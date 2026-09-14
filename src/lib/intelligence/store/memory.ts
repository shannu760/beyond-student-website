/**
 * In-memory knowledge store.
 *
 * This is NOT a toy: it implements the same `KnowledgeStore` interface the
 * Postgres/Supabase adapter will implement, and its collections mirror
 * migrations/0001_knowledge_layer.sql one-to-one. That lets the whole pipeline,
 * retrieval path and evaluation harness run in CI with zero infrastructure,
 * while production swaps in Postgres behind the same contract.
 */

import { sha256, toDedupeInput, type DedupeInput } from '../ingest/stages';
import type {
  CitationRef, ClaimStatus, KnowledgeChunk, KnowledgeClaim, KnowledgeConflict, KnowledgeEdge,
  KnowledgeVersion, ResourceRecord, SourceRecord, StudentContext,
} from '../types/core';

export interface ResearchJob {
  job_id: string;
  trigger: 'KNOWLEDGE_GAP' | 'SCHEDULED_REFRESH' | 'MANUAL' | 'CONTRADICTION';
  query: string;
  target_domains: string[];
  status: 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED' | 'CANCELLED';
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  error: string | null;
  docs_ingested: number;
  claims_produced: number;
  /** Every action taken, for the admin audit trail. */
  audit: string[];
}

