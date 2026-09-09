import React from "react";
import Link from "next/link";
import { 
  Compass, 
  RotateCw, 
  BookOpen, 
  Users, 
  Lightbulb, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Sparkles,
  ShieldCheck,
  Zap,
  Layers
} from "lucide-react";
import { AcademicHeader } from "@/components/academic/AcademicHeader";
import { AcademicFooter } from "@/components/academic/AcademicFooter";

export const metadata = {
  title: "How It Works — The BEYOND Continuous Growth Loops",
  description: "Explore the 4 continuous growth loops powering BEYOND: Learning, Community, Ideas, and Opportunities.",
};

export default function HowItWorks() {
  return (
    <div className="relative min-h-screen bg-[#F7F5F0] text-[#1A2219] selection:bg-[#283826] selection:text-[#F7F5F0]">
      {/* Top Monograph Header */}
      <AcademicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 space-y-12">
        {/* Header Strip */}
        <div className="space-y-4 border-b border-[#E1DDD2] pb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#283826] text-[#C8A95B]">
              Growth Methodology
            </span>
            <span className="text-[10px] font-mono text-[#6C7D64]">
              Section 43 • Master Blueprint
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A2219] leading-tight">
            How BEYOND Works: <br />
            <span className="italic font-normal text-[#6C7D64]">The Four Continuous Growth Loops.</span>
          </h1>

          <p className="font-serif text-base sm:text-lg text-[#3D4425] leading-relaxed max-w-2xl">
            BEYOND does not try to tell you what your entire future must be. Instead, we connect your daily revision, peer collaboration, verified opportunities, and creative ideas into four reinforcing cycles.
          </p>
        </div>

        {/* The 4 Continuous Loops */}
        <div className="space-y-6">
          {/* Loop A: Learning */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1DDD2] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1DDD2] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#283826] text-[#C8A95B] flex items-center justify-center font-bold text-xs font-mono">
                  A
                </div>
                <h2 className="font-serif text-xl font-bold text-[#1A2219]">Loop A — The Learning Engine</h2>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                Academic Progress
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#283826]">
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Diagnostic</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Daily Plan</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Focused Study</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Chapter Quiz</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">Weak Topic Remediation</span>
            </div>

            <p className="text-xs text-[#556052] leading-relaxed">
              Every chapter assessment diagnoses specific misconceptions rather than just calculating a percentage. Your errors feed directly into your next morning&apos;s 15-minute priority review schedule.
            </p>

            <div className="pt-1">
              <Link 
                href="/student/study/planner" 
                className="text-xs font-mono font-bold text-[#283826] hover:text-[#C8A95B] inline-flex items-center gap-1"
              >
                <span>View Personalized Study Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Loop B: Community */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1DDD2] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1DDD2] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#283826] text-[#C8A95B] flex items-center justify-center font-bold text-xs font-mono">
                  B
                </div>
                <h2 className="font-serif text-xl font-bold text-[#1A2219]">Loop B — Peer Learning & Quiet Pods</h2>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#C8A95B] bg-[#283826] px-2.5 py-0.5 rounded">
                Reputation & Stars
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#283826]">
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Ask Peer Question</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Peer Explains</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Concept Solved</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold">+20 BEYOND Stars</span>
            </div>

            <p className="text-xs text-[#556052] leading-relaxed">
              Teaching is the ultimate test of understanding. When you explain a concept to another student or study alongside 120+ peers in silent Pomodoro study pods, you deepen your own mastery and earn verified academic reputation.
            </p>

            <div className="pt-1">
              <Link 
                href="/student/study/rooms" 
                className="text-xs font-mono font-bold text-[#283826] hover:text-[#C8A95B] inline-flex items-center gap-1"
              >
                <span>Enter Quiet Study Rooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Loop C: Ideas */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1DDD2] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1DDD2] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#283826] text-[#C8A95B] flex items-center justify-center font-bold text-xs font-mono">
                  C
                </div>
                <h2 className="font-serif text-xl font-bold text-[#1A2219]">Loop C — BEYOND Idea Lab</h2>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded">
                100% Student IP Ownership
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#283826]">
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Submit Study Idea</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">AI Feasibility Audit</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Student Peer Votes</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 font-bold">Prototype Project</span>
            </div>

            <p className="text-xs text-[#556052] leading-relaxed">
              Have an idea for a 3D physics visualizer or student study tool? Submit it to the Idea Lab. Our AI clarifies your problem statement, suggests prototype steps, and opens it for community peer validation.
            </p>

            <div className="pt-1">
              <Link 
                href="/student/ideas" 
                className="text-xs font-mono font-bold text-[#283826] hover:text-[#C8A95B] inline-flex items-center gap-1"
              >
                <span>Explore BEYOND Idea Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Loop D: Opportunities */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1DDD2] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1DDD2] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#283826] text-[#C8A95B] flex items-center justify-center font-bold text-xs font-mono">
                  D
                </div>
                <h2 className="font-serif text-xl font-bold text-[#1A2219]">Loop D — Opportunities & Scholarships</h2>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                Verified NSP Schemes
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#283826]">
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Profile Match</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Scheme Discovery</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">Document Checklist</span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">Official Application</span>
            </div>

            <p className="text-xs text-[#556052] leading-relaxed">
              We match your class, stream, and category with official Central Sector, PM-YASASVI, and corporate foundation opportunities. We generate your required document checklist so you never miss a deadline.
            </p>

            <div className="pt-1">
              <Link 
                href="/student/opportunities" 
                className="text-xs font-mono font-bold text-[#283826] hover:text-[#C8A95B] inline-flex items-center gap-1"
              >
                <span>Explore Opportunity Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="pt-8 border-t border-[#E1DDD2] text-center space-y-3">
          <h3 className="font-serif text-2xl font-bold text-[#1A2219]">Start your structured student journey</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/student/dashboard" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#283826] text-[#F7F5F0] text-xs font-mono font-bold hover:bg-[#364A33] transition-all shadow-sm"
            >
              <span>Launch Growth Hub</span>
              <ArrowRight className="w-4 h-4 text-[#C8A95B]" />
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#E1DDD2] text-[#283826] text-xs font-mono font-bold hover:bg-[#FAF8F5] transition-all"
            >
              <span>Read Trust Charter</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <AcademicFooter />
    </div>
  );
}
