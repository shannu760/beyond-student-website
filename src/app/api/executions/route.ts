import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId");

    const where: any = {};
    if (workflowId) where.workflowId = workflowId;

    const executions = (prisma as any).execution?.findMany
      ? await (prisma as any).execution.findMany({
          where,
          orderBy: { startedAt: "desc" },
          take: 50,
          include: {
            workflow: {
              select: { id: true, name: true, triggerType: true }
            },
            logs: {
              orderBy: { executedAt: "asc" }
            }
          }
        })
      : [];

    return NextResponse.json({ success: true, data: executions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
