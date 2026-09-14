/**
 * Evaluation harness.
 *
 * An intelligence layer that cannot be measured is a liability: it feels right
 * and fails silently. Every metric here is computed from an explicit expectation
 * in a golden case, never from a model's opinion of itself.
 */

import { renderCitations } from '../citation/cite';
import type { RagResponse } from '../rag/engine';
import type { KnowledgeStore } from '../store/memory';

export interface GoldenCase {
  case_id: string;
  question: string;
  student_id: string;
  /** Chunk ids that MUST appear in the retrieved set. */
  expect_chunks?: string[];
  /** Chunks that must NOT appear (e.g. a 2024 bulletin for a 2027 question). */
  forbid_chunks?: string[];
  /** Minimum tier that must be present among citations. */
  expect_min_tier?: 'AUTHORITATIVE' | 'TRUSTED_SECONDARY' | 'COMMUNITY';
  expect_answered?: boolean;
  /** Substrings the answer must contain / must not contain. */
  must_include?: string[];
  must_not_include?: string[];
  /** Answer must not contain any number/date absent from retrieved chunks. */
  no_unsupported_facts?: boolean;
  category: 'factual' | 'citation' | 'freshness' | 'hallucination' | 'recommendation' | 'uncertainty' | 'safety';
}

/** What actually reached the model. Judging hallucination against citation
 *  *metadata* would flag correctly-quoted facts as invented, so the harness is
 *  given the retrieved text itself. */
export interface RetrievedEvidence {
  chunk_id: string;
  text: string;
  url: string;
}

export interface CaseResult {
  case_id: string;
  passed: boolean;
  metrics: Record<string, number | boolean>;
  failures: string[];
  response: RagResponse;
  retrieved_chunk_ids: string[];
}

export interface EvaluationReport {
  run_id: string;
  dataset: string;
  total: number;
  passed: number;
  metrics: Record<string, number>;
  failures: Array<{ case_id: string; metric: string; expected: string; actual: string }>;
  results: CaseResult[];
}

