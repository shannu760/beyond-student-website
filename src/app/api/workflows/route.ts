import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workflows = (prisma as any).workflow?.findMany
      ? await (prisma as any).workflow.findMany({
          orderBy: { updatedAt: "desc" },
          include: {
            _count: {
              select: { executions: true }
            },
            executions: {
              take: 1,
              orderBy: { startedAt: "desc" },
              select: {
                id: true,
                status: true,
                startedAt: true,
                durationMs: true
              }
            }
          }
        })
      : [];

    return NextResponse.json({ success: true, data: workflows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, triggerType = "manual", webhookPath, nodes = [], edges = [] } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Workflow name is required" }, { status: 400 });
    }

    const workflow = await (prisma as any).workflow?.create({
      data: {
        name,
        description,
        triggerType,
        webhookPath: webhookPath || (triggerType === "webhook" ? `webhook-${Date.now()}` : null),
        nodes: typeof nodes === "string" ? nodes : JSON.stringify(nodes),
        edges: typeof edges === "string" ? edges : JSON.stringify(edges),
        active: true
      }
    });

    return NextResponse.json({ success: true, data: workflow });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
