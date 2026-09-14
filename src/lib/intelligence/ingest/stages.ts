/**
 * Ingestion pipeline stages.
 *
 * The pipeline is DISCOVER -> FETCH -> VALIDATE -> EXTRACT -> CLEAN -> CLASSIFY
 * -> CHUNK -> DEDUPLICATE -> EMBED -> INDEX -> VERIFY -> PUBLISH.
 *
 * Every stage is a small pure (or nearly pure) function taking one input type and
 * returning one output type, so each can be unit-tested and re-run independently.
 * No stage reaches into another stage's internals and no stage writes to the
 * store directly — `runPipeline` in pipeline.ts is the only orchestrator and the
 * only thing that persists.
 */

import { createHash } from 'node:crypto';
import { normaliseText, detectInjection, stripSmugglingVectors } from '../guardrails/injection';
import { extractHtml, blocksToText, normaliseDate } from './html';
import type {
  AuthorityTier, ContentBlock, ExtractedDocument, FreshnessCategory, KnowledgeChunk, SourceRecord, SourceType,
} from '../types/core';

/* ------------------------------------------------------------------ FETCH */

export interface FetchedPage {
  url: string;
  final_url: string;
  status: number;
  content_type: string;
  body: string;
  byte_length: number;
  fetched_at: string;
}

/* --------------------------------------------------------------- VALIDATE */

export interface ValidationVerdict {
  ok: boolean;
  reason: string | null;
  code: 'OK' | 'BAD_STATUS' | 'RETRYABLE_STATUS' | 'BAD_CONTENT_TYPE' | 'EMPTY' | 'TOO_LARGE' | 'REDIRECT_LOOP' | 'PAYWALL_HINT';
  /** True when the failure is a transient server problem worth retrying, as
   *  opposed to a property of the document that will not change on retry. */
  retryable: boolean;
}

const PAYWALL_HINTS = [/subscribe to continue/i, /sign in to read/i, /this article is for subscribers/i, /enable javascript to continue/i];

export function validatePage(page: FetchedPage, maxBytes = 2_000_000): ValidationVerdict {
  if (page.status < 200 || page.status >= 300) {
    // 5xx and 429 are the server's problem, not the document's: record nothing
    // and let the scheduler retry. 4xx is a durable property of the URL.
    const retryable = page.status >= 500 || page.status === 429;
    return {
      ok: false,
      reason: `HTTP ${page.status}`,
      code: retryable ? 'RETRYABLE_STATUS' : 'BAD_STATUS',
      retryable,
    };
  }
  const ct = (page.content_type || '').toLowerCase();
  if (!/^(text\/html|text\/plain|application\/xhtml\+xml|application\/json|application\/xml)/.test(ct)) {
    return { ok: false, reason: `unsupported content-type ${ct}`, code: 'BAD_CONTENT_TYPE', retryable: false };
  }
  if (page.byte_length > maxBytes) return { ok: false, reason: `${page.byte_length} bytes > ${maxBytes}`, code: 'TOO_LARGE', retryable: false };
  if (normaliseText(page.body).length < 120) return { ok: false, reason: 'body too short to be content', code: 'EMPTY', retryable: false };
  if (PAYWALL_HINTS.some((re) => re.test(page.body))) {
    return { ok: false, reason: 'paywall/login hint detected — we do not circumvent', code: 'PAYWALL_HINT', retryable: false };
  }
  return { ok: true, reason: null, code: 'OK', retryable: false };
}

/* ---------------------------------------------------------------- EXTRACT */

export interface ExtractResult {
  document: ExtractedDocument;
  warnings: string[];
}

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/** Canonicalise a URL so cosmetic variants collapse to one identity. */
export function canonicalUrl(url: string): string {
  try {
    const u = new URL(url);
    const drop = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref', 'amp']);
    for (const k of [...u.searchParams.keys()]) if (drop.has(k.toLowerCase())) u.searchParams.delete(k);
    u.hash = '';
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, '');
    let path = u.pathname.replace(/\/+$/, '');
    if (/\.(html?|php|aspx?)$/i.test(path)) path = path.replace(/\.(html?|php|aspx?)$/i, '');
    u.pathname = path || '/';
    u.protocol = 'https:';
    return u.toString();
  } catch {
    return url;
  }
}

