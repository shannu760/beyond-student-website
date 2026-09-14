/**
 * Source registry, trust tiering and source scoring.
 *
 * The registry is an *allowlist-first* design: a domain is only crawled because
 * someone reviewed it and said so. Tier assignment lives here, in one place, so
 * "why is this Tier 1?" is always answerable.
 *
 * Scoring is deliberately transparent: a weighted sum of independently
 * inspectable components. A weighted sum beats a black-box score because admins
 * can explain a ranking to a student, and because each weight can be tuned per
 * category without retraining anything.
 */

import { FRESHNESS_HALF_LIFE_DAYS, TIER_RANK, type AuthorityTier, type FreshnessCategory, type SourceRecord, type SourceType } from '../types/core';
import { canonicalUrl } from '../ingest/stages';

export interface SourcePolicy {
  domain: string;
  authority_tier: AuthorityTier;
  organization: string;
  source_type: SourceType;
  freshness_category: FreshnessCategory;
  jurisdiction?: string;
  license?: string;
  /** Pin the cycle this source describes when the page text is ambiguous
   *  (e.g. a scholarship portal covering the 2026-27 cycle). */
  applicable_year?: number;
  /** Explicitly reviewed by a human. Required for Tier 1. */
  reviewed_by: string | null;
  reviewed_at: string | null;
  /** Paths we are allowed to fetch. Empty = whole domain (still robots-checked). */
  allowed_paths?: string[];
  /** Hard refusal: never fetch this domain even if linked. */
  blocked?: boolean;
  /** Refresh interval in days; overrides the freshness-derived default. */
  refresh_days?: number;
  notes?: string;
}

/**
 * Seed registry for BEYOND (Indian student context). Every entry here is a
 * proposal that requires human review before it is treated as Tier 1 — the
 * `reviewed_by` field stays null until an admin signs off, and tiering code
 * downgrades unreviewed Tier 1 entries to TRUSTED_SECONDARY.
 */
