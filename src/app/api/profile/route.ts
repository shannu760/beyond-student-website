import { NextRequest, NextResponse } from "next/server";
import { getPreservedProfile, updatePreservedProfile } from "@/lib/profileService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeZone = searchParams.get("tz") || req.headers.get("x-timezone") || "Asia/Kolkata";
    const profile = await getPreservedProfile(timeZone);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch student profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeZone = searchParams.get("tz") || req.headers.get("x-timezone") || "Asia/Kolkata";
    const updates = await req.json();
    const profile = await updatePreservedProfile(updates, timeZone);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update student profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeZone = searchParams.get("tz") || req.headers.get("x-timezone") || "Asia/Kolkata";
    const body = await req.json().catch(() => ({}));

    // Record or update daily login
    const profile = await updatePreservedProfile(body.updates || {}, timeZone);
    return NextResponse.json({ success: true, profile, message: "Daily login and streak synchronized." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to record daily login" },
      { status: 500 }
    );
  }
}
