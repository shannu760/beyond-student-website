/**
 * BEYOND AI — core type contracts.
 *
 * These types are the single source of truth for the shape of the intelligence
 * layer. The SQL migration in ../migrations/0001_knowledge_layer.sql is the
 * relational mirror of these types; if one changes the other must change too.
 *
 * Design rule: every piece of knowledge that can reach a student carries
 * provenance (where it came from), tier (how much to trust it), and temporal
 * validity (when it was/is true). No exceptions.
 */

/** How much we trust the origin of a piece of knowledge. Ordered — never reorder casually. */
export const AUTHORITY_TIERS = [
  'AUTHORITATIVE',
  'TRUSTED_SECONDARY',
  'COMMUNITY',
  'UNVERIFIED',
] as const;
export type AuthorityTier = (typeof AUTHORITY_TIERS)[number];

/** Numeric rank: lower = more trusted. */
export const TIER_RANK: Record<AuthorityTier, number> = {
  AUTHORITATIVE: 0,
  TRUSTED_SECONDARY: 1,
  COMMUNITY: 2,
  UNVERIFIED: 3,
};

/**
 * Volatility class of a knowledge topic. Drives freshness half-life and the
 * scheduled `next_review_at`. Deadlines rot fast; historical facts do not rot.
 */
export const FRESHNESS_CATEGORIES = [
  'DEADLINE_SENSITIVE',
  'POLICY',
  'CURRICULUM',
  'FUNDAMENTAL_CONCEPT',
  'HISTORICAL',
] as const;
export type FreshnessCategory = (typeof FRESHNESS_CATEGORIES)[number];

/** Median time (days) after which confidence in a category has decayed by half. */
export const FRESHNESS_HALF_LIFE_DAYS: Record<FreshnessCategory, number> = {
  DEADLINE_SENSITIVE: 21,
  POLICY: 120,
  CURRICULUM: 365,
  FUNDAMENTAL_CONCEPT: 1460,
  HISTORICAL: 3650,
};

export type SourceType =
  | 'OFFICIAL_ANNOUNCEMENT'
  | 'OFFICIAL_DOCUMENT'
  | 'GOVERNMENT_PORTAL'
  | 'UNIVERSITY_PAGE'
  | 'SCHOLARSHIP_PROVIDER'
  | 'PUBLISHER'
  | 'DOCUMENTATION'
  | 'OER'
  | 'FEED'
  | 'FORUM'
  | 'BLOG'
  | 'VIDEO'
  | 'UNKNOWN';

/**
 * The claim/knowledge status lifecycle. Note CONFLICTING and NEEDS_REVIEW are
 * first-class states — the system is allowed (and expected) to say "I don't
 * know yet" rather than resolve ambiguity silently.
 */
export const CLAIM_STATUSES = [
  'ACTIVE',
  'SUPERSEDED',
  'CONFLICTING',
  'NEEDS_REVIEW',
  'OUTDATED',
  'REJECTED',
] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export type ReviewStatus = 'UNREVIEWED' | 'VERIFIED' | 'NEEDS_REVIEW' | 'CONFLICTING' | 'OUTDATED' | 'REJECTED';

export interface SourceRecord {
  source_id: string;
  url: string;
  domain: string;
  organization: string | null;
  title: string | null;
  source_type: SourceType;
  authority_tier: AuthorityTier;
  discovered_at: string;
  published_at: string | null;
  last_checked_at: string | null;
  last_verified_at: string | null;
  /** When the system will next look at this source. Never null in production. */
  next_review_at: string | null;
  freshness_category: FreshnessCategory;
  jurisdiction: string | null; // e.g. 'IN', 'IN-AP'
  applicable_exam: string | null; // e.g. 'JEE_MAIN'
  applicable_year: number | null; // e.g. 2027 — critical for temporal correctness
  language: string | null;
  license: string | null;
  content_hash: string | null;
  status: 'ACTIVE' | 'STALE' | 'BLOCKED' | 'RETIRED';
  /** 0..1, computed by scoreSource(). Cached so ranking is cheap. */
  source_score: number;
  confidence: number;
  human_review_required: boolean;
  robots_allowed: boolean;
  /** Set when the source was admitted by an explicit allowlist entry. */
  allowlisted: boolean;
}

export interface ExtractedDocument {
  document_id: string;
  source_id: string;
  url: string;
  title: string;
  /** Ordered, structure-preserving blocks. Tables stay atomic. */
  blocks: ContentBlock[];
  /** Concatenated, sanitised plain text (post-clean). Used for dedupe + embedding input. */
  text: string;
  content_hash: string;
  language: string | null;
  published_at: string | null;
  extracted_at: string;
  warnings: string[];
}

export type ContentBlock =
  | { kind: 'heading'; level: number; text: string; path: string[] }
  | { kind: 'paragraph'; text: string; path: string[] }
  | { kind: 'list'; ordered: boolean; items: string[]; path: string[] }
  | { kind: 'table'; caption: string | null; headers: string[]; rows: string[][]; path: string[] }
  | { kind: 'code'; language: string | null; text: string; path: string[] };

