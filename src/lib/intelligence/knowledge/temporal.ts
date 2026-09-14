/**
 * Temporal knowledge: claims, versions, supersession and contradiction handling.
 *
 * Non-negotiable rules implemented here:
 *   1. Historical information is NEVER overwritten. A superseded claim keeps its
 *      row, its value and its history; only its `status` changes.
 *   2. A newer AUTHORITATIVE source may supersede an older one automatically.
 *      A less-trusted source may never silently override a more-trusted one —
 *      that produces a conflict for a human.
 *   3. Anything flagged high_impact (eligibility, deadlines, fees, scholarships,
 *      regulations) requires human review before it is shown as verified.
 */

import { sha256 } from '../ingest/stages';
import type { KnowledgeStore } from '../store/memory';
import { TIER_RANK, type KnowledgeChunk, type KnowledgeClaim, type KnowledgeConflict } from '../types/core';

export interface ClaimInput {
  subject: string;
  predicate: string;
  value: string;
  value_display: string;
  unit?: string | null;
  applicable_year: number | null;
  jurisdiction: string | null;
  effective_from: string | null;
  effective_until: string | null;
  authority_tier: KnowledgeClaim['authority_tier'];
  source_id: string;
  chunk_id: string | null;
  confidence: number;
  high_impact: boolean;
  evidence: string;
  verified_at?: string;
}

export interface ClaimOutcome {
  claim: KnowledgeClaim;
  action: 'CREATED' | 'SUPERSEDED_PREVIOUS' | 'CONFLICT_RAISED' | 'DUPLICATE_CONFIRMED' | 'NEEDS_REVIEW';
  superseded: KnowledgeClaim[];
  conflict: KnowledgeConflict | null;
}

/**
 * Normalise a value so "25 years", "25" and "twenty-five" compare equal where it
 * matters. Deliberately conservative: when unsure we keep the raw string, which
 * means we may raise a conflict that a human then dismisses. Raising a spurious
 * conflict is cheap; silently merging two different facts is not.
 */
export function normaliseValue(value: string, unit?: string | null): string {
  const v = value.trim().toLowerCase();
  const num = /^(-?\d+(?:\.\d+)?)\s*(.*)$/.exec(v);
  if (num) return `${Number(num[1])}${unit ?? num[2] ?? ''}`.replace(/\s+/g, '');
  return v.replace(/\s+/g, ' ');
}

export class KnowledgeLedger {
  constructor(
    private readonly store: KnowledgeStore,
    private readonly now: () => Date = () => new Date(),
  ) {}

  /**
   * Record a claim. Idempotent per (subject, predicate, value, source).
   */
  record(input: ClaimInput): ClaimOutcome {
    const nowIso = this.now().toISOString();
    const verifiedAt = input.verified_at ?? nowIso;
    const normNew = normaliseValue(input.value, input.unit);

    const siblings = this.store.claims.bySubject(input.subject).filter((c) => c.predicate === input.predicate);
    const exactSame = siblings.find((c) => normaliseValue(c.value, c.unit) === normNew && c.source_id === input.source_id && c.status === 'ACTIVE');
    if (exactSame) {
      this.store.versions.put({
        version_id: `ver_${sha256(exactSame.claim_id + verifiedAt).slice(0, 16)}`,
        claim_id: exactSame.claim_id,
        value: exactSame.value,
        status: 'ACTIVE',
        recorded_at: nowIso,
        recorded_by: 'system',
        reason: 're-observed by a later ingestion run',
      });
      return { claim: exactSame, action: 'DUPLICATE_CONFIRMED', superseded: [], conflict: null };
    }

    const claim_id = `clm_${sha256(`${input.subject}|${input.predicate}|${normNew}|${input.source_id}`).slice(0, 16)}`;
    const claim: KnowledgeClaim = {
      claim_id,
      subject: input.subject,
      predicate: input.predicate,
      value: normNew,
      value_display: input.value_display,
      unit: input.unit ?? null,
      applicable_year: input.applicable_year,
      jurisdiction: input.jurisdiction,
      effective_from: input.effective_from,
      effective_until: input.effective_until,
      verified_at: verifiedAt,
      supersedes: null,
      status: input.high_impact ? 'NEEDS_REVIEW' : 'ACTIVE',
      authority_tier: input.authority_tier,
      source_id: input.source_id,
      chunk_id: input.chunk_id,
      confidence: input.confidence,
      high_impact: input.high_impact,
      evidence: input.evidence,
    };

