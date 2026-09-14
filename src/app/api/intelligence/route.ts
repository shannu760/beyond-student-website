import { NextRequest, NextResponse } from "next/server";
import { BeyondIntelligenceHub } from "@/lib/intelligence/hub";

export async function GET() {
  try {
    const metrics = BeyondIntelligenceHub.getSystemMetrics();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      layerVersion: "Agent 00 Architecture v1.0",
      metrics
    });
  } catch (error: any) {
    console.error("Intelligence API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch metrics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, studentContext } = body;

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const result = await BeyondIntelligenceHub.queryIntelligence(query, studentContext);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Intelligence Query error:", error);
    return NextResponse.json({ error: error.message || "Failed to query intelligence layer" }, { status: 500 });
  }
}
