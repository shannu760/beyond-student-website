import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runWorkflow, WorkflowNode, WorkflowEdge } from "@/lib/engine/dagRunner";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workflowId, nodes, edges, initialData = {}, triggerSource = "manual" } = body;

    let targetNodes: WorkflowNode[] = nodes;
    let targetEdges: WorkflowEdge[] = edges;
    let targetWorkflowId = workflowId;

    if (workflowId && (!nodes || !edges)) {
      const dbWorkflow = await (prisma as any).workflow?.findUnique({
        where: { id: workflowId }
      });
      if (!dbWorkflow) {
        return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
      }
      targetNodes = typeof dbWorkflow.nodes === "string" ? JSON.parse(dbWorkflow.nodes) : dbWorkflow.nodes;
      targetEdges = typeof dbWorkflow.edges === "string" ? JSON.parse(dbWorkflow.edges) : dbWorkflow.edges;
    }

    if (!targetWorkflowId) {
      // Create ephemeral or default workflow container
      const tempWorkflow = await (prisma as any).workflow?.create({
        data: {
          name: "Interactive Execution",
          nodes: JSON.stringify(targetNodes || []),
          edges: JSON.stringify(targetEdges || [])
        }
      });
      targetWorkflowId = tempWorkflow?.id || "temp-exec-id";
    }

    const result = await runWorkflow({
      workflowId: targetWorkflowId,
      nodes: targetNodes || [],
      edges: targetEdges || [],
      initialData,
      triggerSource
    });

    return NextResponse.json({
      success: result.status === "success",
      data: result
    });
  } catch (error: any) {
    console.error("Execution error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
