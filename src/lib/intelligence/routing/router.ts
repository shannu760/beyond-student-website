/**
 * Model router.
 *
 * BEYOND never asks "which model do we like?" It asks "what does this task
 * need?" and picks the cheapest model that satisfies the task's quality, latency
 * and context constraints — with an explicit fallback chain and a per-task
 * ceiling.
 *
 * The routing table is data, not code, so it can be tuned (and A/B tested) from
 * the admin dashboard without a deploy.
 */

import type { AIProvider } from '../providers/provider';
import { estimateCost } from '../providers/provider';
import type { TaskType, TokenUsage } from '../types/core';

export type ModelTier = 'CHEAP_FAST' | 'BALANCED' | 'STRONG_REASONING' | 'EMBEDDING' | 'MODERATION';

export interface RoutingRule {
  task: TaskType;
  /** Ordered preference list. */
  prefer: ModelTier[];
  /** Hard ceiling: never spend more than this per 1M output tokens for this task. */
  max_output_price_per_1m: number;
  max_latency_ms: number;
  min_context_tokens: number;
  /** Tasks that must never silently degrade to a weaker model. */
  no_fallback_below?: ModelTier;
  notes: string;
}

export const DEFAULT_ROUTING_TABLE: RoutingRule[] = [
  { task: 'CLASSIFY', prefer: ['CHEAP_FAST'], max_output_price_per_1m: 0.5, max_latency_ms: 800, min_context_tokens: 4096, notes: 'intent + topic classification; runs on every request' },
  { task: 'RESOURCE_CLASSIFY', prefer: ['CHEAP_FAST', 'BALANCED'], max_output_price_per_1m: 1.0, max_latency_ms: 2000, min_context_tokens: 8192, notes: 'batch classification of discovered resources' },
  { task: 'EXTRACT_CLAIMS', prefer: ['BALANCED', 'STRONG_REASONING'], max_output_price_per_1m: 4.0, max_latency_ms: 15000, min_context_tokens: 16384, no_fallback_below: 'BALANCED', notes: 'claim extraction must not use the cheapest model — errors here poison the KB' },
  { task: 'CONTRADICTION', prefer: ['STRONG_REASONING', 'BALANCED'], max_output_price_per_1m: 12.0, max_latency_ms: 20000, min_context_tokens: 32768, no_fallback_below: 'BALANCED', notes: 'comparing sources is reasoning-heavy' },
  { task: 'SUMMARIZE', prefer: ['BALANCED', 'CHEAP_FAST'], max_output_price_per_1m: 4.0, max_latency_ms: 8000, min_context_tokens: 16384, notes: 'summaries are lossy by design; balanced is enough' },
  { task: 'MODERATION', prefer: ['MODERATION', 'CHEAP_FAST'], max_output_price_per_1m: 1.0, max_latency_ms: 500, min_context_tokens: 4096, notes: 'dedicated moderation path; never routed to a chat model alone' },
  { task: 'SYNTHESIS', prefer: ['STRONG_REASONING', 'BALANCED'], max_output_price_per_1m: 12.0, max_latency_ms: 25000, min_context_tokens: 32768, no_fallback_below: 'BALANCED', notes: 'multi-source synthesis for high-impact answers' },
  { task: 'CHAT', prefer: ['BALANCED', 'CHEAP_FAST'], max_output_price_per_1m: 4.0, max_latency_ms: 6000, min_context_tokens: 16384, notes: 'student-facing conversational answers' },
  { task: 'PLANNING', prefer: ['STRONG_REASONING', 'BALANCED'], max_output_price_per_1m: 12.0, max_latency_ms: 20000, min_context_tokens: 16384, notes: 'study plans touch student outcomes; prefer the strong model' },
];

export interface ModelEntry {
  tier: ModelTier;
  model: string;
  provider_id: string;
  output_price_per_1m: number;
  max_context_tokens: number;
  typical_latency_ms: number;
  available: boolean;
}

export interface RouteDecision {
  task: TaskType;
  model: string;
  provider_id: string;
  tier: ModelTier;
  fallbacks: Array<{ model: string; provider_id: string; tier: ModelTier }>;
  reason: string;
  estimated_cost_usd: number;
}

export interface RouteRequest {
  task: TaskType;
  estimated_input_tokens: number;
  estimated_output_tokens: number;
  required_context_tokens?: number;
  latency_budget_ms?: number;
  /** Emergency: only free/local models allowed. */
  budget_locked?: boolean;
}

export class ModelRouter {
  constructor(
    private readonly models: ModelEntry[],
    private readonly table: RoutingRule[] = DEFAULT_ROUTING_TABLE,
  ) {}

