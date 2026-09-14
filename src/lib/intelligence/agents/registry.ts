/**
 * Agent registry and permission enforcement.
 *
 * ONE AGENT = ONE BOUNDED TASK. An agent is not a free actor: it is a capability
 * list plus a write scope plus an approval requirement. The `withPermission`
 * wrapper is the single choke point through which every agent action passes, so
 * "can this agent do X?" has exactly one answer in the code.
 */

import type { KnowledgeStore } from '../store/memory';

export type AgentId =
  | 'research' | 'source_verification' | 'extraction' | 'knowledge' | 'contradiction'
  | 'summarization' | 'resource' | 'recommendation' | 'citation' | 'evaluation'
  | 'safety' | 'orchestrator';

export type Resource_ = 'sources' | 'documents' | 'chunks' | 'claims' | 'conflicts' | 'resources' | 'jobs' | 'tasks' | 'usage' | 'students' | 'edges' | 'network';

export interface AgentPermissions {
  read: Resource_[];
  write: Resource_[];
  /** Actions that must be queued for a human rather than executed. */
  requires_human_approval: string[];
  /** Hard ceiling on writes per run — a runaway agent stops itself. */
  max_writes_per_run: number;
  /** Agents may never do these. Enforced, not advisory. */
  forbidden: string[];
}

export interface AgentManifest {
  id: AgentId;
  name: string;
  task: string;
  permissions: AgentPermissions;
}

export const AGENT_MANIFESTS: AgentManifest[] = [
  {
    id: 'research',
    name: 'Research Agent',
    task: 'Discover candidate sources for a knowledge gap. Finds URLs; never ingests or publishes.',
    permissions: {
      read: ['sources', 'jobs', 'usage', 'network'],
      write: ['jobs'],
      requires_human_approval: ['promote_tier', 'add_domain_to_allowlist'],
      max_writes_per_run: 50,
      forbidden: ['write_chunks', 'write_claims', 'modify_sources_tier', 'bypass_robots', 'bypass_paywall'],
    },
  },
  {
    id: 'source_verification',
    name: 'Source Verification Agent',
    task: 'Assess authority, freshness and provenance. Proposes tier changes; cannot apply Tier 1.',
    permissions: {
      read: ['sources', 'documents', 'network'],
      write: ['sources', 'tasks'],
      requires_human_approval: ['set_tier_authoritative', 'approve_source'],
      max_writes_per_run: 200,
      forbidden: ['write_chunks', 'write_claims', 'self_approve'],
    },
  },
  {
    id: 'extraction',
    name: 'Extraction Agent',
    task: 'Turn a validated document into structured blocks and candidate claims.',
    permissions: {
      read: ['documents', 'sources'],
      write: ['chunks'],
      requires_human_approval: [],
      max_writes_per_run: 500,
      forbidden: ['write_claims', 'publish', 'modify_sources'],
    },
  },
  {
    id: 'knowledge',
    name: 'Knowledge Agent',
    task: 'Record claims into the temporal ledger, creating versions and conflicts.',
    permissions: {
      read: ['chunks', 'claims', 'sources'],
      write: ['claims', 'conflicts', 'tasks', 'edges'],
      requires_human_approval: ['approve_high_impact_claim'],
      max_writes_per_run: 300,
      forbidden: ['delete_history', 'overwrite_superseded', 'self_approve'],
    },
  },
  {
    id: 'contradiction',
    name: 'Contradiction Agent',
    task: 'Compare sources on the same fact and raise conflicts. Never resolves them.',
    permissions: {
      read: ['claims', 'chunks', 'sources'],
      write: ['conflicts', 'tasks'],
      requires_human_approval: ['resolve_conflict'],
      max_writes_per_run: 100,
      forbidden: ['write_claims', 'delete_history', 'resolve_conflict'],
    },
  },
  {
    id: 'summarization',
    name: 'Summarization Agent',
    task: 'Produce concise, attributed summaries of a document or a claim set.',
    permissions: { read: ['documents', 'chunks', 'claims'], write: [], requires_human_approval: [], max_writes_per_run: 0, forbidden: ['write_claims', 'write_chunks'] },
  },
  {
    id: 'resource',
    name: 'Resource Agent',
    task: 'Discover and verify free/open learning resources. May not claim FREE without verification.',
    permissions: {
      read: ['resources', 'sources', 'network'],
      write: ['resources', 'tasks'],
      requires_human_approval: ['mark_verified_free'],
      max_writes_per_run: 200,
      forbidden: ['recommend_pirated', 'bypass_paywall', 'write_claims'],
    },
  },
  {
    id: 'recommendation',
    name: 'Recommendation Agent',
    task: 'Match verified resources to a student context and order them into a sequence.',
    permissions: { read: ['resources', 'students', 'claims', 'usage'], write: ['usage'], requires_human_approval: [], max_writes_per_run: 100, forbidden: ['write_resources', 'write_claims', 'read_other_students'] },
  },
  {
    id: 'citation',
    name: 'Citation Agent',
    task: 'Verify that every claim in an answer maps to a retrieved source. Read-only by design.',
    permissions: { read: ['chunks', 'sources', 'claims'], write: [], requires_human_approval: [], max_writes_per_run: 0, forbidden: ['fabricate_citation', 'write_anything'] },
  },
  {
    id: 'evaluation',
    name: 'Evaluation Agent',
    task: 'Score answers and retrieval against golden datasets. Records metrics only.',
    permissions: { read: ['chunks', 'claims', 'sources', 'usage'], write: ['usage'], requires_human_approval: [], max_writes_per_run: 100, forbidden: ['modify_knowledge', 'write_claims'] },
  },
  {
    id: 'safety',
    name: 'Safety Agent',
    task: 'Check privacy, age appropriateness and harmful content. Can block, cannot publish.',
    permissions: { read: ['students', 'usage'], write: ['usage'], requires_human_approval: [], max_writes_per_run: 100, forbidden: ['publish', 'write_claims', 'expose_student_pii'] },
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    task: 'Sequence agents and enforce budgets. Has no direct knowledge write access.',
    permissions: { read: ['jobs', 'tasks', 'sources', 'usage'], write: ['jobs'], requires_human_approval: ['change_agent_permissions', 'deploy', 'alter_security_policy'], max_writes_per_run: 100, forbidden: ['write_claims', 'write_chunks', 'modify_self'] },
  },
];

