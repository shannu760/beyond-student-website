import { NextRequest, NextResponse } from "next/server";
import { 
  generateDailyReport, 
  getLatestDailyReport, 
  markDailyReportAsRead 
} from "@/lib/profileService";

export async function GET() {
  try {
    const data = await getLatestDailyReport();
    return NextResponse.json({ 
      success: true, 
      report: data.report, 
      hasUnreadNotification: data.hasUnreadNotification 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch daily report" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const report = await generateDailyReport();
    return NextResponse.json({ 
      success: true, 
      report, 
      message: "End-of-day performance scorecard generated." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate daily report" }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    await markDailyReportAsRead();
    return NextResponse.json({ 
      success: true, 
      message: "Daily report notification marked as acknowledged." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to mark report as read" }, { status: 500 });
  }
}