export const SEED_SOURCE_POLICIES: SourcePolicy[] = [
  { domain: 'nta.ac.in', authority_tier: 'AUTHORITATIVE', organization: 'National Testing Agency', source_type: 'OFFICIAL_ANNOUNCEMENT', freshness_category: 'DEADLINE_SENSITIVE', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 3 },
  { domain: 'jeemain.nta.nic.in', authority_tier: 'AUTHORITATIVE', organization: 'National Testing Agency (JEE Main)', source_type: 'OFFICIAL_ANNOUNCEMENT', freshness_category: 'DEADLINE_SENSITIVE', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 3 },
  { domain: 'exams.nta.ac.in', authority_tier: 'AUTHORITATIVE', organization: 'National Testing Agency (Exams)', source_type: 'OFFICIAL_ANNOUNCEMENT', freshness_category: 'DEADLINE_SENSITIVE', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 3 },
  { domain: 'neet.nta.nic.in', authority_tier: 'AUTHORITATIVE', organization: 'National Testing Agency (NEET)', source_type: 'OFFICIAL_ANNOUNCEMENT', freshness_category: 'DEADLINE_SENSITIVE', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 3 },
  { domain: 'ugc.gov.in', authority_tier: 'AUTHORITATIVE', organization: 'University Grants Commission', source_type: 'GOVERNMENT_PORTAL', freshness_category: 'POLICY', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 14 },
  { domain: 'aicte-india.org', authority_tier: 'AUTHORITATIVE', organization: 'All India Council for Technical Education', source_type: 'GOVERNMENT_PORTAL', freshness_category: 'POLICY', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 14 },
  { domain: 'nmc.org.in', authority_tier: 'AUTHORITATIVE', organization: 'National Medical Commission', source_type: 'GOVERNMENT_PORTAL', freshness_category: 'POLICY', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 14 },
  { domain: 'nss.gov.in', authority_tier: 'AUTHORITATIVE', organization: 'National Scholarship Portal', source_type: 'SCHOLARSHIP_PROVIDER', freshness_category: 'DEADLINE_SENSITIVE', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 7 },
  { domain: 'scholarships.gov.in', authority_tier: 'AUTHORITATIVE', organization: 'National Scholarship Portal', source_type: 'SCHOLARSHIP_PROVIDER', freshness_category: 'DEADLINE_SENSITIVE', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 7 },
  { domain: 'apcfss.in', authority_tier: 'AUTHORITATIVE', organization: 'AP Jagananna Cheyutha / CFSS (Andhra Pradesh)', source_type: 'SCHOLARSHIP_PROVIDER', freshness_category: 'DEADLINE_SENSITIVE', jurisdiction: 'IN-AP', reviewed_by: null, reviewed_at: null, refresh_days: 7 },
  { domain: 'sce.ap.gov.in', authority_tier: 'AUTHORITATIVE', organization: 'AP State Council of Higher Education', source_type: 'GOVERNMENT_PORTAL', freshness_category: 'POLICY', jurisdiction: 'IN-AP', reviewed_by: null, reviewed_at: null, refresh_days: 7 },
  { domain: 'education.gov.in', authority_tier: 'AUTHORITATIVE', organization: 'Ministry of Education, Govt. of India', source_type: 'GOVERNMENT_PORTAL', freshness_category: 'POLICY', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 14 },
  { domain: 'ncert.nic.in', authority_tier: 'AUTHORITATIVE', organization: 'NCERT', source_type: 'OER', freshness_category: 'CURRICULUM', jurisdiction: 'IN', license: 'Government of India (free for educational use)', reviewed_by: null, reviewed_at: null, refresh_days: 60 },
  { domain: 'iitkgp.ac.in', authority_tier: 'AUTHORITATIVE', organization: 'IIT Kharagpur', source_type: 'UNIVERSITY_PAGE', freshness_category: 'CURRICULUM', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 30 },
  { domain: 'ocw.mit.edu', authority_tier: 'TRUSTED_SECONDARY', organization: 'MIT OpenCourseWare', source_type: 'OER', freshness_category: 'CURRICULUM', license: 'CC BY-NC-SA 4.0', reviewed_by: null, reviewed_at: null, refresh_days: 90 },
  { domain: 'khanacademy.org', authority_tier: 'TRUSTED_SECONDARY', organization: 'Khan Academy', source_type: 'OER', freshness_category: 'CURRICULUM', reviewed_by: null, reviewed_at: null, refresh_days: 90 },
  { domain: 'developer.mozilla.org', authority_tier: 'TRUSTED_SECONDARY', organization: 'MDN Web Docs', source_type: 'DOCUMENTATION', freshness_category: 'FUNDAMENTAL_CONCEPT', license: 'CC-BY-SA 2.5', reviewed_by: null, reviewed_at: null, refresh_days: 60 },
  { domain: 'nptel.ac.in', authority_tier: 'AUTHORITATIVE', organization: 'NPTEL / SWAYAM (Govt. of India)', source_type: 'OER', freshness_category: 'CURRICULUM', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 60 },
  { domain: 'swayam.gov.in', authority_tier: 'AUTHORITATIVE', organization: 'SWAYAM (Govt. of India)', source_type: 'OER', freshness_category: 'CURRICULUM', jurisdiction: 'IN', reviewed_by: null, reviewed_at: null, refresh_days: 60 },
  // Community — never automatically promoted, capped in scoring below.
  { domain: 'reddit.com', authority_tier: 'COMMUNITY', organization: 'Reddit (student discussion)', source_type: 'FORUM', freshness_category: 'FUNDAMENTAL_CONCEPT', reviewed_by: null, reviewed_at: null, refresh_days: 180, notes: 'community signal only; never authoritative' },
  { domain: 'quora.com', authority_tier: 'COMMUNITY', organization: 'Quora', source_type: 'FORUM', freshness_category: 'FUNDAMENTAL_CONCEPT', reviewed_by: null, reviewed_at: null, refresh_days: 180, notes: 'community signal only' },
  { domain: 'medium.com', authority_tier: 'COMMUNITY', organization: 'Medium (individual blogs)', source_type: 'BLOG', freshness_category: 'FUNDAMENTAL_CONCEPT', reviewed_by: null, reviewed_at: null, refresh_days: 180 },
];

