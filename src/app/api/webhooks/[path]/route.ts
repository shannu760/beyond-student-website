import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runWorkflow } from "@/lib/engine/dagRunner";

export async function POST(req: Request, { params }: { params: { path: string } }) {
  return handleWebhook(req, params.path, "POST");
}

export async function GET(req: Request, { params }: { params: { path: string } }) {
  return handleWebhook(req, params.path, "GET");
}

async function handleWebhook(req: Request, path: string, method: string) {
  try {
    const workflow = await (prisma as any).workflow?.findFirst({
      where: {
        webhookPath: path,
        active: true
      }
    });

    if (!workflow) {
      return NextResponse.json({
        success: false,
        error: `No active workflow registered for webhook path '${path}'`
      }, { status: 404 });
    }

    let payload: any = {};
    if (method !== "GET") {
      try {
        payload = await req.json();
      } catch {
        payload = {};
      }
    } else {
      const { searchParams } = new URL(req.url);
      payload = Object.fromEntries(searchParams.entries());
    }

    const nodes = typeof workflow.nodes === "string" ? JSON.parse(workflow.nodes) : workflow.nodes;
    const edges = typeof workflow.edges === "string" ? JSON.parse(workflow.edges) : workflow.edges;

    // Run workflow asynchronously
    const execution = await runWorkflow({
      workflowId: workflow.id,
      nodes,
      edges,
      initialData: {
        ...payload,
        _httpMethod: method,
        _headers: Object.fromEntries(req.headers.entries())
      },
      triggerSource: "webhook"
    });

    return NextResponse.json({
      success: true,
      message: `Webhook '${path}' received and processed`,
      executionId: execution.executionId,
      status: execution.status,
      durationMs: execution.durationMs,
      data: execution.finalOutput
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
