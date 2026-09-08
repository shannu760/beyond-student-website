import { prisma } from "../prisma";
import { executeNode, NodeExecutionResult } from "./executors";

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  params: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string; // source node id
  target: string; // target node id
  sourceHandle?: string; // "true", "false", or "output"
  targetHandle?: string; // "input"
}

export interface RunWorkflowOptions {
  workflowId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  initialData?: Record<string, any>;
  triggerSource?: string;
}

export interface WorkflowRunResult {
  executionId: string;
  status: "success" | "error";
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  stepLogs: {
    nodeId: string;
    nodeName: string;
    nodeType: string;
    status: "pending" | "running" | "success" | "error";
    inputData: Record<string, any>;
    outputData: Record<string, any>;
    error?: string;
    durationMs: number;
  }[];
  finalOutput: Record<string, any>;
  error?: string;
}

export async function runWorkflow(options: RunWorkflowOptions): Promise<WorkflowRunResult> {
  const { workflowId, nodes, edges, initialData = {}, triggerSource = "manual" } = options;
  const startTime = Date.now();

  // Create Execution in DB
  let executionId = `exec-${Date.now()}`;
  try {
    const execution = await (prisma as any).execution?.create({
      data: {
        workflowId,
        status: "running",
        triggerSource,
        initialData: JSON.stringify(initialData)
      }
    });
    if (execution?.id) executionId = execution.id;
  } catch {}

  const nodeMap = new Map<string, WorkflowNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  // Build adjacency graph
  const outgoing = new Map<string, WorkflowEdge[]>();
  const incoming = new Map<string, WorkflowEdge[]>();

  nodes.forEach(n => {
    outgoing.set(n.id, []);
    incoming.set(n.id, []);
  });

  edges.forEach(e => {
    outgoing.get(e.source)?.push(e);
    incoming.get(e.target)?.push(e);
  });

  // Find root nodes (Trigger nodes or nodes with 0 incoming edges)
  const rootNodes = nodes.filter(n => (incoming.get(n.id)?.length || 0) === 0);

  const stepLogs: WorkflowRunResult["stepLogs"] = [];
  const nodeOutputs: Record<string, { json: Record<string, any> }> = {};
  const nodeDataMap = new Map<string, Record<string, any>>();

  // Initialize root nodes with initialData
  rootNodes.forEach(rn => {
    nodeDataMap.set(rn.id, initialData);
  });

  const queue: string[] = rootNodes.map(n => n.id);
  const executedNodes = new Set<string>();
  let overallError: string | undefined = undefined;
  let finalOutput: Record<string, any> = {};

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (executedNodes.has(currentId)) continue;

    const node = nodeMap.get(currentId);
    if (!node) continue;

    const input = nodeDataMap.get(currentId) || {};

    // Execute the node
    const execResult: NodeExecutionResult = await executeNode({
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      params: node.params || {},
      inputData: input,
      nodeOutputs
    });

    executedNodes.add(currentId);
    nodeOutputs[node.name || node.id] = { json: execResult.outputData };
    finalOutput = execResult.outputData;

    // Save Step Log in DB
    try {
      await (prisma as any).executionStepLog?.create({
        data: {
          executionId,
          nodeId: node.id,
          nodeName: node.name || node.type,
          nodeType: node.type,
          status: execResult.status,
          inputData: JSON.stringify(input),
          outputData: JSON.stringify(execResult.outputData),
          error: execResult.error,
          durationMs: execResult.durationMs
        }
      });
    } catch {}

    stepLogs.push({
      nodeId: node.id,
      nodeName: node.name || node.type,
      nodeType: node.type,
      status: execResult.status,
      inputData: input,
      outputData: execResult.outputData,
      error: execResult.error,
      durationMs: execResult.durationMs
    });

    if (execResult.status === "error") {
      overallError = execResult.error;
      break;
    }

    // Determine outgoing targets based on branch (for IF nodes)
    const outEdges = outgoing.get(currentId) || [];
    for (const edge of outEdges) {
      if (execResult.branch && edge.sourceHandle && edge.sourceHandle !== execResult.branch) {
        continue; // Skip branch not taken
      }
      // Pass outputData to child node
      nodeDataMap.set(edge.target, execResult.outputData);
      queue.push(edge.target);
    }
  }

  const finishedAt = new Date();
  const totalDuration = Date.now() - startTime;
  const finalStatus = overallError ? "error" : "success";

  // Update Execution record in DB
  try {
    await (prisma as any).execution?.update({
      where: { id: executionId },
      data: {
        status: finalStatus,
        finishedAt,
        durationMs: totalDuration,
        resultData: JSON.stringify(finalOutput),
        error: overallError
      }
    });
  } catch {}

  return {
    executionId,
    status: finalStatus,
    startedAt: new Date(startTime).toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: totalDuration,
    stepLogs,
    finalOutput,
    error: overallError
  };
}