export class SourceRegistry {
  private byDomain = new Map<string, SourcePolicy>();
  /** The tier a domain was *declared* at, kept separately from the effective
   *  tier so a human sign-off can restore it. Without this, approval is a no-op
   *  because the stored policy has already been downgraded. */
  private declaredTier = new Map<string, AuthorityTier>();

  constructor(policies: SourcePolicy[] = SEED_SOURCE_POLICIES) {
    for (const p of policies) this.upsert(p);
  }

  upsert(policy: SourcePolicy): void {
    // Tier 1 requires a human signature. This is the rule that stops a scraper
    // from quietly turning a random domain into "authoritative".
    const effective: SourcePolicy =
      policy.authority_tier === 'AUTHORITATIVE' && !policy.reviewed_by
        ? { ...policy, authority_tier: 'TRUSTED_SECONDARY', notes: `${policy.notes ?? ''} [auto-downgraded: Tier 1 requires human review]`.trim() }
        : policy;
    this.declaredTier.set(policy.domain.toLowerCase(), policy.authority_tier);
    this.byDomain.set(effective.domain.toLowerCase(), effective);
  }

  /** Returns the policy for a URL's registrable-ish host (walks up subdomains). */
  policyFor(url: string): SourcePolicy | null {
    let host: string;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      return null;
    }
    const parts = host.split('.');
    for (let i = 0; i < parts.length; i++) {
      const candidate = parts.slice(i).join('.');
      const hit = this.byDomain.get(candidate);
      if (hit) return hit;
    }
    return null;
  }

  /** Allowlist check used by the research engine before any fetch. */
  isPermitted(url: string): { permitted: boolean; reason: string; policy: SourcePolicy | null } {
    const policy = this.policyFor(url);
    if (!policy) return { permitted: false, reason: 'domain not in reviewed allowlist', policy: null };
    if (policy.blocked) return { permitted: false, reason: 'domain explicitly blocked', policy };
    if (policy.allowed_paths?.length) {
      try {
        const { pathname } = new URL(url);
        if (!policy.allowed_paths.some((p) => pathname.startsWith(p))) {
          return { permitted: false, reason: `path ${pathname} outside reviewed scope`, policy };
        }
      } catch {
        return { permitted: false, reason: 'unparseable URL', policy };
      }
    }
    return { permitted: true, reason: 'ok', policy };
  }

  /**
   * Human sign-off. Because `policyFor` resolves the *most specific* matching
   * entry, signing off a parent domain would be inert while a child entry
   * (jeemain.nta.nic.in under nta.nic.in) stays downgraded. So sign-off covers
   * the domain and all registered subdomains of it.
   */
  approve(domain: string, reviewer: string, at = new Date().toISOString()): void {
    const key = domain.toLowerCase();
    for (const [d, p] of [...this.byDomain.entries()]) {
      if (d !== key && !d.endsWith(`.${key}`)) continue;
      const tier = this.declaredTier.get(d) ?? p.authority_tier;
      this.byDomain.set(d, {
        ...p,
        authority_tier: tier,
        reviewed_by: reviewer,
        reviewed_at: at,
        notes: (p.notes ?? '').replace(/\s*\[auto-downgraded[^\]]*\]/, '').trim() || undefined,
      });
    }
  }

  all(): SourcePolicy[] {
    return [...this.byDomain.values()];
  }
}

/* ------------------------------------------------------------- SCORING */

export interface ScoreComponents {
  authority: number;
  freshness: number;
  relevance: number;
  completeness: number;
  citation_quality: number;
  consistency: number;
  reliability_history: number;
}

export interface ScoreWeights extends ScoreComponents {}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  authority: 0.28,
  freshness: 0.22,
  relevance: 0.18,
  completeness: 0.08,
  citation_quality: 0.10,
  consistency: 0.07,
  reliability_history: 0.07,
};

