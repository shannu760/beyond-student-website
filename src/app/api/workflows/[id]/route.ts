import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const workflow = await (prisma as any).workflow?.findUnique({
      where: { id: params.id },
      include: {
        executions: {
          take: 10,
          orderBy: { startedAt: "desc" }
        }
      }
    });

    if (!workflow) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: workflow });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, description, active, triggerType, webhookPath, nodes, edges } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (active !== undefined) updateData.active = active;
    if (triggerType !== undefined) updateData.triggerType = triggerType;
    if (webhookPath !== undefined) updateData.webhookPath = webhookPath;
    if (nodes !== undefined) updateData.nodes = typeof nodes === "string" ? nodes : JSON.stringify(nodes);
    if (edges !== undefined) updateData.edges = typeof edges === "string" ? edges : JSON.stringify(edges);

    const workflow = await (prisma as any).workflow?.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: workflow });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await (prisma as any).workflow?.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: "Workflow deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
