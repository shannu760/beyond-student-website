"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  HelpCircle, 
  BookOpen, 
  Flame, 
  Clock, 
  Target, 
  ArrowRight,
  Sparkles,
  FileCheck,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface Question {
  id: string;
  exam: "JEE" | "NEET" | "SAT" | "GRE";
  type: "MCQ" | "PYQ";
  pyqYear?: string;
  subject: string;
  topic: string;
  question: string;
  options: { label: string; text: string }[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1",
    exam: "JEE",
    type: "PYQ",
    pyqYear: "JEE Main 2024 (Session 1)",
    subject: "Physics",
    topic: "Work-Energy Theorem",
    question: "A block of mass m = 2 kg is released from rest from a height h = 5 m on a frictionless curved track which becomes horizontal. The horizontal surface has friction with coefficient μ = 0.25. How far does the block slide along the horizontal surface before stopping? (Take g = 10 m/s²)",
    options: [
      { label: "A", text: "10 m" },
      { label: "B", text: "20 m" },
      { label: "C", text: "15 m" },
      { label: "D", text: "25 m" }
    ],
    correctIndex: 1, // B: 20 m (mgh = μmgd => d = h/μ = 5/0.25 = 20 m)
    explanation: "By Work-Energy Theorem: Loss in potential energy = Work done against friction. mgh = μmg * d  =>  d = h / μ = 5 / 0.25 = 20 meters."
  },
  {
    id: "q2",
    exam: "JEE",
    type: "PYQ",
    pyqYear: "JEE Main 2023",
    subject: "Mathematics",
    topic: "Definite Integrals",
    question: "Evaluate the definite integral: I = ∫[0 to π/2] (sin^3(x) / (sin^3(x) + cos^3(x))) dx.",
    options: [
      { label: "A", text: "π / 2" },
      { label: "B", text: "π / 4" },
      { label: "C", text: "π" },
      { label: "D", text: "1" }
    ],
    correctIndex: 1, // B: π / 4
    explanation: "Using property ∫[0 to a] f(x)dx = ∫[0 to a] f(a-x)dx: 2I = ∫[0 to π/2] 1 dx = π/2 => I = π/4."
  },
  {
    id: "q3",
    exam: "SAT",
    type: "MCQ",
    subject: "SAT Math",
    topic: "Advanced Math & Quadratics",
    question: "The vertex of the parabola in the xy-plane given by y = 2(x - 3)(x + 5) has coordinates (h, k). What is the value of k?",
    options: [
      { label: "A", text: "-32" },
      { label: "B", text: "-16" },
      { label: "C", text: "-8" },
      { label: "D", text: "-64" }
    ],
    correctIndex: 0, // A: -32 (x-intercepts at 3 and -5. Vertex x = (3 - 5)/2 = -1. y(-1) = 2(-4)(4) = -32)
    explanation: "The x-intercepts are at x = 3 and x = -5. The x-coordinate of the vertex h = (3 + (-5))/2 = -1. Substituting x = -1: y = 2(-1 - 3)(-1 + 5) = 2(-4)(4) = -32."
  },
  {
    id: "q4",
    exam: "SAT",
    type: "MCQ",
    subject: "SAT Reading & Writing",
    topic: "Standard English Conventions",
    question: "To test whether bioluminescent fungi deter insect herbivores, ecologists measured spore loss on agar plates; ________ that insects avoided the glowing specimens entirely.",
    options: [
      { label: "A", text: "their data revealed" },
      { label: "B", text: "revealing" },
      { label: "C", text: "and the data will reveal" },
      { label: "D", text: "revealed" }
    ],
    correctIndex: 0, // A
    explanation: "A semicolon connects two independent clauses. Choice A correctly provides the subject 'their data' and finite past-tense verb 'revealed' to form a complete independent clause."
  },
  {
    id: "q5",
    exam: "NEET",
    type: "PYQ",
    pyqYear: "NEET 2024",
    subject: "Biology",
    topic: "Genetics & Inheritance",
    question: "In Mendel's dihybrid cross between round yellow seeds (RRYY) and wrinkled green seeds (rryy), what proportion of the F2 generation will have a recombinant phenotype?",
    options: [
      { label: "A", text: "9 / 16" },
      { label: "B", text: "6 / 16 (3/8)" },
      { label: "C", text: "1 / 16" },
      { label: "D", text: "3 / 16" }
    ],
    correctIndex: 1, // B: Round Green (3/16) + Wrinkled Yellow (3/16) = 6/16
    explanation: "The parental phenotypes are Round Yellow (9/16) and Wrinkled Green (1/16). Recombinant phenotypes are Round Green (3/16) and Wrinkled Yellow (3/16), giving 6/16."
  },
  {
    id: "q6",
    exam: "GRE",
    type: "MCQ",
    subject: "GRE Quantitative",
    topic: "Combinatorics & Probability",
    question: "A committee of 3 students is to be selected from a pool of 5 juniors and 4 seniors. What is the probability that the committee contains at least 1 junior and at least 1 senior?",
    options: [
      { label: "A", text: "5 / 6" },
      { label: "B", text: "25 / 42" },
      { label: "C", text: "70 / 84 (5/6)" },
      { label: "D", text: "35 / 42" }
    ],
    correctIndex: 0, // Total = C(9,3) = 84. All juniors = C(5,3) = 10. All seniors = C(4,3) = 4. 84 - 14 = 70. 70/84 = 5/6
    explanation: "Total selections: C(9, 3) = 84. Complementary cases: all juniors = C(5, 3) = 10; all seniors = C(4, 3) = 4. Valid selections = 84 - 14 = 70. P = 70 / 84 = 5 / 6."
  }
];