  ruleFor(task: TaskType): RoutingRule {
    const rule = this.table.find((r) => r.task === task);
    if (!rule) throw new Error(`No routing rule for task ${task}`);
    return rule;
  }

  route(req: RouteRequest): RouteDecision {
    const rule = this.ruleFor(req.task);
    const latencyBudget = req.latency_budget_ms ?? rule.max_latency_ms;
    const needContext = req.required_context_tokens ?? rule.min_context_tokens;

    const eligible = (tier: ModelTier): ModelEntry[] =>
      this.models
        .filter((m) => m.tier === tier && m.available)
        .filter((m) => m.output_price_per_1m <= rule.max_output_price_per_1m)
        .filter((m) => m.max_context_tokens >= needContext)
        .filter((m) => !req.budget_locked || m.output_price_per_1m === 0)
        .sort((a, b) => a.output_price_per_1m - b.output_price_per_1m || a.typical_latency_ms - b.typical_latency_ms);

    const chosen: Array<{ model: ModelEntry; tier: ModelTier }> = [];
    for (const tier of rule.prefer) {
      for (const m of eligible(tier)) chosen.push({ model: m, tier });
    }
    if (!chosen.length) {
      // Fail closed with a clear reason rather than silently picking a bad model.
      throw new Error(
        `No eligible model for ${req.task}: need context>=${needContext}, latency<=${latencyBudget}ms, output<=${rule.max_output_price_per_1m}/1M${req.budget_locked ? ', budget locked' : ''}`,
      );
    }

    const [first, ...rest] = chosen as [{ model: ModelEntry; tier: ModelTier }, ...Array<{ model: ModelEntry; tier: ModelTier }>];
    const usage: TokenUsage = { input_tokens: req.estimated_input_tokens, output_tokens: req.estimated_output_tokens, cached_input_tokens: 0 };
    return {
      task: req.task,
      model: first.model.model,
      provider_id: first.model.provider_id,
      tier: first.tier,
      fallbacks: rest.map((c) => ({ model: c.model.model, provider_id: c.model.provider_id, tier: c.tier })),
      reason: `task=${req.task} tier=${first.tier} (${rule.notes})`,
      estimated_cost_usd: estimateCost(first.model.model, usage),
    };
  }

  /** Resolve a routed decision to a live provider. */
  providerFor(decision: RouteDecision, providers: Map<string, AIProvider>): AIProvider {
    const p = providers.get(decision.provider_id);
    if (!p) throw new Error(`Provider ${decision.provider_id} not registered`);
    return p;
  }

  /** Cheap guard used before we spend money on a big synthesis call. */
  fitsContext(decision: RouteDecision, tokenCount: number): boolean {
    const entry = this.models.find((m) => m.model === decision.model);
    return !entry || entry.max_context_tokens >= tokenCount;
  }

  table_snapshot(): RoutingRule[] {
    return this.table;
  }
}

/**
 * Production-ish model roster for BEYOND. Availability flips off when a key is
 * missing, so the router degrades instead of throwing at request time.
 * Prices are indicative placeholders (see providers/provider.ts).
 */
export function defaultModelRoster(env: NodeJS.ProcessEnv = process.env): ModelEntry[] {
  return [
    { tier: 'CHEAP_FAST', model: 'deepseek-v4-flash', provider_id: 'deepseek', output_price_per_1m: 0.28, max_context_tokens: 65536, typical_latency_ms: 700, available: Boolean(env.DEEPSEEK_API_KEY) },
    { tier: 'BALANCED', model: 'gemini-3.8-flash', provider_id: 'google', output_price_per_1m: 3.75, max_context_tokens: 1048576, typical_latency_ms: 1200, available: Boolean(env.GOOGLE_API_KEY) },
    { tier: 'STRONG_REASONING', model: 'claude-sonnet-5', provider_id: 'anthropic', output_price_per_1m: 10.0, max_context_tokens: 200000, typical_latency_ms: 3000, available: Boolean(env.ANTHROPIC_API_KEY) },
    { tier: 'EMBEDDING', model: 'embed-text-3k', provider_id: 'google', output_price_per_1m: 0, max_context_tokens: 8192, typical_latency_ms: 200, available: Boolean(env.GOOGLE_API_KEY) },
    { tier: 'MODERATION', model: 'deepseek-v4-flash', provider_id: 'deepseek', output_price_per_1m: 0.28, max_context_tokens: 65536, typical_latency_ms: 400, available: Boolean(env.DEEPSEEK_API_KEY) },
  ];
}