export function extractDocument(source: SourceRecord, page: FetchedPage): ExtractResult {
  const html = extractHtml(page.body);
  const warnings = [...html.warnings];
  const blocks = html.blocks;
  const text = normaliseText(blocksToText(blocks));
  return {
    document: {
      document_id: `doc_${sha256(canonicalUrl(page.final_url)).slice(0, 16)}`,
      source_id: source.source_id,
      url: page.final_url,
      title: html.title || source.title || page.final_url,
      blocks,
      text,
      content_hash: sha256(text),
      language: html.language ?? source.language,
      published_at: html.published_at ?? source.published_at,
      extracted_at: page.fetched_at,
      warnings,
    },
    warnings,
  };
}

/** Text/PDF-derived content (already converted to text upstream) -> document. */
export function extractFromText(source: SourceRecord, text: string, opts: { url: string; title: string; published_at?: string | null }): ExtractedDocument {
  const cleaned = normaliseText(text);
  return {
    document_id: `doc_${sha256(canonicalUrl(opts.url)).slice(0, 16)}`,
    source_id: source.source_id,
    url: opts.url,
    title: opts.title,
    blocks: [{ kind: 'paragraph', text: cleaned, path: [] }],
    text: cleaned,
    content_hash: sha256(cleaned),
    language: source.language,
    published_at: normaliseDate(opts.published_at ?? null),
    extracted_at: new Date().toISOString(),
    warnings: cleaned.length < 120 ? ['body too short'] : [],
  };
}

/* ------------------------------------------------------------------ CLEAN */

export interface CleanResult {
  text: string;
  blocks: ContentBlock[];
  flags: ReturnType<typeof detectInjection>['flags'];
  quarantine: boolean;
}

export function cleanDocument(doc: ExtractedDocument): CleanResult {
  const strippedText = normaliseText(stripSmugglingVectors(doc.text));
  const scan = detectInjection(strippedText);
  const blocks = doc.blocks.map((b) => {
    switch (b.kind) {
      case 'paragraph': return { ...b, text: normaliseText(b.text) };
      case 'heading': return { ...b, text: normaliseText(b.text) };
      case 'list': return { ...b, items: b.items.map((i) => normaliseText(i)).filter(Boolean) };
      case 'code': return { ...b, text: b.text.replace(/[\u0000-\u0008]/g, '') };
      default: return b;
    }
  });
  return { text: scan.text, blocks, flags: scan.flags, quarantine: scan.quarantine };
}

/* --------------------------------------------------------------- CLASSIFY */

export interface Classification {
  semantic_topic: string;
  applicable_exam: string | null;
  applicable_year: number | null;
  jurisdiction: string | null;
  freshness_category: FreshnessCategory;
  high_impact: boolean;
  /** Which classifier produced this: cheap heuristics or a model. */
  classifier: 'heuristic' | 'model';
}

/** Exam/year signals. Heuristic on purpose: this runs on every document and must
 *  be cheap, deterministic and explainable. A model classifier can override it
 *  (classifier: 'model') but cannot remove the high_impact flag. */
/** Official exams write their own names inconsistently: NTA publishes
 *  "JEE (Main)", students type "JEE Main", boards write "JEE-Main". Match all
 *  three, or exam-scoped retrieval silently degrades to unfiltered retrieval. */
const EXAM_PATTERNS: Array<[string, RegExp]> = [
  ['JEE_MAIN', /\bJEE\s*\(?\s*Main\s*\)?\b/i],
  ['JEE_ADVANCED', /\bJEE\s*\(?\s*Advanced\s*\)?\b/i],
  ['NEET_UG', /\bNEET\b(?:[-\s]*\(?\s*UG\s*\)?)?/i],
  ['CUET', /\bCUET\b/i],
  ['AP_EAMCET', /\b(EAMCET|EAPCET)\b/i],
  ['GATE', /\bGATE\s*(exam|20\d\d)\b/i],
  ['UPSC', /\bUPSC\b/i],
];

const HIGH_IMPACT_PATTERNS = [
  /\beligib/i, /\bdeadline\b/i, /\blast date\b/i, /\bfee[s]?\b/i, /\bscholarship\b/i,
  /\badmission[s]?\b/i, /\bexamination pattern\b/i, /\bregulation[s]?\b/i, /\bsyllabus\b/i,
];

