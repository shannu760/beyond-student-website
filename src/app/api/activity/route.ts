import { NextRequest, NextResponse } from "next/server";
import { 
  recordQuestionAttempt, 
  recordFocusSession, 
  getTodayActivity, 
  resetStudentRecordsToZero,
  getPreservedProfile
} from "@/lib/profileService";

export async function GET() {
  try {
    const today = await getTodayActivity();
    const profile = await getPreservedProfile();
    return NextResponse.json({ success: true, today, profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch activity" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "question") {
      const { subject, topic, isPYQ, isCorrect, timeSpentSeconds } = body;
      const result = await recordQuestionAttempt({
        subject: subject || "Physics",
        topic: topic || "General Concepts",
        isPYQ: Boolean(isPYQ),
        isCorrect: Boolean(isCorrect),
        timeSpentSeconds: Number(timeSpentSeconds) || 30
      });

      return NextResponse.json({
        success: true,
        type: "question",
        attempt: result.attempt,
        starsEarned: result.starsEarned,
        profile: result.updatedProfile
      });
    }

    if (action === "focus") {
      const { durationMinutes, goal } = body;
      const result = await recordFocusSession({
        durationMinutes: Number(durationMinutes) || 25,
        goal: goal || "Focused Problem Solving"
      });

      return NextResponse.json({
        success: true,
        type: "focus",
        session: result.session,
        starsEarned: result.starsEarned,
        profile: result.updatedProfile
      });
    }

    return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log activity" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const profile = await resetStudentRecordsToZero();
    return NextResponse.json({ 
      success: true, 
      message: "Student records and stats successfully reset to zero.", 
      profile 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reset records" }, { status: 500 });
  }
}
