import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request);
    if (!user?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          include: { topic: true },
        },
        attempts: {
          where: { userId: user.userId },
          orderBy: { completedAt: "desc" },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request);
    if (!user?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { answers } = body;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    let score = 0;
    const results = assessment.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctOption;
      if (isCorrect) score++;
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctOption,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const accuracy = (score / assessment.questions.length) * 100;

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId: user.userId,
        assessmentId: id,
        score,
        totalQuestions: assessment.questions.length,
        accuracy,
      },
    });

    if (assessment.questions[0]?.topicId) {
      await prisma.topicMastery.upsert({
        where: {
          userId_topicId: {
            userId: user.userId,
            topicId: assessment.questions[0].topicId,
          },
        },
        update: {
          questionsTried: { increment: assessment.questions.length },
          accuracy: { increment: accuracy },
          lastAssessedAt: new Date(),
        },
        create: {
          userId: user.userId,
          topicId: assessment.questions[0].topicId,
          accuracy,
          questionsTried: assessment.questions.length,
          level: accuracy >= 90 ? "PROFICIENT" : accuracy >= 70 ? "DEVELOPING" : "NEEDS_SUPPORT",
        },
      });
    }

    await prisma.starsLedger.create({
      data: {
        userId: user.userId,
        amount: Math.floor(accuracy / 10) * 10,
        reason: `Completed ${assessment.title}`,
      },
    });

    return NextResponse.json({ attempt, results, accuracy });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}