    // Find live claims that assert something different about the same fact.
    const rivals = siblings.filter((c) => c.status === 'ACTIVE' || c.status === 'NEEDS_REVIEW');
    const contradictory = rivals.filter((c) => normaliseValue(c.value, c.unit) !== normNew);

    if (!contradictory.length) {
      this.store.claims.put(claim);
      this.store.versions.put({
        version_id: `ver_${sha256(claim_id + nowIso).slice(0, 16)}`,
        claim_id,
        value: claim.value,
        status: claim.status,
        recorded_at: nowIso,
        recorded_by: 'system',
        reason: 'first observation',
      });
      if (claim.high_impact) {
        this.openReviewTask(claim, 'high-impact fact requires human sign-off');
        return { claim, action: 'NEEDS_REVIEW', superseded: [], conflict: null };
      }
      return { claim, action: 'CREATED', superseded: [], conflict: null };
    }

    // Supersession is only automatic when the new source is strictly more trusted
    // AND the old claim is not high_impact.
    const supersedable = contradictory.filter((c) => TIER_RANK[input.authority_tier] < TIER_RANK[c.authority_tier] && !c.high_impact);
    const nonSupersedable = contradictory.filter((c) => !supersedable.includes(c));

    if (supersedable.length && !nonSupersedable.length) {
      for (const old of supersedable) {
        this.store.claims.update(old.claim_id, { status: 'SUPERSEDED', effective_until: claim.effective_from ?? verifiedAt });
        this.store.versions.put({
          version_id: `ver_${sha256(old.claim_id + nowIso).slice(0, 16)}`,
          claim_id: old.claim_id,
          value: old.value,
          status: 'SUPERSEDED',
          recorded_at: nowIso,
          recorded_by: 'system',
          reason: `superseded by ${claim.claim_id} from a more authoritative source (${input.authority_tier} > ${old.authority_tier})`,
        });
      }
      claim.supersedes = supersedable[0]!.claim_id;
      claim.status = input.high_impact ? 'NEEDS_REVIEW' : 'ACTIVE';
      this.store.claims.put(claim);
      this.store.versions.put({
        version_id: `ver_${sha256(claim_id + nowIso).slice(0, 16)}`,
        claim_id,
        value: claim.value,
        status: claim.status,
        recorded_at: nowIso,
        recorded_by: 'system',
        reason: `supersedes ${supersedable.map((s) => s.claim_id).join(', ')}`,
      });
      if (claim.high_impact) {
        this.openReviewTask(claim, 'high-impact fact supersedes an earlier record; human sign-off required');
        return { claim, action: 'NEEDS_REVIEW', superseded: supersedable, conflict: null };
      }
      return { claim, action: 'SUPERSEDED_PREVIOUS', superseded: supersedable, conflict: null };
    }

    // Otherwise: keep both, mark the state, raise a conflict. Nothing is deleted.
    claim.status = 'CONFLICTING';
    this.store.claims.put(claim);
    this.store.versions.put({
      version_id: `ver_${sha256(claim_id + nowIso).slice(0, 16)}`,
      claim_id,
      value: claim.value,
      status: 'CONFLICTING',
      recorded_at: nowIso,
      recorded_by: 'system',
      reason: `contradicts ${contradictory.map((c) => c.claim_id).join(', ')}`,
    });
    for (const c of contradictory) {
      if (c.status === 'ACTIVE') {
        this.store.claims.update(c.claim_id, { status: 'CONFLICTING' });
        this.store.versions.put({
          version_id: `ver_${sha256(c.claim_id + nowIso + 'conflict').slice(0, 16)}`,
          claim_id: c.claim_id,
          value: c.value,
          status: 'CONFLICTING',
          recorded_at: nowIso,
          recorded_by: 'system',
          reason: `contradicted by newer/other source claim ${claim_id}`,
        });
      }
    }
    const conflict: KnowledgeConflict = {
      conflict_id: `cnf_${sha256(`${input.subject}|${input.predicate}|${nowIso}`).slice(0, 16)}`,
      subject: input.subject,
      predicate: input.predicate,
      claim_ids: [claim_id, ...contradictory.map((c) => c.claim_id)],
      values: [claim.value_display, ...contradictory.map((c) => c.value_display)],
      best_tier_rank: Math.min(TIER_RANK[input.authority_tier], ...contradictory.map((c) => TIER_RANK[c.authority_tier])),
      resolved: false,
      resolution: null,
      detected_at: nowIso,
      notes: `new=${input.authority_tier}(${input.source_id}) vs existing=${contradictory.map((c) => `${c.authority_tier}(${c.source_id})`).join(', ')}`,
    };
    this.store.conflicts.put(conflict);
    this.openReviewTask(claim, `unresolved contradiction on ${input.subject}/${input.predicate}`, 'HIGH');
    return { claim, action: 'CONFLICT_RAISED', superseded: supersedable, conflict };
  }

