/**
 * Deterministic offline provider.
 *
 * Used for tests, CI, local development and the demo — and, importantly, it is a
 * real implementation of the AIProvider contract rather than a mock object. That
 * means every consumer of AIProvider (retrieval, RAG, router, agents) is
 * exercised by the test suite even with no API keys and no network.
 *
 * Embeddings are a hashed bag-of-words projection. They are NOT semantically
 * good; they are good enough to prove the retrieval maths, the ranking weights
 * and the citation plumbing are correct, deterministically, forever, for free.
 * Production uses a real embedding model with identical dimension handling.
 */

import type {
  AIProvider, EmbedRequest, GenerateRequest, GenerateResult, JsonSchema, ModerationVerdict,
  ProviderCapabilities, StructuredRequest, StructuredResult,
} from './provider';
import type { TokenUsage } from '../types/core';

const STOPWORDS = new Set('a an the of for and or to in on is are be with by from that this it as at'.split(' '));

function tokensOf(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export class DeterministicEmbedder {
  readonly model = 'beyond-fake-v1';
  readonly dimensions: number;

  constructor(dimensions = 256) {
    this.dimensions = dimensions;
  }

  embedOne(text: string): number[] {
    const v = new Array<number>(this.dimensions).fill(0);
    const toks = tokensOf(text);
    for (const t of toks) {
      const h = hash32(t);
      const idx = h % this.dimensions;
      // Signed hashing keeps the distribution centred instead of all-positive.
      const sign = (h >>> 16) & 1 ? 1 : -1;
      v[idx]! += sign;
      // A second, decorrelated projection so distinct terms do not collapse.
      const idx2 = hash32(`${t}#2`) % this.dimensions;
      v[idx2]! += sign * 0.5;
    }
    // Sub-linear term weighting: repeated words matter less than new words.
    for (let i = 0; i < v.length; i++) v[i] = Math.sign(v[i]!) * Math.sqrt(Math.abs(v[i]!));
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map((x) => x / norm);
  }

  embed(texts: string[]): number[][] {
    return texts.map((t) => this.embedOne(t));
  }
}

export class FakeProvider implements AIProvider {
  readonly id = 'beyond-fake';
  readonly vendor = 'fake' as const;
  readonly capabilities: ProviderCapabilities = {
    generateText: true,
    generateStructured: true,
    embed: true,
    moderate: true,
    stream: true,
    maxContextTokens: 8000,
    supportsToolUse: true,
  };
  readonly embeddingModel = 'beyond-fake-v1';
  readonly embeddingDimensions: number;

  private readonly embedder: DeterministicEmbedder;
  /** Optional script so tests can assert on refusal / structured behaviour. */
  private script: (req: GenerateRequest) => string | null = () => null;

  constructor(dimensions = 256) {
    this.embedder = new DeterministicEmbedder(dimensions);
    this.embeddingDimensions = dimensions;
  }

  setScript(fn: (req: GenerateRequest) => string | null): void {
    this.script = fn;
  }

  async generateText(req: GenerateRequest): Promise<GenerateResult> {
    const start = Date.now();
    const scripted = this.script(req);
    const text = scripted ?? defaultAnswer(req);
    const usage: TokenUsage = {
      input_tokens: Math.ceil((req.system.length + req.messages.reduce((s, m) => s + m.content.length, 0)) / 4),
      output_tokens: Math.ceil(text.length / 4),
      cached_input_tokens: 0,
    };
    return { text, usage, model: this.id, stop_reason: scripted === null ? 'end' : 'end', latency_ms: Date.now() - start };
  }

  async generateStructured<T>(req: StructuredRequest<T>): Promise<StructuredResult<T>> {
    const start = Date.now();
    const raw = this.script(req) ?? '{}';
    return {
      value: req.parse(raw),
      raw,
      usage: { input_tokens: Math.ceil(req.system.length / 4), output_tokens: Math.ceil(raw.length / 4), cached_input_tokens: 0 },
      model: this.id,
      latency_ms: Date.now() - start,
    };
  }

  async embed(req: EmbedRequest): Promise<{ vectors: number[][]; usage: TokenUsage; model: string }> {
    const vectors = this.embedder.embed(req.texts);
    return {
      vectors,
      usage: {
        input_tokens: req.texts.reduce((s, t) => s + Math.ceil(t.length / 4), 0),
        output_tokens: 0,
        cached_input_tokens: 0,
      },
      model: this.embeddingModel,
    };
  }

  async moderate(text: string, opts?: { age_band?: string }): Promise<ModerationVerdict> {
    const checks: Array<{ name: string; re: RegExp }> = [
      { name: 'self_harm', re: /\b(kill myself|suicide|end my life)\b/i },
      { name: 'violence', re: /\b(bomb making|how to make a weapon)\b/i },
      { name: 'sexual_minor', re: /\b(child porn|nude minor)\b/i },
      { name: 'cheating', re: /\b(leaked question paper|answer key leak|pay someone to take my exam)\b/i },
    ];
    const categories = checks.map((c) => {
      const flagged = c.re.test(text);
      return { name: c.name, flagged, score: flagged ? 0.99 : 0.01 };
    });
    const unsafe = categories.some((c) => c.flagged);
    return {
      safe: !unsafe,
      categories,
      age_appropriate: opts?.age_band === 'UNDER_13' ? !/\b(alcohol|gambling|dating)\b/i.test(text) : true,
      reason: unsafe ? `flagged: ${categories.filter((c) => c.flagged).map((c) => c.name).join(', ')}` : null,
    };
  }

  async *stream(req: GenerateRequest): AsyncIterable<string> {
    const { text } = await this.generateText(req);
    for (const word of text.split(/(\s+)/)) yield word;
  }
}

function defaultAnswer(req: GenerateRequest): string {
  if (req.task === 'CLASSIFY') return JSON.stringify({ intent: 'unknown' });
  return '[fake-provider] no script configured';
}

export const fakeSchema: JsonSchema = { type: 'object', properties: { intent: { type: 'string' } }, required: ['intent'] };
