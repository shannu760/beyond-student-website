/**
 * The autonomous research loop — bounded.
 *
 *   IDENTIFY GAP -> CREATE QUERY -> DISCOVER -> SCORE -> FETCH -> EXTRACT
 *   -> COMPARE -> STRUCTURE -> VERIFY -> STORE -> INDEX -> EVALUATE
 *   -> SCHEDULE NEXT REVIEW
 *
 * What "autonomous" means here, precisely:
 *   - It may decide what to research next, from observed gaps.
 *   - It may fetch only allowlisted, robots-permitted URLs.
 *   - It may write chunks, claims, conflicts and jobs.
 *   - It may NOT: promote a source to Tier 1, approve a high-impact claim,
 *     resolve a conflict, change agent permissions, deploy, or edit its own code.
 *     Those raise HumanApprovalRequired and land in the review queue.
 *   - It stops when a budget is exhausted. It never retries past a ceiling.
 */

import { createContext, type AgentId } from './registry';
import { sourcesDueForReview, type PipelineDeps } from '../ingest/pipeline';
import { KnowledgeLedger, normaliseValue } from '../knowledge/temporal';
import type { KnowledgeStore, ResearchJob } from '../store/memory';
import type { Budget } from '../guardrails/ratelimit';

export interface KnowledgeGap {
  gap_id: string;
  /** The question students actually asked, normalised and deduplicated. */
  question: string;
  topic: string | null;
  ask_count: number;
  /** How often BEYOND had to refuse. This is what makes a gap urgent. */
  refusal_count: number;
  first_seen: string;
  last_seen: string;
  priority: number;
}

export interface GapSignals {
  /** Anonymised, aggregated query events. Never raw student text with an id. */
  events: Array<{ topic: string | null; question: string; refused: boolean; at: string }>;
}

/**
 * Detect gaps from anonymised usage. Note the privacy boundary: this consumes
 * aggregated labels, not conversation transcripts. A student's private wording
 * is reduced to a topic + a refusal flag before it ever reaches here.
 */
export function detectGaps(signals: GapSignals, minAsks = 2): KnowledgeGap[] {
  const groups = new Map<string, KnowledgeGap>();
  for (const e of signals.events) {
    const key = (e.topic ?? e.question.toLowerCase().trim()).slice(0, 80);
    const existing = groups.get(key);
    if (existing) {
      existing.ask_count++;
      if (e.refused) existing.refusal_count++;
      existing.last_seen = e.at > existing.last_seen ? e.at : existing.last_seen;
      existing.first_seen = e.at < existing.first_seen ? e.at : existing.first_seen;
    } else {
      groups.set(key, {
        gap_id: `gap_${key.replace(/\W+/g, '_').slice(0, 32)}`,
        question: e.question,
        topic: e.topic,
        ask_count: 1,
        refusal_count: e.refused ? 1 : 0,
        first_seen: e.at,
        last_seen: e.at,
        priority: 0,
      });
    }
  }
  return [...groups.values()]
    .filter((g) => g.ask_count >= minAsks || g.refusal_count >= 1)
    .map((g) => ({ ...g, priority: g.refusal_count * 3 + g.ask_count }))
    .sort((a, b) => b.priority - a.priority);
}

export interface ResearchLoopDeps {
  store: KnowledgeStore;
  pipeline: PipelineDeps;
  ledger: KnowledgeLedger;
  budget: Budget;
  /** Candidate URLs the research agent is allowed to consider, per topic.
   *  In production this comes from a search API restricted to allowlisted domains. */
  suggestSources: (topic: string | null, gap: KnowledgeGap) => Promise<string[]>;
  now?: () => Date;
  onHumanApproval?: (agent: AgentId, action: string, detail: string) => void;
  maxJobsPerRun?: number;
}

export interface ResearchLoopResult {
  jobs_run: number;
  gaps_addressed: number;
  sources_refreshed: number;
  published: number;
  quarantined: number;
  blocked: number;
  conflicts: number;
  review_tasks: number;
  stopped_early: string | null;
}

