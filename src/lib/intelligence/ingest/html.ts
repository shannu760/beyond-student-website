/**
 * Minimal HTML tokeniser + structure-preserving extractor.
 *
 * We deliberately do NOT pull in a DOM library here: the extraction contract we
 * need is small (headings, paragraphs, lists, tables, code, metadata) and a
 * hand-rolled tokeniser keeps the ingestion path auditable and dependency-free.
 * For production we would swap this module for a battle-tested parser behind the
 * same `extractHtml` signature — that swap is localised to this file.
 */

import { stripSmugglingVectors, normaliseText } from '../guardrails/injection';
import type { ContentBlock } from '../types/core';

interface Token {
  type: 'tag' | 'text';
  name?: string;
  attrs?: Record<string, string>;
  selfClosing?: boolean;
  closing?: boolean;
  text?: string;
}

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const SKIP_SUBTREES = new Set(['script', 'style', 'noscript', 'template', 'svg', 'canvas', 'form', 'nav', 'footer', 'aside', 'header']);

function decodeEntities(s: string): string {
  const named: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '\u2019', lsquo: '\u2018',
    ldquo: '\u201C', rdquo: '\u201D', ndash: '\u2013', mdash: '\u2014', hellip: '\u2026', middot: '\u00B7',
    times: '\u00D7', deg: '\u00B0', sup2: '\u00B2', sup3: '\u00B3', frac12: '\u00BD',
  };
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_m, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m);
}

export function tokeniseHtml(html: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      // Comments and doctype: skip whole.
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i);
        i = end < 0 ? html.length : end + 3;
        continue;
      }
      const end = html.indexOf('>', i);
      if (end < 0) break;
      const raw = html.slice(i + 1, end);
      i = end + 1;
      if (raw.startsWith('!') || raw.startsWith('?')) continue;
      const closing = raw.startsWith('/');
      const body = closing ? raw.slice(1) : raw;
      const selfClosing = body.endsWith('/');
      const nameMatch = /^\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(body);
      if (!nameMatch) continue;
      const name = (nameMatch[1] ?? '').toLowerCase();
      const attrs: Record<string, string> = {};
      const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
      let am: RegExpExecArray | null;
      while ((am = attrRe.exec(body)) !== null) {
        attrs[(am[1] ?? '').toLowerCase()] = decodeEntities(am[3] ?? am[4] ?? am[5] ?? '');
      }
      tokens.push({ type: 'tag', name, attrs, selfClosing: selfClosing || VOID_ELEMENTS.has(name), closing });
    } else {
      const next = html.indexOf('<', i);
      const chunk = html.slice(i, next < 0 ? html.length : next);
      i = next < 0 ? html.length : next;
      const text = decodeEntities(chunk);
      if (text.trim()) tokens.push({ type: 'text', text });
    }
  }
  return tokens;
}

export interface HtmlDocument {
  title: string;
  description: string | null;
  published_at: string | null;
  canonical_url: string | null;
  language: string | null;
  blocks: ContentBlock[];
  /** Text of anything we dropped, for review. */
  warnings: string[];
}