export class PermissionDeniedError extends Error {
  constructor(readonly agent: AgentId, readonly resource: Resource_ | string) {
    super(`Agent '${agent}' is not permitted to touch '${resource}'`);
    this.name = 'PermissionDeniedError';
  }
}

export interface AgentActionLog {
  agent: AgentId;
  at: string;
  resource: Resource_ | string;
  op: 'read' | 'write' | 'blocked' | 'queued_for_human';
  detail: string;
}

export class AgentContext {
  private writes = 0;
  readonly log: AgentActionLog[] = [];

  constructor(readonly manifest: AgentManifest, readonly store: KnowledgeStore, private readonly onHumanApproval?: (agent: AgentId, action: string, detail: string) => void) {}

  private record(resource: Resource_ | string, op: AgentActionLog['op'], detail: string): void {
    this.log.push({ agent: this.manifest.id, at: new Date().toISOString(), resource, op, detail });
  }

  read<T>(resource: Resource_, fn: () => T, detail = ''): T {
    if (!this.manifest.permissions.read.includes(resource)) {
      this.record(resource, 'blocked', detail || 'read denied');
      throw new PermissionDeniedError(this.manifest.id, resource);
    }
    this.record(resource, 'read', detail || 'read');
    return fn();
  }

  write<T>(resource: Resource_, action: string, fn: () => T, detail = ''): T {
    const p = this.manifest.permissions;
    if (p.forbidden.includes(action)) {
      this.record(action, 'blocked', `forbidden action: ${action}`);
      throw new PermissionDeniedError(this.manifest.id, action);
    }
    if (p.requires_human_approval.includes(action)) {
      this.record(action, 'queued_for_human', detail || 'requires human approval');
      this.onHumanApproval?.(this.manifest.id, action, detail);
      this.store.tasks.put({
        task_id: `appr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        claim_id: `${this.manifest.id}:${action}`,
        reason: `${this.manifest.id} requested '${action}' which requires human approval. ${detail}`,
        priority: 'HIGH',
        status: 'OPEN',
        created_at: new Date().toISOString(),
        resolved_at: null,
        resolved_by: null,
      });
      throw new HumanApprovalRequired(this.manifest.id, action);
    }
    if (!p.write.includes(resource)) {
      this.record(resource, 'blocked', detail || 'write denied');
      throw new PermissionDeniedError(this.manifest.id, resource);
    }
    if (this.writes >= p.max_writes_per_run) {
      this.record(resource, 'blocked', `write ceiling ${p.max_writes_per_run} reached`);
      throw new WriteCeilingReached(this.manifest.id, p.max_writes_per_run);
    }
    const out = fn();
    this.writes++;
    this.record(resource, 'write', detail || 'write');
    return out;
  }

  get writesUsed(): number {
    return this.writes;
  }
}

export class HumanApprovalRequired extends Error {
  constructor(readonly agent: AgentId, readonly action: string) {
    super(`'${action}' by agent '${agent}' is queued for human approval and was NOT executed`);
    this.name = 'HumanApprovalRequired';
  }
}

export class WriteCeilingReached extends Error {
  constructor(readonly agent: AgentId, readonly ceiling: number) {
    super(`Agent '${agent}' hit its per-run write ceiling of ${ceiling}`);
    this.name = 'WriteCeilingReached';
  }
}

export function createContext(id: AgentId, store: KnowledgeStore, onHumanApproval?: (agent: AgentId, action: string, detail: string) => void): AgentContext {
  const manifest = AGENT_MANIFESTS.find((m) => m.id === id);
  if (!manifest) throw new Error(`Unknown agent ${id}`);
  return new AgentContext(manifest, store, onHumanApproval);
}