const DEADLINE_PATTERNS = [/\bdeadline\b/i, /\blast date\b/i, /\bapply by\b/i, /\bregistration (open|close|date)/i, /\bimportant dates\b/i];

export function classifyText(text: string, source: SourceRecord): Classification {
  const exam = EXAM_PATTERNS.find(([, re]) => re.test(text))?.[0] ?? source.applicable_exam;
  // An explicit year on the reviewed source always wins. Inferring "the highest
  // year mentioned" is wrong for documents whose subject spans two calendar
  // years (a 2026-27 scholarship cycle) and for pages that merely cite older
  // bulletins, so inference only happens for a recognisable exam cycle phrase.
  // Academic-cycle form: 2026-27 / 2026–27 / 2026 to 2027. The suffix must be a
  // plausible next-year value (20-39), otherwise "02 December 2026 to 04
  // December 2026" in an important-dates list parses as a cycle.
  const cycle = /\b(20[2-4]\d)\s*(?:-|\u2013|\u2014|to)\s*(?:20)?([2-3]\d)\b/.exec(text);
  const namedCycle = /\b(?:JEE|NEET|CUET|EAMCET|EAPCET|GATE|UPSC)\b[\s\S]{0,40}?\b(20[2-4]\d)\b/i.exec(text);
  // An explicitly named exam cycle is stronger evidence than a bare date range.
  const inferred = namedCycle ? Number(namedCycle[1]) : cycle ? Number(cycle[1]) : null;
  const year = source.applicable_year ?? inferred;

  let freshness: FreshnessCategory;
  if (DEADLINE_PATTERNS.some((re) => re.test(text))) freshness = 'DEADLINE_SENSITIVE';
  else if (/\b(syllabus|curriculum|course structure|credit)/i.test(text)) freshness = 'CURRICULUM';
  else if (/\b(policy|rule[s]?|regulation|guideline|ordinance|act\b)/i.test(text)) freshness = 'POLICY';
  else if (/\b(history|ancient|in \d{4}\b|founded)/i.test(text)) freshness = 'HISTORICAL';
  else freshness = 'FUNDAMENTAL_CONCEPT';

  const topicGuess = guessTopic(text);
  return {
    semantic_topic: topicGuess,
    applicable_exam: exam,
    applicable_year: year,
    jurisdiction: source.jurisdiction,
    freshness_category: freshness,
    high_impact: HIGH_IMPACT_PATTERNS.some((re) => re.test(text)),
    classifier: 'heuristic',
  };
}

const TOPIC_KEYWORDS: Array<[string, RegExp]> = [
  ['exam_eligibility', /\b(eligib|criteria|qualif)/i],
  ['exam_pattern', /\b(examination pattern|paper pattern|marking scheme|negative marking)/i],
  ['exam_dates', /\b(important dates|schedule|application (window|period)|last date)/i],
  ['scholarship', /\b(scholarship|fellowship|stipend)/i],
  ['admissions', /\b(admission|counselling|seat allotment|cut[-\s]?off)/i],
  ['syllabus', /\b(syllabus|curriculum|units?\b)/i],
  ['calculus', /\b(calculus|derivative|integral|limit)/i],
  ['programming', /\b(programming|algorithm|data structure|python|javascript)\b/i],
];

function guessTopic(text: string): string {
  return TOPIC_KEYWORDS.find(([, re]) => re.test(text))?.[0] ?? 'general';
}

/* ------------------------------------------------------------------ CHUNK */

export interface ChunkOptions {
  /** Target chunk size in approximate tokens. */
  targetTokens?: number;
  /** Hard ceiling; oversized blocks are split further. */
  maxTokens?: number;
  /** Sentences copied from the end of the previous chunk for continuity. */
  overlapSentences?: number;
}

export const approxTokens = (text: string): number => Math.ceil(text.length / 4);

const splitSentences = (text: string): string[] =>
  text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(\u201C])/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Semantic chunking: one chunk ~= one coherent concept.
 *
 * Strategy:
 *   1. Group consecutive blocks under their heading path.
 *   2. Fill a chunk until targetTokens; never split a table.
 *   3. If a single block exceeds maxTokens, split it on sentence boundaries.
 *   4. Carry `overlapSentences` sentences forward so a fact never lands at a
 *      chunk edge without its qualifying context.
 *   5. Prefix every chunk with its heading path — a chunk that says "25 years"
 *      is useless; "Eligibility > Age limit: 25 years" is retrievable.
 */
