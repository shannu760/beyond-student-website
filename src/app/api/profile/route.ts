import { NextRequest, NextResponse } from "next/server";
import { getPreservedProfile, updatePreservedProfile } from "@/lib/profileService";

export async function GET() {
  try {
    const profile = await getPreservedProfile();
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
    const updates = await req.json();
    const profile = await updatePreservedProfile(updates);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update student profile" },
      { status: 500 }
    );
  }
}
