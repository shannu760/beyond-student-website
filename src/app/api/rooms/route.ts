import { NextRequest, NextResponse } from "next/server";
import {
  getStudyRooms,
  createStudyRoom
} from "@/lib/studyRoomsService";
import { getPreservedProfile } from "@/lib/profileService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();

    let rooms = getStudyRooms();

    if (category && category !== "ALL") {
      rooms = rooms.filter((r) => r.category.toUpperCase() === category.toUpperCase());
    }

    if (search) {
      rooms = rooms.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.topic.toLowerCase().includes(search) ||
          r.exam.toLowerCase().includes(search) ||
          r.subject.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let hostName = "Krishna Addanki";
    let hostAvatar = "/images/default-avatar.svg";
    try {
      const profile = await getPreservedProfile();
      if (profile?.fullName) hostName = profile.fullName;
      if (profile?.avatarUrl) hostAvatar = profile.avatarUrl;
    } catch {}

    const newRoom = createStudyRoom({
      ...body,
      hostName: body.hostName || hostName,
      hostAvatar: body.hostAvatar || hostAvatar
    });

    return NextResponse.json({ success: true, room: newRoom }, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}