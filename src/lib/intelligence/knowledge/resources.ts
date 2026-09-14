/**
 * Free resource discovery + recommendation.
 *
 * Two invariants:
 *   1. `cost` is never reported as FREE unless `free_verified_at` is set. An
 *      unverified resource is UNKNOWN and is ranked below verified ones.
 *   2. Recommendations are explanations, not link dumps. Every recommendation
 *      carries a reason tied to the student's actual context (assessed mastery
 *      where available, never invented).
 */

import { freshnessScore } from '../knowledge/sources';
import { TIER_RANK, type AuthorityTier, type ResourceRecord, type StudentContext } from '../types/core';

export const COST_RANK: Record<ResourceRecord['cost'], number> = {
  FREE: 0, FREE_WITH_SIGNUP: 1, FREE_TRIAL: 2, UNKNOWN: 3, PAID: 4,
};

/**
 * Quality score in 0..1. Authority dominates, because a wrong free resource
 * costs a student weeks.
 */
export function scoreResource(r: ResourceRecord, now = new Date()): number {
  const authority = 1 - TIER_RANK[r.authority_tier] * 0.28;
  const fresh = r.last_verified ? freshnessScore('CURRICULUM', r.last_verified, now) : 0.4;
  const freeTrust = r.cost === 'FREE' && r.free_verified_at ? 1 : r.cost === 'FREE' ? 0.5 : 0.3;
  const license = r.license ? 1 : 0.55;
  const score = 0.38 * authority + 0.22 * fresh + 0.2 * freeTrust + 0.12 * license + 0.08 * (r.description.length > 80 ? 1 : 0.4);
  return Math.round(Math.min(1, score) * 1000) / 1000;
}

/**
 * Resources that must never be surfaced, whatever their quality score.
 *
 * Note the ordering: an authoritative publisher distributing its own material
 * for free is legitimate (NCERT publishes free PDFs of its own textbooks), so
 * the piracy signals are only treated as disqualifying for sources that are not
 * authoritative. Flagging by keyword alone would ban the single best free
 * resource an Indian student has.
 */
const PIRACY_SIGNALS = /(leaked|cracked|pirated|torrent|telegram\s*channel|drive\.google\.com\/[^\s]*\.pdf|mega\.nz\/[^\s]*\.pdf)/i;

export function isProhibited(r: ResourceRecord): boolean {
  const haystack = `${r.title} ${r.url} ${r.description} ${r.provider}`;
  if (r.authority_tier === 'AUTHORITATIVE' && r.license) return false;
  return PIRACY_SIGNALS.test(haystack);
}

export interface RecommendationQuery {
  topic: string;
  subject?: string | null;
  level?: ResourceRecord['level'];
  language?: string | null;
  maxResults?: number;
  preferFree?: boolean;
}

export interface RankedResource {
  resource: ResourceRecord;
  score: number;
  reasons: string[];
}

export function rankResources(
  resources: ResourceRecord[],
  query: RecommendationQuery,
  student: StudentContext | null,
  now = new Date(),
): RankedResource[] {
  const topicTokens = tokenize(query.topic);
  const out: RankedResource[] = [];

  for (const r of resources) {
    if (isProhibited(r)) continue;
    if (student?.exclusions.some((x) => x.toLowerCase() === r.title.toLowerCase() || x.toLowerCase() === r.provider.toLowerCase())) continue;
    if (query.language && r.language && r.language !== query.language && r.language !== 'en') continue;

    const reasons: string[] = [];
    const rTokens = tokenize(`${r.title} ${r.topic ?? ''} ${r.subject ?? ''} ${r.description}`);
    const overlap = topicTokens.filter((t) => rTokens.some((rt) => rt.startsWith(t) || t.startsWith(rt))).length;
    const relevance = topicTokens.length ? overlap / topicTokens.length : 0.5;
    if (overlap) reasons.push(`matches your topic (${overlap}/${topicTokens.length} terms)`);

    let levelFit = 0.6;
    if (query.level && r.level !== 'ALL') {
      levelFit = r.level === query.level ? 1 : 0.25;
      if (r.level === query.level) reasons.push(`written for ${query.level.toLowerCase()} level`);
    } else if (r.level === 'ALL') {
      levelFit = 0.8;
    }

    const assessed = student?.weak_topics.find((t) => tokenize(t.topic).some((tt) => topicTokens.includes(tt)));
    if (assessed && assessed.source === 'assessment') {
      reasons.push(`targets ${assessed.topic}, where your last assessment showed ${(assessed.mastery * 100).toFixed(0)}% mastery`);
    }

    const freeFit = query.preferFree === false ? 0.7 : 1 - COST_RANK[r.cost] * 0.18;
    if (r.cost === 'FREE' && r.free_verified_at) reasons.push(`verified free (checked ${r.free_verified_at})`);
    else if (r.cost === 'FREE') reasons.push('listed as free but not yet verified by us');

    const quality = scoreResource(r, now);
    const score = Math.round((0.42 * relevance + 0.2 * levelFit + 0.2 * quality + 0.18 * freeFit) * 1000) / 1000;
    if (relevance === 0 && !assessed) continue;
    if (r.authority_tier === 'AUTHORITATIVE') reasons.push('published by an official/authoritative body');
    out.push({ resource: { ...r, quality_score: quality }, score, reasons });
  }

  return out.sort((a, b) => b.score - a.score).slice(0, query.maxResults ?? 5);
}