export interface KnowledgeChunk {
  chunk_id: string;
  document_id: string;
  source_id: string;
  /** Full heading path, e.g. ["Eligibility", "Age limit"]. Kept for attribution. */
  heading: string[];
  section: string;
  /** Chunk text WITH the heading path prefixed, because retrieval quality
   *  measurably suffers when a chunk loses the context its headings supplied. */
  content: string;
  semantic_topic: string | null;
  source_url: string;
  authority_tier: AuthorityTier;
  published_at: string | null;
  verified_at: string | null;
  jurisdiction: string | null;
  applicable_year: number | null;
  applicable_exam: string | null;
  freshness_category: FreshnessCategory;
  confidence: number;
  token_estimate: number;
  /** Set when the chunk was copied forward from a neighbouring chunk for context. */
  overlap_from: string | null;
  embedding: number[] | null;
  embedding_model: string | null;
}

/** An atomic, checkable factual statement. This is the unit that gets versioned. */
export interface KnowledgeClaim {
  claim_id: string;
  /** Stable subject key so versions of the same fact collide on purpose. */
  subject: string; // e.g. 'jee_main.2027.eligibility.age_limit'
  predicate: string; // e.g. 'upper_age_limit'
  /** Normalised value, so "50%" and "fifty percent" can be compared. */
  value: string;
  value_display: string;
  unit: string | null;
  applicable_year: number | null;
  jurisdiction: string | null;
  effective_from: string | null;
  effective_until: string | null;
  verified_at: string;
  supersedes: string | null;
  status: ClaimStatus;
  authority_tier: AuthorityTier;
  source_id: string;
  chunk_id: string | null;
  confidence: number;
  /** Facts that must never be shown to a student without human sign-off. */
  high_impact: boolean;
  evidence: string;
}

export interface KnowledgeVersion {
  version_id: string;
  claim_id: string;
  value: string;
  status: ClaimStatus;
  recorded_at: string;
  recorded_by: string; // 'system' | admin id | 'research_agent'
  reason: string;
}

export interface KnowledgeConflict {
  conflict_id: string;
  subject: string;
  predicate: string;
  claim_ids: string[];
  values: string[];
  /** Lower number = more trusted tier. Conflicts where the *less* trusted source
   *  contradicts the more trusted one are usually auto-resolvable. */
  best_tier_rank: number;
  resolved: boolean;
  resolution: 'AUTO_SUPERSEDE' | 'HUMAN_REVIEW' | null;
  detected_at: string;
  notes: string;
}

export interface KnowledgeEdge {
  edge_id: string;
  from_entity: string;
  to_entity: string;
  relation: string; // 'conducted_by' | 'requires' | 'offered_by' | 'applies_to' | ...
  source_id: string;
  confidence: number;
}

export interface ResourceRecord {
  resource_id: string;
  title: string;
  description: string;
  url: string;
  provider: string;
  category: string;
  subject: string | null;
  topic: string | null;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL';
  language: string | null;
  cost: 'FREE' | 'FREE_WITH_SIGNUP' | 'FREE_TRIAL' | 'PAID' | 'UNKNOWN';
  /** Never report FREE unless free_verified_at is set. */
  free_verified_at: string | null;
  license: string | null;
  authority_tier: AuthorityTier;
  last_verified: string | null;
  quality_score: number;
}

/** Permitted student context. Everything here is explicitly consented + scoped. */
export interface StudentContext {
  student_id: string;
  class_level: string | null;
  target_exam: string | null;
  target_year: number | null;
  subjects: string[];
  goals: string[];
  /** Derived from the performance engine, never self-reported as fact. */
  weak_topics: Array<{ topic: string; mastery: number; source: 'assessment' | 'self_report' }>;
  strong_topics: Array<{ topic: string; mastery: number }>;
  language_preference: string | null;
  /** Topics the student asked to exclude. */
  exclusions: string[];
  permissions: StudentPermissions;
}

export interface StudentPermissions {
  allow_performance_data: boolean;
  allow_anonymized_aggregation: boolean;
  allow_content_for_product_learning: boolean;
  minor: boolean;
  age_band: 'UNDER_13' | '13_17' | '18_PLUS';
}

export interface CitationRef {
  citation_id: string;
  source_name: string;
  organization: string | null;
  url: string;
  published_at: string | null;
  verified_at: string | null;
  section: string | null;
  authority_tier: AuthorityTier;
  confidence: number;
  chunk_id: string;
}

export interface RetrievalHit {
  chunk: KnowledgeChunk;
  /** Final fused score, 0..1-ish. */
  score: number;
  lexical_rank: number | null;
  vector_rank: number | null;
  vector_similarity: number | null;
  authority_weight: number;
  freshness_weight: number;
  reasons: string[];
}

export interface RetrievalResult {
  query: string;
  hits: RetrievalHit[];
  applied_filters: Record<string, unknown>;
  /** True when nothing met the evidence bar. Answers must degrade, not guess. */
  evidence_sufficient: boolean;
  diagnostics: string[];
}

export type TaskType =
  | 'CLASSIFY'
  | 'EXTRACT_CLAIMS'
  | 'SUMMARIZE'
  | 'RESOURCE_CLASSIFY'
  | 'MODERATION'
  | 'CONTRADICTION'
  | 'SYNTHESIS'
  | 'CHAT'
  | 'PLANNING';

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cached_input_tokens: number;
}

export interface CostEstimate {
  usd: number;
  model: string;
  input_tokens: number;
  output_tokens: number;
}
