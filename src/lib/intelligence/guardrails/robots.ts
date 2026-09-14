/**
 * robots.txt handling.
 *
 * Policy: we obey robots.txt by default and treat a *parse failure* as
 * "disallowed", not "allowed". We also obey an explicit per-domain override
 * allowlist — but only for domains we have reviewed, and only for paths that
 * robots.txt also permits. The override never grants access to a path robots.txt
 * forbids; it only lets us fetch pages that robots.txt merely does not mention.
 *
 * This is deliberately a small, readable implementation rather than a dependency.
 */

export interface RobotsRules {
  /** group -> list of {type, pattern} in file order */
  groups: Map<string, Array<{ type: 'allow' | 'disallow'; pattern: string }>>;
  crawlDelay: Map<string, number>;
  sitemaps: string[];
  raw: string;
}

export const EMPTY_ROBOTS: RobotsRules = {
  groups: new Map(),
  crawlDelay: new Map(),
  sitemaps: [],
  raw: '',
};

export function parseRobots(raw: string): RobotsRules {
  const groups = new Map<string, Array<{ type: 'allow' | 'disallow'; pattern: string }>>();
  const crawlDelay = new Map<string, number>();
  const sitemaps: string[] = [];
  const currentAgents: string[] = [];

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (!value && field !== 'sitemap') continue;

    if (field === 'user-agent') {
      if (currentAgents.length && groups.get(currentAgents[0] ?? '')?.length) currentAgents.length = 0;
      currentAgents.push(value.toLowerCase());
      for (const a of currentAgents) if (!groups.has(a)) groups.set(a, []);
    } else if (field === 'disallow' || field === 'allow') {
      for (const a of currentAgents.length ? currentAgents : ['*']) {
        if (!groups.has(a)) groups.set(a, []);
        // Empty disallow = explicit allow-all.
        if (!value) continue;
        groups.get(a)!.push({ type: field, pattern: value });
      }
    } else if (field === 'crawl-delay') {
      const n = Number(value);
      if (Number.isFinite(n)) for (const a of currentAgents.length ? currentAgents : ['*']) crawlDelay.set(a, n);
    } else if (field === 'sitemap') {
      sitemaps.push(value);
    }
  }
  return { groups, crawlDelay, sitemaps, raw };
}

/**
 * Convert a robots.txt pattern into an anchored RegExp (supports * and $).
 *
 * Per RFC 9309 a pattern is a path *prefix* unless it ends with '$'. The subtle
 * part: the suffix group must NOT start with a literal '/', because a pattern
 * like /admin/ already ends in one and "^/admin/(?:/.*)" would then require two
 * consecutive slashes and match nothing. Disallow /admin/ has to block
 * /admin/secret; getting this wrong means crawling exactly what a site forbade.
 */
function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^{}()|[\]\\]/g, '\\$&');
  const withWildcard = escaped.replace(/\*/g, '.*');
  if (withWildcard.endsWith('$')) return new RegExp(`^${withWildcard}`);
  // Prefix match. The trailing group looks redundant but is load-bearing: it
  // states that the pattern is a prefix which may be followed by anything (more
  // path, a query or a fragment) or nothing at all. Do not "simplify" it to
  // `(?:$|/.*)` — that fails on /admin/ vs /admin/secret, because the pattern
  // already consumed the slash.
  return new RegExp(`^${withWildcard}(?:$|.*)`);
}

export interface RobotsDecision {
  allowed: boolean;
  reason: string;
  matched_rule: string | null;
  crawl_delay_s: number | null;
}

export function isPathAllowed(rules: RobotsRules, path: string, userAgent: string): RobotsDecision {
  const ua = userAgent.toLowerCase();
  const specific = rules.groups.get(ua);
  const group = specific ?? rules.groups.get('*') ?? [];
  const delay = rules.crawlDelay.get(ua) ?? rules.crawlDelay.get('*') ?? null;

  if (!group.length) return { allowed: true, reason: 'no matching rule', matched_rule: null, crawl_delay_s: delay };

  // Longest match wins; on a tie, Allow wins over Disallow.
  let best: { rule: { type: 'allow' | 'disallow'; pattern: string }; len: number } | null = null;
  for (const rule of group) {
    if (patternToRegex(rule.pattern).test(path)) {
      if (!best || rule.pattern.length > best.len) best = { rule, len: rule.pattern.length };
    }
  }
  if (!best) return { allowed: true, reason: 'no matching rule', matched_rule: null, crawl_delay_s: delay };
  return {
    allowed: best.rule.type === 'allow',
    reason: `${best.rule.type} ${best.rule.pattern}`,
    matched_rule: best.rule.pattern,
    crawl_delay_s: delay,
  };
}

export class RobotsChecker {
  private cache = new Map<string, { rules: RobotsRules; fetched_at: number }>();
  private readonly ttlMs = 6 * 60 * 60 * 1000; // re-read robots.txt every 6h

  constructor(
    private readonly fetchImpl: (url: string) => Promise<{ ok: boolean; status: number; text: string }>,
    private readonly userAgent: string,
  ) {}

  async check(url: string): Promise<RobotsDecision> {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return { allowed: false, reason: 'unparseable URL', matched_rule: null, crawl_delay_s: null };
    }
    const origin = parsed.origin;
    const cached = this.cache.get(origin);
    const now = Date.now();
    let rules = cached && now - cached.fetched_at < this.ttlMs ? cached.rules : null;

    if (!rules) {
      try {
        const res = await this.fetchImpl(`${origin}/robots.txt`);
        // A 404/410 means "no restrictions published" — allowed.
        // Anything else unexpected (401/403/5xx) means we cannot know — disallow.
        if (res.ok || res.status === 404 || res.status === 410) {
          rules = res.ok ? parseRobots(res.text) : EMPTY_ROBOTS;
        } else {
          return {
            allowed: false,
            reason: `robots.txt returned HTTP ${res.status}; treating as disallowed`,
            matched_rule: null,
            crawl_delay_s: null,
          };
        }
      } catch (err) {
        return {
          allowed: false,
          reason: `robots.txt fetch failed: ${(err as Error).message}; treating as disallowed`,
          matched_rule: null,
          crawl_delay_s: null,
        };
      }
      this.cache.set(origin, { rules, fetched_at: now });
    }

    const path = `${parsed.pathname}${parsed.search}` || '/';
    return isPathAllowed(rules, path, this.userAgent);
  }
}
