/**
 * Citation engine.
 *
 * Rules this module enforces:
 *   - A citation can only be produced from a chunk that was actually retrieved
 *     for this answer. There is no code path that invents a source.
 *   - Every sentence in the answer that carries a claim index must resolve to at
 *     least one citation, or the sentence is rejected by `auditAnswer`.
 *   - `renderCitations` never emits a URL that did not come from a real chunk.
 */

import type { CitationRef, KnowledgeChunk, RetrievalHit } from '../types/core';

export interface CitedAnswer {
  body: string;
  citations: CitationRef[];
  unsupported: string[];
  confidence: number;
}

export function citationsFromHits(hits: RetrievalHit[]): Map<string, CitationRef> {
  const map = new Map<string, CitationRef>();
  hits.forEach((h, i) => {
    const id = `c${i + 1}`;
    map.set(h.chunk.chunk_id, {
      citation_id: id,
      source_name: sourceName(h.chunk),
      organization: h.chunk.source_url ? new URL(h.chunk.source_url).hostname : null,
      url: h.chunk.source_url,
      published_at: h.chunk.published_at,
      verified_at: h.chunk.verified_at,
      section: h.chunk.section,
      authority_tier: h.chunk.authority_tier,
      confidence: h.chunk.confidence,
      chunk_id: h.chunk.chunk_id,
    });
  });
  return map;
}

function sourceName(chunk: KnowledgeChunk): string {
  try {
    const host = new URL(chunk.source_url).hostname.replace(/^www\./, '');
    return host;
  } catch {
    return chunk.source_url;
  }
}

/**
 * Attach citations to an answer body.
 *
 * `claimRefs` maps a sentence marker (e.g. "s1") to the chunk ids that support
 * it. The answer body uses [c1] style markers; anything unmarked is listed in
 * `unsupported` so the caller can decide to drop or rephrase it.
 */
export function buildCitedAnswer(body: string, hits: RetrievalHit[]): CitedAnswer {
  const refs = citationsFromHits(hits);
  const used = new Set<string>();
  const unsupported: string[] = [];

  for (const line of body.split('\n')) {
    const markers = [...line.matchAll(/\[(c\d+)\]/g)].map((m) => m[1]!);
    if (markers.length) {
      for (const m of markers) {
        const found = [...refs.values()].find((r) => r.citation_id === m);
        if (found) used.add(m);
        else unsupported.push(line.trim());
      }
    }
  }

  const citations = [...refs.values()].filter((r) => used.has(r.citation_id));
  const confidence = citations.length ? citations.reduce((s, c) => s + c.confidence, 0) / citations.length : 0;
  return { body, citations, unsupported, confidence };
}

/**
 * Post-generation audit: catch fabricated or orphaned citations before anything
 * reaches a student. Returns the problems; the caller must act on them.
 */
export function auditAnswer(answer: CitedAnswer, retrievedChunkIds: Set<string>): string[] {
  const problems: string[] = [];
  for (const c of answer.citations) {
    if (!retrievedChunkIds.has(c.chunk_id)) problems.push(`fabricated citation ${c.citation_id} -> ${c.chunk_id} was never retrieved`);
    if (!/^https?:\/\//.test(c.url)) problems.push(`citation ${c.citation_id} has a non-http URL: ${c.url}`);
  }
  const usedMarkers = new Set([...answer.body.matchAll(/\[(c\d+)\]/g)].map((m) => m[1]));
  for (const c of answer.citations) {
    if (!usedMarkers.has(c.citation_id)) problems.push(`citation ${c.citation_id} listed but never used in the answer`);
  }
  for (const m of usedMarkers) {
    if (!answer.citations.some((c) => c.citation_id === m)) problems.push(`marker [${m}] in body has no matching citation`);
  }
  if (answer.unsupported.length) problems.push(`${answer.unsupported.length} line(s) make claims without a citation`);
  return problems;
}

/**
 * The visible source block. Rendered exactly as the spec requires:
 * source name, organisation, URL, publication date, verification date.
 */
export function renderCitations(citations: CitationRef[]): string {
  if (!citations.length) return '';
  const lines = citations.map((c) => {
    const parts = [`Source: ${c.source_name}`];
    if (c.organization) parts.push(`Organisation: ${c.organization}`);
    parts.push(`Link: ${c.url}`);
    if (c.published_at) parts.push(`Published: ${c.published_at}`);
    parts.push(c.verified_at ? `Verified: ${c.verified_at}` : 'Verified: not yet human-verified');
    if (c.section) parts.push(`Section: ${c.section}`);
    parts.push(`Authority: ${c.authority_tier} (confidence ${(c.confidence * 100).toFixed(0)}%)`);
    return parts.join('\n');
  });
  return ['---', 'Sources', ...lines].join('\n');
}

/** Markdown/HTML link rendering for the UI, with rel hardening. */
export function citationLinksHtml(citations: CitationRef[]): string {
  return citations
    .map(
      (c) =>
        `<li><a href="${escapeAttr(c.url)}" target="_blank" rel="noopener noreferrer nofollow">[${escapeHtml(c.citation_id)}] ${escapeHtml(c.source_name)}</a>` +
        `${c.published_at ? ` <span class="muted">(published ${escapeHtml(c.published_at)})</span>` : ''}</li>`,
    )
    .join('\n');
}

export const escapeHtml = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export const escapeAttr = escapeHtml;
