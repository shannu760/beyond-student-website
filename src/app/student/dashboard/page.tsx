"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  BookOpen,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Flame,
  Star,
  Users,
  Award,
  ChevronRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  FileText,
  Clock
} from "lucide-react";

export default function GrowthHubDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
      })
      .catch((err) => console.error("Error loading profile:", err));

    const handleUpdate = () => {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data?.profile) setProfile(data.profile);
        })
        .catch(() => {});
    };

    window.addEventListener("beyond:activity-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("beyond:activity-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const firstName = profile?.fullName ? profile.fullName.trim().split(" ")[0] : "Krishna";
  const targetExam = profile?.targetExam || "JEE Main 2027";
  const classLevel = profile?.classLevel || "Class 12";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Welcome Monograph Banner */}
      <div className="bg-[#283826] text-[#F7F5F0] rounded-2xl p-6 sm:p-8 border border-[#364A33] shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#F7F5F0] bg-[#364A33] px-3 py-1 rounded border border-[#6C7D64]/40">
              Academic Growth Hub
            </span>
            <span className="text-xs text-[#F0EDE4]/80 font-mono">
              {classLevel} • {targetExam}
            </span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F7F5F0] leading-tight">
            Welcome back, <span className="italic font-normal text-[#F0EDE4]">{firstName}</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#F0EDE4]/90 leading-relaxed font-sans max-w-2xl">
            BEYOND is helping you focus on what matters most today. Your current preparation alignment for <strong className="text-white">{targetExam}</strong> is <strong className="text-[#B07D4F]">88% Strong</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/student/study/planner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#F7F5F0] text-[#283826] font-sans font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-[#283826]" />
              <span>Open Study Planner</span>
            </Link>

            <Link
              href="/student/study/rooms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#364A33] text-[#F7F5F0] font-sans font-bold text-xs uppercase tracking-wider border border-[#6C7D64]/50 hover:bg-[#435B40] transition-all"
            >
              <Users className="w-4 h-4 text-[#F7F5F0]" />
              <span>Enter Quiet Room</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CORE NORTH STAR: WHAT SHOULD I DO NEXT? */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#1A2219]">
              What Should You Study Next?
            </h2>
            <p className="text-xs text-[#556052]">
              High-yield academic actions generated from your recent performance & weak topics.
            </p>
          </div>
          <span className="text-xs font-mono text-[#283826] font-semibold bg-[#F0EDE4] px-3 py-1 rounded border border-[#E1DDD2]">
            3 Actions Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Quiz */}
          <div className="bg-[#FAF8F5] border border-[#E1DDD2] hover:border-[#283826] rounded p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Weak Topic Remediation
                </span>
                <span className="text-xs font-semibold text-[#B07D4F] font-mono">
                  +50 Stars
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A2219]">
                Electrostatics Dipole Quiz
              </h3>
              <p className="text-xs text-[#556052] leading-relaxed">
                You scored 60% on Dipole Problems last week. Solve 3 high-yield questions to fix concept errors.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E1DDD2] flex items-center justify-between">
              <span className="text-xs text-[#556052] font-medium flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> 12 Mins
              </span>
              <Link
                href="/student/exams"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#283826] group-hover:text-[#364A33] transition-colors"
              >
                <span>Start Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Concept Analysis */}
          <div className="bg-[#FAF8F5] border border-[#E1DDD2] hover:border-[#283826] rounded p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  Concept Derivation
                </span>
                <span className="text-xs font-semibold text-[#B07D4F] font-mono">
                  +30 Stars
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A2219]">
                Calculus Limits & Continuity
              </h3>
              <p className="text-xs text-[#556052] leading-relaxed">
                Review L&apos;Hôpital&apos;s Rule and indeterminate forms with structured step-by-step mathematical proofs.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E1DDD2] flex items-center justify-between">
              <span className="text-xs text-[#556052] font-medium flex items-center gap-1 font-mono">
                <FileText className="w-3.5 h-3.5" /> Study Notes
              </span>
              <Link
                href="/student/ai"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#283826] group-hover:text-[#364A33] transition-colors"
              >
                <span>Open Concept Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Peer Study Room */}
          <div className="bg-[#FAF8F5] border border-[#E1DDD2] hover:border-[#283826] rounded p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Live Peer Room
                </span>
                <span className="text-xs font-semibold text-emerald-800 font-mono">
                  8 Live Now
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A2219]">
                JEE Physics Problem Sprint
              </h3>
              <p className="text-xs text-[#556052] leading-relaxed">
                Join 8 classmates in a 45-minute focused problem-solving sprint with timer and goal logs.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E1DDD2] flex items-center justify-between">
              <span className="text-xs text-[#556052] font-medium flex items-center gap-1 font-mono">
                <Users className="w-3.5 h-3.5" /> Room #04
              </span>
              <Link
                href="/student/study/rooms"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#283826] group-hover:text-[#364A33] transition-colors"
              >
                <span>Join Room</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC ALIGNMENT MATRIX */}
      <section className="bg-[#F0EDE4] border border-[#E1DDD2] rounded p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1DDD2] pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#283826]">
              Diagnostic Guidance Engine
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#1A2219]">
              JEE Main 2027 Pathway Alignment
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold font-serif text-[#1A2219]">88%</div>
              <div className="text-[10px] text-[#6C7D64] uppercase font-mono font-bold">Strong Alignment</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#283826] border-t-[#B07D4F] flex items-center justify-center font-bold text-xs text-[#283826] bg-[#FAF8F5]">
              88%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Evidence Points */}
          <div className="bg-[#FAF8F5] rounded p-5 border border-[#E1DDD2] space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#1A2219] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Evidence & Alignment Strengths</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#556052]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>High accuracy in <strong>Mechanics & Vector Calculus</strong> problems during recent mock tests.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Consistent {profile?.streakDays ?? 1}-day study streak averaging 4.5 hours/day of focused concept learning.</span>
              </li>
            </ul>
          </div>

          {/* Uncertainty & Experiments */}
          <div className="bg-[#FAF8F5] rounded p-5 border border-[#E1DDD2] space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#1A2219] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Key Uncertainties & Experiments</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#556052]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>Organic Chemistry reaction mechanisms show higher error rate under timed conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>Need to test speed strategy: switching from Chemistry first to Physics first in sectional mocks.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* OPPORTUNITY & IDEA HIGHLIGHT STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scholarship Radar */}
        <div className="bg-[#283826] text-[#F7F5F0] rounded p-6 border border-[#364A33] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#F0EDE4]">
              National Scholarship Radar
            </span>
            <span className="text-xs font-mono text-[#F0EDE4]/80">AY 2026-27</span>
          </div>

          <h3 className="font-serif font-bold text-xl text-[#F7F5F0]">
            Central Sector Scholarship (NSP)
          </h3>

          <p className="text-xs text-[#F0EDE4]/80 leading-relaxed">
            You match criteria for Class 12 board toppers with ₹12,000/yr support. Verification deadline is approaching.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-bold text-[#B07D4F] font-mono">Strong Match (92%)</span>
            <Link
              href="/student/opportunities"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#F7F5F0] hover:text-[#F0EDE4] transition-colors"
            >
              <span>View Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Idea Lab */}
        <div className="bg-[#F0EDE4] text-[#1A2219] rounded p-6 border border-[#E1DDD2] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#283826]">
              BEYOND Idea Lab
            </span>
            <span className="text-xs font-mono text-[#6C7D64]">Student Feedback</span>
          </div>

          <h3 className="font-serif font-bold text-xl text-[#1A2219]">
            Have an idea to improve study workflow?
          </h3>

          <p className="text-xs text-[#556052] leading-relaxed">
            Submit your concept to the BEYOND Idea Lab. Get feasibility analysis and community feedback.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-[#283826]">142 Ideas This Month</span>
            <Link
              href="/student/ideas"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#283826] hover:text-[#364A33] transition-colors"
            >
              <span>Submit Idea</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