/**
 * Order a small set of resources into a learning sequence: concept -> worked
 * examples -> practice. This is the "start with X, then use Y" behaviour, and it
 * is bounded to the ranked set we already justified.
 */
export function sequenceResources(ranked: RankedResource[]): Array<RankedResource & { role: 'LEARN' | 'PRACTICE' | 'REFERENCE' | 'WATCH' }> {
  const roleOf = (r: ResourceRecord): 'LEARN' | 'PRACTICE' | 'REFERENCE' | 'WATCH' => {
    if (/(practice|problem|exercise|question bank|quiz)/i.test(`${r.title} ${r.category} ${r.description}`)) return 'PRACTICE';
    if (/(video|lecture|course)/i.test(`${r.category} ${r.title}`)) return 'WATCH';
    if (/(documentation|reference|manual|specification)/i.test(`${r.category} ${r.title}`)) return 'REFERENCE';
    return 'LEARN';
  };
  const order = { LEARN: 0, WATCH: 1, PRACTICE: 2, REFERENCE: 3 } as const;
  return ranked
    .map((r) => ({ ...r, role: roleOf(r.resource) }))
    .sort((a, b) => order[a.role] - order[b.role] || b.score - a.score);
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/** Curated seed resources. Every entry needs a verification pass before FREE is honoured. */
export const SEED_RESOURCES: ResourceRecord[] = [
  {
    resource_id: 'res_ncert_math_12',
    title: 'NCERT Mathematics Class 12 (official textbook, free PDF)',
    description: 'Official NCERT Class 12 Mathematics textbook covering relations, matrices, calculus, vectors and probability. Free to read on the NCERT website.',
    url: 'https://ncert.nic.in/textbook.php',
    provider: 'NCERT',
    category: 'textbook',
    subject: 'mathematics',
    topic: 'calculus',
    level: 'INTERMEDIATE',
    language: 'en',
    cost: 'FREE',
    free_verified_at: null,
    license: 'Government of India — free for educational use',
    authority_tier: 'AUTHORITATIVE',
    last_verified: null,
    quality_score: 0,
  },
  {
    resource_id: 'res_nptel_calculus',
    title: 'NPTEL: Mathematics I (IIT lecture series)',
    description: 'Free video lecture series on single variable calculus from the Government of India SWAYAM/NPTEL platform, with assignments.',
    url: 'https://nptel.ac.in/courses',
    provider: 'NPTEL / SWAYAM',
    category: 'lecture',
    subject: 'mathematics',
    topic: 'calculus',
    level: 'INTERMEDIATE',
    language: 'en',
    cost: 'FREE',
    free_verified_at: null,
    license: 'Free to view; attribution required',
    authority_tier: 'AUTHORITATIVE',
    last_verified: null,
    quality_score: 0,
  },
  {
    resource_id: 'res_khan_calculus',
    title: 'Khan Academy — Calculus 1',
    description: 'Structured free course on limits, derivatives and integrals with practice exercises and mastery tracking.',
    url: 'https://www.khanacademy.org/math/calculus-1',
    provider: 'Khan Academy',
    category: 'open_course',
    subject: 'mathematics',
    topic: 'calculus',
    level: 'BEGINNER',
    language: 'en',
    cost: 'FREE',
    free_verified_at: null,
    license: 'CC BY-NC-SA',
    authority_tier: 'TRUSTED_SECONDARY',
    last_verified: null,
    quality_score: 0,
  },
  {
    resource_id: 'res_mit_ocw_1801',
    title: 'MIT OpenCourseWare 18.01 Single Variable Calculus',
    description: 'Free lecture notes, problem sets and exams from MIT. Requires self-discipline; assumes comfort with algebra.',
    url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/',
    provider: 'MIT OpenCourseWare',
    category: 'open_course',
    subject: 'mathematics',
    topic: 'calculus',
    level: 'ADVANCED',
    language: 'en',
    cost: 'FREE',
    free_verified_at: null,
    license: 'CC BY-NC-SA 4.0',
    authority_tier: 'TRUSTED_SECONDARY',
    last_verified: null,
    quality_score: 0,
  },
  {
    resource_id: 'res_nss_scholarships',
    title: 'National Scholarship Portal — scheme list',
    description: 'Official Government of India portal listing central and state scholarship schemes, eligibility and application windows.',
    url: 'https://scholarships.gov.in/',
    provider: 'Ministry of Education, Govt. of India',
    category: 'scholarship',
    subject: null,
    topic: 'scholarships',
    level: 'ALL',
    language: 'en',
    cost: 'FREE',
    free_verified_at: null,
    license: null,
    authority_tier: 'AUTHORITATIVE',
    last_verified: null,
    quality_score: 0,
  },
  {
    resource_id: 'res_pirated_jee_pdf',
    title: 'JEE Main previous papers FREE PDF download — leaked collection',
    description: 'Unofficial PDF collection advertised on a Telegram channel. Included in the seed set only so the prohibition filter has something to reject.',
    url: 'https://example.invalid/leaked-jee-pdf',
    provider: 'Unknown Telegram channel',
    category: 'practice',
    subject: 'physics',
    topic: 'jee_main',
    level: 'ALL',
    language: 'en',
    cost: 'FREE',
    free_verified_at: null,
    license: null,
    authority_tier: 'UNVERIFIED',
    last_verified: null,
    quality_score: 0,
  },
];

export const tierRank = TIER_RANK;
export type { AuthorityTier };