export async function runResearchLoop(deps: ResearchLoopDeps, gaps: KnowledgeGap[]): Promise<ResearchLoopResult> {
  const now = deps.now ?? (() => new Date());
  const maxJobs = deps.maxJobsPerRun ?? 5;
  const result: ResearchLoopResult = {
    jobs_run: 0, gaps_addressed: 0, sources_refreshed: 0, published: 0,
    quarantined: 0, blocked: 0, conflicts: 0, review_tasks: 0, stopped_early: null,
  };

  // --- Phase A: address knowledge gaps (research agent, bounded) ---
  const research = createContext('research', deps.store, deps.onHumanApproval);
  for (const gap of gaps.slice(0, maxJobs)) {
    if (!deps.budget.canSpend('documents', 1)) {
      result.stopped_early = 'document budget exhausted';
      break;
    }
    const urls = await research.read('sources', () => deps.suggestSources(gap.topic, gap), `suggest sources for ${gap.topic}`);
    const job = createJob(deps.store, gap, urls, now().toISOString());
    research.write('jobs', 'log_job', () => deps.store.jobs.update(job.job_id, { status: 'RUNNING', started_at: now().toISOString() }));

    const { ingestUrl } = await import('../ingest/pipeline.js');
    let touched = 0;
    for (const url of urls.slice(0, 4)) {
      const r = await ingestUrl(deps.pipeline, url);
      deps.store.jobs.update(job.job_id, {
        audit: [...(deps.store.jobs.all().find((j) => j.job_id === job.job_id)?.audit ?? []), `${url} -> ${r.final_status}${r.error ? ` (${r.error})` : ''}`],
      });
      touched++;
      if (r.published) {
        result.published++;
        result.conflicts += r.conflicts;
        result.review_tasks += r.review_tasks;
      } else if (r.quarantined) result.quarantined++;
      else if (r.final_status === 'BLOCKED') result.blocked++;
    }
    deps.store.jobs.update(job.job_id, {
      status: touched ? 'DONE' : 'FAILED',
      finished_at: now().toISOString(),
      docs_ingested: result.published,
    });
    result.jobs_run++;
    if (touched) result.gaps_addressed++;
  }

  // --- Phase B: scheduled refresh of sources whose next_review_at has passed ---
  const due = sourcesDueForReview(deps.store, now());
  const { ingestUrl } = await import('../ingest/pipeline.js');
  for (const source of due.slice(0, maxJobs)) {
    if (!deps.budget.canSpend('documents', 1)) {
      result.stopped_early = 'document budget exhausted during refresh';
      break;
    }
    const r = await ingestUrl(deps.pipeline, source.url);
    deps.store.sources.upsert({
      ...source,
      last_checked_at: now().toISOString(),
      last_verified_at: r.published ? now().toISOString() : source.last_verified_at,
    });
    result.sources_refreshed++;
    if (r.published) result.published++;
  }

  // --- Phase C: consistency sweep — same fact, different values -> conflict ---
  const contradiction = createContext('contradiction', deps.store, deps.onHumanApproval);
  const bySubject = new Map<string, Array<{ claim_id: string; value: string; value_display: string; tier: string }>>();
  for (const c of deps.store.claims.all()) {
    if (c.status === 'SUPERSEDED' || c.status === 'REJECTED') continue;
    const key = `${c.subject}::${c.predicate}`;
    const arr = bySubject.get(key) ?? [];
    arr.push({ claim_id: c.claim_id, value: normaliseValue(c.value, c.unit), value_display: c.value_display, tier: c.authority_tier });
    bySubject.set(key, arr);
  }
  for (const [key, entries] of bySubject) {
    const distinct = new Set(entries.map((e) => e.value));
    if (distinct.size <= 1) continue;
    const alreadyOpen = deps.store.conflicts.open().some((c) => `${c.subject}::${c.predicate}` === key);
    if (alreadyOpen) continue;
    contradiction.write('conflicts', 'raise_conflict', () => {
      deps.store.conflicts.put({
        conflict_id: `cnf_sweep_${key.replace(/\W+/g, '_').slice(0, 32)}`,
        subject: key.split('::')[0]!,
        predicate: key.split('::')[1]!,
        claim_ids: entries.map((e) => e.claim_id),
        values: entries.map((e) => e.value_display),
        best_tier_rank: 0,
        resolved: false,
        resolution: null,
        detected_at: now().toISOString(),
        notes: 'consistency sweep found divergent values for the same subject/predicate',
      });
    }, `divergent values for ${key}`);
  }

  return result;
}

function createJob(store: KnowledgeStore, gap: KnowledgeGap, urls: string[], at: string): ResearchJob {
  const job: ResearchJob = {
    job_id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    trigger: 'KNOWLEDGE_GAP',
    query: gap.question,
    target_domains: urls.map((u) => {
      try { return new URL(u).hostname; } catch { return u; }
    }),
    status: 'QUEUED',
    created_at: at,
    started_at: null,
    finished_at: null,
    error: null,
    docs_ingested: 0,
    claims_produced: 0,
    audit: [`gap ${gap.gap_id}: asks=${gap.ask_count} refusals=${gap.refusal_count}`],
  };
  store.jobs.put(job);
  return job;
}
