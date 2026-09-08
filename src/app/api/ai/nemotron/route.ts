import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

const NEMOTRON_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, model, temperature, maxTokens, stream } = body;

    const apiKey = process.env.NEMOTRON_3_ULTRA_API_KEY;
    if (!apiKey || apiKey === "your-nemotron-3-ultra-api-key-here") {
      return NextResponse.json(
        { error: "Nemotron API key not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(NEMOTRON_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": stream ? "text/event-stream" : "application/json",
      },
      body: JSON.stringify({
        model: model || "nvidia/nemotron-3-ultra",
        messages: messages || [],
        temperature: temperature ?? 0.7,
        max_tokens: maxTokens || 2048,
        stream: stream || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Nemotron API error:", response.status, errorData);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    if (stream) {
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Nemotron API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}