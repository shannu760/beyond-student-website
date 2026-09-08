import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cache in memory after loading
let cachedData: any = null;

function load12thPassData() {
  if (cachedData) return cachedData;
  const filePath = path.join(process.cwd(), "data", "12thpass", "all_pyqs.json");
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf8");
    cachedData = JSON.parse(raw);
    return cachedData;
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam") || "JEE Main"; // "JEE Main" | "JEE Advanced"
    const subject = searchParams.get("subject") || "Physics"; // "Physics" | "Chemistry" | "Mathematics"
    const chapter = searchParams.get("chapter"); // slug or null for all
    const year = searchParams.get("year"); // e.g. "2025" or null
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const getTaxonomyOnly = searchParams.get("taxonomy") === "true";

    const db = load12thPassData();
    if (!db) {
      return NextResponse.json({ success: false, message: "12thpass database not loaded" }, { status: 500 });
    }

    // If requested only taxonomy summary
    if (getTaxonomyOnly) {
      return NextResponse.json({
        success: true,
        taxonomy: db.taxonomy,
        metadata: db.metadata,
        totalLoadedQuestions: db.questions.length
      });
    }

    // Filter questions
    let filtered = db.questions.filter((q: any) => {
      if (exam && q.exam.toLowerCase() !== exam.toLowerCase()) return false;
      if (subject && q.subject.toLowerCase() !== subject.toLowerCase()) return false;
      if (chapter && chapter !== "all" && q.chapterSlug !== chapter) return false;
      if (year && year !== "all" && q.year !== parseInt(year, 10)) return false;
      if (search && !q.question.toLowerCase().includes(search) && !q.sessionLabel.toLowerCase().includes(search)) {
        return false;
      }
      return true;
    });

    const totalMatching = filtered.length;
    const totalPages = Math.ceil(totalMatching / limit);
    const startIndex = (page - 1) * limit;
    const paginatedQuestions = filtered.slice(startIndex, startIndex + limit);

    // Get list of chapters for the current exam + subject
    const examKey = exam.toLowerCase().includes("adv") ? "jeeAdvanced" : "jeeMain";
    const subKey = subject.toLowerCase();
    const chapters = db.taxonomy?.[examKey]?.[subKey]?.chapters || [];

    return NextResponse.json({
      success: true,
      exam,
      subject,
      chapter,
      chapters,
      page,
      limit,
      totalMatching,
      totalPages,
      questions: paginatedQuestions
    });
  } catch (error: any) {
    console.error("12thpass API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