  private openReviewTask(claim: KnowledgeClaim, reason: string, priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH'): void {
    this.store.tasks.put({
      task_id: `vrf_${sha256(claim.claim_id + reason).slice(0, 16)}`,
      claim_id: claim.claim_id,
      reason,
      priority: claim.high_impact ? 'HIGH' : priority,
      status: 'OPEN',
      created_at: this.now().toISOString(),
      resolved_at: null,
      resolved_by: null,
    });
  }

  /** Admin action. The only path by which a claim becomes VERIFIED. */
  approve(claimId: string, adminId: string): void {
    const c = this.store.claims.byId(claimId);
    if (!c) return;
    this.store.claims.update(claimId, { status: 'ACTIVE', confidence: Math.max(c.confidence, 0.95), verified_at: this.now().toISOString() });
    this.store.versions.put({
      version_id: `ver_${sha256(claimId + adminId + this.now().toISOString()).slice(0, 16)}`,
      claim_id: claimId,
      value: c.value,
      status: 'ACTIVE',
      recorded_at: this.now().toISOString(),
      recorded_by: adminId,
      reason: 'human verification',
    });
    for (const t of this.store.tasks.all()) {
      if (t.claim_id === claimId && t.status === 'OPEN') {
        this.store.tasks.update(t.task_id, { status: 'VERIFIED', resolved_at: this.now().toISOString(), resolved_by: adminId });
      }
    }
  }

  reject(claimId: string, adminId: string): void {
    const c = this.store.claims.byId(claimId);
    if (!c) return;
    this.store.claims.update(claimId, { status: 'REJECTED' });
    this.store.versions.put({
      version_id: `ver_${sha256(claimId + adminId + 'reject').slice(0, 16)}`,
      claim_id: claimId,
      value: c.value,
      status: 'REJECTED',
      recorded_at: this.now().toISOString(),
      recorded_by: adminId,
      reason: 'human rejection',
    });
  }

  /** Claims safe to show a student right now. */
  citableClaims(subject?: string): KnowledgeClaim[] {
    const all = subject ? this.store.claims.bySubject(subject) : this.store.claims.all();
    return all.filter((c) => c.status === 'ACTIVE' && (!c.high_impact || c.confidence >= 0.95));
  }

  /** Best current value for a subject/predicate, or null if not established. */
  currentClaim(subject: string, predicate: string): KnowledgeClaim | null {
    const candidates = this.citableClaims(subject).filter((c) => c.predicate === predicate);
    if (!candidates.length) return null;
    return candidates.sort(
      (a, b) =>
        TIER_RANK[a.authority_tier] - TIER_RANK[b.authority_tier] ||
        new Date(b.verified_at).getTime() - new Date(a.verified_at).getTime() ||
        b.confidence - a.confidence,
    )[0]!;
  }
}

/** Confidence for a chunk given its source tier, freshness and whether it was verified. */
export function chunkConfidence(chunk: KnowledgeChunk, sourceScore: number, verified: boolean): number {
  const base = 0.35 * sourceScore + 0.25 * (TIER_RANK[chunk.authority_tier] === 0 ? 1 : 1 - TIER_RANK[chunk.authority_tier] * 0.25);
  const verifyBonus = verified ? 0.3 : 0;
  return Math.min(0.99, Math.max(0.05, base + verifyBonus + 0.1 * (chunk.published_at ? 1 : 0)));
}
