/**
 * Per-domain politeness + global cost control.
 *
 * Two independent budgets:
 *   - DomainRateLimiter: minimum interval between requests to one origin, and a
 *     hard daily cap per origin. We obey robots.txt crawl-delay when present.
 *   - Budget: daily caps on documents fetched, embeddings generated and model
 *     spend. When a budget is exhausted the research loop backs off instead of
 *     silently burning money.
 */

export interface RateLimitDecision {
  allowed: boolean;
  wait_ms: number;
  reason: string;
}

export class DomainRateLimiter {
  private lastRequest = new Map<string, number>();
  private dayCount = new Map<string, { day: string; count: number }>();

  constructor(
    private readonly defaultMinIntervalMs = 2000,
    private readonly dailyCapPerDomain = 200,
    private readonly now: () => number = Date.now,
  ) {}

  setOverride(domain: string, minIntervalMs: number): void {
    this.overrides.set(domain, minIntervalMs);
  }
  private overrides = new Map<string, number>();

  /** Respect a robots.txt crawl-delay (seconds) discovered for this domain. */
  applyCrawlDelay(domain: string, seconds: number | null): void {
    if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return;
    const current = this.overrides.get(domain) ?? this.defaultMinIntervalMs;
    this.overrides.set(domain, Math.max(current, seconds * 1000));
  }

  check(domain: string): RateLimitDecision {
    const now = this.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const entry = this.dayCount.get(domain);
    if (entry && entry.day === day && entry.count >= this.dailyCapPerDomain) {
      return { allowed: false, wait_ms: 0, reason: `daily cap ${this.dailyCapPerDomain} reached for ${domain}` };
    }
    const min = this.overrides.get(domain) ?? this.defaultMinIntervalMs;
    const last = this.lastRequest.get(domain);
    if (last !== undefined) {
      const elapsed = now - last;
      if (elapsed < min) return { allowed: false, wait_ms: min - elapsed, reason: `politeness interval ${min}ms` };
    }
    return { allowed: true, wait_ms: 0, reason: 'ok' };
  }

  record(domain: string): void {
    const now = this.now();
    const day = new Date(now).toISOString().slice(0, 10);
    this.lastRequest.set(domain, now);
    const entry = this.dayCount.get(domain);
    if (!entry || entry.day !== day) this.dayCount.set(domain, { day, count: 1 });
    else entry.count += 1;
  }

  usage(domain: string): number {
    const day = new Date(this.now()).toISOString().slice(0, 10);
    const entry = this.dayCount.get(domain);
    return entry && entry.day === day ? entry.count : 0;
  }
}

export type BudgetKind = 'documents' | 'embeddings' | 'model_usd' | 'search_queries';

export class Budget {
  private spent = new Map<BudgetKind, number>();

  constructor(
    private readonly limits: Record<BudgetKind, number>,
    public readonly onExhausted: (kind: BudgetKind, limit: number) => void = () => {},
  ) {}

  remaining(kind: BudgetKind): number {
    return Math.max(0, this.limits[kind] - (this.spent.get(kind) ?? 0));
  }

  canSpend(kind: BudgetKind, amount: number): boolean {
    return this.remaining(kind) >= amount;
  }

  spend(kind: BudgetKind, amount: number): boolean {
    if (!this.canSpend(kind, amount)) {
      this.onExhausted(kind, this.limits[kind]);
      return false;
    }
    this.spent.set(kind, (this.spent.get(kind) ?? 0) + amount);
    return true;
  }

  used(kind: BudgetKind): number {
    return this.spent.get(kind) ?? 0;
  }

  snapshot(): Record<BudgetKind, { used: number; limit: number }> {
    const out = {} as Record<BudgetKind, { used: number; limit: number }>;
    for (const k of Object.keys(this.limits) as BudgetKind[]) out[k] = { used: this.used(k), limit: this.limits[k] };
    return out;
  }
}