export function extractHtml(html: string): HtmlDocument {
  const cleaned = stripSmugglingVectors(html);
  const tokens = tokeniseHtml(cleaned);
  const warnings: string[] = [];

  let title = '';
  let description: string | null = null;
  let published: string | null = null;
  let canonical: string | null = null;
  let language: string | null = null;

  // --- metadata pass ---
  for (const t of tokens) {
    if (t.type !== 'tag' || !t.attrs) continue;
    if (t.name === 'html' && t.attrs.lang) language = t.attrs.lang.slice(0, 10) || null;
    if (t.name === 'title' && !title) {
      const idx = tokens.indexOf(t);
      const nextTok = tokens[idx + 1];
      title = normaliseText(nextTok?.type === 'text' ? (nextTok.text ?? '') : '');
    }
    if (t.name === 'link' && t.attrs.rel === 'canonical') canonical = t.attrs.href ?? null;
    if (t.name === 'meta') {
      const name = (t.attrs.name ?? t.attrs.property ?? '').toLowerCase();
      const content = t.attrs.content ?? '';
      if (name === 'description' || name === 'og:description') description ??= normaliseText(content) || null;
      if (
        name === 'article:published_time' || name === 'og:article:published_time' ||
        name === 'date' || name === 'pubdate' || name === 'publishdate' || name === 'dc.date'
      ) {
        published ??= normaliseDate(content);
      }
      if (name === 'og:title' && !title) title = normaliseText(content);
    }
    if (t.name === 'time' && t.attrs.datetime) published ??= normaliseDate(t.attrs.datetime);
  }

  // --- structure pass ---
  const blocks: ContentBlock[] = [];
  const headings: string[] = [];
  let docTitle = '';
  let skipDepth = 0;
  let i = 0;

  const textUntilClose = (closeTag: string): string => {
    const parts: string[] = [];
    let depth = 0;
    while (i < tokens.length) {
      const t = tokens[i]!;
      i += 1;
      if (t.type === 'text') {
        parts.push(t.text ?? '');
        continue;
      }
      if (t.name === closeTag) {
        if (depth === 0) return normaliseText(parts.join(' '));
        depth -= 1;
        continue;
      }
      if (!t.closing && !t.selfClosing && t.name === closeTag) depth += 1;
    }
    return normaliseText(parts.join(' '));
  };

  while (i < tokens.length) {
    const t = tokens[i]!;
    i += 1;
    if (t.type !== 'tag') continue;

    if (!t.closing && !t.selfClosing && SKIP_SUBTREES.has(t.name!)) {
      skipDepth += 1;
      continue;
    }
    if (t.closing && skipDepth > 0) {
      skipDepth -= 1;
      continue;
    }
    if (skipDepth > 0) continue;

    // h1 is the document title and is stored on the document itself. Excluding
    // it from the block path stops every chunk being prefixed with a repeated
    // title, which wastes tokens and dilutes retrieval.
    const path = headings.filter(Boolean).filter((h) => h !== docTitle);

    const h = /^(h[1-6])$/.exec(t.name ?? '');
    if (h && !t.closing) {
      const tag = h[1] ?? 'h1';
      const text = textUntilClose(tag);
      if (text) {
        const level = Number(tag[1]);
        headings.length = Math.max(0, level - 1);
        headings[level - 1] = text;
        if (level === 1) docTitle = text;
        blocks.push({ kind: 'heading', level, text, path: headings.filter(Boolean).filter((x) => x !== docTitle) });
      }
      continue;
    }

    if (t.name === 'p' && !t.closing) {
      const text = textUntilClose('p');
      if (text) blocks.push({ kind: 'paragraph', text, path: [...path] });
      continue;
    }

    if ((t.name === 'ul' || t.name === 'ol') && !t.closing) {
      const closeTag = t.name;
      const items: string[] = [];
      let depth = 0;
      while (i < tokens.length) {
        const tk = tokens[i]!;
        i += 1;
        if (tk.type === 'tag' && (tk.name === 'ul' || tk.name === 'ol') && !tk.closing) depth += 1;
        if (tk.type === 'tag' && (tk.name === 'ul' || tk.name === 'ol') && tk.closing) {
          if (depth === 0) break;
          depth -= 1;
          continue;
        }
        if (tk.type === 'tag' && tk.name === 'li' && !tk.closing) {
          const item = textUntilClose('li');
          if (item) items.push(item);
        }
      }
      if (items.length) blocks.push({ kind: 'list', ordered: closeTag === 'ol', items, path: [...path] });
      continue;
    }

    if (t.name === 'table' && !t.closing) {
      const { headers, rows, caption } = parseTable(tokens, i);
      // advance i past </table>
      let depth = 0;
      while (i < tokens.length) {
        const tk = tokens[i]!;
        i += 1;
        if (tk.type === 'tag' && tk.name === 'table' && !tk.closing) depth += 1;
        if (tk.type === 'tag' && tk.name === 'table' && tk.closing) {
          if (depth === 0) break;
          depth -= 1;
        }
      }
      if (headers.length || rows.length) {
        if (!headers.length && rows.length) {
          blocks.push({ kind: 'table', caption, headers: rows[0] ?? [], rows: rows.slice(1), path: [...path] });
        } else {
          blocks.push({ kind: 'table', caption, headers, rows, path: [...path] });
        }
      }
      continue;
    }

    if (t.name === 'pre' && !t.closing) {
      const text = textUntilClose('pre');
      if (text) blocks.push({ kind: 'code', language: null, text, path: [...path] });
      continue;
    }

    if ((t.name === 'div' || t.name === 'li' || t.name === 'td' || t.name === 'section' || t.name === 'article') && !t.closing) {
      // Fallback: if a text node sits directly in a container with no block child,
      // capture it so short announcements are not lost.
      const next = tokens[i];
      if (next?.type === 'text') {
        const text = normaliseText(next.text ?? '');
        i += 1;
        if (text.length > 40) blocks.push({ kind: 'paragraph', text, path: [...path] });
      }
    }
  }

  // Fallback title from the first h1.
  if (!title) title = docTitle;
  if (!blocks.length) warnings.push('no content blocks extracted');
  if (!published) warnings.push('no publication date found');

  return { title: normaliseText(title), description, published_at: published, canonical_url: canonical, language, blocks, warnings };
}

