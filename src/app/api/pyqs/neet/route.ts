import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cache in memory after loading
let cachedNeetData: any = null;

function loadNeetData() {
  if (cachedNeetData) return cachedNeetData;
  const filePath = path.join(process.cwd(), "data", "neet", "all_neet_pyqs.json");
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf8");
    cachedNeetData = JSON.parse(raw);
    return cachedNeetData;
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject") || "Physics"; // "Physics" | "Chemistry" | "Biology" | "Botany" | "Zoology" | "all"
    const chapter = searchParams.get("chapter"); // chapter name / id or "all"
    const year = searchParams.get("year"); // e.g. "2024" or "all"
    const code = searchParams.get("code"); // e.g. "Code F1" or "all"
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const view = searchParams.get("view") || "questions"; // "questions" | "papers" | "taxonomy"

    const db = loadNeetData();
    if (!db) {
      return NextResponse.json({ success: false, message: "NEET database not loaded" }, { status: 500 });
    }

    // Taxonomy query
    if (view === "taxonomy") {
      return NextResponse.json({
        success: true,
        source: db.source,
        counts: db.counts,
        chapters: db.chapters,
        totalQuestions: db.questions.length,
        totalPaperSets: db.paperSets.length
      });
    }

    // Papers catalog query
    if (view === "papers") {
      let filteredPapers = db.paperSets.filter((p: any) => {
        if (year && year !== "all" && p.year !== parseInt(year, 10)) return false;
        if (subject && subject !== "all" && subject !== "Biology") {
          if (p.subject !== "Full Paper" && p.subject.toLowerCase() !== subject.toLowerCase()) return false;
        }
        if (code && code !== "all" && !p.code.toLowerCase().includes(code.toLowerCase())) return false;
        if (search && !p.title.toLowerCase().includes(search)) return false;
        return true;
      });

      return NextResponse.json({
        success: true,
        view: "papers",
        totalMatching: filteredPapers.length,
        paperSets: filteredPapers
      });
    }

    // Questions filtering
    let filtered = db.questions.filter((q: any) => {
      // Subject filtering
      if (subject && subject !== "all") {
        if (subject.toLowerCase() === "biology") {
          if (q.subject !== "Biology" && q.subject !== "Botany" && q.subject !== "Zoology") return false;
        } else {
          if (q.subject.toLowerCase() !== subject.toLowerCase()) return false;
        }
      }

      // Chapter filtering
      if (chapter && chapter !== "all") {
        if (q.chapter.toLowerCase() !== chapter.toLowerCase() && q.chapterId !== chapter) {
          return false;
        }
      }

      // Year filtering
      if (year && year !== "all") {
        if (q.year !== parseInt(year, 10)) return false;
      }

      // Paper Code filtering
      if (code && code !== "all") {
        if (!q.paperCode?.toLowerCase().includes(code.toLowerCase())) return false;
      }

      // Keyword search
      if (search) {
        const textToSearch = `${q.question} ${q.chapter} ${q.unit} ${q.yearLabel} ${q.officialExplanation}`.toLowerCase();
        if (!textToSearch.includes(search)) return false;
      }

      return true;
    });

    const totalMatching = filtered.length;
    const totalPages = Math.ceil(totalMatching / limit);
    const startIndex = (page - 1) * limit;
    const paginatedQuestions = filtered.slice(startIndex, startIndex + limit);

    // Filter relevant chapters for the current subject
    let subjectChapters = db.chapters;
    if (subject && subject !== "all") {
      if (subject.toLowerCase() === "biology") {
        subjectChapters = db.chapters.filter((c: any) => c.subject === "Botany" || c.subject === "Zoology");
      } else {
        subjectChapters = db.chapters.filter((c: any) => c.subject.toLowerCase() === subject.toLowerCase());
      }
    }

    // Relevant papers for quick access
    const relatedPapers = db.paperSets.filter((p: any) => {
      if (year && year !== "all" && p.year === parseInt(year, 10)) return true;
      return p.year >= 2024;
    }).slice(0, 8);

    return NextResponse.json({
      success: true,
      subject,
      chapter,
      year,
      code,
      page,
      limit,
      totalMatching,
      totalPages,
      counts: db.counts,
      chapters: subjectChapters,
      relatedPapers,
      questions: paginatedQuestions
    });
  } catch (error: any) {
    console.error("NEET API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
