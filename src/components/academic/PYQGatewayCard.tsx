"use client";

import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Award, 
  Layers, 
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export function PYQGatewayCard() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="rounded-xl bg-[#FAF8F5] paper-texture border border-[#D5CFBE] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
        
        {/* Subtle Decorative Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#283826]/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

        <div className="space-y-3 relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#283826] text-[#F7F5F0] text-[10px] font-mono uppercase tracking-wider font-semibold">
              Separate Dedicated Station
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#B07D4F] text-white text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              Nemotron Ultra AI Solver
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A2219]">
            Official PYQs Repository & AI Derivation Engine
          </h3>

          <p className="text-xs sm:text-sm text-[#556052] font-sans leading-relaxed">
            All Previous Year Questions across <strong>JEE Main & Advanced</strong>, <strong>NEET UG</strong>, <strong>Digital SAT</strong>, and <strong>GRE</strong> have been cataloged in an ordered, chapter-by-chapter archive. Solve with instant feedback, 60-second competitive speed-hacks, and step-by-step mathematical reasoning.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#283826] pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>NTA JEE & NEET 2024–2022</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Digital SAT Suite</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>GRE General Quantitative</span>
            </span>
          </div>
        </div>

        {/* CTA Launch Button */}
        <div className="relative z-10 shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
          <Link
            href="/pyqs"
            className="px-6 py-3 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all group/btn"
          >
            <BookOpen className="w-4 h-4 text-[#B07D4F]" />
            <span>Open PYQ Station</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <span className="text-[11px] font-mono text-[#6C7D64] text-center">
            Zero-Base Tracking Enabled
          </span>
        </div>

      </div>
    </section>
  );
}