export function chunkDocument(doc: ExtractedDocument, source: SourceRecord, classification: Classification, opts: ChunkOptions = {}): KnowledgeChunk[] {
  const targetTokens = opts.targetTokens ?? 220;
  const maxTokens = opts.maxTokens ?? 420;
  const overlapSentences = opts.overlapSentences ?? 1;

  const chunks: KnowledgeChunk[] = [];
  let buffer: string[] = [];
  let bufferTokens = 0;
  let currentPath: string[] = [];
  let carryOver: string[] = [];
  let index = 0;

  const flush = (): void => {
    const body = buffer.join('\n').trim();
    if (!body) {
      buffer = [];
      bufferTokens = 0;
      return;
    }
    const content = currentPath.length ? `${currentPath.join(' > ')}\n${body}` : body;
    const heading = currentPath.length ? [...currentPath] : [doc.title];
    chunks.push({
      chunk_id: `chk_${doc.document_id}_${index++}`,
      document_id: doc.document_id,
      source_id: doc.source_id,
      heading,
      section: currentPath.join(' > ') || doc.title,
      content,
      semantic_topic: classification.semantic_topic,
      source_url: doc.url,
      authority_tier: source.authority_tier,
      published_at: doc.published_at,
      verified_at: null,
      jurisdiction: classification.jurisdiction,
      applicable_year: classification.applicable_year,
      applicable_exam: classification.applicable_exam,
      freshness_category: classification.freshness_category,
      confidence: 0, // filled by VERIFY
      token_estimate: approxTokens(content),
      overlap_from: carryOver.length ? chunks[chunks.length - 1]?.chunk_id ?? null : null,
      embedding: null,
      embedding_model: null,
    });
    // Keep the tail of this chunk as leading context for the next one.
    const tail = splitSentences(body).slice(-overlapSentences);
    carryOver = tail;
    buffer = [];
    bufferTokens = 0;
  };

  const pushText = (path: string[], text: string): void => {
    if (carryOver.length) {
      buffer.push(`[context: ${carryOver.join(' ')}]`);
      bufferTokens += approxTokens(carryOver.join(' '));
      carryOver = [];
    }
    const sentences = splitSentences(text);
    let piece: string[] = [];
    let pieceTokens = 0;
    for (const s of sentences) {
      const st = approxTokens(s);
      if (pieceTokens + st > maxTokens && piece.length) {
        buffer.push(piece.join(' '));
        bufferTokens += pieceTokens;
        piece = [];
        pieceTokens = 0;
      }
      piece.push(s);
      pieceTokens += st;
      if (bufferTokens + pieceTokens >= targetTokens) {
        buffer.push(piece.join(' '));
        bufferTokens += pieceTokens;
        piece = [];
        pieceTokens = 0;
        if (path.join('|') !== currentPath.join('|')) currentPath = [...path];
        flush();
      }
    }
    if (piece.length) {
      buffer.push(piece.join(' '));
      bufferTokens += pieceTokens;
    }
  };

  for (const block of doc.blocks) {
    switch (block.kind) {
      case 'heading':
        // A heading ends the current concept.
        flush();
        currentPath = [...block.path.length ? block.path : [block.text]];
        break;
      case 'paragraph':
        pushText(block.path, block.text);
        break;
      case 'list': {
        const text = block.items.map((it, ix) => (block.ordered ? `${ix + 1}. ${it}` : `- ${it}`)).join('\n');
        pushText(block.path, text);
        break;
      }
      case 'code':
        pushText(block.path, block.text);
        break;
      case 'table': {
        // Tables are atomic: never split across chunks.
        if (bufferTokens > 0) flush();
        const head = block.headers.length ? `| ${block.headers.join(' | ')} |` : '';
        const sep = block.headers.length ? `| ${block.headers.map(() => '---').join(' | ')} |` : '';
        const body = block.rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
        const tableText = [block.caption ?? '', head, sep, body].filter(Boolean).join('\n');
        currentPath = block.path.length ? [...block.path] : currentPath;
        buffer.push(tableText);
        bufferTokens += approxTokens(tableText);
        flush();
        break;
      }
    }
  }
  flush();
  return chunks;
}

