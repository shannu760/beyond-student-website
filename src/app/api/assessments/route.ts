import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const topicId = searchParams.get("topicId");

    const assessments = await prisma.assessment.findMany({
      where: {
        ...(subject && { subjectName: subject }),
        ...(topicId && { questions: { some: { topicId } } }),
      },
      include: {
        questions: {
          include: {
            topic: true,
          },
        },
        attempts: {
          where: { userId: user.userId },
          orderBy: { completedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subjectName, duration, questions } = body;

    const assessment = await prisma.assessment.create({
      data: {
        title,
        subjectName,
        duration: duration || 15,
        questions: {
          create: questions.map((q: { prompt: string; options: string[]; correctOption: number; explanation: string; topicId?: string; difficulty?: string }) => ({
            prompt: q.prompt,
            optionsJson: JSON.stringify(q.options),
            correctOption: q.correctOption,
            explanation: q.explanation,
            topicId: q.topicId,
            difficulty: q.difficulty || "MEDIUM",
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}