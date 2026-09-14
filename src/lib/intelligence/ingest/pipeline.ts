/**
 * Pipeline orchestrator — the only place that persists.
 *
 * DISCOVER -> FETCH -> VALIDATE -> EXTRACT -> CLEAN -> CLASSIFY -> CHUNK
 * -> DEDUPLICATE -> EMBED -> INDEX -> VERIFY -> PUBLISH
 *
 * Each stage's outcome is recorded in `StageTrace` so a failed document can be
 * replayed from any stage, and so the admin dashboard can answer "why did this
 * page not become knowledge?".
 */

import { sha256, canonicalUrl, validatePage, extractDocument, cleanDocument, classifyText, chunkDocument, dedupeDecision, toDedupeInput } from './stages';
import type { Classification } from './stages';
import type { Embedder, FetchedPage } from './stages';
import { SourceRegistry } from '../knowledge/sources';
import { scoreSource } from '../knowledge/sources';
import { chunkConfidence, KnowledgeLedger } from '../knowledge/temporal';
import { RobotsChecker } from '../guardrails/robots';
import { assertPublicHttpUrl } from '../guardrails/ssrf';
import { DomainRateLimiter, type Budget } from '../guardrails/ratelimit';
import type { KnowledgeStore } from '../store/memory';
import type { KnowledgeChunk, SourceRecord } from '../types/core';

export type StageName =
  | 'DISCOVER' | 'FETCH' | 'VALIDATE' | 'EXTRACT' | 'CLEAN' | 'CLASSIFY'
  | 'CHUNK' | 'DEDUPLICATE' | 'EMBED' | 'INDEX' | 'VERIFY' | 'PUBLISH';

export interface StageTrace {
  stage: StageName;
  status: 'OK' | 'SKIPPED' | 'FAILED';
  detail: string;
  ms: number;
}

export interface IngestResult {
  url: string;
  source_id: string;
  document_id: string | null;
  published: boolean;
  quarantined: boolean;
  chunks_added: number;
  chunks_dropped: number;
  conflicts: number;
  review_tasks: number;
  trace: StageTrace[];
  final_status: 'PUBLISHED' | 'QUARANTINED' | 'REJECTED' | 'DUPLICATE' | 'BLOCKED' | 'ERROR';
  error: string | null;
}

export interface IngestOptions {
  /** Skip the network and use this page (tests, replays, curated documents). */
  page?: FetchedPage;
  /** Skip robots.txt (only for explicitly curated local/fixture content). */
  skipRobots?: boolean;
}

export interface PipelineDeps {
  store: KnowledgeStore;
  registry: SourceRegistry;
  robots: RobotsChecker;
  rateLimiter: DomainRateLimiter;
  budget: Budget;
  embedder: Embedder;
  ledger: KnowledgeLedger;
  fetchPage: (url: string) => Promise<FetchedPage>;
  /** Optional LLM-backed classifier; falls back to heuristics when absent. */
  classifyWithModel?: (text: string) => Promise<Partial<ReturnType<typeof classifyText>>>;
  now?: () => Date;
}

async function stage<T extends { detail: string }>(name: StageName, fn: () => T | Promise<T>, trace: StageTrace[]): Promise<T> {
  const t0 = Date.now();
  try {
    const r = await fn();
    trace.push({ stage: name, status: 'OK', detail: r.detail, ms: Date.now() - t0 });
    return r;
  } catch (err) {
    const detail = (err as Error).message;
    trace.push({ stage: name, status: 'FAILED', detail, ms: Date.now() - t0 });
    // Preserve the retryable signal so the caller can reschedule rather than
    // persisting a rejection that is really a transient server fault.
    if (err instanceof RetryableError) throw err;
    throw new StageError(name, detail);
  }
}

export class StageError extends Error {
  constructor(readonly stage: StageName, detail: string) {
    super(`${stage} failed: ${detail}`);
    this.name = 'StageError';
  }
}

/** A transient failure. Callers may reschedule; nothing is persisted. */
export class RetryableError extends Error {
  constructor(detail: string) {
    super(detail);
    this.name = 'RetryableError';
  }
}