/* ----------------------------------------------------------- DEDUPLICATE */

/** 64-bit FNV-1a over each 5-word shingle; compact enough to keep in memory. */
export function shingles(text: string, k = 5): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + k <= words.length; i++) {
    const s = words.slice(i, i + k).join(' ');
    let h = 0xcbf29ce484222325n;
    for (let c = 0; c < s.length; c++) {
      h ^= BigInt(s.charCodeAt(c));
      h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
    }
    out.add(h.toString(36));
  }
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export interface DedupeInput {
  chunk: KnowledgeChunk;
  shingles: Set<string>;
}

export const toDedupeInput = (chunk: KnowledgeChunk): DedupeInput => ({ chunk, shingles: shingles(chunk.content) });

export interface DedupeOutcome {
  decision: 'KEEP' | 'DUPLICATE' | 'SUPERSEDES' | 'CONFLICT';
  /** The chunk this one duplicates or supersedes. */
  against: KnowledgeChunk | null;
  similarity: number;
  reason: string;
}

const TIER_RANK_LOCAL: Record<AuthorityTier, number> = { AUTHORITATIVE: 0, TRUSTED_SECONDARY: 1, COMMUNITY: 2, UNVERIFIED: 3 };

/**
 * Decide what to do with a candidate chunk given near-duplicates already stored.
 *
 * Rules:
 *   - Same content_hash / URL  -> exact duplicate, drop it.
 *   - Same applicable_year and near-identical text -> keep the more authoritative
 *     (and fresher) one; the loser becomes a duplicate pointer, never a copy.
 *   - Same subject, DIFFERENT applicable_year -> NOT a duplicate. Both are kept
 *     (temporal versioning), the older marked superseded by the VERIFY stage.
 *   - Same subject, same year, materially different values -> CONFLICT, escalate.
 */
export function dedupeDecision(candidate: DedupeInput, existing: DedupeInput[], nearDuplicateThreshold = 0.86): DedupeOutcome {
  let best: { c: KnowledgeChunk; sim: number } | null = null;
  for (const e of existing) {
    const sim = jaccard(candidate.shingles, e.shingles);
    if (!best || sim > best.sim) best = { c: e.chunk, sim };
  }
  if (!best || best.sim < 0.35) return { decision: 'KEEP', against: null, similarity: best?.sim ?? 0, reason: 'no near-duplicate' };

  const c = best.c;
  const cand = candidate.chunk;
  const sameYear = (cand.applicable_year ?? 0) === (c.applicable_year ?? 0);

  if (cand.source_url === c.source_url) {
    return { decision: 'DUPLICATE', against: c, similarity: best.sim, reason: 'same canonical URL' };
  }
  if (!sameYear) {
    return {
      decision: 'SUPERSEDES',
      against: c,
      similarity: best.sim,
      reason: `different applicable_year (${c.applicable_year} -> ${cand.applicable_year}); both retained as versions`,
    };
  }
  if (best.sim >= nearDuplicateThreshold) {
    const candRank = TIER_RANK_LOCAL[cand.authority_tier];
    const existRank = TIER_RANK_LOCAL[c.authority_tier];
    if (candRank < existRank) return { decision: 'SUPERSEDES', against: c, similarity: best.sim, reason: `more authoritative (${cand.authority_tier} beats ${c.authority_tier})` };
    if (candRank > existRank) return { decision: 'DUPLICATE', against: c, similarity: best.sim, reason: `less authoritative than existing ${c.authority_tier}` };
    return { decision: 'DUPLICATE', against: c, similarity: best.sim, reason: 'same tier near-duplicate; keeping first-seen' };
  }
  return { decision: 'CONFLICT', against: c, similarity: best.sim, reason: 'same topic/year, materially different content' };
}

/* ------------------------------------------------------------------ EMBED */

export interface Embedder {
  readonly model: string;
  readonly dimensions: number;
  /** Returns one vector per input text, plus the model that produced them so the
   *  stored chunk records which embedding space it lives in. Mixing embedding
   *  models in one index silently destroys retrieval quality. */
  embed(texts: string[]): Promise<{ vectors: number[][]; model: string }>;
}

/* ------------------------------------------------------------------- TYPE */

export type { SourceType, AuthorityTier, FreshnessCategory };