function parseTable(tokens: Token[], start: number): { headers: string[]; rows: string[][]; caption: string | null } {
  const headers: string[] = [];
  const rows: string[][] = [];
  let caption: string | null = null;
  let i = start;
  let depth = 0;
  let currentRow: string[] | null = null;

  const cellText = (): string => {
    const parts: string[] = [];
    let d = 0;
    while (i < tokens.length) {
      const t = tokens[i]!;
      i += 1;
      if (t.type === 'text') {
        parts.push(t.text ?? '');
        continue;
      }
      if ((t.name === 'td' || t.name === 'th') && t.closing && d === 0) return normaliseText(parts.join(' '));
      if ((t.name === 'td' || t.name === 'th') && !t.closing) d += 1;
      if ((t.name === 'td' || t.name === 'th') && t.closing) d -= 1;
    }
    return normaliseText(parts.join(' '));
  };

  while (i < tokens.length) {
    const t = tokens[i]!;
    i += 1;
    if (t.type !== 'tag') continue;
    if (t.name === 'table') {
      if (t.closing && depth === 0) break;
      if (!t.closing) depth += 1;
      if (t.closing) depth -= 1;
      continue;
    }
    if (t.name === 'caption' && !t.closing) {
      const parts: string[] = [];
      while (i < tokens.length) {
        const tk = tokens[i]!;
        i += 1;
        if (tk.type === 'text') parts.push(tk.text ?? '');
        if (tk.type === 'tag' && tk.name === 'caption' && tk.closing) break;
      }
      caption = normaliseText(parts.join(' ')) || null;
      continue;
    }
    if (t.name === 'tr' && !t.closing) currentRow = [];
    if ((t.name === 'td' || t.name === 'th') && !t.closing) {
      const txt = cellText();
      if (!currentRow) currentRow = [];
      if (t.name === 'th' && !currentRow.length && !rows.length) headers.push(txt);
      else currentRow.push(txt);
    }
    if (t.name === 'tr' && t.closing && currentRow) {
      rows.push(currentRow);
      currentRow = null;
    }
  }
  return { headers, rows, caption };
}

export function normaliseDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

/** Flatten blocks to plain text, keeping table structure readable for embedding + display. */
export function blocksToText(blocks: ContentBlock[]): string {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case 'heading':
        out.push('\n' + '#'.repeat(b.level) + ' ' + b.text);
        break;
      case 'paragraph':
        out.push(b.text);
        break;
      case 'list':
        out.push(b.items.map((it, ix) => (b.ordered ? `${ix + 1}. ${it}` : `- ${it}`)).join('\n'));
        break;
      case 'table': {
        const head = b.headers.length ? `| ${b.headers.join(' | ')} |` : '';
        const sep = b.headers.length ? `| ${b.headers.map(() => '---').join(' | ')} |` : '';
        const body = b.rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
        out.push([b.caption ?? '', head, sep, body].filter(Boolean).join('\n'));
        break;
      }
      case 'code':
        out.push('```\n' + b.text + '\n```');
        break;
    }
  }
  return out.join('\n\n').trim();
}