/** Upper bound on score by tier. A community post can never out-score a
 *  government notice, no matter how well written. This is a policy decision,
 *  not an emergent property of the formula. */
export const TIER_SCORE_CAP: Record<AuthorityTier, number> = {
  AUTHORITATIVE: 1.0,
  TRUSTED_SECONDARY: 0.85,
  COMMUNITY: 0.55,
  UNVERIFIED: 0.35,
};

const AUTHORITY_SCORE: Record<AuthorityTier, number> = {
  AUTHORITATIVE: 1.0,
  TRUSTED_SECONDARY: 0.72,
  COMMUNITY: 0.4,
  UNVERIFIED: 0.15,
};

/** Exponential freshness decay with a per-category half-life. */
export function freshnessScore(category: FreshnessCategory, publishedAt: string | null, now = new Date()): number {
  if (!publishedAt) return 0.3; // unknown age is a real penalty, not a free pass
  const ageDays = (now.getTime() - new Date(publishedAt).getTime()) / 86_400_000;
  if (!Number.isFinite(ageDays)) return 0.3;
  if (ageDays <= 0) return 1;
  const halfLife = FRESHNESS_HALF_LIFE_DAYS[category];
  return Math.pow(0.5, ageDays / halfLife);
}

export interface ScoreInputs {
  tier: AuthorityTier;
  freshness_category: FreshnessCategory;
  published_at: string | null;
  relevance?: number; // 0..1, query-specific; pass when scoring for a query
  completeness?: number; // fraction of expected facts found
  citation_quality?: number; // does the source cite its own sources?
  consistency?: number; // agreement with other sources on same claim
  reliability_history?: number; // historical accuracy of this domain
  now?: Date;
}

export interface ScoreResult {
  score: number;
  capped: boolean;
  components: ScoreComponents;
  next_review_at: string;
}

export function scoreSource(input: ScoreInputs, weights: ScoreWeights = DEFAULT_WEIGHTS): ScoreResult {
  const now = input.now ?? new Date();
  const components: ScoreComponents = {
    authority: AUTHORITY_SCORE[input.tier],
    freshness: freshnessScore(input.freshness_category, input.published_at, now),
    relevance: input.relevance ?? 0.5,
    completeness: input.completeness ?? 0.6,
    citation_quality: input.citation_quality ?? (input.tier === 'AUTHORITATIVE' ? 0.9 : 0.4),
    consistency: input.consistency ?? 0.6,
    reliability_history: input.reliability_history ?? (input.tier === 'AUTHORITATIVE' ? 0.95 : 0.6),
  };
  const total = Object.keys(weights).reduce((sum, k) => sum + weights[k as keyof ScoreWeights] * components[k as keyof ScoreComponents], 0);
  const cap = TIER_SCORE_CAP[input.tier];
  const score = Math.min(total, cap);
  return { score: round(score, 4), capped: total > cap, components, next_review_at: nextReviewAt(input.freshness_category, input.published_at, now) };
}

/** When should we next look at this? Half-life scaled by criticality. */
export function nextReviewAt(category: FreshnessCategory, publishedAt: string | null, now = new Date()): string {
  const halfLife = FRESHNESS_HALF_LIFE_DAYS[category];
  // Re-check at roughly a quarter of the half-life: early enough to catch a
  // deadline change, late enough to keep crawl volume sane.
  const intervalDays = Math.max(1, Math.round(halfLife / 4));
  const base = publishedAt ? new Date(publishedAt) : now;
  const anchor = base.getTime() > now.getTime() ? now : base;
  return new Date(anchor.getTime() + intervalDays * 86_400_000).toISOString();
}

export const round = (n: number, dp = 4): number => Math.round(n * 10 ** dp) / 10 ** dp;

export const domainOf = (url: string): string => {
  try {
    return canonicalUrl(url).replace(/^https?:\/\//, '').split('/')[0]!;
  } catch {
    return 'unknown';
  }
};

export const tierRank = TIER_RANK;