export async function ingestUrl(deps: PipelineDeps, url: string, opts: IngestOptions = {}): Promise<IngestResult> {
  const now = deps.now ?? (() => new Date());
  const trace: StageTrace[] = [];
  const canonical = canonicalUrl(url);
  const result: IngestResult = {
    url: canonical, source_id: '', document_id: null, published: false, quarantined: false,
    chunks_added: 0, chunks_dropped: 0, conflicts: 0, review_tasks: 0, trace,
    final_status: 'ERROR', error: null,
  };

  const finish = (status: IngestResult['final_status'], error: string | null = null): IngestResult => {
    result.final_status = status;
    result.error = error;
    return result;
  };

  try {
    /* 1. DISCOVER — allowlist + robots + SSRF + budget. All four must pass. */
    let policy: ReturnType<SourceRegistry['policyFor']>;
    await stage('DISCOVER', async () => {
      assertPublicHttpUrl(canonical, { allowNonHttps: true });
      const permit = deps.registry.isPermitted(canonical);
      if (!permit.permitted) throw new Error(`not permitted: ${permit.reason}`);
      policy = permit.policy!;
      if (!opts.skipRobots) {
        const robots = await deps.robots.check(canonical);
        deps.rateLimiter.applyCrawlDelay(new URL(canonical).hostname, robots.crawl_delay_s);
        if (!robots.allowed) throw new Error(`robots.txt: ${robots.reason}`);
      }
      if (!deps.budget.canSpend('documents', 1)) throw new Error('daily document budget exhausted');
      return { detail: `permitted via ${policy!.domain} (${policy!.authority_tier})` };
    }, trace);

    /* 2. FETCH */
    let page: FetchedPage;
    await stage('FETCH', async () => {
      const domain = new URL(canonical).hostname;
      const rl = deps.rateLimiter.check(domain);
      if (!rl.allowed) throw new Error(`rate limited: ${rl.reason}`);
      page = opts.page ?? (await deps.fetchPage(canonical));
      deps.rateLimiter.record(domain);
      deps.budget.spend('documents', 1);
      return { detail: `HTTP ${page.status} ${page.byte_length}B ${page.content_type}` };
    }, trace);

    // Build/refresh the source record now that we know it is reachable.
    const source = upsertSource(deps, canonical, policy!, page!, now().toISOString());
    result.source_id = source.source_id;

    /* 3. VALIDATE */
    await stage('VALIDATE', () => {
      const v = validatePage(page!);
      if (!v.ok) {
        // Retryable server faults must not leave a REJECTED document behind:
        // that would look like a judgement about the content when it is not.
        if (v.retryable) throw new RetryableError(`HTTP ${page!.status}`);
        deps.store.documents.put({
          document_id: `doc_${sha256(canonical).slice(0, 16)}`, source_id: source.source_id, url: canonical,
          title: page!.final_url, content_hash: sha256(page!.body), published_at: null,
          extracted_at: now().toISOString(), status: 'REJECTED', warnings: [`${v.code}: ${v.reason}`],
        });
        throw new Error(`${v.code}: ${v.reason}`);
      }
      return { detail: 'content-type + size + paywall checks passed' };
    }, trace);

    /* 4. EXTRACT */
    const { document } = await stage('EXTRACT', () => {
      const r = extractDocument(source, page!);
      if (!r.document.text.length) throw new Error('extraction produced no text');
      return { detail: `${r.document.blocks.length} blocks, ${r.document.text.length} chars`, ...r };
    }, trace);
    result.document_id = document.document_id;

    /* 5. CLEAN + injection scan */
    const cleaned = await stage('CLEAN', () => {
      const c = cleanDocument(document);
      if (c.quarantine) throw new Error(`prompt-injection patterns detected: ${c.flags.map((f) => f.pattern).join(', ')}`);
      return { detail: c.flags.length ? `cleaned, ${c.flags.length} benign flag(s)` : 'cleaned', ...c };
    }, trace);

    /* 6. CLASSIFY */
    const { classification } = await stage('CLASSIFY', async (): Promise<{ detail: string; classification: Classification }> => {
      const base = classifyText(document.text, source);
      if (deps.classifyWithModel) {
        const override = await deps.classifyWithModel(document.text);
        const merged: Classification = { ...base, ...override, classifier: 'model', high_impact: base.high_impact || Boolean(override.high_impact) };
        return { detail: `model classifier: topic=${merged.semantic_topic} year=${merged.applicable_year} high_impact=${merged.high_impact}`, classification: merged };
      }
      return { detail: `heuristic: topic=${base.semantic_topic} year=${base.applicable_year} high_impact=${base.high_impact}`, classification: base };
    }, trace);

    /* 7. CHUNK */
    let chunks: KnowledgeChunk[] = [];
    await stage('CHUNK', () => {
      chunks = chunkDocument({ ...document, blocks: cleaned.blocks, text: cleaned.text }, source, classification);
      if (!chunks.length) throw new Error('no chunks produced');
      return { detail: `${chunks.length} chunk(s), max ${Math.max(...chunks.map((c) => c.token_estimate))} tok` };
    }, trace);

    /* 8. DEDUPLICATE */
    const kept: KnowledgeChunk[] = [];
    await stage('DEDUPLICATE', () => {
      const existing = deps.store.dedupeIndex.forTopic(classification.semantic_topic, classification.applicable_year);
      for (const chunk of chunks) {
        const input = toDedupeInput(chunk);
        const decision = dedupeDecision(input, [...existing, ...kept.map(toDedupeInput)]);
        if (decision.decision === 'DUPLICATE') {
          result.chunks_dropped++;
          continue;
        }
        if (decision.decision === 'CONFLICT') {
          result.conflicts++;
          deps.store.conflicts.put({
            conflict_id: `cnf_${sha256(chunk.chunk_id).slice(0, 16)}`,
            subject: `${classification.semantic_topic}#${classification.applicable_year ?? '*'}`,
            predicate: 'content_divergence',
            claim_ids: [chunk.chunk_id, decision.against?.chunk_id ?? ''],
            values: [chunk.content.slice(0, 80), (decision.against?.content ?? '').slice(0, 80)],
            best_tier_rank: 0,
            resolved: false,
            resolution: null,
            detected_at: now().toISOString(),
            notes: decision.reason,
          });
          // Kept anyway: a conflict is a review item, not a deletion.
        }
        kept.push(chunk);
      }
      if (!kept.length) throw new Error('all chunks were duplicates');
      return { detail: `${kept.length} kept, ${result.chunks_dropped} dropped, ${result.conflicts} conflict(s)` };
    }, trace);

    /* 9. EMBED */
    await stage('EMBED', async () => {
      if (!deps.budget.canSpend('embeddings', kept.length)) throw new Error('embedding budget exhausted');
      const { vectors, model } = await deps.embedder.embed(kept.map((c) => c.content));
      deps.budget.spend('embeddings', kept.length);
      kept.forEach((c, i) => {
        c.embedding = vectors[i] ?? null;
        c.embedding_model = model;
      });
      return { detail: `${kept.length} x ${vectors[0]?.length ?? 0}d via ${model}` };
    }, trace);

    /* 10. INDEX */
    await stage('INDEX', () => {
      for (const c of kept) {
        deps.store.chunks.put(c);
        deps.store.dedupeIndex.add(classification.semantic_topic, classification.applicable_year, toDedupeInput(c));
      }
      return { detail: `${kept.length} chunk(s) indexed` };
    }, trace);

    /* 11. VERIFY */
    await stage('VERIFY', () => {
      const score = scoreSource({
        tier: source.authority_tier,
        freshness_category: classification.freshness_category,
        published_at: document.published_at,
        now: now(),
      }).score;
      for (const c of kept) {
        deps.store.chunks.update(c.chunk_id, { confidence: chunkConfidence(c, score, false), verified_at: null });
      }
      deps.store.sources.upsert({
        ...source,
        source_score: score,
        human_review_required: source.human_review_required || classification.high_impact,
      });
      if (classification.high_impact) {
        result.review_tasks++;
        deps.store.tasks.put({
          task_id: `vrf_${sha256(document.document_id).slice(0, 16)}`,
          claim_id: `doc:${document.document_id}`,
          reason: `high-impact content from ${source.authority_tier} source needs human verification`,
          priority: 'HIGH',
          status: 'OPEN',
          created_at: now().toISOString(),
          resolved_at: null,
          resolved_by: null,
        });
      }
      return { detail: `source_score=${score.toFixed(3)} high_impact=${classification.high_impact}` };
    }, trace);

    /* 12. PUBLISH */
    await stage('PUBLISH', () => {
      deps.store.documents.put({
        document_id: document.document_id,
        source_id: source.source_id,
        url: document.url,
        title: document.title,
        content_hash: document.content_hash,
        published_at: document.published_at,
        extracted_at: document.extracted_at,
        status: 'PUBLISHED',
        warnings: document.warnings,
      });
      result.chunks_added = kept.length;
      return { detail: `published as ${document.document_id}` };
    }, trace);

    result.published = true;
    return finish('PUBLISHED');
  } catch (err) {
    const e = err as Error;
    if (e instanceof RetryableError) return finish('ERROR', `retryable: ${e.message}`);
    const isStage = e instanceof StageError;
    const detail = e.message;
    if (/robots|not permitted|BLOCKLISTED|PRIVATE_IP|rate limited|budget/i.test(detail)) return finish('BLOCKED', detail);
    if (/injection/i.test(detail)) {
      result.quarantined = true;
      if (result.document_id) {
        deps.store.documents.put({
          document_id: result.document_id, source_id: result.source_id, url: canonical, title: canonical,
          content_hash: sha256(detail), published_at: null, extracted_at: now().toISOString(),
          status: 'QUARANTINED', warnings: [detail],
        });
      }
      return finish('QUARANTINED', detail);
    }
    if (/duplicate/i.test(detail)) return finish('DUPLICATE', detail);
    // A StageError from FETCH means the transport failed (retryable, so ERROR).
    // A StageError from any later stage means the page itself was unacceptable.
    const stageName = e instanceof StageError ? e.stage : null;
    return finish(stageName === null || stageName === 'FETCH' || stageName === 'DISCOVER' ? 'ERROR' : 'REJECTED', detail);
  }
}