interface QuickQuizTrackerProps {
  onActivityLogged?: () => void;
  onRequestDailyReport?: () => void;
}

export function QuickQuizTracker({ onActivityLogged, onRequestDailyReport }: QuickQuizTrackerProps) {
  const [selectedExam, setSelectedExam] = useState<"ALL" | "JEE" | "NEET" | "SAT" | "GRE">("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Today's live stats
  const [stats, setStats] = useState({
    totalMCQs: 0,
    totalPYQs: 0,
    totalQuestions: 0,
    correctCount: 0,
    accuracyPercentage: 0,
    totalFocusMinutes: 0,
  });

  const filteredQuestions = selectedExam === "ALL" 
    ? SAMPLE_QUESTIONS 
    : SAMPLE_QUESTIONS.filter((q) => q.exam === selectedExam);

  const activeQuestion = filteredQuestions[currentIndex % filteredQuestions.length];

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/activity");
      const json = await res.json();
      if (json.success && json.today) {
        setStats({
          totalMCQs: json.today.totalMCQs,
          totalPYQs: json.today.totalPYQs,
          totalQuestions: json.today.totalMCQs + json.today.totalPYQs,
          correctCount: json.today.correctCount,
          accuracyPercentage: json.today.accuracyPercentage,
          totalFocusMinutes: json.today.totalFocusMinutes,
        });
      }
    } catch (e) {
      console.error("Failed to load today stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
    setStartTime(Date.now());
  }, []);

  // Submit Answer
  const handleSelectOption = async (idx: number) => {
    if (isAnswered || isSubmitting) return;

    setSelectedOption(idx);
    setIsAnswered(true);
    setIsSubmitting(true);

    const isCorrect = idx === activeQuestion.correctIndex;
    const timeSpent = Math.max(5, Math.round((Date.now() - startTime) / 1000));

    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "question",
          subject: activeQuestion.subject,
          topic: activeQuestion.topic,
          isPYQ: activeQuestion.type === "PYQ",
          isCorrect,
          timeSpentSeconds: timeSpent
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchStats();
        window.dispatchEvent(new Event("beyond:activity-updated"));
        if (onActivityLogged) onActivityLogged();
      }
    } catch (e) {
      console.error("Failed to record answer:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setStartTime(Date.now());
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  // Reset Records to Zero
  const handleResetToZero = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/activity", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStats({
          totalMCQs: 0,
          totalPYQs: 0,
          totalQuestions: 0,
          correctCount: 0,
          accuracyPercentage: 0,
          totalFocusMinutes: 0,
        });
        setSelectedOption(null);
        setIsAnswered(false);
        setResetConfirmOpen(false);
        window.dispatchEvent(new Event("beyond:activity-updated"));
        if (onActivityLogged) onActivityLogged();
      }
    } catch (e) {
      console.error("Failed to reset student records:", e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <section id="practice-tracker" className="scroll-mt-20">
      <div className="rounded-xl bg-[#F7F5F0] paper-texture border border-[#D5CFBE] shadow-md overflow-hidden">
        
        {/* Banner Bar with Live Stats & Reset from Zero */}
        <div className="p-6 bg-[#ECE7DC] border-b border-[#D5CFBE]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#283826] text-[#F7F5F0] text-[10px] font-mono uppercase tracking-wider font-semibold">
                  Live Ledger Engine
                </span>
                <span className="text-xs text-[#5E685B] font-sans">
                  Real-time Supabase & SQLite sync
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1A2219]">
                Interactive MCQs & PYQs Practice Ledger
              </h3>
              <p className="text-xs text-[#5E685B] font-sans max-w-xl mt-1">
                Solve authentic NTA JEE, NEET, SAT, and GRE questions. Every attempt is permanently tracked from zero with accuracy percentage and daily analytics.
              </p>
            </div>

            {/* Action Buttons: Reset to Zero & End of Day Report */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#EFECE3] hover:bg-rose-50 border border-[#D5CFBE] hover:border-rose-200 text-xs font-semibold text-[#5E685B] hover:text-rose-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Reset all today's records back to zero"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start from Zero</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onRequestDailyReport) {
                    onRequestDailyReport();
                  } else {
                    window.dispatchEvent(new Event("beyond:open-report"));
                  }
                }}
                className="px-3.5 py-2 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-[#B07D4F]" />
                <span>View Day Report</span>
              </button>
            </div>
          </div>

          {/* Real-Time Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
            <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#D5CFBE]">
              <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">MCQs Solved</span>
              <span className="text-xl font-bold text-[#1A2219] font-mono">{stats.totalMCQs}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#D5CFBE]">
              <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">PYQs Solved</span>
              <span className="text-xl font-bold text-[#1A2219] font-mono">{stats.totalPYQs}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#D5CFBE]">
              <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">Total Questions</span>
              <span className="text-xl font-bold text-[#1A2219] font-mono">{stats.totalQuestions}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#D5CFBE]">
              <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">Correct</span>
              <span className="text-xl font-bold text-emerald-800 font-mono">{stats.correctCount}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#D5CFBE]">
              <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">Accuracy</span>
              <span className="text-xl font-bold text-[#283826] font-mono">
                {stats.totalQuestions > 0 ? `${stats.accuracyPercentage}%` : "0%"}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#D5CFBE]">
              <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">Focus Time</span>
              <span className="text-xl font-bold text-[#B07D4F] font-mono">{stats.totalFocusMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-[#EFECE3] border-b border-[#D5CFBE] flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#5E685B] font-mono uppercase">Filter Exam:</span>
            {(["ALL", "JEE", "NEET", "SAT", "GRE"] as const).map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setSelectedExam(ex);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedExam === ex
                    ? "bg-[#283826] text-[#F7F5F0]"
                    : "bg-[#E5E0D2] text-[#556052] hover:bg-[#D5CFBE]"
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[#5E685B]">
            Problem {currentIndex + 1} of {filteredQuestions.length}
          </div>
        </div>

        {/* Question Solving Body */}
        <div className="p-6 space-y-5">
          {/* Question Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono uppercase ${
              activeQuestion.type === "PYQ" 
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-blue-100 text-blue-900 border border-blue-300"
            }`}>
              {activeQuestion.type === "PYQ" ? `Previous Year Question (${activeQuestion.pyqYear})` : "Standard Syllabus MCQ"}
            </span>

            <span className="px-2.5 py-1 rounded bg-[#EAE6DB] border border-[#DDD7C8] text-xs font-semibold text-[#283826]">
              {activeQuestion.subject}
            </span>

            <span className="px-2.5 py-1 rounded bg-[#EAE6DB] border border-[#DDD7C8] text-xs font-mono text-[#556052]">
              Topic: {activeQuestion.topic}
            </span>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">
            <p className="font-serif text-base sm:text-lg text-[#1A2219] leading-relaxed">
              {activeQuestion.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === activeQuestion.correctIndex;
              
              let optStyle = "bg-[#FAF8F5] border-[#D5CFBE] hover:bg-[#F0EDE4] text-[#1A2219]";
              if (isAnswered) {
                if (isCorrectAnswer) {
                  optStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold";
                } else if (isSelected && !isCorrectAnswer) {
                  optStyle = "bg-rose-50 border-rose-500 text-rose-950";
                } else {
                  optStyle = "bg-[#F7F5F0] border-[#E1DDD2] text-[#7C8578] opacity-60";
                }
              }

              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered || isSubmitting}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-center justify-between text-sm ${optStyle} shadow-2xs cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#EAE6DB] border border-[#D5CFBE] flex items-center justify-center font-mono font-bold text-xs shrink-0 text-[#283826]">
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {isAnswered && (
            <div className={`p-4 rounded-lg border animate-in fade-in duration-200 ${
              selectedOption === activeQuestion.correctIndex 
                ? "bg-emerald-50/70 border-emerald-300"
                : "bg-rose-50/70 border-rose-300"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-sm flex items-center gap-1.5">
                  {selectedOption === activeQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span className="text-emerald-900">Correct! +{activeQuestion.type === "PYQ" ? "20" : "15"} Stars Recorded</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-700" />
                      <span className="text-rose-900">Incorrect. Review the detailed solution below:</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-mono font-semibold text-[#556052]">
                  Logged to Database
                </span>
              </div>
              <p className="text-xs text-[#283826] font-sans leading-relaxed">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Footer Controls: Next Question */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E1DDD2]">
            <div className="text-xs text-[#6C7D64]">
              {isAnswered ? "Recorded in today's daily log" : "Select an option to evaluate"}
            </div>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting to Zero */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2219]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#F7F5F0] paper-texture rounded-xl border border-[#D5CFBE] shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1A2219]">
                  Start Records From Zero?
                </h4>
                <p className="text-xs text-[#556052] mt-1 font-sans">
                  This will reset all your tracked MCQ questions, PYQ records, and focus sessions back to zero for a clean slate. Your baseline profile remains preserved.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-[#EFECE3] border border-[#DDD7C8] text-xs text-[#283826] space-y-1">
              <p className="font-semibold">• MCQs & PYQs attempts reset to 0</p>
              <p className="font-semibold">• Today's focus sessions reset to 0 minutes</p>
              <p className="font-semibold">• Today's Daily Report refreshed from scratch</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded text-xs font-medium text-[#5E685B] hover:bg-[#E5E0D2] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetting}
                onClick={handleResetToZero}
                className="px-4 py-1.5 rounded bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{resetting ? "Resetting..." : "Confirm Reset to Zero"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
