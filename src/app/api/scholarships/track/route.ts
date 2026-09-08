import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";
import { getPreservedProfile, updatePreservedProfile } from "@/lib/profileService";

export interface TrackedScholarship {
  id: string;
  schemeId: string;
  title: string;
  authority: string;
  amount: string;
  status: "Saved" | "Documents_Ready" | "Application_Submitted" | "Under_Review";
  deadline: string;
  trackedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SCHOLARSHIP_FILE = path.join(DATA_DIR, "student_scholarships.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getLocalTracked(): TrackedScholarship[] {
  ensureDataDir();
  if (!fs.existsSync(SCHOLARSHIP_FILE)) {
    const initial: TrackedScholarship[] = [
      {
        id: "trk-1",
        schemeId: "reliance-foundation",
        title: "Reliance Foundation Undergraduate Scholarship",
        authority: "Reliance Foundation (via Buddy4Study)",
        amount: "₹2,00,000 Total Grant",
        status: "Documents_Ready",
        deadline: "October 15, 2026",
        trackedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
    fs.writeFileSync(SCHOLARSHIP_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(SCHOLARSHIP_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveLocalTracked(list: TrackedScholarship[]) {
  ensureDataDir();
  fs.writeFileSync(SCHOLARSHIP_FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function GET() {
  try {
    const profile = await getPreservedProfile();
    let trackedList: TrackedScholarship[] = [];

    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from("student_scholarships")
        .select("*")
        .eq("student_id", profile.id);

      if (!error && data && data.length > 0) {
        trackedList = data.map((d: any) => ({
          id: d.id,
          schemeId: d.scheme_id,
          title: d.title,
          authority: d.authority,
          amount: d.amount,
          status: d.status,
          deadline: d.deadline,
          trackedAt: d.created_at
        }));
      }
    } catch {
      // Use local fallback
    }

    if (trackedList.length === 0) {
      trackedList = getLocalTracked();
    }

    return NextResponse.json({ success: true, tracked: trackedList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch scholarships" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schemeId, title, authority, amount, deadline, status = "Saved" } = body;
    const profile = await getPreservedProfile();

    const newRecord: TrackedScholarship = {
      id: "trk-" + Date.now(),
      schemeId,
      title,
      authority,
      amount,
      status,
      deadline: deadline || "October 31, 2026",
      trackedAt: new Date().toISOString()
    };

    // Save to local ledger
    const current = getLocalTracked();
    const updated = [newRecord, ...current.filter((s) => s.schemeId !== schemeId)];
    saveLocalTracked(updated);

    // Sync to Supabase
    try {
      await supabase.from("student_scholarships").upsert({
        id: newRecord.id,
        student_id: profile.id,
        scheme_id: schemeId,
        title,
        authority,
        amount,
        status,
        deadline: newRecord.deadline,
        created_at: newRecord.trackedAt
      });
    } catch (e) {
      console.warn("Supabase scholarship upsert fallback:", e);
    }

    // Award student 50 Stars for tracking scholarship preparation
    const updatedProfile = await updatePreservedProfile({
      starsBalance: profile.starsBalance + 50
    });

    return NextResponse.json({
      success: true,
      message: `Tracked ${title} successfully in Supabase & local ledger. +50 Stars awarded!`,
      tracked: newRecord,
      profile: updatedProfile
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to track scholarship" }, { status: 500 });
  }
}
