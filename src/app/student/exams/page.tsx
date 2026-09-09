"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Shuffle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Check,
  Trophy,
  Play,
  Flame,
  BookOpen,
  Zap,
  AlertTriangle
} from "lucide-react";
import {
  CURATED_JUMBLED_PAPERS,
  generateJumbledExamPaper,
  JumbledExamPaper,
  PYQQuestion
} from "@/data/pyqDatabase";

export default function ExamsQuizPage() {
  const [activeTab, setActiveTab] = useState<"jumbled" | "diagnostics">("jumbled");
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>("ALL");
  
  // Active Test Session State
  const [activePaper, setActivePaper] = useState<JumbledExamPaper | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Custom Jumbled Paper Generator
  const [customExam, setCustomExam] = useState<"ALL" | "JEE Main" | "JEE Advanced" | "NEET" | "SAT" | "GRE">("JEE Main");
  const [customStartYear, setCustomStartYear] = useState<number>(2020);
  const [customEndYear, setCustomEndYear] = useState<number>(2026);
  const [customCount, setCustomCount] = useState<number>(8);

  // Live Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activePaper && !isSubmitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activePaper, isSubmitted, timeRemaining]);

  // Start Paper
  const handleStartPaper = (paper: JumbledExamPaper) => {
    setActivePaper(paper);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setTimeRemaining(paper.durationMinutes * 60);
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Launch Custom Generator
  const handleLaunchCustomGenerator = () => {
    const paper = generateJumbledExamPaper({
      exam: customExam,
      startYear: customStartYear,
      endYear: customEndYear,
      count: customCount,
      title: `Custom ${customExam === "ALL" ? "Cross-Exam" : customExam} Jumbled Test (${customStartYear}–${customEndYear})`
    });
    handleStartPaper(paper);
  };

  // Handle Option Selection
  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  // Calculate Scores
  const calculateScore = () => {
    if (!activePaper) return { score: 0, maxScore: 0, correct: 0, wrong: 0, unattempted: 0 };
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    activePaper.questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = (correct * activePaper.marksPerCorrect) - (wrong * activePaper.negativeMarks);
    const maxScore = activePaper.questions.length * activePaper.marksPerCorrect;

    return { score, maxScore, correct, wrong, unattempted };
  };

  // Submit Test & Award Stars
  const handleSubmitTest = async () => {
    setIsSubmitted(true);
    const stats = calculateScore();
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "exam_completed",
          subject: activePaper?.exam || "Mock Exam",
          topic: activePaper?.title || "Jumbled Test",
          isPYQ: true,
          isCorrect: stats.correct >= stats.wrong,
          timeSpentSeconds: (activePaper?.durationMinutes || 15) * 60 - timeRemaining
        })
      });
      window.dispatchEvent(new Event("beyond:activity-updated"));
    } catch (e) {
      console.error("Failed to log activity:", e);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredCuratedPapers = CURATED_JUMBLED_PAPERS.filter((p) => {
    if (selectedExamFilter === "ALL") return true;
    return p.exam === selectedExamFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              Examination & Jumbled Testing Hall
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#252B18] text-[#C8A95B] px-2.5 py-0.5 rounded-full border border-[#C8A95B]/40">
              2020 – 2026 Engine
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Real-time Computer-Based Test (CBT) simulator with jumbled previous year questions across JEE Main, JEE Advanced, NEET, SAT, and GRE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pyqs"
            className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#3D4425]/20 text-xs font-mono font-bold text-[#252B18] hover:bg-[#EAE6DB] transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#3D4425]" />
            <span>Browse PYQ Archive</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SELECTION LOBBY (When not in test session) */}
      {/* ========================================================================= */}
      {!activePaper ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Hero Featured Card */}
          <div className="bg-[#252B18] text-[#F3EBDD] rounded-3xl p-6 sm:p-8 border border-[#C8A95B]/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8A95B] font-bold flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5" />
                Featured 2020–2026 Jumbled Simulator
              </span>
              <span className="text-xs font-mono text-[#D9CAA8]">
                Authentic Multi-Year Question Shuffling
              </span>
            </div>

            <h2 className="font-accent font-bold text-2xl sm:text-3xl text-[#F3EBDD]">
              🌟 BEYOND All-India Mega Cross-Exam Jumbled Paper
            </h2>

            <p className="text-xs sm:text-sm text-[#D9CAA8]/90 leading-relaxed max-w-3xl">
              Take the ultimate intellectual test: questions randomized from <strong>JEE Main, JEE Advanced, NEET, SAT, and GRE</strong> spanning 2020 to 2026. Features official countdown timer, question palette, negative marking, and <strong className="text-[#C8A95B]">+100 BEYOND Stars ⭐</strong> on completion.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleStartPaper(CURATED_JUMBLED_PAPERS[5] || CURATED_JUMBLED_PAPERS[0])}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C8A95B] text-[#252B18] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#d4b566] transition-all shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Mega Jumbled Exam (10 Qs • 40 Mins)</span>
              </button>

              <span className="text-xs font-mono text-[#D9CAA8]/70">
                Marking: +4 for correct • -1 for incorrect
              </span>
            </div>
          </div>

          {/* Exam Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#3D4425]/15">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#556052]">Select Exam:</span>
              {(
                [
                  { id: "ALL", label: "All Exams" },
                  { id: "JEE Main", label: "⚡ JEE Main" },
                  { id: "JEE Advanced", label: "🔥 JEE Advanced" },
                  { id: "NEET", label: "🧬 NEET-UG" },
                  { id: "SAT", label: "🎯 Digital SAT" },
                  { id: "GRE", label: "🧮 GRE General" }
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedExamFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedExamFilter === f.id
                      ? "bg-[#252B18] text-[#F3EBDD] shadow-2xs"
                      : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-[#6C7D64]">
              Showing {filteredCuratedPapers.length} pre-built papers
            </span>
          </div>

          {/* Curated Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCuratedPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-[#FAF8F5] border border-[#3D4425]/20 hover:border-[#252B18] rounded-2xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#252B18] text-[#C8A95B]">
                      {paper.exam}
                    </span>
                    <span className="text-xs font-mono text-[#B07D4F] font-bold">
                      {paper.yearSpan}
                    </span>
                  </div>

                  <h3 className="font-accent font-bold text-base text-[#252B18] leading-snug">
                    {paper.title}
                  </h3>

                  <p className="text-xs text-[#69704A] leading-relaxed">
                    {paper.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#3D4425]/15 text-center font-mono text-[11px]">
                    <div className="bg-[#EFECE3] p-1.5 rounded-lg">
                      <div className="text-[9px] text-[#6C7D64]">QUESTIONS</div>
                      <div className="font-bold text-[#252B18]">{paper.totalQuestions}</div>
                    </div>
                    <div className="bg-[#EFECE3] p-1.5 rounded-lg">
                      <div className="text-[9px] text-[#6C7D64]">TIME</div>
                      <div className="font-bold text-[#252B18]">{paper.durationMinutes}m</div>
                    </div>
                    <div className="bg-[#EFECE3] p-1.5 rounded-lg">
                      <div className="text-[9px] text-[#6C7D64]">SCORING</div>
                      <div className="font-bold text-[#252B18]">+{paper.marksPerCorrect}/-{paper.negativeMarks}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartPaper(paper)}
                  className="w-full py-2.5 rounded-xl bg-[#252B18] hover:bg-[#3D4425] text-[#F3EBDD] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#C8A95B] group-hover:scale-110 transition-transform" />
                  <span>Start Jumbled Exam</span>
                </button>
              </div>
            ))}
          </div>

          {/* Interactive Custom Jumbled Exam Generator */}
          <div className="bg-gradient-to-br from-[#ECE7DC] to-[#E3DEC9] border border-[#D5CFBE] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold bg-[#B07D4F] text-white px-2.5 py-0.5 rounded-full">
                  Interactive Randomizer
                </span>
                <h3 className="font-accent font-bold text-xl sm:text-2xl text-[#1A2219] mt-1.5">
                  🎲 Generate Custom Jumbled Exam Paper (2020–2026)
                </h3>
                <p className="text-xs text-[#556052] max-w-2xl font-sans mt-0.5">
                  Configure and generate your own shuffled test paper on-demand. Questions are picked randomly from our verified 2020–2026 question repository.
                </p>
              </div>

              <button
                onClick={handleLaunchCustomGenerator}
                className="px-6 py-3 rounded-xl bg-[#252B18] hover:bg-[#3D4425] text-[#F3EBDD] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Shuffle className="w-4 h-4 text-[#C8A95B]" />
                <span>Generate & Launch Test</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#D5CFBE] space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-[#556052] uppercase">
                  Exam Target:
                </label>
                <select
                  value={customExam}
                  onChange={(e) => setCustomExam(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFBE] rounded-lg p-2 text-xs font-semibold text-[#1A2219] focus:outline-none"
                >
                  <option value="ALL">🌐 Cross-Exam (Mixed)</option>
                  <option value="JEE Main">⚡ JEE Main</option>
                  <option value="JEE Advanced">🔥 JEE Advanced</option>
                  <option value="NEET">🧬 NEET-UG</option>
                  <option value="SAT">🎯 Digital SAT</option>
                  <option value="GRE">🧮 GRE General</option>
                </select>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#D5CFBE] space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-[#556052] uppercase">
                  Start Year:
                </label>
                <select
                  value={customStartYear}
                  onChange={(e) => setCustomStartYear(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFBE] rounded-lg p-2 text-xs font-semibold text-[#1A2219] focus:outline-none"
                >
                  {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#D5CFBE] space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-[#556052] uppercase">
                  End Year:
                </label>
                <select
                  value={customEndYear}
                  onChange={(e) => setCustomEndYear(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFBE] rounded-lg p-2 text-xs font-semibold text-[#1A2219] focus:outline-none"
                >
                  {[2026, 2025, 2024, 2023, 2022, 2021].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#D5CFBE] space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-[#556052] uppercase">
                  Question Count:
                </label>
                <select
                  value={customCount}
                  onChange={(e) => setCustomCount(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFBE] rounded-lg p-2 text-xs font-semibold text-[#1A2219] focus:outline-none"
                >
                  <option value={5}>5 Questions (Express)</option>
                  <option value={8}>8 Questions (Standard)</option>
                  <option value={10}>10 Questions (Power)</option>
                  <option value={15}>15 Questions (Full Test)</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. ACTIVE CBT EXAM SIMULATOR */
        /* ========================================================================= */
        <div className="space-y-6">
          
          {/* CBT Top Bar */}
          <div className="bg-[#252B18] text-[#F3EBDD] p-5 rounded-2xl border border-[#C8A95B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8A95B] font-bold">
                  {activePaper.exam} • {activePaper.yearSpan}
                </span>
                <span className="text-xs font-mono text-[#D9CAA8]/70">
                  +{activePaper.marksPerCorrect} / -{activePaper.negativeMarks} Marks
                </span>
              </div>
              <h2 className="font-accent font-bold text-xl text-[#F3EBDD]">{activePaper.title}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl border font-mono text-center ${
                timeRemaining < 300 
                  ? "bg-rose-900/60 border-rose-500 text-rose-200 animate-pulse" 
                  : "bg-[#3D4425] border-[#C8A95B]/30 text-[#F3EBDD]"
              }`}>
                <div className="text-[9px] uppercase tracking-wider text-[#D9CAA8]/70">Time Remaining</div>
                <div className="text-base font-bold text-[#C8A95B] flex items-center justify-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to exit the exam? Your progress will be discarded.")) {
                    setActivePaper(null);
                  }
                }}
                className="text-xs font-bold px-3 py-2 rounded-lg border border-[#69704A]/40 text-[#E8DCC3] hover:bg-[#3D4425] cursor-pointer"
              >
                Exit Test
              </button>
            </div>
          </div>

          {!isSubmitted ? (
            /* ACTIVE QUESTION PALETTE & TEST RUNNER */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Question Workspace (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {(() => {
                  const currentQ = activePaper.questions[currentQIndex];
                  if (!currentQ) return null;
                  const userAns = selectedAnswers[currentQ.id];
                  const isMarked = !!markedForReview[currentQ.id];

                  return (
                    <div className="bg-[#FAF8F5] border border-[#3D4425]/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                      
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#3D4425]/15">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-[#252B18] text-[#C8A95B] px-3 py-1 rounded-lg">
                            Question {currentQIndex + 1} of {activePaper.questions.length}
                          </span>
                          <span className="text-xs font-mono text-[#69704A] bg-[#E8DCC3] px-2.5 py-1 rounded-lg">
                            {currentQ.exam} • {currentQ.year}
                          </span>
                          <span className="text-xs font-mono text-[#3D4425]">
                            {currentQ.subject}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setMarkedForReview((prev) => ({
                              ...prev,
                              [currentQ.id]: !prev[currentQ.id]
                            }));
                          }}
                          className={`text-xs font-mono px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                            isMarked
                              ? "bg-[#C8A95B] border-[#C8A95B] text-[#252B18] font-bold shadow-2xs"
                              : "bg-[#EFECE3] border-[#D5CFBE] text-[#556052] hover:bg-[#E5E0D2]"
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{isMarked ? "Marked for Review" : "Mark for Review"}</span>
                        </button>
                      </div>

                      {/* Question Text */}
                      <div className="p-5 rounded-xl bg-white border border-[#3D4425]/15 shadow-2xs space-y-2">
                        <div className="text-[11px] font-mono text-[#69704A] uppercase font-bold">
                          {currentQ.chapter}
                        </div>
                        <p className="font-display font-bold text-base sm:text-lg text-[#252B18] leading-relaxed">
                          {currentQ.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {currentQ.options.map((opt, idx) => {
                          const isSelected = userAns === idx;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => handleSelectOption(currentQ.id, idx)}
                              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${
                                isSelected
                                  ? "bg-[#252B18] text-[#F3EBDD] border-[#252B18] font-bold shadow-sm"
                                  : "bg-white hover:bg-[#F0EDE4] border-[#3D4425]/15 text-[#252B18]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                  isSelected
                                    ? "bg-white/20 border-white/40 text-white"
                                    : "bg-[#E8DCC3] border-[#3D4425]/20 text-[#252B18]"
                                }`}>
                                  {opt.label}
                                </span>
                                <span>{opt.text}</span>
                              </div>

                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-[#C8A95B] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Footer controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#3D4425]/15">
                        <button
                          onClick={() => {
                            setSelectedAnswers((prev) => {
                              const next = { ...prev };
                              delete next[currentQ.id];
                              return next;
                            });
                          }}
                          disabled={userAns === undefined}
                          className="text-xs font-mono text-[#69704A] hover:text-rose-700 disabled:opacity-30 cursor-pointer"
                        >
                          Clear Response
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                            disabled={currentQIndex === 0}
                            className="px-4 py-2 rounded-xl bg-[#E8DCC3] border border-[#3D4425]/20 text-xs font-mono font-bold text-[#252B18] disabled:opacity-40 cursor-pointer flex items-center gap-1"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>

                          {currentQIndex < activePaper.questions.length - 1 ? (
                            <button
                              onClick={() => setCurrentQIndex((prev) => prev + 1)}
                              className="px-5 py-2 rounded-xl bg-[#252B18] text-[#F3EBDD] text-xs font-mono font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <span>Next Question</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm("Ready to submit your jumbled exam paper?")) {
                                  handleSubmitTest();
                                }
                              }}
                              className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md"
                            >
                              Submit Exam
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })()}
              </div>

              {/* Question Palette Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#FAF8F5] border border-[#3D4425]/20 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-[#3D4425]/15">
                    <span className="text-xs font-mono font-bold uppercase text-[#556052]">
                      Question Palette ({activePaper.questions.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {activePaper.questions.map((q, idx) => {
                      const isCurrent = idx === currentQIndex;
                      const isAnswered = selectedAnswers[q.id] !== undefined;
                      const isMarked = !!markedForReview[q.id];

                      let btnStyle = "bg-white text-[#556052] border-[#3D4425]/15";
                      if (isMarked) {
                        btnStyle = "bg-[#C8A95B] text-[#252B18] font-bold border-[#C8A95B] ring-1 ring-[#C8A95B]";
                      } else if (isAnswered) {
                        btnStyle = "bg-emerald-700 text-white font-bold border-emerald-800";
                      }

                      if (isCurrent) {
                        btnStyle += " ring-2 ring-[#252B18] scale-105";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQIndex(idx)}
                          className={`h-10 rounded-xl border text-xs font-mono flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#3D4425]/15 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-emerald-700"></span>
                      <span className="text-[#556052]">Answered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-[#C8A95B]"></span>
                      <span className="text-[#556052]">Review</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-white border border-[#3D4425]/20"></span>
                      <span className="text-[#556052]">Unattempted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md ring-2 ring-[#252B18] bg-[#FAF8F5]"></span>
                      <span className="text-[#556052]">Active</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Submit and evaluate your exam paper?")) {
                        handleSubmitTest();
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-[#252B18] hover:bg-[#3D4425] text-[#F3EBDD] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-[#C8A95B]" />
                    <span>Submit & View Score</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* COMPREHENSIVE SCORECARD & DERIVATIONS */
            <div className="space-y-6 animate-in fade-in duration-300">
              {(() => {
                const stats = calculateScore();
                const pct = Math.round((stats.correct / activePaper.questions.length) * 100);

                return (
                  <div className="space-y-6">
                    <div className="bg-[#252B18] text-[#F3EBDD] rounded-3xl p-6 sm:p-8 border border-[#C8A95B]/40 shadow-xl text-center space-y-4">
                      <Trophy className="w-12 h-12 text-[#C8A95B] mx-auto animate-bounce" />
                      <h3 className="font-accent font-bold text-2xl text-[#F3EBDD]">
                        {activePaper.title} Completed!
                      </h3>

                      <div className="flex flex-wrap items-center justify-center gap-6 py-4">
                        <div className="text-center px-4 py-2 bg-white/10 rounded-2xl border border-white/15">
                          <div className="text-[10px] font-mono text-[#D9CAA8] uppercase">Net Score</div>
                          <div className="text-3xl font-mono font-bold text-[#C8A95B]">
                            {stats.score} <span className="text-xs text-[#D9CAA8]">/ {stats.maxScore}</span>
                          </div>
                        </div>

                        <div className="text-center px-4 py-2 bg-white/10 rounded-2xl border border-white/15">
                          <div className="text-[10px] font-mono text-[#D9CAA8] uppercase">Accuracy Rate</div>
                          <div className="text-3xl font-mono font-bold text-emerald-400">
                            {pct}%
                          </div>
                        </div>

                        <div className="text-center px-4 py-2 bg-white/10 rounded-2xl border border-white/15">
                          <div className="text-[10px] font-mono text-[#D9CAA8] uppercase">Correct / Wrong</div>
                          <div className="text-3xl font-mono font-bold text-white">
                            {stats.correct} <span className="text-xs text-rose-300">/ {stats.wrong}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#D9CAA8] max-w-md mx-auto">
                        You earned <strong className="text-[#C8A95B]">+75 BEYOND Stars ⭐</strong>. Your live mastery matrix across {activePaper.exam} has been recorded!
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => handleStartPaper(activePaper)}
                          className="px-5 py-2.5 rounded-xl bg-[#C8A95B] text-[#252B18] font-bold text-xs uppercase tracking-wider hover:bg-[#d4b566] flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Retake Paper</span>
                        </button>

                        <button
                          onClick={() => setActivePaper(null)}
                          className="px-5 py-2.5 rounded-xl bg-white/15 text-[#F3EBDD] font-bold text-xs uppercase tracking-wider hover:bg-white/25 cursor-pointer"
                        >
                          Exit to Testing Hall
                        </button>
                      </div>
                    </div>

                    {/* Question Solution Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-accent font-bold text-xl text-[#252B18]">
                        Detailed Solutions & High-Yield Analysis
                      </h4>

                      <div className="space-y-4">
                        {activePaper.questions.map((q, idx) => {
                          const userAns = selectedAnswers[q.id];
                          const isCorrect = userAns === q.correctIndex;
                          const isUnattempted = userAns === undefined;

                          return (
                            <div
                              key={q.id}
                              className="bg-[#FAF8F5] border border-[#3D4425]/20 rounded-2xl p-6 space-y-4 shadow-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#3D4425]/15">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-xs bg-[#252B18] text-[#C8A95B] px-2.5 py-0.5 rounded-md">
                                    Q{idx + 1}
                                  </span>
                                  <span className="text-xs font-mono text-[#69704A]">
                                    {q.exam} ({q.year}) • {q.subject}
                                  </span>
                                </div>

                                <div>
                                  {isUnattempted && (
                                    <span className="px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 text-xs font-mono font-bold">
                                      ⚪ Unattempted
                                    </span>
                                  )}
                                  {!isUnattempted && isCorrect && (
                                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold">
                                      ✅ Correct (+{activePaper.marksPerCorrect})
                                    </span>
                                  )}
                                  {!isUnattempted && !isCorrect && (
                                    <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-900 border border-rose-300 text-xs font-mono font-bold">
                                      ❌ Incorrect (-{activePaper.negativeMarks})
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="font-display font-bold text-base text-[#252B18] leading-relaxed">
                                {q.question}
                              </p>

                              {/* Options */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                                {q.options.map((opt, oIdx) => {
                                  let optStyle = "bg-white border-[#3D4425]/15 text-[#556052]";
                                  if (oIdx === q.correctIndex) {
                                    optStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                                  } else if (userAns === oIdx) {
                                    optStyle = "bg-rose-100 border-rose-500 text-rose-950 font-bold line-through";
                                  }

                                  return (
                                    <div
                                      key={opt.label}
                                      className={`p-2.5 rounded-xl border flex items-center gap-2 ${optStyle}`}
                                    >
                                      <span className="font-bold">{opt.label}:</span>
                                      <span>{opt.text}</span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Official Explanation */}
                              <div className="p-4 rounded-xl bg-white border border-[#3D4425]/15 space-y-1.5 text-xs">
                                <div className="font-mono font-bold text-[#252B18] uppercase text-[10px]">
                                  Official Explanation:
                                </div>
                                <p className="text-[#69704A] leading-relaxed">
                                  {q.officialExplanation}
                                </p>
                              </div>

                              {/* Speed Hack */}
                              <div className="p-3 rounded-xl bg-[#FAF3E8] border border-[#E5D2BA] text-xs">
                                <span className="font-mono font-bold text-[#8A5B2F] uppercase text-[10px]">
                                  ⚡ 60s Speed-Hack:{" "}
                                </span>
                                <span className="text-[#52371E] font-sans">{q.speedHack}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