export interface VerificationTask {
  task_id: string;
  claim_id: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'VERIFIED' | 'REJECTED' | 'OUTDATED';
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

export interface AiUsageEvent {
  event_id: string;
  at: string;
  task_type: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  usd: number;
  latency_ms: number;
  student_id: string | null;
  /** Aggregatable, non-identifying label. Never free-text student content. */
  topic: string | null;
  outcome: 'ANSWERED' | 'REFUSED_INSUFFICIENT_EVIDENCE' | 'ERROR' | 'MODERATED';
}

export interface AiEvaluationRun {
  run_id: string;
  at: string;
  dataset: string;
  metrics: Record<string, number>;
  failures: Array<{ case_id: string; metric: string; expected: string; actual: string }>;
}

export interface KnowledgeStore {
  sources: { upsert(s: SourceRecord): void; byId(id: string): SourceRecord | undefined; byUrl(url: string): SourceRecord | undefined; all(): SourceRecord[] };
  documents: { put(d: { document_id: string; source_id: string; url: string; title: string; content_hash: string; published_at: string | null; extracted_at: string; status: 'PUBLISHED' | 'QUARANTINED' | 'REJECTED' | 'DUPLICATE'; warnings: string[] }): void; byId(id: string): unknown; all(): Array<{ document_id: string; status: string; content_hash: string; url: string; title: string; warnings: string[] }> };
  chunks: { put(c: KnowledgeChunk): void; update(id: string, patch: Partial<KnowledgeChunk>): void; byId(id: string): KnowledgeChunk | undefined; byDocument(docId: string): KnowledgeChunk[]; all(): KnowledgeChunk[]; delete(id: string): void };
  claims: { put(c: KnowledgeClaim): void; update(id: string, patch: Partial<KnowledgeClaim>): void; byId(id: string): KnowledgeClaim | undefined; bySubject(subject: string): KnowledgeClaim[]; active(): KnowledgeClaim[]; all(): KnowledgeClaim[] };
  versions: { put(v: KnowledgeVersion): void; forClaim(claimId: string): KnowledgeVersion[] };
  conflicts: { put(c: KnowledgeConflict): void; open(): KnowledgeConflict[]; all(): KnowledgeConflict[]; resolve(id: string, resolution: 'AUTO_SUPERSEDE' | 'HUMAN_REVIEW', notes: string): void };
  edges: { put(e: KnowledgeEdge): void; from(entity: string): KnowledgeEdge[]; all(): KnowledgeEdge[] };
  resources: { put(r: ResourceRecord): void; all(): ResourceRecord[]; byId(id: string): ResourceRecord | undefined };
  jobs: { put(j: ResearchJob): void; update(id: string, patch: Partial<ResearchJob>): void; all(): ResearchJob[] };
  tasks: { put(t: VerificationTask): void; update(id: string, patch: Partial<VerificationTask>): void; open(): VerificationTask[]; all(): VerificationTask[] };
  usage: { put(e: AiUsageEvent): void; all(): AiUsageEvent[] };
  evaluations: { put(e: AiEvaluationRun): void; all(): AiEvaluationRun[] };
  students: { put(s: StudentContext): void; byId(id: string): StudentContext | undefined };
  /** Approximate dedupe index over chunk text. Postgres version = shingle table + GIN. */
  dedupeIndex: { forTopic(topic: string | null, year: number | null): DedupeInput[]; add(topic: string | null, year: number | null, input: DedupeInput): void };
  citations: { put(c: CitationRef): void; byId(id: string): CitationRef | undefined };
}

export function createMemoryStore(): KnowledgeStore {
  const sources = new Map<string, SourceRecord>();
  const byUrl = new Map<string, SourceRecord>();
  const documents = new Map<string, { document_id: string; source_id: string; url: string; title: string; content_hash: string; published_at: string | null; extracted_at: string; status: 'PUBLISHED' | 'QUARANTINED' | 'REJECTED' | 'DUPLICATE'; warnings: string[] }>();
  const chunks = new Map<string, KnowledgeChunk>();
  const claims = new Map<string, KnowledgeClaim>();
  const versions = new Map<string, KnowledgeVersion[]>();
  const conflicts = new Map<string, KnowledgeConflict>();
  const edges = new Map<string, KnowledgeEdge>();
  const resources = new Map<string, ResourceRecord>();
  const jobs = new Map<string, ResearchJob>();
  const tasks = new Map<string, VerificationTask>();
  const usage: AiUsageEvent[] = [];
  const evaluations: AiEvaluationRun[] = [];
  const students = new Map<string, StudentContext>();
  const dedupe = new Map<string, DedupeInput[]>();
  const citations = new Map<string, CitationRef>();

  const key = (topic: string | null, year: number | null) => `${topic ?? '*'}::${year ?? '*'}`;

  return {
    sources: {
      upsert: (s) => {
        sources.set(s.source_id, s);
        byUrl.set(s.url, s);
      },
      byId: (id) => sources.get(id),
      byUrl: (url) => byUrl.get(url),
      all: () => [...sources.values()],
    },
    documents: {
      put: (d) => documents.set(d.document_id, d),
      byId: (id) => documents.get(id),
      all: () => [...documents.values()],
    },
    chunks: {
      put: (c) => chunks.set(c.chunk_id, c),
      update: (id, patch) => {
        const cur = chunks.get(id);
        if (cur) chunks.set(id, { ...cur, ...patch });
      },
      byId: (id) => chunks.get(id),
      byDocument: (docId) => [...chunks.values()].filter((c) => c.document_id === docId),
      all: () => [...chunks.values()],
      delete: (id) => chunks.delete(id),
    },
    claims: {
      put: (c) => claims.set(c.claim_id, c),
      update: (id, patch) => {
        const cur = claims.get(id);
        if (cur) claims.set(id, { ...cur, ...patch });
      },
      byId: (id) => claims.get(id),
      bySubject: (subject) => [...claims.values()].filter((c) => c.subject === subject),
      active: () => [...claims.values()].filter((c) => c.status === 'ACTIVE'),
      all: () => [...claims.values()],
    },
    versions: {
      put: (v) => {
        const arr = versions.get(v.claim_id) ?? [];
        arr.push(v);
        versions.set(v.claim_id, arr);
      },
      forClaim: (claimId) => versions.get(claimId) ?? [],
    },
    conflicts: {
      put: (c) => conflicts.set(c.conflict_id, c),
      open: () => [...conflicts.values()].filter((c) => !c.resolved),
      all: () => [...conflicts.values()],
      resolve: (id, resolution, notes) => {
        const c = conflicts.get(id);
        if (c) conflicts.set(id, { ...c, resolved: true, resolution, notes });
      },
    },
    edges: {
      put: (e) => edges.set(e.edge_id, e),
      from: (entity) => [...edges.values()].filter((e) => e.from_entity.toLowerCase() === entity.toLowerCase()),
      all: () => [...edges.values()],
    },
    resources: {
      put: (r) => resources.set(r.resource_id, r),
      all: () => [...resources.values()],
      byId: (id) => resources.get(id),
    },
    jobs: {
      put: (j) => jobs.set(j.job_id, j),
      update: (id, patch) => {
        const cur = jobs.get(id);
        if (cur) jobs.set(id, { ...cur, ...patch });
      },
      all: () => [...jobs.values()],
    },
    tasks: {
      put: (t) => tasks.set(t.task_id, t),
      update: (id, patch) => {
        const cur = tasks.get(id);
        if (cur) tasks.set(id, { ...cur, ...patch });
      },
      open: () => [...tasks.values()].filter((t) => t.status === 'OPEN'),
      all: () => [...tasks.values()],
    },
    usage: {
      put: (e) => usage.push(e),
      all: () => usage,
    },
    evaluations: {
      put: (e) => evaluations.push(e),
      all: () => evaluations,
    },
    students: {
      put: (s) => students.set(s.student_id, s),
      byId: (id) => students.get(id),
    },
    dedupeIndex: {
      forTopic: (topic, year) => dedupe.get(key(topic, year)) ?? [],
      add: (topic, year, input) => {
        const k = key(topic, year);
        const arr = dedupe.get(k) ?? [];
        arr.push(input);
        dedupe.set(k, arr);
      },
    },
    citations: {
      put: (c) => citations.set(c.citation_id, c),
      byId: (id) => citations.get(id),
    },
  };
}

export const hashOf = sha256;
export const dedupeInputOf = toDedupeInput;
export type { ClaimStatus };
