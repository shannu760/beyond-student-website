/**
 * AI provider abstraction.
 *
 * BEYOND is never bound to one vendor. Everything the intelligence layer needs
 * from a model goes through `AIProvider`; concrete adapters (Anthropic, Google,
 * OpenAI, DeepSeek, local open-weight) live behind it and are selected by the
 * router at request time.
 *
 * Hard rules:
 *   - API keys are read server-side only. Nothing in this module or in any
 *     adapter may ever be bundled into browser code.
 *   - Adapters never accept a raw system prompt from a caller. The prompt is
 *     assembled by the pipeline so untrusted content stays wrapped as DATA.
 *   - Every call reports token usage so cost is attributable.
 */

import type { TaskType, TokenUsage } from '../types/core';

export interface ProviderCapabilities {
  generateText: boolean;
  generateStructured: boolean;
  embed: boolean;
  moderate: boolean;
  stream: boolean;
  maxContextTokens: number;
  supportsToolUse: boolean;
}

export interface GenerateRequest {
  task: TaskType;
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxOutputTokens?: number;
  temperature?: number;
  /** Refuse rather than guess. Adapters that cannot do this natively must
   *  implement it via prompt + post-check. */
  allowRefusal?: boolean;
  signal?: AbortSignal;
}

export interface GenerateResult {
  text: string;
  usage: TokenUsage;
  model: string;
  stop_reason: 'end' | 'max_tokens' | 'refused' | 'error';
  latency_ms: number;
}

export interface StructuredRequest<T> extends GenerateRequest {
  schema: JsonSchema;
  /** Adapter-specific: response_format / tool-use / JSON mode. */
  parse: (raw: string) => T;
}

export interface StructuredResult<T> {
  value: T;
  raw: string;
  usage: TokenUsage;
  model: string;
  latency_ms: number;
}

export interface JsonSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
}

export interface EmbedRequest {
  texts: string[];
  task?: 'retrieval_query' | 'retrieval_document';
}

export interface ModerationVerdict {
  safe: boolean;
  categories: Array<{ name: string; flagged: boolean; score: number }>;
  age_appropriate: boolean;
  reason: string | null;
}

export interface AIProvider {
  readonly id: string;
  readonly vendor: 'anthropic' | 'google' | 'openai' | 'deepseek' | 'local' | 'fake';
  readonly capabilities: ProviderCapabilities;
  readonly embeddingModel?: string;
  readonly embeddingDimensions?: number;
  generateText(req: GenerateRequest): Promise<GenerateResult>;
  generateStructured<T>(req: StructuredRequest<T>): Promise<StructuredResult<T>>;
  embed(req: EmbedRequest): Promise<{ vectors: number[][]; usage: TokenUsage; model: string }>;
  moderate(text: string, opts?: { age_band?: string }): Promise<ModerationVerdict>;
  stream(req: GenerateRequest): AsyncIterable<string>;
}

/* ---------------------------------------------------------- cost model */

export interface ModelPricing {
  input_per_1m: number;
  cached_input_per_1m: number;
  output_per_1m: number;
}

/**
 * Indicative list prices as of 2026-09. These are PLACEHOLDERS for the cost
 * model and must be re-confirmed against each vendor's published price page
 * before they are used for real budget alerts. See docs/00-AUDIT §Cost Model.
 */
export const INDICATIVE_PRICING: Record<string, ModelPricing> = {
  'deepseek-v4-flash': { input_per_1m: 0.14, cached_input_per_1m: 0.0028, output_per_1m: 0.28 },
  'claude-sonnet-5': { input_per_1m: 2.0, cached_input_per_1m: 0.2, output_per_1m: 10.0 },
  'gemini-3.8-flash': { input_per_1m: 0.75, cached_input_per_1m: 0.075, output_per_1m: 3.75 },
  'gpt-5.6-luna': { input_per_1m: 0.2, cached_input_per_1m: 0.02, output_per_1m: 1.2 },
  'embed-text-3k': { input_per_1m: 0.02, cached_input_per_1m: 0.02, output_per_1m: 0 },
  'beyond-fake-v1': { input_per_1m: 0, cached_input_per_1m: 0, output_per_1m: 0 },
};

export function estimateCost(model: string, usage: TokenUsage): number {
  const p = INDICATIVE_PRICING[model] ?? { input_per_1m: 0, cached_input_per_1m: 0, output_per_1m: 0 };
  const uncached = Math.max(0, usage.input_tokens - usage.cached_input_tokens);
  return (uncached / 1e6) * p.input_per_1m + (usage.cached_input_tokens / 1e6) * p.cached_input_per_1m + (usage.output_tokens / 1e6) * p.output_per_1m;
}

/**
 * Read a key from the environment, server-side only.
 * Throws if called in a browser-ish environment — a misconfigured bundle that
 * ships this code to the client should fail loudly, not silently leak.
 */
export function requireServerSecret(name: string): string {
  if (typeof window !== 'undefined' || typeof document !== 'undefined') {
    throw new Error(`Refusing to read ${name} in a browser context. Provider secrets must stay server-side.`);
  }
  const v = process.env[name];
  if (!v) throw new Error(`Missing required secret: ${name}`);
  return v;
}

/** Guardrail: never let a secret-looking string reach a log or a student answer. */
export function redactSecrets(text: string): string {
  return text
    .replace(/\b(sk|pk|api)[-_][A-Za-z0-9_-]{16,}\b/g, '[REDACTED_KEY]')
    .replace(/\bBearer\s+[A-Za-z0-9._-]{16,}/g, 'Bearer [REDACTED]')
    .replace(/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, '[REDACTED_JWT]');
}
