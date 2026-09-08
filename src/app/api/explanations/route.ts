import { NextRequest, NextResponse } from "next/server";
import { getTopicExplanations, submitTopicExplanation } from "@/lib/profileService";

export async function GET() {
  try {
    const explanations = await getTopicExplanations();
    return NextResponse.json({ success: true, explanations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch explanations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, subject, topicTitle, explanationText, fileAttachment } = body;

    if (!topicTitle || !explanationText) {
      return NextResponse.json(
        { error: "Topic title and conceptual explanation text are required." },
        { status: 400 }
      );
    }

    if (explanationText.trim().length < 40) {
      return NextResponse.json(
        { error: "Please provide a thorough conceptual explanation (at least 40 characters) to earn stars." },
        { status: 400 }
      );
    }

    const { explanation, updatedProfile } = await submitTopicExplanation({
      studentId: "student-arjun-kumar-2026",
      studentName: studentName || "Arjun Kumar",
      subject: subject || "Physics",
      topicTitle,
      explanationText,
      fileAttachment
    });

    return NextResponse.json({
      success: true,
      explanation,
      starsAwarded: explanation.starsEarned,
      newStarsBalance: updatedProfile.starsBalance,
      profile: updatedProfile
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit topic explanation" },
      { status: 500 }
    );
  }
}