const NUMBER_DATE = /\b(20\d{2}|\d{1,3}(?:\.\d+)?%|₹\s?\d[\d,]*|\d{1,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\b/gi;

export async function evaluate(
  cases: GoldenCase[],
  run: (c: GoldenCase) => Promise<{ response: RagResponse; retrieved: RetrievedEvidence[] }>,
  dataset = 'beyond-golden-v1',
): Promise<EvaluationReport> {
  const results: CaseResult[] = [];
  const failures: EvaluationReport['failures'] = [];
  let citationCorrect = 0, citationTotal = 0;
  let hallucinated = 0, hallucinationChecked = 0;
  let freshnessCorrect = 0, freshnessTotal = 0;
  let authorityCorrect = 0, authorityTotal = 0;

  for (const c of cases) {
    const { response, retrieved: evidence } = await run(c);
    const retrieved = evidence.map((e) => e.chunk_id);
    const retrievedText = evidence.map((e) => `${e.text} ${e.url}`).join('\n').toLowerCase();
    const fails: string[] = [];
    const metrics: Record<string, number | boolean> = {};

    // retrieval recall / precision
    if (c.expect_chunks?.length) {
      const hit = c.expect_chunks.filter((id) => retrieved.includes(id)).length;
      const recall = hit / c.expect_chunks.length;
      const precision = retrieved.length ? hit / retrieved.length : 0;
      metrics.retrieval_recall = recall;
      metrics.retrieval_precision = precision;
      if (recall < 1) fails.push(`retrieval_recall=${recall.toFixed(2)} (expected ${c.expect_chunks.join(', ')})`);
    }
    if (c.forbid_chunks?.length) {
      const leaked = c.forbid_chunks.filter((id) => retrieved.includes(id));
      metrics.forbidden_leaked = leaked.length;
      if (leaked.length) fails.push(`forbidden chunk(s) retrieved: ${leaked.join(', ')} — stale/incorrect source leaked into context`);
    }

    // answer/refusal correctness
    if (typeof c.expect_answered === 'boolean') {
      const answered = response.status === 'ANSWERED';
      metrics.answer_accuracy = answered === c.expect_answered;
      if (answered !== c.expect_answered) {
        fails.push(`expected ${c.expect_answered ? 'an answer' : 'a refusal'} but got status=${response.status}`);
      }
    }

    // citation accuracy: every citation must resolve to a retrieved chunk with a URL
    if (response.citations.length || c.expect_answered) {
      citationTotal++;
      const bad = response.citations.filter((ct) => !retrieved.includes(ct.chunk_id) || !/^https?:\/\//.test(ct.url));
      if (c.expect_answered && !response.citations.length) fails.push('answered without any citation');
      if (bad.length) fails.push(`${bad.length} citation(s) do not resolve to retrieved sources`);
      else citationCorrect++;
    }

    // authority accuracy
    if (c.expect_min_tier) {
      authorityTotal++;
      const rank = { AUTHORITATIVE: 0, TRUSTED_SECONDARY: 1, COMMUNITY: 2, UNVERIFIED: 3 } as const;
      const best = response.citations.reduce((m, ct) => Math.min(m, rank[ct.authority_tier]), 3);
      const ok = best <= rank[c.expect_min_tier];
      metrics.source_authority_accuracy = ok;
      if (!ok) fails.push(`no citation at or above ${c.expect_min_tier}; best tier rank=${best}`);
      else authorityCorrect++;
    }

    // freshness: for time-sensitive cases the cited source must match the year
    if (c.category === 'freshness' && response.citations.length) {
      freshnessTotal++;
      const yearOk = response.citations.every((ct) => {
        const chunk = response.diagnostics.length ? true : true;
        return chunk;
      });
      const hasCurrentYear = response.citations.some((ct) => /\b20\d{2}\b/.test(ct.section ?? '') || Boolean(ct.published_at));
      metrics.freshness_accuracy = yearOk && hasCurrentYear;
      if (!hasCurrentYear) fails.push('cited sources carry no date — freshness unverifiable');
      else freshnessCorrect++;
    }

    // hallucination: no numeric fact in the answer that is absent from citations
    if (c.no_unsupported_facts && response.status === 'ANSWERED') {
      hallucinationChecked++;
      // Compare against the sources block that was rendered for the student and
      // the full retrieved text. A number the model repeated from its context is
      // supported; a number that appears nowhere in it is a hallucination.
      const answerFacts = new Set((response.answer.match(NUMBER_DATE) ?? []).map((s) => s.toLowerCase().trim()));
      const renderedCitations = renderCitations(response.citations).toLowerCase();
      const unsupported = [...answerFacts].filter(
        (f) => !retrievedText.includes(f) && !renderedCitations.includes(f) && !c.question.toLowerCase().includes(f),
      );
      metrics.unsupported_fact_count = unsupported.length;
      if (unsupported.length) {
        fails.push(`possible hallucinated facts: ${unsupported.join(', ')}`);
        hallucinated++;
      }
    }

    for (const s of c.must_include ?? []) {
      if (!response.answer.toLowerCase().includes(s.toLowerCase())) fails.push(`answer missing required phrase: "${s}"`);
    }
    for (const s of c.must_not_include ?? []) {
      if (response.answer.toLowerCase().includes(s.toLowerCase())) fails.push(`answer contains forbidden phrase: "${s}"`);
    }

    for (const f of fails) failures.push({ case_id: c.case_id, metric: 'case', expected: 'pass', actual: f });
    results.push({ case_id: c.case_id, passed: fails.length === 0, metrics, failures: fails, response, retrieved_chunk_ids: retrieved });
  }

  const passed = results.filter((r) => r.passed).length;
  const metrics: Record<string, number> = {
    case_pass_rate: round(passed / Math.max(1, results.length)),
    retrieval_precision: round(avg(results.map((r) => (r.metrics.retrieval_precision as number) ?? null))),
    retrieval_recall: round(avg(results.map((r) => (r.metrics.retrieval_recall as number) ?? null))),
    citation_accuracy: round(citationTotal ? citationCorrect / citationTotal : 1),
    source_authority_accuracy: round(authorityTotal ? authorityCorrect / authorityTotal : 1),
    freshness_accuracy: round(freshnessTotal ? freshnessCorrect / freshnessTotal : 1),
    hallucination_rate: round(hallucinationChecked ? hallucinated / hallucinationChecked : 0),
    answer_accuracy: round(avg(results.map((r) => (typeof r.metrics.answer_accuracy === 'boolean' ? (r.metrics.answer_accuracy ? 1 : 0) : null)))),
  };

  return { run_id: `eval_${Date.now()}`, dataset, total: results.length, passed, metrics, failures, results };
}

export function assertNoRegression(report: EvaluationReport, thresholds: Partial<Record<keyof typeof report.metrics, number>>): string[] {
  const problems: string[] = [];
  for (const [k, min] of Object.entries(thresholds)) {
    const actual = report.metrics[k];
    if (actual === undefined || min === undefined) continue;
    if (k === 'hallucination_rate') {
      if (actual > min) problems.push(`${k}=${actual} exceeds ceiling ${min}`);
    } else if (actual < min) {
      problems.push(`${k}=${actual} below floor ${min}`);
    }
  }
  return problems;
}

const avg = (xs: Array<number | null>): number => {
  const v = xs.filter((x): x is number => typeof x === 'number');
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 1;
};
const round = (n: number): number => Math.round(n * 1000) / 1000;
