"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PYQ_DATABASE, 
  PYQQuestion, 
  JumbledExamPaper,
  CURATED_JUMBLED_PAPERS,
  generateJumbledExamPaper,
  getPYQsByExam,
  getAvailableYears
} from "@/data/pyqDatabase";
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  Zap, 
  AlertTriangle, 
  BookOpen, 
  Clock, 
  Award, 
  ChevronRight, 
  Filter, 
  Compass,
  ArrowRight,
  Database,
  Cpu,
  Shuffle,
  Play,
  Check,
  Flame,
  Trophy,
  Calendar,
  Layers,
  HelpCircle,
  BarChart3,
  Bookmark,
  ChevronLeft,
  Search,
  ExternalLink,
  Atom,
  FlaskConical,
  Calculator,
  Grid,
  ListFilter
} from "lucide-react";

type ExamFilter = "ALL" | "JEE Main" | "JEE Advanced" | "NEET" | "SAT" | "GRE";
type TabType = "12thpass" | "neet" | "archive" | "jumbled";

export default function PYQPortalPage() {
  // Mode Tabs
  const [activeTab, setActiveTab] = useState<TabType>("12thpass");

  // =========================================================================
  // 1. 12THPASS.AI DUMP STATES (13,805 Questions Segregated)
  // =========================================================================
  const [passExam, setPassExam] = useState<"JEE Main" | "JEE Advanced">("JEE Main");
  const [passSubject, setPassSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");
  const [passChapter, setPassChapter] = useState<string>("all");
  const [passYear, setPassYear] = useState<string>("all");
  const [passSearch, setPassSearch] = useState<string>("");
  const [passPage, setPassPage] = useState<number>(1);
  const [passData, setPassData] = useState<any>(null);
  const [passLoading, setPassLoading] = useState<boolean>(false);
  const [passSelectedQuestion, setPassSelectedQuestion] = useState<any>(null);
  const [passSelectedOption, setPassSelectedOption] = useState<number | null>(null);
  const [passIsAnswered, setPassIsAnswered] = useState<boolean>(false);
  const [passAiSolving, setPassAiSolving] = useState<boolean>(false);
  const [passSolvingStage, setPassSolvingStage] = useState<number>(0);
  const [passAiSolution, setPassAiSolution] = useState<any>(null);

  // =========================================================================
  // 2. VEDANTU NEET ARCHIVE STATES (2015-2026 Segregated Repository)
  // =========================================================================
  const [neetSubject, setNeetSubject] = useState<"Physics" | "Chemistry" | "Biology" | "Botany" | "Zoology">("Physics");
  const [neetChapter, setNeetChapter] = useState<string>("all");
  const [neetYear, setNeetYear] = useState<string>("all");
  const [neetCode, setNeetCode] = useState<string>("all");
  const [neetSearch, setNeetSearch] = useState<string>("");
  const [neetPage, setNeetPage] = useState<number>(1);
  const [neetViewMode, setNeetViewMode] = useState<"questions" | "papers">("questions");
  const [neetData, setNeetData] = useState<any>(null);
  const [neetLoading, setNeetLoading] = useState<boolean>(false);
  const [neetSelectedQuestion, setNeetSelectedQuestion] = useState<any>(null);
  const [neetSelectedOption, setNeetSelectedOption] = useState<number | null>(null);
  const [neetShowExplanation, setNeetShowExplanation] = useState<boolean>(false);
  const [neetAiSolving, setNeetAiSolving] = useState<boolean>(false);
  const [neetSolvingStage, setNeetSolvingStage] = useState<number>(0);
  const [neetAiSolution, setNeetAiSolution] = useState<any>(null);

  // Fetch 12thpass data when filters change
  useEffect(() => {
    let ignore = false;
    async function loadData() {
      setPassLoading(true);
      try {
        const query = new URLSearchParams({
          exam: passExam,
          subject: passSubject,
          chapter: passChapter,
          year: passYear,
          search: passSearch,
          page: passPage.toString(),
          limit: "20"
        });
        const res = await fetch(`/api/pyqs/12thpass?${query.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setPassData(data);
          if (data.questions && data.questions.length > 0) {
            setPassSelectedQuestion((prev: any) => {
              if (prev && data.questions.some((q: any) => q.id === prev.id)) return prev;
              return data.questions[0];
            });
            setPassSelectedOption(null);
            setPassIsAnswered(false);
            setPassAiSolution(null);
            setPassSolvingStage(0);
          } else {
            setPassSelectedQuestion(null);
          }
        }
      } catch (err) {
        console.error("Failed to load 12thpass data:", err);
      } finally {
        if (!ignore) setPassLoading(false);
      }
    }
    loadData();
    return () => { ignore = true; };
  }, [passExam, passSubject, passChapter, passYear, passSearch, passPage]);

  // Handle select option for 12thpass question
  const handleSelectPassOption = async (idx: number) => {
    if (!passSelectedQuestion) return;
    setPassSelectedOption(idx);
    setPassIsAnswered(true);

    const isCorrect = idx === passSelectedQuestion.correctIndex;
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "question",
          subject: passSelectedQuestion.subject,
          topic: passSelectedQuestion.chapter,
          isPYQ: true,
          isCorrect,
          timeSpentSeconds: 45
        })
      });
      window.dispatchEvent(new Event("beyond:activity-updated"));
    } catch (e) {
      console.error("Failed to log activity:", e);
    }
  };

  // Handle solve with Nemotron for 12thpass question with progressive steps
  const handleSolvePassQuestion = async () => {
    if (!passSelectedQuestion) return;
    setPassAiSolving(true);
    setPassSolvingStage(1);

    const t1 = setTimeout(() => setPassSolvingStage(2), 350);
    const t2 = setTimeout(() => setPassSolvingStage(3), 850);
    const t3 = setTimeout(() => setPassSolvingStage(4), 1350);

    try {
      const res = await fetch("/api/ai/solve-pyq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: passSelectedQuestion.id,
          questionText: passSelectedQuestion.question,
          exam: passSelectedQuestion.exam,
          subject: passSelectedQuestion.subject,
          topic: passSelectedQuestion.chapter,
          options: passSelectedQuestion.options,
          correctIndex: passSelectedQuestion.correctIndex,
          userSelectedOption: passSelectedOption ?? undefined,
          sourceUrl: passSelectedQuestion.sourceUrl
        })
      });
      const data = await res.json();
      if (data.success && data.solution) {
        setPassSolvingStage(5);
        setPassAiSolution(data);
      }
    } catch (err) {
      console.error("AI Solve error:", err);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setPassAiSolving(false);
    }
  };

  // Fetch NEET data from /api/pyqs/neet
  useEffect(() => {
    let ignore = false;
    async function loadNeetData() {
      setNeetLoading(true);
      try {
        const query = new URLSearchParams({
          subject: neetSubject,
          chapter: neetChapter,
          year: neetYear,
          code: neetCode,
          search: neetSearch,
          page: neetPage.toString(),
          limit: "20",
          view: neetViewMode
        });
        const res = await fetch(`/api/pyqs/neet?${query.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setNeetData(data);
          if (data.questions && data.questions.length > 0) {
            setNeetSelectedQuestion((prev: any) => {
              if (prev && data.questions.some((q: any) => q.id === prev.id)) return prev;
              return data.questions[0];
            });
            setNeetSelectedOption(null);
            setNeetShowExplanation(false);
          } else {
            setNeetSelectedQuestion(null);
          }
        }
      } catch (err) {
        console.error("Failed to load NEET data:", err);
      } finally {
        if (!ignore) setNeetLoading(false);
      }
    }
    loadNeetData();
    return () => { ignore = true; };
  }, [neetSubject, neetChapter, neetYear, neetCode, neetSearch, neetPage, neetViewMode]);

  // Handle solve with Nemotron for NEET question with progressive stages
  const handleSolveNeetQuestion = async () => {
    if (!neetSelectedQuestion) return;
    setNeetAiSolving(true);
    setNeetSolvingStage(1);

    const t1 = setTimeout(() => setNeetSolvingStage(2), 350);
    const t2 = setTimeout(() => setNeetSolvingStage(3), 850);
    const t3 = setTimeout(() => setNeetSolvingStage(4), 1350);

    try {
      const res = await fetch("/api/ai/solve-pyq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: neetSelectedQuestion.id,
          questionText: neetSelectedQuestion.question,
          exam: "NEET",
          subject: neetSelectedQuestion.subject,
          topic: neetSelectedQuestion.chapter,
          options: neetSelectedQuestion.options,
          correctIndex: neetSelectedQuestion.correctIndex,
          userSelectedOption: neetSelectedOption ?? undefined,
          sourceUrl: neetSelectedQuestion.downloadUrl || neetSelectedQuestion.url
        })
      });
      const data = await res.json();
      if (data.success && data.solution) {
        setNeetSolvingStage(5);
        setNeetAiSolution(data);
      }
    } catch (err) {
      console.error("AI Solve NEET error:", err);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setNeetAiSolving(false);
    }
  };

  // =========================================================================
  // 3. CURATED ARCHIVE STATES (Multi-exam bank)
  // =========================================================================
  const [selectedExam, setSelectedExam] = useState<ExamFilter>("JEE Main");
  const [selectedYear, setSelectedYear] = useState<number | "ALL">("ALL");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [activeQuestionId, setActiveQuestionId] = useState<string>("jee-main-pyq-2026-01");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [aiSolving, setAiSolving] = useState<boolean>(false);
  const [curatedSolvingStage, setCuratedSolvingStage] = useState<number>(0);
  const [aiSolution, setAiSolution] = useState<any>(null);
  const [resetting, setResetting] = useState<boolean>(false);

  // =========================================================================
  // 3. JUMBLED EXAM SIMULATOR STATES
  // =========================================================================
  const [activeJumbledPaper, setActiveJumbledPaper] = useState<JumbledExamPaper | null>(null);
  const [jumbledQIndex, setJumbledQIndex] = useState<number>(0);
  const [jumbledAnswers, setJumbledAnswers] = useState<Record<string, number>>({});
  const [jumbledReviews, setJumbledReviews] = useState<Record<string, boolean>>({});
  const [jumbledTimeRemaining, setJumbledTimeRemaining] = useState<number>(1800);
  const [jumbledSubmitted, setJumbledSubmitted] = useState<boolean>(false);
  
  // Custom Paper Generator Controls
  const [genExam, setGenExam] = useState<ExamFilter>("JEE Main");
  const [genCount, setGenCount] = useState<number>(8);
  const [genStartYear, setGenStartYear] = useState<number>(2020);
  const [genEndYear, setGenEndYear] = useState<number>(2026);

  const availableYears = getAvailableYears(); // [2026, 2025, 2024, 2023, 2022, 2021, 2020]

  // Filter curated questions
  const filteredQuestions = PYQ_DATABASE.filter((q) => {
    if (selectedExam !== "ALL" && q.exam !== selectedExam) return false;
    if (selectedYear !== "ALL" && q.year !== selectedYear) return false;
    if (selectedUnit !== "ALL" && q.unit !== selectedUnit) return false;
    if (selectedDifficulty !== "ALL" && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const activeQuestion = 
    filteredQuestions.find((q) => q.id === activeQuestionId) || 
    filteredQuestions[0] || 
    PYQ_DATABASE[0];

  const availableUnits = Array.from(
    new Set(
      PYQ_DATABASE.filter((q) => {
        const matchesExam = selectedExam === "ALL" || q.exam === selectedExam;
        const matchesYear = selectedYear === "ALL" || q.year === selectedYear;
        return matchesExam && matchesYear;
      }).map((q) => q.unit)
    )
  );

  const selectQuestion = (id: string) => {
    setActiveQuestionId(id);
    setSelectedOption(null);
    setIsAnswered(false);
    setAiSolution(null);
    setCuratedSolvingStage(0);
  };

  // Timer effect for jumbled exam simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeJumbledPaper && !jumbledSubmitted && jumbledTimeRemaining > 0) {
      timer = setInterval(() => {
        setJumbledTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setJumbledSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeJumbledPaper, jumbledSubmitted, jumbledTimeRemaining]);

  const handleSelectOption = async (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === activeQuestion.correctIndex;
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "question",
          subject: activeQuestion.subject,
          topic: activeQuestion.chapter,
          isPYQ: true,
          isCorrect,
          timeSpentSeconds: 45
        })
      });
      window.dispatchEvent(new Event("beyond:activity-updated"));
    } catch (e) {
      console.error("Failed to log activity:", e);
    }
  };

  const handleSolveWithNemotron = async () => {
    setAiSolving(true);
    setCuratedSolvingStage(1);

    const t1 = setTimeout(() => setCuratedSolvingStage(2), 350);
    const t2 = setTimeout(() => setCuratedSolvingStage(3), 850);
    const t3 = setTimeout(() => setCuratedSolvingStage(4), 1350);

    try {
      const res = await fetch("/api/ai/solve-pyq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          questionText: activeQuestion.question,
          exam: activeQuestion.exam,
          subject: activeQuestion.subject,
          topic: activeQuestion.chapter,
          options: activeQuestion.options,
          correctIndex: activeQuestion.correctIndex,
          userSelectedOption: selectedOption ?? undefined
        })
      });
      const data = await res.json();
      if (data.success && data.solution) {
        setCuratedSolvingStage(5);
        setAiSolution(data);
      }
    } catch (e) {
      console.error("AI Solve error:", e);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setAiSolving(false);
    }
  };

  const startJumbledExam = (paper: JumbledExamPaper) => {
    setActiveJumbledPaper(paper);
    setJumbledQIndex(0);
    setJumbledAnswers({});
    setJumbledReviews({});
    setJumbledTimeRemaining(paper.durationMinutes * 60);
    setJumbledSubmitted(false);
    setActiveTab("jumbled");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateCustomPaper = () => {
    const paper = generateJumbledExamPaper({
      exam: genExam,
      startYear: genStartYear,
      endYear: genEndYear,
      count: genCount,
      title: `Custom ${genExam === "ALL" ? "Cross-Exam" : genExam} Jumbled Mock (${genStartYear}–${genEndYear})`
    });
    startJumbledExam(paper);
  };

  const calculateJumbledScore = () => {
    if (!activeJumbledPaper) return { score: 0, maxScore: 0, correct: 0, wrong: 0, unattempted: 0 };
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    activeJumbledPaper.questions.forEach((q) => {
      const userAns = jumbledAnswers[q.id];
      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = (correct * activeJumbledPaper.marksPerCorrect) - (wrong * activeJumbledPaper.negativeMarks);
    const maxScore = activeJumbledPaper.questions.length * activeJumbledPaper.marksPerCorrect;

    return { score, maxScore, correct, wrong, unattempted };
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] paper-texture text-[#1A2219]">
      
      {/* Top Breadcrumb Header */}
      <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#D5CFBE] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="p-1.5 rounded-lg bg-[#EFECE3] hover:bg-[#E2DDD0] text-[#283826] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to BEYOND Home</span>
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="font-serif font-bold text-sm text-[#1A2219] hidden sm:inline">
            12thPass AI PYQ Library & Solver
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Navigation Tabs */}
          <div className="bg-[#EAE6DB] p-1 rounded-xl border border-[#D5CFBE] flex items-center gap-1 text-xs font-mono font-bold">
            <button
              onClick={() => {
                setActiveTab("12thpass");
                setActiveJumbledPaper(null);
              }}
              className={`tab-pill px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 ${
                activeTab === "12thpass"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-2xs"
                  : "text-[#556052] hover:text-[#1A2219]"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#B07D4F]" />
              <span>12thPass Mega Dump</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded text-[10px] font-bold">13.8k</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("neet");
                setActiveJumbledPaper(null);
              }}
              className={`tab-pill px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 ${
                activeTab === "neet"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-2xs"
                  : "text-[#556052] hover:text-[#1A2219]"
              }`}
            >
              <span>🧬</span>
              <span>Vedantu NEET</span>
              <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded text-[10px] font-bold">2015–2026</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("archive");
                setActiveJumbledPaper(null);
              }}
              className={`tab-pill px-3 py-1.5 rounded-lg cursor-pointer ${
                activeTab === "archive"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-2xs"
                  : "text-[#556052] hover:text-[#1A2219]"
              }`}
            >
              📚 Curated 2020–2026
            </button>

            <button
              onClick={() => setActiveTab("jumbled")}
              className={`tab-pill px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 ${
                activeTab === "jumbled"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-2xs"
                  : "text-[#556052] hover:text-[#1A2219]"
              }`}
            >
              <Shuffle className="w-3.5 h-3.5 text-[#B07D4F]" />
              <span>Jumbled Papers</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: 12THPASS.AI DUMP (13,805 QUESTIONS SEGREGATED) */}
        {/* ========================================================================= */}
        {activeTab === "12thpass" && (
          <div className="space-y-6 tab-pane-transition">
            
            {/* Banner Area */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#ECE7DC] to-[#E3DEC9] border border-[#D5CFBE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#283826] text-[#F7F5F0] text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Database className="w-3 h-3 text-[#B07D4F]" />
                    12thPass.ai Official Database Dump
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B07D4F] text-white text-[10px] font-mono uppercase font-semibold">
                    13,805 Solved Questions
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white text-[10px] font-mono uppercase font-semibold">
                    Physics • Chemistry • Mathematics
                  </span>
                </div>
                
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A2219]">
                  JEE Main & Advanced Complete PYQ Repository
                </h1>
                
                <p className="text-xs sm:text-sm text-[#556052] max-w-3xl font-sans leading-relaxed">
                  Every single previous year question from <strong>12thPass.ai</strong> segregated by examination (JEE Main & JEE Advanced) and subject (Physics, Chemistry, and Mathematics) across all 84 chapters with session tags, answer keys, and AI derivation.
                </p>
              </div>

              <div className="flex md:flex-col items-start sm:items-end gap-2 shrink-0">
                <div className="text-xs font-mono text-[#283826] bg-white/80 backdrop-blur-xs px-4 py-2 rounded-xl border border-[#D5CFBE] shadow-2xs">
                  JEE Main: <strong>11,645 Questions</strong>
                </div>
                <div className="text-xs font-mono text-[#6C7D64] bg-white/60 px-4 py-1.5 rounded-lg border border-[#D5CFBE]">
                  JEE Advanced: <strong>2,160 Questions</strong>
                </div>
              </div>
            </div>

            {/* Segregation Controls Bar */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D5CFBE] space-y-4 shadow-2xs">
              
              {/* Row 1: Exam Segregation (JEE Main vs JEE Advanced) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E1DDD2]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#556052]">1. Examination:</span>
                  {(["JEE Main", "JEE Advanced"] as const).map((ex) => {
                    const isSelected = passExam === ex;
                    return (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => {
                          setPassExam(ex);
                          setPassChapter("all");
                          setPassPage(1);
                        }}
                        className={`tab-pill px-4 py-2 rounded-xl text-xs font-bold font-mono cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#283826] text-[#F7F5F0] shadow-sm ring-2 ring-[#283826]/30"
                            : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2] border border-[#D5CFBE]"
                        }`}
                      >
                        <span>{ex === "JEE Main" ? "⚡ JEE Main (11.6k)" : "🔥 JEE Advanced (2.1k)"}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Subject Segregation */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#556052]">2. Subject:</span>
                  {(
                    [
                      { id: "Physics", icon: Atom, count: passExam === "JEE Main" ? "4,156" : "732" },
                      { id: "Chemistry", icon: FlaskConical, count: passExam === "JEE Main" ? "3,750" : "717" },
                      { id: "Mathematics", icon: Calculator, count: passExam === "JEE Main" ? "3,739" : "711" }
                    ] as const
                  ).map((s) => {
                    const isSelected = passSubject === s.id;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setPassSubject(s.id);
                          setPassChapter("all");
                          setPassPage(1);
                        }}
                        className={`tab-pill px-3.5 py-2 rounded-xl text-xs font-bold font-mono cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#B07D4F] text-white shadow-2xs"
                            : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2] border border-[#D5CFBE]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{s.id}</span>
                        <span className={`text-[9px] px-1 rounded transition-colors ${isSelected ? "bg-white/20 text-white" : "bg-[#DFD9C7] text-[#556052]"}`}>
                          {s.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Search, Year & Chapter Filter */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* Search input */}
                <div className="md:col-span-4 relative">
                  <Search className="w-4 h-4 text-[#6C7D64] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Search ${passExam} ${passSubject} questions or shifts...`}
                    value={passSearch}
                    onChange={(e) => {
                      setPassSearch(e.target.value);
                      setPassPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D5CFBE] text-xs font-mono text-[#1A2219] focus:outline-none focus:ring-1 focus:ring-[#283826]"
                  />
                </div>

                {/* Chapter Select */}
                <div className="md:col-span-5 flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-[#556052] shrink-0">Chapter:</span>
                  <select
                    value={passChapter}
                    onChange={(e) => {
                      setPassChapter(e.target.value);
                      setPassPage(1);
                    }}
                    className="w-full bg-white border border-[#D5CFBE] rounded-xl p-2 text-xs font-semibold text-[#1A2219] focus:outline-none"
                  >
                    <option value="all">All Chapters ({passData?.chapters?.length || 0} topics)</option>
                    {passData?.chapters?.map((c: any) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.questionCount} Qs)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-[#556052] shrink-0">Year:</span>
                  <select
                    value={passYear}
                    onChange={(e) => {
                      setPassYear(e.target.value);
                      setPassPage(1);
                    }}
                    className="w-full bg-white border border-[#D5CFBE] rounded-xl p-2 text-xs font-semibold text-[#1A2219] focus:outline-none"
                  >
                    <option value="all">All Years (2002–2025)</option>
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                      <option key={y} value={y.toString()}>{y}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Chapters Quick Pills (Top 8 for current subject) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-[#6C7D64] font-bold mr-1">Popular:</span>
                {passData?.chapters?.slice(0, 8).map((c: any) => {
                  const isSelected = passChapter === c.slug;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => {
                        setPassChapter(isSelected ? "all" : c.slug);
                        setPassPage(1);
                      }}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#283826] text-white border-[#283826]"
                          : "bg-white text-[#556052] border-[#D5CFBE] hover:bg-[#F0EDE4]"
                      }`}
                    >
                      {c.name} <span className="text-[9px] opacity-70">({c.questionCount})</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Questions Layout: Left Questions List & Right Question Solver */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Paginated Question List (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl bg-[#FAF8F5] border border-[#D5CFBE] p-4 space-y-3 shadow-2xs max-h-[850px] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-[#E1DDD2]">
                  <span className="text-xs font-mono font-bold uppercase text-[#556052]">
                    Questions Matching: <strong className="text-[#283826]">{passData?.totalMatching?.toLocaleString() || 0}</strong>
                  </span>
                  <span className="text-[11px] font-mono text-[#6C7D64]">
                    Page {passPage} of {passData?.totalPages || 1}
                  </span>
                </div>

                {passLoading ? (
                  <div className="p-12 text-center text-xs font-mono text-[#6C7D64] animate-pulse">
                    Loading questions from 12thPass AI database...
                  </div>
                ) : passData?.questions?.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-[#6C7D64]">
                    No questions found matching this filter criteria.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {passData?.questions?.map((q: any) => {
                      const isActive = passSelectedQuestion?.id === q.id;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setPassSelectedQuestion(q);
                            setPassSelectedOption(null);
                            setPassIsAnswered(false);
                            setPassAiSolution(null);
                            setPassSolvingStage(0);
                          }}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                            isActive
                              ? "bg-[#283826] text-[#F7F5F0] border-[#283826] shadow-md ring-2 ring-[#283826]/30"
                              : "bg-white hover:bg-[#F0EDE4] border-[#E1DDD2] text-[#1A2219]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                              isActive ? "bg-white/20 text-[#F7F5F0]" : "bg-[#EFECE3] text-[#283826]"
                            }`}>
                              {q.sessionLabel}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              q.type === "Numerical" ? "bg-purple-100 text-purple-900" : "bg-blue-100 text-blue-900"
                            }`}>
                              {q.type}
                            </span>
                          </div>

                          <div className="font-serif font-bold text-xs line-clamp-1">
                            {q.chapter}
                          </div>

                          <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                            isActive ? "text-neutral-200" : "text-[#556052]"
                          }`}>
                            {q.question}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {passData?.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-[#E1DDD2]">
                    <button
                      onClick={() => setPassPage((prev) => Math.max(1, prev - 1))}
                      disabled={passPage === 1}
                      className="px-3 py-1.5 rounded-lg bg-[#EFECE3] border border-[#D5CFBE] text-xs font-mono font-bold text-[#283826] disabled:opacity-30 cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    <span className="text-xs font-mono text-[#556052]">
                      {passPage} / {passData.totalPages}
                    </span>

                    <button
                      onClick={() => setPassPage((prev) => Math.min(passData.totalPages, prev + 1))}
                      disabled={passPage >= passData.totalPages}
                      className="px-3 py-1.5 rounded-lg bg-[#283826] text-white text-xs font-mono font-bold disabled:opacity-30 cursor-pointer flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Selected Question & AI Derivation Engine (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {passSelectedQuestion ? (
                  <div className="rounded-2xl bg-[#FAF8F5] border border-[#D5CFBE] p-6 sm:p-8 space-y-6 shadow-xs">
                    
                    {/* Header meta */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E1DDD2]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold font-mono">
                          {passSelectedQuestion.sessionLabel}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-[#EFECE3] border border-[#D5CFBE] text-xs font-semibold text-[#283826]">
                          {passSelectedQuestion.exam} • {passSelectedQuestion.subject}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#EFECE3] border border-[#D5CFBE] text-xs font-mono text-[#556052]">
                          {passSelectedQuestion.chapter}
                        </span>
                      </div>

                      <a
                        href={passSelectedQuestion.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-[#B07D4F] hover:underline flex items-center gap-1"
                      >
                        <span>12thPass Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Question statement */}
                    <div className="p-5 rounded-xl bg-white border border-[#E1DDD2] shadow-2xs space-y-2">
                      <div className="text-[11px] font-mono text-[#6C7D64] uppercase font-bold flex items-center justify-between">
                        <span>Question Statement ({passSelectedQuestion.type})</span>
                        {passSelectedQuestion.year && (
                          <span className="text-amber-800 font-bold">{passSelectedQuestion.year}</span>
                        )}
                      </div>
                      <p className="font-serif text-base sm:text-lg text-[#1A2219] leading-relaxed">
                        {passSelectedQuestion.question}
                      </p>
                    </div>

                    {/* Four Interactive Options */}
                    {passSelectedQuestion.options && passSelectedQuestion.options.length > 0 && (
                      <div className="space-y-3 pt-1">
                        <div className="text-[11px] font-mono text-[#6C7D64] uppercase font-bold flex items-center justify-between">
                          <span>Select Correct Option (+4 / -1 Marking):</span>
                          {passSelectedOption !== null && (
                            <span className={passSelectedOption === passSelectedQuestion.correctIndex ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                              {passSelectedOption === passSelectedQuestion.correctIndex ? "✓ Correct (+4 Marks)" : "✗ Incorrect (-1 Mark)"}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {passSelectedQuestion.options.map((opt: any, idx: number) => {
                            const isChosen = passSelectedOption === idx;
                            const isCorrect = idx === passSelectedQuestion.correctIndex;
                            let style = "bg-white hover:bg-[#F0EDE4] border-[#D5CFBE] text-[#1A2219]";

                            if (passSelectedOption !== null) {
                              if (isCorrect) {
                                style = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-500 shadow-xs";
                              } else if (isChosen) {
                                style = "bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500 shadow-xs";
                              } else {
                                style = "bg-[#FAF8F5] border-[#E1DDD2] text-[#7C8578] opacity-60";
                              }
                            }

                            return (
                              <button
                                key={opt.label || idx}
                                type="button"
                                onClick={() => handleSelectPassOption(idx)}
                                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-sans flex items-start gap-3 transition-all cursor-pointer ${style}`}
                              >
                                <span className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                                  passSelectedOption !== null && isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : passSelectedOption !== null && isChosen
                                    ? "bg-rose-600 text-white"
                                    : "bg-[#EAE6DB] text-[#283826] border border-[#D5CFBE]"
                                }`}>
                                  {opt.label || ["A", "B", "C", "D"][idx]}
                                </span>
                                <span className="leading-snug pt-0.5 flex-1">{opt.text}</span>
                                {passSelectedOption !== null && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 self-center" />
                                )}
                                {passSelectedOption !== null && isChosen && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 self-center" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* GREEN CARD / RED CARD GRADING FEEDBACK */}
                    {passSelectedOption !== null && (
                      <div className="space-y-3">
                        {passSelectedOption === passSelectedQuestion.correctIndex ? (
                          /* GREEN CARD */
                          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/60 border-2 border-emerald-500 shadow-sm animate-in fade-in zoom-in-95 duration-200 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                  <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="font-serif font-bold text-base text-emerald-950 flex items-center gap-2">
                                    <span>CORRECT ANSWER!</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-mono font-bold">
                                      +4 MARKS
                                    </span>
                                  </h4>
                                  <p className="text-xs font-mono text-emerald-700">
                                    Official NTA / Exam Answer Key Verified • Full Accuracy Recorded
                                  </p>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-lg bg-white/90 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold shadow-2xs">
                                Option {passSelectedQuestion.options[passSelectedQuestion.correctIndex]?.label} Confirmed ✓
                              </span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200 text-xs sm:text-sm font-sans text-emerald-950">
                              <div className="font-mono text-[11px] font-bold text-emerald-800 uppercase mb-1">
                                Official Verification Rationale:
                              </div>
                              <p className="leading-relaxed font-serif">
                                {passSelectedQuestion.officialExplanation}
                              </p>
                            </div>

                            {/* Direct Solution Link inside Green Card */}
                            {passSelectedQuestion.directSolutionUrl && (
                              <div className="flex items-center justify-between pt-1 text-xs">
                                <span className="font-mono text-emerald-800 text-[11px]">
                                  Need authoritative external derivation or video?
                                </span>
                                <a
                                  href={passSelectedQuestion.directSolutionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-900 hover:text-emerald-950 font-mono font-bold underline flex items-center gap-1"
                                >
                                  <span>Direct Solution Link</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* RED CARD */
                          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-red-50/50 to-rose-100/60 border-2 border-rose-500 shadow-sm animate-in fade-in zoom-in-95 duration-200 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                                  <XCircle className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
                                    <span>INCORRECT ATTEMPT!</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-700 text-white text-[11px] font-mono font-bold">
                                      -1 NEGATIVE MARK
                                    </span>
                                  </h4>
                                  <p className="text-xs font-mono text-rose-700">
                                    Penalty Applied as per NTA Marking Scheme • Review Traps Below
                                  </p>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-lg bg-white/90 border border-rose-300 text-rose-900 text-xs font-mono font-bold shadow-2xs">
                                Negative Mark Incurred
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="p-3 rounded-xl bg-white/90 border border-rose-300 text-xs font-sans text-rose-950">
                                <span className="text-rose-600 font-mono font-bold text-[11px] uppercase block mb-1">
                                  ✗ Your Selection:
                                </span>
                                <div className="font-bold">
                                  Option {passSelectedQuestion.options[passSelectedOption]?.label}: {passSelectedQuestion.options[passSelectedOption]?.text}
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 text-xs font-sans text-emerald-950">
                                <span className="text-emerald-700 font-mono font-bold text-[11px] uppercase block mb-1">
                                  ✓ Official Correct Key:
                                </span>
                                <div className="font-bold">
                                  Option {passSelectedQuestion.options[passSelectedQuestion.correctIndex]?.label}: {passSelectedQuestion.options[passSelectedQuestion.correctIndex]?.text}
                                </div>
                              </div>
                            </div>

                            {/* Common Trap Alert */}
                            <div className="p-3.5 rounded-xl bg-white/90 border border-rose-200 text-xs sm:text-sm font-sans text-rose-950">
                              <div className="font-mono text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1.5 mb-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Negative Marking Trap Analysis:</span>
                              </div>
                              <p className="leading-relaxed">
                                {passSelectedQuestion.commonTrap || passSelectedQuestion.officialExplanation}
                              </p>
                            </div>

                            {/* Direct Solution Link inside Red Card */}
                            {passSelectedQuestion.directSolutionUrl && (
                              <div className="flex items-center justify-between pt-1 text-xs">
                                <span className="font-mono text-rose-800 text-[11px]">
                                  Review verified answer & step-by-step resolution:
                                </span>
                                <a
                                  href={passSelectedQuestion.directSolutionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-rose-900 hover:text-rose-950 font-mono font-bold underline flex items-center gap-1"
                                >
                                  <span>Direct Solution Link</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Solve Action Bar with Direct Link Fallback (Gated until user attempts question) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E1DDD2]">
                      <div className="flex items-center gap-2">
                        {passSelectedOption === null ? (
                          <span className="text-xs font-mono text-[#7C8578] flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            <span>Select your answer above first to unlock AI step-by-step derivation</span>
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-[#556052]">
                            Need deep mathematical proof or step-by-step derivation?
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {passSelectedOption !== null && passSelectedQuestion.directSolutionUrl && (
                          <a
                            href={passSelectedQuestion.directSolutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2.5 rounded-xl bg-[#EFECE3] hover:bg-[#E5E0D2] border border-[#D5CFBE] text-[#283826] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Open direct authoritative solution on 12thPass/Google"
                          >
                            <span>Direct Solution Link</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#B07D4F]" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (passSelectedOption === null) {
                              alert("Please choose an answer (A, B, C, or D) first to test your understanding!");
                              return;
                            }
                            handleSolvePassQuestion();
                          }}
                          disabled={passAiSolving}
                          className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group ${
                            passSelectedOption === null
                              ? "bg-[#EAE6DB] border border-[#D5CFBE] text-[#6C7D64] hover:bg-[#E1DDD2]"
                              : "bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0]"
                          }`}
                        >
                          <Sparkles className={`w-4 h-4 transition-transform ${passSelectedOption !== null ? "text-[#B07D4F] group-hover:rotate-12" : "text-[#8C9886]"}`} />
                          <span>
                            {passAiSolving 
                              ? "Nemotron Ultra Deriving..." 
                              : passSelectedOption === null 
                              ? "Answer above first" 
                              : "Solve with Nemotron Ultra AI"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Real-Time Progressive Stages during AI solving */}
                    {passAiSolving && (
                      <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#D5CFBE] space-y-3 animate-pulse">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#283826]">
                          <span className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-[#B07D4F] animate-spin" />
                            <span>NVIDIA Nemotron Ultra Live Reasoning Engine...</span>
                          </span>
                          <span className="text-[11px] text-[#B07D4F] font-semibold">
                            {passSolvingStage === 1 && "Stage 1/4: Analyzing Parameters..."}
                            {passSolvingStage === 2 && "Stage 2/4: Formulating Laws..."}
                            {passSolvingStage === 3 && "Stage 3/4: Mathematical Derivation..."}
                            {passSolvingStage >= 4 && "Stage 4/4: Distractor Elimination..."}
                          </span>
                        </div>
                        <div className="w-full bg-[#E5E0D3] h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#B07D4F] to-[#283826] h-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(20, passSolvingStage * 25))}%` }}
                          />
                        </div>
                        <p className="text-[11px] font-mono text-[#556052]">
                          {passSolvingStage === 1 && "Ingesting question stem, physical invariants, and boundary conditions..."}
                          {passSolvingStage === 2 && "Formulating first-principles equations and conservation laws without hallucination..."}
                          {passSolvingStage === 3 && "Executing multi-step algebra and calculating exact value for candidate options..."}
                          {passSolvingStage >= 4 && "Cross-referencing verified answer key and preparing 60s speed hack..."}
                        </p>
                      </div>
                    )}

                    {/* Nemotron Solution Box */}
                    {passAiSolution && (
                      <div className="rounded-2xl bg-[#FAF8F5] border-2 border-[#283826] p-6 space-y-5 shadow-md animate-in fade-in duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5CFBE]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#283826] text-white flex items-center justify-center">
                              <Bot className="w-5 h-5 text-[#C8A95B]" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-base text-[#1A2219]">
                                NVIDIA Nemotron Ultra Academic Derivation
                              </h3>
                              <p className="text-[10px] font-mono text-[#6C7D64]">
                                {passAiSolution.model} • Latency: {passAiSolution.latencyMs}ms
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                            ✓ Step-by-Step Proof
                          </span>
                        </div>

                        {/* Direct Solution Fallback Banner */}
                        {passAiSolution.directSolutionUrl && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="text-xs font-mono font-bold text-amber-950 flex items-center gap-1.5">
                                <span>🔗 Direct Solution Link (Official & Video Verification):</span>
                              </div>
                              <p className="text-[11px] text-amber-900 font-sans">
                                Cross-verify with original exam portal, official answer keys, or watch video solutions.
                              </p>
                            </div>

                            <a
                              href={passAiSolution.directSolutionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl bg-[#283826] hover:bg-[#364A33] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                            >
                              <span>Open Direct Solution</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {/* Principles */}
                        {passAiSolution.solution.governingPrinciples && (
                          <div className="space-y-1.5">
                            <span className="text-xs font-mono font-bold uppercase text-[#556052]">Governing Principles:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {passAiSolution.solution.governingPrinciples.map((p: string, i: number) => (
                                <span key={i} className="px-2.5 py-0.5 rounded bg-white border border-[#D5CFBE] text-xs font-mono text-[#283826] font-semibold">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Numbered Step-by-Step Derivation Cards */}
                        <div className="space-y-2.5">
                          <span className="text-xs font-mono font-bold uppercase text-[#556052] flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#B07D4F]" />
                            <span>Real-Time Step-by-Step Derivation Process:</span>
                          </span>

                          {passAiSolution.solution.steps && passAiSolution.solution.steps.length > 0 ? (
                            <div className="space-y-2">
                              {passAiSolution.solution.steps.map((step: any, sIdx: number) => (
                                <div key={sIdx} className="p-3.5 rounded-xl bg-white border border-[#E1DDD2] shadow-2xs space-y-1">
                                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#283826]">
                                    <span className="w-5 h-5 rounded-full bg-[#EAE6DB] text-[#283826] flex items-center justify-center text-[11px]">
                                      {step.stepNumber || sIdx + 1}
                                    </span>
                                    <span>{step.title}</span>
                                  </div>
                                  <p className="text-xs font-serif text-[#1A2219] leading-relaxed pl-7">
                                    {step.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-white border border-[#E1DDD2] text-xs sm:text-sm font-serif text-[#1A2219] leading-relaxed">
                              {passAiSolution.solution.stepByStepDerivation}
                            </div>
                          )}
                        </div>

                        {/* Speed Hack */}
                        {passAiSolution.solution.speedHack && (
                          <div className="p-3.5 rounded-xl bg-[#FAF3E8] border border-[#E5D2BA] space-y-1">
                            <span className="text-[11px] font-mono font-bold text-[#8A5B2F] uppercase flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5" />
                              60s Competitive Shortcut:
                            </span>
                            <p className="text-xs text-[#52371E] font-sans">
                              {passAiSolution.solution.speedHack}
                            </p>
                          </div>
                        )}

                        {/* Traps */}
                        {passAiSolution.solution.commonTraps && (
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
                            <span className="text-[11px] font-mono font-bold text-amber-900 uppercase flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Negative Marking Trap:
                            </span>
                            <p className="text-xs text-amber-950 font-sans">
                              {passAiSolution.solution.commonTraps}
                            </p>
                          </div>
                        )}

                        {passAiSolution.solution.correctOption && (
                          <div className="p-3 rounded-xl bg-[#EFECE3] border border-[#D5CFBE] flex items-center justify-between text-xs font-mono font-bold text-[#283826]">
                            <span>Final Answer Key:</span>
                            <span className="px-2.5 py-0.5 rounded bg-[#283826] text-white">
                              {passAiSolution.solution.correctOption}
                            </span>
                          </div>
                        )}

                        {/* Alternative Outbound Verification Links */}
                        {passAiSolution.directLinks && passAiSolution.directLinks.length > 0 && (
                          <div className="pt-2 border-t border-[#E1DDD2] space-y-1.5">
                            <span className="text-[11px] font-mono text-[#6C7D64] uppercase font-bold">
                              External Verification & Video Archives:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {passAiSolution.directLinks.map((link: any, lIdx: number) => (
                                <a
                                  key={lIdx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white hover:bg-[#EFECE3] border border-[#D5CFBE] text-[#283826] flex items-center gap-1 transition-colors"
                                >
                                  <span>{link.label}</span>
                                  <ExternalLink className="w-3 h-3 text-[#B07D4F]" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-12 text-center text-xs font-mono text-[#6C7D64] bg-[#FAF8F5] rounded-2xl border border-[#D5CFBE]">
                    Select any question from the list on the left to view statement and solve.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VEDANTU NEET ARCHIVE (2015–2026 SEGREGATED REPOSITORY) */}
        {/* ========================================================================= */}
        {activeTab === "neet" && (
          <div className="space-y-6 tab-pane-transition">
            
            {/* Banner Area */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#E8F0E6] to-[#DDE8DA] border border-[#C5D6C2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1E3A20] text-[#F7F5F0] text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1">
                    <span>🧬</span>
                    Vedantu NEET Official Archives
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-mono uppercase font-semibold">
                    2015–2026 National Papers
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B07D4F] text-white text-[10px] font-mono uppercase font-semibold">
                    Physics • Chemistry • Biology (Botany & Zoology)
                  </span>
                </div>
                
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142616]">
                  NEET-UG Previous Year Question Papers & Questions
                </h1>
                
                <p className="text-xs sm:text-sm text-[#465E44] max-w-3xl font-sans leading-relaxed">
                  Every official paper, question, and answer key from <strong>Vedantu NEET Archives</strong> (2015 to 2026) segregated into Physics, Chemistry, and Biology (with dedicated Botany and Zoology streams) across all 88 NCERT chapters with instant AI clinical derivations.
                </p>
              </div>

              {/* Top View Mode Switcher & Stats */}
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-[#C5D6C2] shadow-2xs text-xs font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => setNeetViewMode("questions")}
                    className={`tab-pill px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 ${
                      neetViewMode === "questions"
                        ? "bg-[#1E3A20] text-white shadow-2xs"
                        : "text-[#465E44] hover:text-[#142616]"
                    }`}
                  >
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Questions ({neetData?.totalMatching || 115})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeetViewMode("papers")}
                    className={`tab-pill px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 ${
                      neetViewMode === "papers"
                        ? "bg-[#1E3A20] text-white shadow-2xs"
                        : "text-[#465E44] hover:text-[#142616]"
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Official Papers (74)</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#465E44] bg-white/60 px-3 py-1 rounded-lg border border-[#C5D6C2]">
                  720 Marks • 180 Qs per Mock • NCERT Verified
                </div>
              </div>
            </div>

            {/* Controls Bar: Subject Segregation & Filters */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D5CFBE] space-y-4 shadow-2xs">
              
              {/* Row 1: Subject Segregation Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E1DDD2]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#556052]">1. Subject Segregation:</span>
                  <span className="text-[11px] font-sans text-[#6C7D64] hidden sm:inline">(Cleanly segregated as per NTA NEET & Vedantu pattern)</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: "Physics", label: "Physics", icon: Atom, count: neetData?.counts?.Physics ?? 34, color: "text-blue-600" },
                      { id: "Chemistry", label: "Chemistry", icon: FlaskConical, count: neetData?.counts?.Chemistry ?? 36, color: "text-amber-600" },
                      { id: "Biology", label: "Biology (All)", icon: Sparkles, count: neetData?.counts?.BiologyTotal ?? 45, color: "text-emerald-700" },
                      { id: "Botany", label: "Botany", icon: Layers, count: neetData?.counts?.Botany ?? 25, color: "text-emerald-600" },
                      { id: "Zoology", label: "Zoology", icon: Compass, count: neetData?.counts?.Zoology ?? 20, color: "text-teal-600" }
                    ] as const
                  ).map((sub) => {
                    const Icon = sub.icon;
                    const isActive = neetSubject === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setNeetSubject(sub.id);
                          setNeetChapter("all");
                          setNeetPage(1);
                        }}
                        className={`tab-pill px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? "bg-[#1E3A20] text-white shadow-2xs ring-2 ring-[#1E3A20]/20"
                            : "bg-white text-[#556052] border border-[#D5CFBE] hover:border-[#1E3A20] hover:text-[#1E3A20]"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C8A95B]" : sub.color}`} />
                        <span>{sub.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                          isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                        }`}>
                          {sub.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Secondary Filters (Year, Paper Code, Search) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#556052]">2. Year & Code:</span>

                  {/* Year Dropdown */}
                  <select
                    value={neetYear}
                    onChange={(e) => {
                      setNeetYear(e.target.value);
                      setNeetPage(1);
                    }}
                    aria-label="Filter NEET by year"
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#D5CFBE] text-xs font-mono text-[#283826] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A20] cursor-pointer"
                  >
                    <option value="all">All Years (2015–2026)</option>
                    <option value="2026">2026 (Re-NEET & Regular)</option>
                    <option value="2025">2025 National Paper</option>
                    <option value="2024">2024 National Paper</option>
                    <option value="2023">2023 National Paper</option>
                    <option value="2022">2022 National Paper</option>
                    <option value="2021">2021 (Code O1)</option>
                    <option value="2020">2020 (Code F1)</option>
                    <option value="2019">2019 (Codes P1–S2)</option>
                    <option value="2018">2018 (Codes AA–NN)</option>
                    <option value="2017">2017 (Codes A–S)</option>
                    <option value="2016">2016 (Phase 1 & 2)</option>
                    <option value="2015">2015 (Codes A–D)</option>
                  </select>

                  {/* Paper Code Quick Pills */}
                  <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono">
                    {["all", "Code F1", "Code Q1", "Code R1", "Code E1", "Code O1", "Re-NEET"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setNeetCode(c);
                          setNeetPage(1);
                        }}
                        className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          neetCode === c
                            ? "bg-[#1E3A20] text-white font-bold"
                            : "bg-white text-[#556052] border border-[#E1DDD2] hover:bg-[#EFECE3]"
                        }`}
                      >
                        {c === "all" ? "All Codes" : c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Box */}
                <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6C7D64]" />
                  <input
                    type="text"
                    value={neetSearch}
                    onChange={(e) => {
                      setNeetSearch(e.target.value);
                      setNeetPage(1);
                    }}
                    placeholder="Search question, keyword, or chapter..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#D5CFBE] text-xs font-sans text-[#1A2219] placeholder-[#6C7D64] focus:outline-none focus:ring-2 focus:ring-[#1E3A20]"
                  />
                  {neetSearch && (
                    <button
                      type="button"
                      onClick={() => setNeetSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 hover:text-neutral-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Row 3: Chapter Explorer Pills (All 88 Chapters) */}
              <div className="pt-2 border-t border-[#E1DDD2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#556052] flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-[#1E3A20]" />
                    <span>NCERT Chapter Selection ({neetData?.chapters?.length || 88} Topics):</span>
                  </span>
                  {neetChapter !== "all" && (
                    <button
                      type="button"
                      onClick={() => {
                        setNeetChapter("all");
                        setNeetPage(1);
                      }}
                      className="text-[10px] font-mono text-[#B07D4F] hover:underline font-bold"
                    >
                      Clear Chapter Filter
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => {
                      setNeetChapter("all");
                      setNeetPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      neetChapter === "all"
                        ? "bg-[#1E3A20] text-white shadow-2xs"
                        : "bg-white text-[#556052] border border-[#D5CFBE] hover:bg-[#EFECE3]"
                    }`}
                  >
                    All Chapters
                  </button>

                  {neetData?.chapters?.map((chap: any) => {
                    const isSelected = neetChapter.toLowerCase() === chap.name.toLowerCase();
                    return (
                      <button
                        key={chap.id}
                        type="button"
                        onClick={() => {
                          setNeetChapter(chap.name);
                          setNeetPage(1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#1E3A20] text-white font-bold shadow-2xs"
                            : "bg-white text-[#556052] border border-[#D5CFBE] hover:bg-[#EFECE3]"
                        }`}
                      >
                        <span>{chap.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"
                        }`}>
                          {chap.weightage}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ===================================================================== */}
            {/* VIEW MODE 1: QUESTIONS BROWSER */}
            {/* ===================================================================== */}
            {neetViewMode === "questions" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Question Cards List (5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  
                  {/* Status header */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-mono text-[#556052]">
                      Showing <strong>{neetData?.questions?.length || 0}</strong> of <strong>{neetData?.totalMatching || 0}</strong> questions
                    </span>
                    <span className="text-[11px] font-mono text-[#6C7D64]">
                      Page {neetPage} of {neetData?.totalPages || 1}
                    </span>
                  </div>

                  {/* Loading Spinner */}
                  {neetLoading && (
                    <div className="p-8 text-center bg-white rounded-2xl border border-[#D5CFBE] space-y-2">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E3A20]"></div>
                      <p className="text-xs font-mono text-[#6C7D64]">Filtering NEET questions...</p>
                    </div>
                  )}

                  {/* Empty state */}
                  {!neetLoading && (!neetData?.questions || neetData.questions.length === 0) && (
                    <div className="p-8 text-center bg-white rounded-2xl border border-[#D5CFBE] space-y-2">
                      <p className="text-xs font-mono text-[#6C7D64]">No questions match the current filters.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setNeetChapter("all");
                          setNeetYear("all");
                          setNeetCode("all");
                          setNeetSearch("");
                        }}
                        className="text-xs font-mono font-bold text-[#1E3A20] hover:underline"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}

                  {/* Questions List */}
                  {!neetLoading && neetData?.questions?.map((q: any, idx: number) => {
                    const isSelected = neetSelectedQuestion?.id === q.id;
                    return (
                      <div
                        key={q.id}
                        onClick={() => {
                          setNeetSelectedQuestion(q);
                          setNeetSelectedOption(null);
                          setNeetShowExplanation(false);
                          setNeetAiSolution(null);
                        }}
                        className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-white border-[#1E3A20] ring-2 ring-[#1E3A20]/20 shadow-md"
                            : "bg-[#FAF8F5] border-[#E1DDD2] hover:bg-white hover:border-[#C5D6C2] shadow-2xs"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold">
                            {q.yearLabel}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-mono">
                            {q.difficulty}
                          </span>
                        </div>

                        <p className="text-xs font-sans text-[#1A2219] line-clamp-2 leading-relaxed font-medium">
                          {q.question}
                        </p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[#6C7D64] mt-2 pt-2 border-t border-[#EFECE3]">
                          <span className="truncate max-w-[220px]">
                            {q.chapter}
                          </span>
                          <span className="text-[#1E3A20] font-bold shrink-0">
                            {isSelected ? "Active ✓" : "View →"}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination Bar */}
                  {neetData?.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2 px-1">
                      <button
                        type="button"
                        disabled={neetPage <= 1}
                        onClick={() => setNeetPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#D5CFBE] text-xs font-mono font-bold text-[#1E3A20] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EFECE3] cursor-pointer"
                      >
                        ← Prev
                      </button>
                      <span className="text-xs font-mono text-[#556052]">
                        {neetPage} / {neetData.totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={neetPage >= neetData.totalPages}
                        onClick={() => setNeetPage(p => Math.min(neetData.totalPages, p + 1))}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#D5CFBE] text-xs font-mono font-bold text-[#1E3A20] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EFECE3] cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  )}

                </div>

                {/* Right Column: Selected Question & AI Derivation (7 Cols) */}
                <div className="lg:col-span-7 sticky top-20">
                  {neetSelectedQuestion ? (
                    <div className="p-6 rounded-3xl bg-white border border-[#D5CFBE] shadow-md space-y-6">
                      
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E1DDD2]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#1E3A20] text-white text-[11px] font-mono font-bold">
                              {neetSelectedQuestion.yearLabel}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-mono font-bold">
                              {neetSelectedQuestion.subject}
                            </span>
                            <span className="text-xs font-mono text-[#6C7D64]">
                              {neetSelectedQuestion.paperCode}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-[#283826] font-semibold">
                            Chapter: {neetSelectedQuestion.chapter} ({neetSelectedQuestion.unit})
                          </div>
                        </div>

                        {neetSelectedQuestion.ncertRef && (
                          <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900">
                            📖 {neetSelectedQuestion.ncertRef}
                          </span>
                        )}
                      </div>

                      {/* Question statement */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-[#6C7D64] uppercase font-bold">
                          Question Statement:
                        </div>
                        <p className="font-serif text-base sm:text-lg text-[#1A2219] leading-relaxed">
                          {neetSelectedQuestion.question}
                        </p>
                      </div>

                      {/* Multiple Choice Options */}
                      <div className="space-y-2 pt-2">
                        <div className="text-[11px] font-mono text-[#6C7D64] uppercase font-bold flex items-center justify-between">
                          <span>Select Your Answer (+4 / -1 Marking):</span>
                          {neetSelectedOption !== null && (
                            <span className={neetSelectedOption === neetSelectedQuestion.correctIndex ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                              {neetSelectedOption === neetSelectedQuestion.correctIndex ? "✓ Correct (+4 Marks)" : "✗ Incorrect (-1 Mark)"}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {neetSelectedQuestion.options?.map((opt: any, idx: number) => {
                            const isChosen = neetSelectedOption === idx;
                            const isCorrect = idx === neetSelectedQuestion.correctIndex;
                            let style = "bg-[#FAF8F5] border-[#E1DDD2] text-[#1A2219] hover:bg-[#EFECE3]";
                            
                            if (neetSelectedOption !== null) {
                              if (isCorrect) {
                                style = "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-2 ring-emerald-500 shadow-xs";
                              } else if (isChosen) {
                                style = "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500 shadow-xs";
                              } else {
                                style = "bg-[#FAF8F5] border-[#E1DDD2] text-neutral-400 opacity-60";
                              }
                            }

                            return (
                              <button
                                key={opt.label || idx}
                                type="button"
                                onClick={() => setNeetSelectedOption(idx)}
                                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-sans flex items-start gap-3 transition-all cursor-pointer ${style}`}
                              >
                                <span className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                                  neetSelectedOption !== null && isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : neetSelectedOption !== null && isChosen
                                    ? "bg-rose-600 text-white"
                                    : "bg-white border border-neutral-300 text-neutral-800"
                                }`}>
                                  {opt.label || ["A", "B", "C", "D"][idx]}
                                </span>
                                <span className="leading-snug pt-0.5 flex-1">{opt.text}</span>
                                {neetSelectedOption !== null && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 self-center" />
                                )}
                                {neetSelectedOption !== null && isChosen && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 self-center" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* GREEN CARD / RED CARD FEEDBACK FOR NEET */}
                      {neetSelectedOption !== null && (
                        <div className="space-y-3">
                          {neetSelectedOption === neetSelectedQuestion.correctIndex ? (
                            /* GREEN CARD */
                            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/60 border-2 border-emerald-500 shadow-sm animate-in fade-in zoom-in-95 duration-200 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                                    <CheckCircle2 className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h4 className="font-serif font-bold text-base text-emerald-950 flex items-center gap-2">
                                      <span>CORRECT ANSWER!</span>
                                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-mono font-bold">
                                        +4 MARKS
                                      </span>
                                    </h4>
                                    <p className="text-xs font-mono text-emerald-700">
                                      Official NEET-UG Answer Key Verified • Full Accuracy Recorded
                                    </p>
                                  </div>
                                </div>
                                <span className="px-3 py-1 rounded-lg bg-white/90 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold shadow-2xs">
                                  Option {neetSelectedQuestion.options[neetSelectedQuestion.correctIndex]?.label} Confirmed ✓
                                </span>
                              </div>

                              <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200 text-xs sm:text-sm font-sans text-emerald-950">
                                <div className="font-mono text-[11px] font-bold text-emerald-800 uppercase mb-1">
                                  Official NCERT Solution:
                                </div>
                                <p className="leading-relaxed font-serif">
                                  {neetSelectedQuestion.officialExplanation}
                                </p>
                              </div>

                              {/* Direct Solution Link in Green Card */}
                              {(neetSelectedQuestion.downloadUrl || neetSelectedQuestion.url) && (
                                <div className="flex items-center justify-between pt-1 text-xs">
                                  <span className="font-mono text-emerald-800 text-[11px]">
                                    Want to open official Vedantu paper & video solution?
                                  </span>
                                  <a
                                    href={neetSelectedQuestion.downloadUrl || neetSelectedQuestion.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-900 hover:text-emerald-950 font-mono font-bold underline flex items-center gap-1"
                                  >
                                    <span>Direct Solution Link</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* RED CARD */
                            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-red-50/50 to-rose-100/60 border-2 border-rose-500 shadow-sm animate-in fade-in zoom-in-95 duration-200 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                                    <XCircle className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h4 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
                                      <span>INCORRECT ATTEMPT!</span>
                                      <span className="px-2.5 py-0.5 rounded-full bg-rose-700 text-white text-[11px] font-mono font-bold">
                                        -1 NEGATIVE MARK
                                      </span>
                                    </h4>
                                    <p className="text-xs font-mono text-rose-700">
                                      Penalty Applied as per NEET-UG Marking Scheme • Review Traps Below
                                    </p>
                                  </div>
                                </div>
                                <span className="px-3 py-1 rounded-lg bg-white/90 border border-rose-300 text-rose-900 text-xs font-mono font-bold shadow-2xs">
                                  Negative Mark Incurred
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div className="p-3 rounded-xl bg-white/90 border border-rose-300 text-xs font-sans text-rose-950">
                                  <span className="text-rose-600 font-mono font-bold text-[11px] uppercase block mb-1">
                                    ✗ Your Selection:
                                  </span>
                                  <div className="font-bold">
                                    Option {neetSelectedQuestion.options[neetSelectedOption]?.label}: {neetSelectedQuestion.options[neetSelectedOption]?.text}
                                  </div>
                                </div>

                                <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 text-xs font-sans text-emerald-950">
                                  <span className="text-emerald-700 font-mono font-bold text-[11px] uppercase block mb-1">
                                    ✓ Official Correct Key:
                                  </span>
                                  <div className="font-bold">
                                    Option {neetSelectedQuestion.options[neetSelectedQuestion.correctIndex]?.label}: {neetSelectedQuestion.options[neetSelectedQuestion.correctIndex]?.text}
                                  </div>
                                </div>
                              </div>

                              {/* Common Trap Alert */}
                              <div className="p-3.5 rounded-xl bg-white/90 border border-rose-200 text-xs sm:text-sm font-sans text-rose-950">
                                <div className="font-mono text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1.5 mb-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Negative Marking Trap Analysis:</span>
                                </div>
                                <p className="leading-relaxed">
                                  {neetSelectedQuestion.commonTrap || neetSelectedQuestion.officialExplanation}
                                </p>
                              </div>

                              {/* Direct Solution Link in Red Card */}
                              {(neetSelectedQuestion.downloadUrl || neetSelectedQuestion.url) && (
                                <div className="flex items-center justify-between pt-1 text-xs">
                                  <span className="font-mono text-rose-800 text-[11px]">
                                    Review verified answer & step-by-step resolution:
                                  </span>
                                  <a
                                    href={neetSelectedQuestion.downloadUrl || neetSelectedQuestion.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-rose-900 hover:text-rose-950 font-mono font-bold underline flex items-center gap-1"
                                  >
                                    <span>Direct Solution Link</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Official Explanation Toggle & Speed Hacks (Gated until user answers) */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          {neetSelectedOption !== null ? (
                            <button
                              type="button"
                              onClick={() => setNeetShowExplanation(!neetShowExplanation)}
                              className="text-xs font-mono font-bold text-[#1E3A20] hover:underline flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{neetShowExplanation ? "Hide Official Explanation" : "View Official Step-by-Step Explanation"}</span>
                              <span>{neetShowExplanation ? "▲" : "▼"}</span>
                            </button>
                          ) : (
                            <span className="text-xs font-mono text-[#7C8578] flex items-center gap-1.5 font-medium">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                              <span>Select an option above to test your knowledge & unlock explanation</span>
                            </span>
                          )}

                          {neetSelectedQuestion.speedHack && neetSelectedOption !== null && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                              ⚡ 30s Speed Hack
                            </span>
                          )}
                        </div>

                        {neetSelectedOption !== null && neetShowExplanation && (
                          <div className="p-4 rounded-2xl bg-[#F4F8F3] border border-[#C5D6C2] space-y-3 text-xs font-sans text-[#142616] animate-in fade-in duration-200">
                            <div>
                              <strong className="font-mono text-[11px] uppercase text-[#1E3A20] block mb-1">Official Solution:</strong>
                              <p className="leading-relaxed">{neetSelectedQuestion.officialExplanation}</p>
                            </div>

                            {neetSelectedQuestion.speedHack && (
                              <div className="p-2.5 rounded-xl bg-white border border-[#C5D6C2] text-amber-900 font-mono text-[11px]">
                                <strong>⚡ Speed Hack:</strong> {neetSelectedQuestion.speedHack}
                              </div>
                            )}

                            {neetSelectedQuestion.commonTrap && (
                              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-mono text-[11px]">
                                <strong>⚠️ Common Trap:</strong> {neetSelectedQuestion.commonTrap}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* AI Derivation Action Button with Direct Link Fallback (Gated until user attempts question) */}
                      <div className="pt-2 border-t border-[#E1DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs font-mono text-[#556052]">
                          {neetSelectedOption === null 
                            ? "Attempt the question first to unlock AI clinical proof" 
                            : "Need deep clinical and conceptual proof?"}
                        </span>

                        <div className="flex items-center gap-2">
                          {neetSelectedOption !== null && (neetSelectedQuestion.downloadUrl || neetSelectedQuestion.url) && (
                            <a
                              href={neetSelectedQuestion.downloadUrl || neetSelectedQuestion.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2.5 rounded-xl bg-[#EFECE3] hover:bg-[#E5E0D2] border border-[#D5CFBE] text-[#1E3A20] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Open direct authoritative solution on Vedantu/Google"
                            >
                              <span>Direct Solution Link</span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#B07D4F]" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (neetSelectedOption === null) {
                                alert("Please choose an answer (A, B, C, or D) first to test yourself!");
                                return;
                              }
                              handleSolveNeetQuestion();
                            }}
                            disabled={neetAiSolving}
                            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group ${
                              neetSelectedOption === null
                                ? "bg-[#EAE6DB] border border-[#D5CFBE] text-[#6C7D64] hover:bg-[#E1DDD2]"
                                : "bg-[#1E3A20] hover:bg-[#284E2A] text-white"
                            }`}
                          >
                            <Sparkles className={`w-4 h-4 transition-transform ${neetSelectedOption !== null ? "text-[#C8A95B] group-hover:rotate-12" : "text-[#8C9886]"}`} />
                            <span>
                              {neetAiSolving 
                                ? "Nemotron Ultra Reasoning..." 
                                : neetSelectedOption === null 
                                ? "Answer above first" 
                                : "Derive with Nemotron Ultra AI"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Real-Time Progressive Stages during NEET AI solving */}
                      {neetAiSolving && (
                        <div className="p-5 rounded-2xl bg-[#F0F5EE] border border-[#C5D6C2] space-y-3 animate-pulse">
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1E3A20]">
                            <span className="flex items-center gap-2">
                              <Bot className="w-4 h-4 text-[#B07D4F] animate-spin" />
                              <span>NVIDIA Nemotron Ultra NEET Medical Reasoning...</span>
                            </span>
                            <span className="text-[11px] text-[#1E3A20] font-semibold">
                              {neetSolvingStage === 1 && "Stage 1/4: Analyzing Parameters..."}
                              {neetSolvingStage === 2 && "Stage 2/4: Formulating NCERT Laws..."}
                              {neetSolvingStage === 3 && "Stage 3/4: Mathematical Derivation..."}
                              {neetSolvingStage >= 4 && "Stage 4/4: Distractor Elimination..."}
                            </span>
                          </div>
                          <div className="w-full bg-[#DCE7D9] h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#B07D4F] to-[#1E3A20] h-full transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.max(20, neetSolvingStage * 25))}%` }}
                            />
                          </div>
                          <p className="text-[11px] font-mono text-[#556052]">
                            {neetSolvingStage === 1 && "Ingesting question stem, clinical parameters, and boundary conditions..."}
                            {neetSolvingStage === 2 && "Grounding theoretical concepts strictly in NCERT Biology/Chemistry/Physics curricula..."}
                            {neetSolvingStage === 3 && "Executing algebraic calculations and clinical mechanism deduction..."}
                            {neetSolvingStage >= 4 && "Cross-referencing verified NEET answer key and preparing 30s shortcut..."}
                          </p>
                        </div>
                      )}

                      {/* Nemotron Solution Box */}
                      {neetAiSolution && (
                        <div className="rounded-2xl bg-[#FAF8F5] border-2 border-[#1E3A20] p-6 space-y-5 shadow-md animate-in fade-in duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5CFBE]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#1E3A20] text-white flex items-center justify-center">
                                <Bot className="w-5 h-5 text-[#C8A95B]" />
                              </div>
                              <div>
                                <h3 className="font-serif font-bold text-base text-[#1A2219]">
                                  NVIDIA Nemotron Ultra NEET Medical Reasoning
                                </h3>
                                <p className="text-[10px] font-mono text-[#6C7D64]">
                                  {neetAiSolution.model} • Latency: {neetAiSolution.latencyMs}ms
                                </p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                              ✓ NCERT Verified Core
                            </span>
                          </div>

                          {/* Direct Solution Fallback Banner */}
                          {neetAiSolution.directSolutionUrl && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-0.5">
                                <div className="text-xs font-mono font-bold text-amber-950 flex items-center gap-1.5">
                                  <span>🔗 Direct Solution Link (Official & Video Verification):</span>
                                </div>
                                <p className="text-[11px] text-amber-900 font-sans">
                                  Cross-verify with original exam portal, official answer keys, or watch video solutions.
                                </p>
                              </div>

                              <a
                                href={neetAiSolution.directSolutionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl bg-[#1E3A20] hover:bg-[#284E2A] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                              >
                                <span>Open Direct Solution</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}

                          {/* Principles */}
                          {neetAiSolution.solution?.governingPrinciples && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-mono font-bold uppercase text-[#556052]">Governing Principles:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {neetAiSolution.solution.governingPrinciples.map((p: string, i: number) => (
                                  <span key={i} className="px-2.5 py-0.5 rounded bg-white border border-[#D5CFBE] text-xs font-mono text-[#1E3A20] font-semibold">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Numbered Step-by-Step Derivation Cards */}
                          <div className="space-y-2.5">
                            <span className="text-xs font-mono font-bold uppercase text-[#556052] flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-[#B07D4F]" />
                              <span>Real-Time Step-by-Step Derivation Process:</span>
                            </span>

                            {neetAiSolution.solution?.steps && neetAiSolution.solution.steps.length > 0 ? (
                              <div className="space-y-2">
                                {neetAiSolution.solution.steps.map((step: any, sIdx: number) => (
                                  <div key={sIdx} className="p-3.5 rounded-xl bg-white border border-[#E1DDD2] shadow-2xs space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E3A20]">
                                      <span className="w-5 h-5 rounded-full bg-[#EAE6DB] text-[#1E3A20] flex items-center justify-center text-[11px]">
                                        {step.stepNumber || sIdx + 1}
                                      </span>
                                      <span>{step.title}</span>
                                    </div>
                                    <p className="text-xs font-serif text-[#1A2219] leading-relaxed pl-7">
                                      {step.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-white border border-[#D5CFBE] text-xs font-sans text-[#1A2219] space-y-2 leading-relaxed">
                                {typeof neetAiSolution.solution?.stepByStepDerivation === "string" ? (
                                  <p className="whitespace-pre-line">{neetAiSolution.solution.stepByStepDerivation}</p>
                                ) : (
                                  Array.isArray(neetAiSolution.solution?.stepByStepDerivation) && neetAiSolution.solution.stepByStepDerivation.map((s: string, i: number) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <span className="font-mono font-bold text-[#1E3A20]">{i + 1}.</span>
                                      <span>{s}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          {/* Speed Hack */}
                          {(neetAiSolution.solution?.speedHack || neetAiSolution.solution?.speedHack60Sec) && (
                            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                              <span className="text-[11px] font-mono font-bold text-emerald-900 uppercase flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-[#B07D4F]" />
                                Competitive Elimination Hack:
                              </span>
                              <p className="text-xs text-emerald-950 font-sans">
                                {neetAiSolution.solution.speedHack || neetAiSolution.solution.speedHack60Sec}
                              </p>
                            </div>
                          )}

                          {/* Traps */}
                          {neetAiSolution.solution?.commonTraps && (
                            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
                              <span className="text-[11px] font-mono font-bold text-amber-900 uppercase flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Negative Marking Hazard:
                              </span>
                              <p className="text-xs text-amber-950 font-sans">
                                {neetAiSolution.solution.commonTraps}
                              </p>
                            </div>
                          )}

                          {neetAiSolution.solution?.correctOption && (
                            <div className="p-3 rounded-xl bg-[#EFECE3] border border-[#D5CFBE] flex items-center justify-between text-xs font-mono font-bold text-[#1E3A20]">
                              <span>Final Answer Key:</span>
                              <span className="px-2.5 py-0.5 rounded bg-[#1E3A20] text-white">
                                {neetAiSolution.solution.correctOption}
                              </span>
                            </div>
                          )}

                          {/* Alternative Outbound Verification Links */}
                          {neetAiSolution.directLinks && neetAiSolution.directLinks.length > 0 && (
                            <div className="pt-2 border-t border-[#E1DDD2] space-y-1.5">
                              <span className="text-[11px] font-mono text-[#6C7D64] uppercase font-bold">
                                External Verification & Video Archives:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {neetAiSolution.directLinks.map((link: any, lIdx: number) => (
                                  <a
                                    key={lIdx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white hover:bg-[#EFECE3] border border-[#D5CFBE] text-[#1E3A20] flex items-center gap-1 transition-colors"
                                  >
                                    <span>{link.label}</span>
                                    <ExternalLink className="w-3 h-3 text-[#B07D4F]" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs font-mono text-[#6C7D64] bg-white rounded-3xl border border-[#D5CFBE]">
                      Select any question from the list on the left to inspect statement, answer key, and live AI derivation.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ===================================================================== */}
            {/* VIEW MODE 2: OFFICIAL VEDANTU FULL PAPERS CATALOG (74 PAPERS) */}
            {/* ===================================================================== */}
            {neetViewMode === "papers" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-mono text-[#556052]">
                    Official Question Papers with Solutions & Answer Keys (2015–2026)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-800 font-bold">
                    Direct Official Vedantu Download Repository
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(neetData?.paperSets || neetData?.relatedPapers)?.map((paper: any) => (
                    <div
                      key={paper.id}
                      className="p-5 rounded-2xl bg-white border border-[#D5CFBE] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold">
                            {paper.year}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold">
                            {paper.code}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#B07D4F]">
                            {paper.totalMarks} Marks
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-sm text-[#1A2219] leading-snug">
                          {paper.title}
                        </h3>

                        <div className="text-[11px] font-mono text-[#6C7D64] flex items-center gap-3">
                          <span>⏱️ {paper.durationMinutes} Mins</span>
                          <span>📝 {paper.totalQuestions} Questions</span>
                          <span>{paper.subject}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[#EFECE3]">
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl bg-[#1E3A20] hover:bg-[#284E2A] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#C8A95B]" />
                          <span>View on Vedantu Official</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            const p = generateJumbledExamPaper({
                              exam: "NEET",
                              startYear: paper.year,
                              endYear: paper.year,
                              count: 20,
                              title: `Simulated Mock: ${paper.title}`
                            });
                            startJumbledExam(p);
                          }}
                          className="w-full py-1.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#EFECE3] border border-[#D5CFBE] text-[#1E3A20] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-[#B07D4F]" />
                          <span>Simulate CBT Exam</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CURATED ARCHIVE (MULTI-EXAM) */}
        {/* ========================================================================= */}
        {activeTab === "archive" && (
          <div className="space-y-6 tab-pane-transition">
            {/* Filter Navigation Tabs */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D5CFBE] space-y-4 shadow-2xs">
              <div className="space-y-2 pb-3 border-b border-[#E1DDD2]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#556052] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#283826]" />
                    Select Examination:
                  </span>
                  <span className="text-[11px] font-mono text-[#6C7D64]">Separated Archives</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: "JEE Main", label: "⚡ JEE Main" },
                      { id: "JEE Advanced", label: "🔥 JEE Advanced" },
                      { id: "NEET", label: "🧬 NEET-UG" },
                      { id: "SAT", label: "🎯 Digital SAT" },
                      { id: "GRE", label: "🧮 GRE General" },
                      { id: "ALL", label: "🌐 All Exams" }
                    ] as const
                  ).map((item) => {
                    const isSelected = selectedExam === item.id;
                    const countForExam = PYQ_DATABASE.filter(
                      (q) => item.id === "ALL" || q.exam === item.id
                    ).length;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedExam(item.id);
                          setSelectedUnit("ALL");
                          const matching = PYQ_DATABASE.filter(
                            (q) =>
                              (item.id === "ALL" || q.exam === item.id) &&
                              (selectedYear === "ALL" || q.year === selectedYear)
                          );
                          if (matching.length > 0) selectQuestion(matching[0].id);
                        }}
                        className={`tab-pill px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? "bg-[#283826] text-[#F7F5F0] shadow-sm ring-2 ring-[#283826]/30"
                            : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2] border border-[#D5CFBE]"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full transition-colors ${isSelected ? "bg-white/20 text-[#F7F5F0]" : "bg-[#DFD9C7] text-[#556052]"}`}>
                          {countForExam}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Year Filter */}
              <div className="space-y-2 pb-3 border-b border-[#E1DDD2]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#556052] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B07D4F]" />
                    Filter by Examination Year (2020 – 2026):
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear("ALL");
                      const matching = PYQ_DATABASE.filter(
                        (q) => selectedExam === "ALL" || q.exam === selectedExam
                      );
                      if (matching.length > 0) selectQuestion(matching[0].id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedYear === "ALL"
                        ? "bg-[#B07D4F] text-white shadow-2xs"
                        : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2]"
                    }`}
                  >
                    All Years (2020–2026)
                  </button>

                  {availableYears.map((yr) => {
                    const isSelected = selectedYear === yr;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => {
                          setSelectedYear(yr);
                          const matching = PYQ_DATABASE.filter(
                            (q) =>
                              q.year === yr &&
                              (selectedExam === "ALL" || q.exam === selectedExam)
                          );
                          if (matching.length > 0) selectQuestion(matching[0].id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#283826] text-[#F7F5F0] shadow-2xs ring-1 ring-[#283826]"
                            : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2] border border-[#D5CFBE]"
                        }`}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 rounded-2xl bg-[#FAF8F5] border border-[#D5CFBE] p-4 space-y-3 max-h-[850px] overflow-y-auto shadow-2xs">
                <div className="space-y-2">
                  {filteredQuestions.map((q) => {
                    const isActive = q.id === activeQuestion.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => selectQuestion(q.id)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                          isActive
                            ? "bg-[#283826] text-[#F7F5F0] border-[#283826] shadow-md ring-2 ring-[#283826]/30"
                            : "bg-white hover:bg-[#F0EDE4] border-[#E1DDD2] text-[#1A2219]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            isActive ? "bg-white/20 text-[#F7F5F0]" : "bg-[#EFECE3] text-[#283826]"
                          }`}>
                            {q.exam} • {q.subject}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isActive ? "bg-amber-400/20 text-amber-300" : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}>
                            {q.year}
                          </span>
                        </div>
                        <div className="font-serif font-bold text-xs line-clamp-1">{q.chapter}</div>
                        <p className={`text-[11px] line-clamp-2 leading-relaxed ${isActive ? "text-neutral-200" : "text-[#556052]"}`}>
                          {q.question}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Solver */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl bg-[#FAF8F5] border border-[#D5CFBE] p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E1DDD2]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold font-mono">
                        {activeQuestion.yearLabel || `${activeQuestion.exam} ${activeQuestion.year}`}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-[#EFECE3] border border-[#D5CFBE] text-xs font-semibold text-[#283826]">
                        {activeQuestion.subject} • {activeQuestion.chapter}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-white border border-[#E1DDD2] shadow-2xs">
                    <p className="font-serif text-base sm:text-lg text-[#1A2219] leading-relaxed">
                      {activeQuestion.question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {activeQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === activeQuestion.correctIndex;
                      let style = "bg-white hover:bg-[#F0EDE4] border-[#D5CFBE] text-[#1A2219]";
                      if (isAnswered) {
                        if (isCorrect) style = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-500 shadow-xs";
                        else if (isSelected) style = "bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500 shadow-xs";
                        else style = "bg-[#F7F5F0] border-[#E1DDD2] text-[#7C8578] opacity-60";
                      }
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswered}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between text-sm ${style} shadow-2xs cursor-pointer`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg font-mono font-bold text-xs shrink-0 flex items-center justify-center ${
                              isAnswered && isCorrect
                                ? "bg-emerald-600 text-white"
                                : isAnswered && isSelected
                                ? "bg-rose-600 text-white"
                                : "bg-[#EAE6DB] border border-[#D5CFBE] text-[#283826]"
                            }`}>
                              {opt.label}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isAnswered && (
                            <div>
                              {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                              {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* GREEN CARD / RED CARD FEEDBACK FOR CURATED */}
                  {isAnswered && selectedOption !== null && (
                    <div className="space-y-3 pt-2">
                      {selectedOption === activeQuestion.correctIndex ? (
                        /* GREEN CARD */
                        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/60 border-2 border-emerald-500 shadow-sm animate-in fade-in zoom-in-95 duration-200 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-serif font-bold text-base text-emerald-950 flex items-center gap-2">
                                  <span>CORRECT ANSWER!</span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-mono font-bold">
                                    +4 MARKS
                                  </span>
                                </h4>
                                <p className="text-xs font-mono text-emerald-700">
                                  Verified National Exam Key • Full Accuracy Credited
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-white/90 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold shadow-2xs">
                              Option {activeQuestion.options[activeQuestion.correctIndex]?.label} Confirmed ✓
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200 text-xs sm:text-sm font-sans text-emerald-950">
                            <div className="font-mono text-[11px] font-bold text-emerald-800 uppercase mb-1">
                              Official Verification Rationale:
                            </div>
                            <p className="leading-relaxed font-serif">
                              {activeQuestion.officialExplanation}
                            </p>
                          </div>

                          {/* Direct Solution Link in Green Card */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="font-mono text-emerald-800 text-[11px]">
                              Want authoritative external derivation or video?
                            </span>
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(`${activeQuestion.question.slice(0, 100)} ${activeQuestion.exam} ${activeQuestion.subject} solution answer key`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-900 hover:text-emerald-950 font-mono font-bold underline flex items-center gap-1"
                            >
                              <span>Direct Solution Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        /* RED CARD */
                        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-red-50/50 to-rose-100/60 border-2 border-rose-500 shadow-sm animate-in fade-in zoom-in-95 duration-200 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                                <XCircle className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
                                  <span>INCORRECT ATTEMPT!</span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-rose-700 text-white text-[11px] font-mono font-bold">
                                    -1 NEGATIVE MARK
                                  </span>
                                </h4>
                                <p className="text-xs font-mono text-rose-700">
                                  Penalty Applied as per NTA Exam Regulations • Review Traps Below
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-white/90 border border-rose-300 text-rose-900 text-xs font-mono font-bold shadow-2xs">
                              Negative Mark Incurred
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3 rounded-xl bg-white/90 border border-rose-300 text-xs font-sans text-rose-950">
                              <span className="text-rose-600 font-mono font-bold text-[11px] uppercase block mb-1">
                                ✗ Your Selection:
                              </span>
                              <div className="font-bold">
                                Option {activeQuestion.options[selectedOption]?.label}: {activeQuestion.options[selectedOption]?.text}
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 text-xs font-sans text-emerald-950">
                              <span className="text-emerald-700 font-mono font-bold text-[11px] uppercase block mb-1">
                                ✓ Official Correct Key:
                              </span>
                              <div className="font-bold">
                                Option {activeQuestion.options[activeQuestion.correctIndex]?.label}: {activeQuestion.options[activeQuestion.correctIndex]?.text}
                              </div>
                            </div>
                          </div>

                          {/* Common Trap Alert */}
                          <div className="p-3.5 rounded-xl bg-white/90 border border-rose-200 text-xs sm:text-sm font-sans text-rose-950">
                            <div className="font-mono text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1.5 mb-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Negative Marking Trap Analysis:</span>
                            </div>
                            <p className="leading-relaxed">
                              {activeQuestion.commonTrap || activeQuestion.officialExplanation}
                            </p>
                          </div>

                          {/* Direct Solution Link in Red Card */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="font-mono text-rose-800 text-[11px]">
                              Review verified answer & step-by-step resolution:
                            </span>
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(`${activeQuestion.question.slice(0, 100)} ${activeQuestion.exam} ${activeQuestion.subject} solution answer key`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-rose-900 hover:text-rose-950 font-mono font-bold underline flex items-center gap-1"
                            >
                              <span>Direct Solution Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Solve Action Bar with Direct Link Fallback (Gated until user attempts question) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#E1DDD2]">
                    <span className="text-xs font-mono text-[#556052]">
                      {!isAnswered 
                        ? "Choose an answer above to test yourself & unlock AI derivation" 
                        : "Need AI derivation or authoritative external proof?"}
                    </span>

                    <div className="flex items-center gap-2">
                      {isAnswered && (
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(`${activeQuestion.question.slice(0, 100)} ${activeQuestion.exam} ${activeQuestion.subject} solution answer key`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2.5 rounded-xl bg-[#EFECE3] hover:bg-[#E5E0D2] border border-[#D5CFBE] text-[#283826] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Open direct authoritative solution"
                        >
                          <span>Direct Solution Link</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#B07D4F]" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (!isAnswered) {
                            alert("Please select your answer (A, B, C, or D) first to test your understanding!");
                            return;
                          }
                          handleSolveWithNemotron();
                        }}
                        disabled={aiSolving}
                        className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer group ${
                          !isAnswered
                            ? "bg-[#EAE6DB] border border-[#D5CFBE] text-[#6C7D64] hover:bg-[#E1DDD2]"
                            : "bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0]"
                        }`}
                      >
                        <Sparkles className={`w-4 h-4 transition-transform ${isAnswered ? "text-[#B07D4F] group-hover:rotate-12" : "text-[#8C9886]"}`} />
                        <span>
                          {aiSolving 
                            ? "Nemotron Ultra Deriving..." 
                            : !isAnswered 
                            ? "Answer above first" 
                            : "Solve with Nemotron Ultra AI"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Real-Time Progressive Stages during Curated AI solving */}
                  {aiSolving && (
                    <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#D5CFBE] space-y-3 animate-pulse">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-[#283826]">
                        <span className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-[#B07D4F] animate-spin" />
                          <span>NVIDIA Nemotron Ultra Live Reasoning Engine...</span>
                        </span>
                        <span className="text-[11px] text-[#B07D4F] font-semibold">
                          {curatedSolvingStage === 1 && "Stage 1/4: Analyzing Parameters..."}
                          {curatedSolvingStage === 2 && "Stage 2/4: Formulating Laws..."}
                          {curatedSolvingStage === 3 && "Stage 3/4: Mathematical Derivation..."}
                          {curatedSolvingStage >= 4 && "Stage 4/4: Distractor Elimination..."}
                        </span>
                      </div>
                      <div className="w-full bg-[#E5E0D3] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#B07D4F] to-[#283826] h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(20, curatedSolvingStage * 25))}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-mono text-[#556052]">
                        {curatedSolvingStage === 1 && "Ingesting question stem, physical invariants, and boundary conditions..."}
                        {curatedSolvingStage === 2 && "Formulating first-principles equations and conservation laws without hallucination..."}
                        {curatedSolvingStage === 3 && "Executing multi-step algebra and calculating exact value for candidate options..."}
                        {curatedSolvingStage >= 4 && "Cross-referencing verified answer key and preparing 60s speed hack..."}
                      </p>
                    </div>
                  )}

                  {/* Nemotron Solution Box */}
                  {aiSolution && (
                    <div className="rounded-2xl bg-[#FAF8F5] border-2 border-[#283826] p-6 space-y-5 shadow-md animate-in fade-in duration-300">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5CFBE]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#283826] text-white flex items-center justify-center">
                            <Bot className="w-5 h-5 text-[#C8A95B]" />
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-base text-[#1A2219]">
                              NVIDIA Nemotron Ultra Academic Derivation
                            </h3>
                            <p className="text-[10px] font-mono text-[#6C7D64]">
                              {aiSolution.model} • Latency: {aiSolution.latencyMs}ms
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                          ✓ Step-by-Step Proof
                        </span>
                      </div>

                      {/* Direct Solution Fallback Banner */}
                      {aiSolution.directSolutionUrl && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="text-xs font-mono font-bold text-amber-950 flex items-center gap-1.5">
                              <span>🔗 Direct Solution Link (Official & Video Verification):</span>
                            </div>
                            <p className="text-[11px] text-amber-900 font-sans">
                              Cross-verify with original exam portal, official answer keys, or watch video solutions.
                            </p>
                          </div>

                          <a
                            href={aiSolution.directSolutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-[#283826] hover:bg-[#364A33] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                          >
                            <span>Open Direct Solution</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {/* Principles */}
                      {aiSolution.solution?.governingPrinciples && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-mono font-bold uppercase text-[#556052]">Governing Principles:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {aiSolution.solution.governingPrinciples.map((p: string, i: number) => (
                              <span key={i} className="px-2.5 py-0.5 rounded bg-white border border-[#D5CFBE] text-xs font-mono text-[#283826] font-semibold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Numbered Step-by-Step Derivation Cards */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-mono font-bold uppercase text-[#556052] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#B07D4F]" />
                          <span>Real-Time Step-by-Step Derivation Process:</span>
                        </span>

                        {aiSolution.solution?.steps && aiSolution.solution.steps.length > 0 ? (
                          <div className="space-y-2">
                            {aiSolution.solution.steps.map((step: any, sIdx: number) => (
                              <div key={sIdx} className="p-3.5 rounded-xl bg-white border border-[#E1DDD2] shadow-2xs space-y-1">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#283826]">
                                  <span className="w-5 h-5 rounded-full bg-[#EAE6DB] text-[#283826] flex items-center justify-center text-[11px]">
                                    {step.stepNumber || sIdx + 1}
                                  </span>
                                  <span>{step.title}</span>
                                </div>
                                <p className="text-xs font-serif text-[#1A2219] leading-relaxed pl-7">
                                  {step.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-white border border-[#E1DDD2] text-xs sm:text-sm font-serif text-[#1A2219] leading-relaxed">
                            {aiSolution.solution?.stepByStepDerivation}
                          </div>
                        )}
                      </div>

                      {/* Speed Hack */}
                      {aiSolution.solution?.speedHack && (
                        <div className="p-3.5 rounded-xl bg-[#FAF3E8] border border-[#E5D2BA] space-y-1">
                          <span className="text-[11px] font-mono font-bold text-[#8A5B2F] uppercase flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            60s Competitive Shortcut:
                          </span>
                          <p className="text-xs text-[#52371E] font-sans">
                            {aiSolution.solution.speedHack}
                          </p>
                        </div>
                      )}

                      {/* Traps */}
                      {aiSolution.solution?.commonTraps && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
                          <span className="text-[11px] font-mono font-bold text-amber-900 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Negative Marking Trap:
                          </span>
                          <p className="text-xs text-amber-950 font-sans">
                            {aiSolution.solution.commonTraps}
                          </p>
                        </div>
                      )}

                      {aiSolution.solution?.correctOption && (
                        <div className="p-3 rounded-xl bg-[#EFECE3] border border-[#D5CFBE] flex items-center justify-between text-xs font-mono font-bold text-[#283826]">
                          <span>Final Answer Key:</span>
                          <span className="px-2.5 py-0.5 rounded bg-[#283826] text-white">
                            {aiSolution.solution.correctOption}
                          </span>
                        </div>
                      )}

                      {/* Alternative Outbound Verification Links */}
                      {aiSolution.directLinks && aiSolution.directLinks.length > 0 && (
                        <div className="pt-2 border-t border-[#E1DDD2] space-y-1.5">
                          <span className="text-[11px] font-mono text-[#6C7D64] uppercase font-bold">
                            External Verification & Video Archives:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {aiSolution.directLinks.map((link: any, lIdx: number) => (
                              <a
                                key={lIdx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white hover:bg-[#EFECE3] border border-[#D5CFBE] text-[#283826] flex items-center gap-1 transition-colors"
                              >
                                <span>{link.label}</span>
                                <ExternalLink className="w-3 h-3 text-[#B07D4F]" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: JUMBLED EXAM PAPERS & CBT SIMULATOR */}
        {/* ========================================================================= */}
        {activeTab === "jumbled" && (
          <div className="space-y-8 tab-pane-transition">
            {!activeJumbledPaper ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {CURATED_JUMBLED_PAPERS.map((paper) => (
                    <div
                      key={paper.id}
                      className="bg-[#FAF8F5] border border-[#D5CFBE] hover:border-[#283826] rounded-2xl p-5 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#283826] text-[#F7F5F0]">
                            {paper.exam}
                          </span>
                          <span className="text-xs font-mono text-[#B07D4F] font-bold">{paper.yearSpan}</span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#1A2219]">{paper.title}</h3>
                        <p className="text-xs text-[#556052]">{paper.description}</p>
                      </div>
                      <button
                        onClick={() => startJumbledExam(paper)}
                        className="w-full py-2.5 rounded-xl bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-[#B07D4F]" />
                        <span>Start CBT Exam</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom Generator */}
                <div className="bg-gradient-to-br from-[#ECE7DC] to-[#E5E0CE] border border-[#D5CFBE] rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#1A2219]">🎲 Generate Custom Jumbled Exam</h3>
                      <p className="text-xs text-[#556052]">Randomized paper using Fisher-Yates algorithmic distribution.</p>
                    </div>
                    <button
                      onClick={handleGenerateCustomPaper}
                      className="px-6 py-3 rounded-xl bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Shuffle className="w-4 h-4 text-[#B07D4F]" />
                      <span>Generate & Launch Test</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE CBT RUNNER */
              <div className="space-y-6">
                <div className="bg-[#283826] text-[#F7F5F0] rounded-2xl p-4 sm:p-6 border border-[#D5CFBE] flex items-center justify-between">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-[#F7F5F0]">{activeJumbledPaper.title}</h2>
                    <span className="text-xs font-mono text-[#D5CFBE]">+{activeJumbledPaper.marksPerCorrect} / -{activeJumbledPaper.negativeMarks} Marks</span>
                  </div>
                  <div className="text-center bg-[#364A33] px-4 py-2 rounded-xl">
                    <div className="text-[9px] text-neutral-300">TIME REMAINING</div>
                    <div className="text-lg font-mono font-bold text-[#F7F5F0]">{formatTime(jumbledTimeRemaining)}</div>
                  </div>
                </div>

                {!jumbledSubmitted ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#D5CFBE] rounded-2xl p-6 space-y-6">
                      {(() => {
                        const currentQ = activeJumbledPaper.questions[jumbledQIndex];
                        if (!currentQ) return null;
                        const userAns = jumbledAnswers[currentQ.id];
                        return (
                          <div className="space-y-4">
                            <div className="font-mono font-bold text-xs text-[#556052]">Question {jumbledQIndex + 1} of {activeJumbledPaper.questions.length}</div>
                            <p className="font-serif text-base text-[#1A2219]">{currentQ.question}</p>
                            <div className="space-y-2.5">
                              {currentQ.options.map((opt, idx) => (
                                <button
                                  key={opt.label}
                                  onClick={() => setJumbledAnswers(prev => ({ ...prev, [currentQ.id]: idx }))}
                                  className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 text-sm cursor-pointer ${
                                    userAns === idx ? "bg-[#283826] text-white" : "bg-white text-[#1A2219]"
                                  }`}
                                >
                                  <span className="font-bold">{opt.label}:</span>
                                  <span>{opt.text}</span>
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-[#E1DDD2]">
                              <button
                                onClick={() => setJumbledQIndex(p => Math.max(0, p - 1))}
                                disabled={jumbledQIndex === 0}
                                className="px-4 py-2 rounded-xl bg-[#EFECE3] text-xs font-mono font-bold disabled:opacity-40"
                              >
                                Previous
                              </button>
                              {jumbledQIndex < activeJumbledPaper.questions.length - 1 ? (
                                <button
                                  onClick={() => setJumbledQIndex(p => p + 1)}
                                  className="px-5 py-2 rounded-xl bg-[#283826] text-white text-xs font-mono font-bold"
                                >
                                  Next
                                </button>
                              ) : (
                                <button
                                  onClick={() => setJumbledSubmitted(true)}
                                  className="px-6 py-2 rounded-xl bg-emerald-800 text-white text-xs font-mono font-bold"
                                >
                                  Submit
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Palette */}
                    <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#D5CFBE] rounded-2xl p-5 space-y-4">
                      <div className="text-xs font-mono font-bold uppercase text-[#556052]">Question Palette</div>
                      <div className="grid grid-cols-5 gap-2">
                        {activeJumbledPaper.questions.map((q, idx) => (
                          <button
                            key={q.id}
                            onClick={() => setJumbledQIndex(idx)}
                            className={`h-9 rounded-lg border text-xs font-mono ${
                              jumbledAnswers[q.id] !== undefined ? "bg-emerald-700 text-white" : "bg-white text-[#556052]"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setJumbledSubmitted(true)}
                        className="w-full py-2.5 rounded-xl bg-[#283826] text-white text-xs font-mono font-bold uppercase"
                      >
                        Submit Exam
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Scorecard */
                  <div className="bg-[#283826] text-[#F7F5F0] rounded-3xl p-8 text-center space-y-4">
                    <Trophy className="w-12 h-12 text-[#B07D4F] mx-auto" />
                    <h3 className="font-serif font-bold text-2xl">Exam Completed!</h3>
                    <div className="text-3xl font-mono font-bold text-[#B07D4F]">
                      Score: {calculateJumbledScore().score} / {calculateJumbledScore().maxScore}
                    </div>
                    <button
                      onClick={() => setActiveJumbledPaper(null)}
                      className="px-5 py-2.5 rounded-xl bg-[#B07D4F] text-white text-xs font-mono font-bold uppercase"
                    >
                      Back to Jumbled Papers
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
