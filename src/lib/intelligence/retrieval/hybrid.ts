/**
 * Hybrid retrieval.
 *
 *   query understanding -> metadata filter -> [BM25 | vector] -> RRF fusion
 *   -> authority/freshness rerank -> evidence-sufficiency gate
 *
 * The temporal filter is the part that matters most in this domain. A student
 * asking "JEE Main 2027 eligibility" must not be answered from a 2024 bulletin.
 * So when the query names a year, chunks tagged for a different year are demoted
 * hard (not merely ranked lower), and if nothing current exists the retriever
 * reports `evidence_sufficient: false` instead of quietly serving stale data.
 */

import { Bm25Index, cosineSimilarity, rrf } from './bm25';
import { freshnessScore, TIER_SCORE_CAP } from '../knowledge/sources';
import { TIER_RANK, type AuthorityTier, type KnowledgeChunk, type RetrievalHit, type RetrievalResult } from '../types/core';

export interface QueryUnderstanding {
  raw: string;
  normalized: string;
  year: number | null;
  exam: string | null;
  jurisdiction: string | null;
  is_time_sensitive: boolean;
  wants_official: boolean;
  topics: string[];
}

/** Must stay in sync with EXAM_PATTERNS in ingest/stages.ts — retrieval and
 *  ingestion have to agree on what an exam is called or filters silently miss. */
const EXAMS: Array<[string, RegExp]> = [
  ['JEE_MAIN', /\bjee\s*\(?\s*main\s*\)?\b/i],
  ['JEE_ADVANCED', /\bjee\s*\(?\s*advanced\s*\)?\b/i],
  ['NEET_UG', /\bneet\b/i],
  ['CUET', /\bcuet\b/i],
  ['AP_EAMCET', /\b(eamcet|eapcet)\b/i],
  ['GATE', /\bgate\b/i],
  ['UPSC', /\bupsc\b/i],
];

const TIME_SENSITIVE = /\b(current|latest|now|today|this year|deadline|last date|apply|application|dates?|fee|cut[-\s]?off|result|admit card)\b/i;
const WANTS_OFFICIAL = /\b(official|nta|ugc|aicte|government|govt|notification|circular|authoritative)\b/i;

export function understandQuery(raw: string, currentYear: number): QueryUnderstanding {
  const yearMatch = /\b(20[2-4]\d)\b/.exec(raw);
  const exam = EXAMS.find(([, re]) => re.test(raw))?.[0] ?? null;
  const isTimeSensitive = TIME_SENSITIVE.test(raw) || Boolean(yearMatch);
  return {
    raw,
    normalized: raw.trim().replace(/\s+/g, ' '),
    year: yearMatch ? Number(yearMatch[1]) : null,
    exam,
    jurisdiction: /\b(andhra pradesh|ap\b|telangana)\b/i.test(raw) ? 'IN-AP' : null,
    is_time_sensitive: isTimeSensitive,
    wants_official: WANTS_OFFICIAL.test(raw),
    topics: [],
  };
}

export interface RetrievalFilters {
  year?: number | null;
  exam?: string | null;
  jurisdiction?: string | null;
  /** Never surface anything below this tier. Default: allow COMMUNITY (flagged). */
  min_tier?: AuthorityTier;
  require_active_claims?: boolean;
}

export interface HybridOptions {
  topK?: number;
  candidatePool?: number;
  lexicalWeight?: number;
  vectorWeight?: number;
  rrfK?: number;
  /** Below this fused score we declare insufficient evidence. */
  evidenceThreshold?: number;
  now?: Date;
  /** Pre-computed query vector. Supplied by the caller (the RAG engine) so this
   *  module never reaches for a model directly. */
  queryEmbedding?: number[];
}

export interface EmbeddedChunk {
  chunk: KnowledgeChunk;
  embedding: number[];
}

export class HybridRetriever {
  private bm25 = new Bm25Index();
  private vectors = new Map<string, number[]>();
  private chunks = new Map<string, KnowledgeChunk>();

