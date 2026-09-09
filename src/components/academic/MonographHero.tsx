"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, BookOpen, Users, Target, ShieldCheck, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";

export function MonographHero() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
      })
      .catch((err) => console.error("Error loading profile for home hero:", err));

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

  const firstName = profile?.fullName ? profile.fullName.trim().split(" ")[0] : null;

  return (
    <section className="pt-8 pb-10 md:pt-12 md:pb-14 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Monograph Top Metadata Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-[#E1DDD2]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#283826]" />
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826]">
              Academic Growth Network • Class 11–12 & Competitive Exams
            </span>
          </div>

          {firstName ? (
            <Link
              href="/student/profile"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#283826] text-[#F7F5F0] text-xs font-mono hover:bg-[#364A33] transition-all shadow-2xs group"
            >
              <img
                src={profile?.avatarUrl || "https://avatars.githubusercontent.com/u/101566537?v=4"}
                alt={firstName}
                className="w-4 h-4 rounded-full object-cover border border-[#C8A95B]"
              />
              <span>Welcome back, <strong className="text-[#C8A95B] font-bold">{firstName}</strong></span>
              <span className="text-[10px] text-[#D5CFBE] font-sans">
                ({profile?.membershipTier === "GOLD" ? "Gold Scholar" : "Active"})
              </span>
              <ArrowRight className="w-3 h-3 text-[#C8A95B] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="text-[11px] font-mono text-[#6C7D64]">
              Official Source Synchronized • AY 2026–27
            </div>
          )}
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-6 max-w-4xl">
          {firstName && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Personalized for <strong>{firstName}</strong> • {profile?.targetExam || "JEE Main & Advanced 2027"}</span>
            </div>
          )}

          <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-[#1A2219] leading-[1.12] tracking-tight">
            {firstName ? (
              <>
                Welcome back, <span className="italic font-normal text-[#283826] underline decoration-[#C8A95B]/50 decoration-3">{firstName}</span>. Build the discipline to master your syllabus.
              </>
            ) : (
              <>
                Build the discipline to know where you stand, and <span className="italic font-normal text-[#283826]">exactly what to study next.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#556052] leading-relaxed font-sans max-w-3xl">
            BEYOND replaces generic chatbots and exam noise with a structured academic operating workspace. Connect your daily syllabus planning, topic-level diagnostics, quiet study rooms, and verified scholarship pathways in one focused environment.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#diagnostic"
              className="px-6 py-3.5 rounded bg-[#283826] text-[#F7F5F0] font-sans font-semibold text-sm hover:bg-[#364A33] transition-all shadow-sm flex items-center gap-2 group"
            >
              <span>Explore Diagnostic Roadmap</span>
              <ArrowRight className="w-4 h-4 text-[#F7F5F0] group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="#study-hall"
              className="px-6 py-3.5 rounded bg-[#F0EDE4] hover:bg-[#E8DDC8] text-[#1A2219] font-sans font-semibold text-sm border border-[#E1DDD2] transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#6C7D64]" />
              <span>Enter Quiet Study Hall</span>
            </a>
          </div>
        </div>

        {/* Four Academic Pillars Grid */}
        <div className="mt-8 pt-6 border-t border-[#E1DDD2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded bg-[#F0EDE4]/60 border border-[#E1DDD2] space-y-2">
            <div className="flex items-center gap-2 text-[#283826]">
              <Compass className="w-4 h-4 text-[#283826]" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">01. Guidance</span>
            </div>
            <p className="text-xs text-[#556052] leading-snug">
              JEE vs NEET vs Degree diagnostics with 30-day trial roadmaps.
            </p>
          </div>

          <div className="p-4 rounded bg-[#F0EDE4]/60 border border-[#E1DDD2] space-y-2">
            <div className="flex items-center gap-2 text-[#283826]">
              <Clock className="w-4 h-4 text-[#283826]" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">02. Quiet Rooms</span>
            </div>
            <p className="text-xs text-[#556052] leading-snug">
              Silent focus sessions with Pomodoro cycles and peer goals.
            </p>
          </div>

          <div className="p-4 rounded bg-[#F0EDE4]/60 border border-[#E1DDD2] space-y-2">
            <div className="flex items-center gap-2 text-[#283826]">
              <Target className="w-4 h-4 text-[#283826]" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">03. Mastery</span>
            </div>
            <p className="text-xs text-[#556052] leading-snug">
              Granular topic-level accuracy tracking and targeted remediation.
            </p>
          </div>

          <div className="p-4 rounded bg-[#F0EDE4]/60 border border-[#E1DDD2] space-y-2">
            <div className="flex items-center gap-2 text-[#283826]">
              <ShieldCheck className="w-4 h-4 text-[#B07D4F]" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#B07D4F]">04. Opportunities</span>
            </div>
            <p className="text-xs text-[#556052] leading-snug">
              Verified NSP AY 2026–27 schemes with eligibility checklists.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
