/**
 * Lexical scoring (Okapi BM25).
 *
 * Vector search alone loses exact-match cases that matter enormously in this
 * domain: "EAMCET", "NTA", "Form 26AS", "JEE Main 2027". BM25 keeps those.
 * This is the in-memory mirror of the Postgres `ts_rank_cd` / websearch_to_tsquery
 * leg of the hybrid query; both legs are fused with RRF.
 */

export interface Bm25Doc {
  id: string;
  tokens: string[];
  /** Boost multiplier applied to the final score (authority, freshness...). */
  boost: number;
}

const STOPWORDS = new Set('a an the of for and or to in on is are be with by from that this it as at we you your our'.split(' '));

export function tokenize(text: string): string[] {
  const base = text
    .toLowerCase()
    // Keep alphanumerics together so "2027", "jee-main" and "class-12" survive.
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .split(/[\s.]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
  // Light stemming: plurals and -ing/-ed. Cheap and adequate for this corpus.
  return base.map((w) =>
    w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w,
  );
}

export interface Bm25Options {
  k1?: number;
  b?: number;
}

export class Bm25Index {
  private docs = new Map<string, Bm25Doc>();
  private df = new Map<string, number>();
  private totalLen = 0;

  constructor(private readonly opts: Bm25Options = {}) {}

  private get k1(): number {
    return this.opts.k1 ?? 1.5;
  }
  private get b(): number {
    return this.opts.b ?? 0.75;
  }

  add(id: string, text: string, boost = 1): void {
    if (this.docs.has(id)) this.remove(id);
    const tokens = tokenize(text);
    this.docs.set(id, { id, tokens, boost });
    this.totalLen += tokens.length;
    for (const t of new Set(tokens)) this.df.set(t, (this.df.get(t) ?? 0) + 1);
  }

  remove(id: string): void {
    const d = this.docs.get(id);
    if (!d) return;
    this.totalLen -= d.tokens.length;
    for (const t of new Set(d.tokens)) {
      const n = (this.df.get(t) ?? 0) - 1;
      if (n <= 0) this.df.delete(t);
      else this.df.set(t, n);
    }
    this.docs.delete(id);
  }

  get size(): number {
    return this.docs.size;
  }

  private get avgdl(): number {
    return this.docs.size ? this.totalLen / this.docs.size : 1;
  }

  search(query: string, limit = 20): Array<{ id: string; score: number }> {
    const q = tokenize(query);
    if (!q.length) return [];
    const N = this.docs.size;
    const scores: Array<{ id: string; score: number }> = [];

    for (const doc of this.docs.values()) {
      const tf = new Map<string, number>();
      for (const t of doc.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      let s = 0;
      for (const term of q) {
        const f = tf.get(term);
        if (!f) continue;
        const n = this.df.get(term) ?? 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        const denom = f + this.k1 * (1 - this.b + (this.b * doc.tokens.length) / this.avgdl);
        s += idf * ((f * (this.k1 + 1)) / denom);
      }
      if (s > 0) scores.push({ id: doc.id, score: s * doc.boost });
    }
    return scores.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

/** Reciprocal Rank Fusion — rank-based, so incomparable score scales fuse safely. */
export function rrf(rankLists: Array<Array<string | { id: string }>>, k = 60, weights: number[] = []): Map<string, number> {
  const out = new Map<string, number>();
  rankLists.forEach((list, li) => {
    const w = weights[li] ?? 1;
    list.forEach((item, rank) => {
      const id = typeof item === 'string' ? item : item.id;
      out.set(id, (out.get(id) ?? 0) + (w * 1) / (k + rank + 1));
    });
  });
  return out;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || !a.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (!na || !nb) return 0;
  return dot / Math.sqrt(na * nb);
}