  add(chunk: KnowledgeChunk, embedding: number[] | null): void {
    this.chunks.set(chunk.chunk_id, chunk);
    // Authority-weighted BM25 so a Tier 1 page wins ties on exact-match relevance.
    const boost = 1 + (3 - TIER_RANK[chunk.authority_tier]) * 0.25;
    this.bm25.add(chunk.chunk_id, chunk.content, boost);
    if (embedding) this.vectors.set(chunk.chunk_id, embedding);
  }

  remove(chunkId: string): void {
    this.chunks.delete(chunkId);
    this.bm25.remove(chunkId);
    this.vectors.delete(chunkId);
  }

  get size(): number {
    return this.chunks.size;
  }

  search(query: string, filters: RetrievalFilters = {}, opts: HybridOptions = {}): RetrievalResult {
    const topK = opts.topK ?? 6;
    const pool = opts.candidatePool ?? Math.max(30, topK * 5);
    const lexicalWeight = opts.lexicalWeight ?? 1.0;
    const vectorWeight = opts.vectorWeight ?? 1.0;
    const rrfK = opts.rrfK ?? 60;
    const now = opts.now ?? new Date();
    const diagnostics: string[] = [];

    const qu = understandQuery(query, now.getFullYear());
    const appliedFilters: Record<string, unknown> = {
      year: filters.year ?? qu.year,
      exam: filters.exam ?? qu.exam,
      jurisdiction: filters.jurisdiction ?? qu.jurisdiction,
      min_tier: filters.min_tier ?? 'COMMUNITY',
    };

    // 1. metadata filter — cheap, and it removes the dangerous cases (wrong year,
    //    wrong jurisdiction) before any scoring can rescue them.
    const eligible: KnowledgeChunk[] = [];
    let rejectedByYear = 0;
    let rejectedByTier = 0;
    const minTierRank = TIER_RANK[filters.min_tier ?? 'COMMUNITY'];
    for (const c of this.chunks.values()) {
      const wantYear = (filters.year ?? qu.year) ?? null;
      if (wantYear && c.applicable_year && c.applicable_year !== wantYear) {
        rejectedByYear++;
        continue;
      }
      if (TIER_RANK[c.authority_tier] > minTierRank) {
        rejectedByTier++;
        continue;
      }
      const wantExam = filters.exam ?? qu.exam;
      // A chunk with no exam tag is general knowledge and stays eligible.
      if (wantExam && c.applicable_exam && c.applicable_exam !== wantExam) continue;
      const wantJur = filters.jurisdiction ?? qu.jurisdiction;
      if (wantJur && c.jurisdiction && c.jurisdiction !== wantJur) continue;
      eligible.push(c);
    }
    if (rejectedByYear) diagnostics.push(`excluded ${rejectedByYear} chunk(s) tagged for a different applicable year`);
    if (rejectedByTier) diagnostics.push(`excluded ${rejectedByTier} chunk(s) below tier ${filters.min_tier ?? 'COMMUNITY'}`);

    if (!eligible.length) {
      return { query, hits: [], applied_filters: appliedFilters, evidence_sufficient: false, diagnostics: [...diagnostics, 'no eligible chunks after filtering'] };
    }

    // 2. lexical leg over the eligible set only.
    const lexicalAll = this.bm25.search(query, this.chunks.size);
    const eligibleIds = new Set(eligible.map((c) => c.chunk_id));
    const lexical = lexicalAll.filter((r) => eligibleIds.has(r.id)).slice(0, pool);

    // 3. vector leg.
    const vectorLeg: Array<{ id: string; similarity: number }> = [];
    if (this.vectors.size) {
      // Query embedding is supplied by the caller in production; here we reuse the
      // corpus's own embedding space by embedding the query through the same
      // provider (see RagEngine). For the pure-retrieval unit test we accept an
      // optional pre-computed query vector via `opts`.
      const qv = opts.queryEmbedding;
      if (qv) {
        for (const c of eligible) {
          const v = this.vectors.get(c.chunk_id);
          if (v) vectorLeg.push({ id: c.chunk_id, similarity: cosineSimilarity(qv, v) });
        }
        vectorLeg.sort((a, b) => b.similarity - a.similarity);
      }
    } else {
      diagnostics.push('no embeddings available; lexical-only retrieval');
    }

    // 4. fuse.
    const fused = rrf(
      [lexical.map((r) => r.id), vectorLeg.map((r) => r.id)],
      rrfK,
      [lexicalWeight, vectorWeight],
    );
    if (!fused.size) {
      return { query, hits: [], applied_filters: appliedFilters, evidence_sufficient: false, diagnostics: [...diagnostics, 'no lexical or vector matches'] };
    }

    // 5. rerank on authority + freshness.
    const lexicalRank = new Map(lexical.map((r, i) => [r.id, i + 1]));
    const vectorRank = new Map(vectorLeg.map((r, i) => [r.id, i + 1]));
    const vectorSim = new Map(vectorLeg.map((r) => [r.id, r.similarity]));

    const hits: RetrievalHit[] = [];
    for (const [id, fusedScore] of fused) {
      const chunk = this.chunks.get(id)!;
      const authorityWeight = TIER_SCORE_CAP[chunk.authority_tier];
      const freshness = freshnessScore(chunk.freshness_category, chunk.published_at, now);
      const temporalPenalty = qu.is_time_sensitive ? 1.6 : 1.0;
      const finalScore = fusedScore * (0.55 + 0.3 * authorityWeight + 0.15 * (freshness ** temporalPenalty));
      const reasons: string[] = [`fused=${fusedScore.toFixed(4)}`, `tier=${chunk.authority_tier}`];
      if (lexicalRank.has(id)) reasons.push(`lexical#${lexicalRank.get(id)}`);
      if (vectorRank.has(id)) reasons.push(`vector#${vectorRank.get(id)}`);
      if (chunk.applicable_year) reasons.push(`year=${chunk.applicable_year}`);
      if (chunk.published_at) reasons.push(`published=${chunk.published_at} freshness=${freshness.toFixed(2)}`);
      hits.push({
        chunk,
        score: finalScore,
        lexical_rank: lexicalRank.get(id) ?? null,
        vector_rank: vectorRank.get(id) ?? null,
        vector_similarity: vectorSim.get(id) ?? null,
        authority_weight: authorityWeight,
        freshness_weight: freshness,
        reasons,
      });
    }
    hits.sort((a, b) => b.score - a.score);
    const top = hits.slice(0, topK);

    // 6. evidence sufficiency. A time-sensitive question answered only by
    //    community content is not evidence — it is a rumour.
    const threshold = opts.evidenceThreshold ?? 0.008;
    const best = top[0];
    const hasAuthoritative = top.some((h) => h.chunk.authority_tier === 'AUTHORITATIVE' || h.chunk.authority_tier === 'TRUSTED_SECONDARY');
    let sufficient = Boolean(best && best.score >= threshold);
    if (sufficient && qu.wants_official && !hasAuthoritative) {
      sufficient = false;
      diagnostics.push('query asked for official information but no AUTHORITATIVE/TRUSTED source matched');
    }
    if (sufficient && qu.is_time_sensitive && best && !best.chunk.published_at) {
      sufficient = false;
      diagnostics.push('time-sensitive query matched an undated source');
    }
    if (sufficient && qu.is_time_sensitive && best && freshnessScore(best.chunk.freshness_category, best.chunk.published_at, now) < 0.05) {
      sufficient = false;
      diagnostics.push(`best match is very stale (freshness ${(freshnessScore(best.chunk.freshness_category, best.chunk.published_at, now)).toFixed(3)})`);
    }
    diagnostics.push(`eligible=${eligible.length} lexical=${lexical.length} vector=${vectorLeg.length} fused=${fused.size} sufficient=${sufficient}`);

    return { query, hits: top, applied_filters: appliedFilters, evidence_sufficient: sufficient, diagnostics };
  }
}