function upsertSource(deps: PipelineDeps, url: string, policy: NonNullable<ReturnType<SourceRegistry['policyFor']>>, page: FetchedPage, nowIso: string): SourceRecord {
  const domain = new URL(url).hostname.toLowerCase();
  const existing = deps.store.sources.byId(`src_${sha256(url).slice(0, 16)}`);
  const scored = scoreSource({ tier: policy.authority_tier, freshness_category: policy.freshness_category, published_at: null, now: new Date(nowIso) });
  const source: SourceRecord = {
    source_id: `src_${sha256(url).slice(0, 16)}`,
    url,
    domain,
    organization: policy.organization,
    title: null,
    source_type: policy.source_type,
    authority_tier: policy.authority_tier,
    discovered_at: existing?.discovered_at ?? nowIso,
    published_at: null,
    last_checked_at: nowIso,
    last_verified_at: existing?.last_verified_at ?? null,
    next_review_at: scored.next_review_at,
    freshness_category: policy.freshness_category,
    jurisdiction: policy.jurisdiction ?? null,
    applicable_exam: null,
    applicable_year: policy.applicable_year ?? null,
    language: null,
    license: policy.license ?? null,
    content_hash: sha256(page.body),
    status: 'ACTIVE',
    source_score: scored.score,
    confidence: scored.score,
    // Review is required when either the domain is not yet signed off, or the
    // document contains high-impact facts. Set conservatively here; VERIFY
    // tightens it once classification is known.
    human_review_required: !policy.reviewed_by,
    robots_allowed: true,
    allowlisted: true,
  };
  deps.store.sources.upsert(source);
  return source;
}

/** Sources whose next_review_at has passed. This is what the research loop polls. */
export function sourcesDueForReview(store: KnowledgeStore, now = new Date()): SourceRecord[] {
  return store.sources
    .all()
    .filter((s) => s.status === 'ACTIVE' && s.next_review_at && new Date(s.next_review_at).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.next_review_at!).getTime() - new Date(b.next_review_at!).getTime());
}
