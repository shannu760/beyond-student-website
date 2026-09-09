"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Crown,
  Star,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
  Users,
  Compass,
} from "lucide-react";
import { BeyondBrandBadge, MembershipTier } from "@/components/brand/BeyondBrandBadge";
import { MembershipUpgradeModal } from "./MembershipUpgradeModal";

interface MembershipPlansSectionProps {
  currentTier?: MembershipTier;
  currentStars?: number;
  className?: string;
  onUpgradeSuccess?: (newTier: MembershipTier) => void;
}

export function MembershipPlansSection({
  currentTier = "FREE",
  currentStars = 0,
  className = "",
  onUpgradeSuccess,
}: MembershipPlansSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<"PREMIUM" | "GOLD">("PREMIUM");

  const openUpgradeModal = (tier: "PREMIUM" | "GOLD") => {
    setSelectedPlanForModal(tier);
    setModalOpen(true);
  };

  return (
    <section className={`py-10 md:py-12 px-4 sm:px-6 max-w-7xl mx-auto ${className}`}>
      {/* Brand & Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE7DC] border border-[#D5CFBE]">
          <BeyondBrandBadge size="xs" withLink={false} showSubtitle={false} />
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#283826] uppercase">
            BEYOND Academic Guild
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2219] tracking-tight">
          Invest in High-Yield Academic Rigor
        </h2>

        <p className="font-sans text-[#4F5E4B] text-base sm:text-lg leading-relaxed">
          Choose a BEYOND membership tailored to your target exam. Get unrestricted access to Nemotron
          Ultra AI derivations, verified syllabus roadmaps, and 1-on-1 mentorship.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Tier 1: Free */}
        <div className="rounded-3xl bg-[#FAF9F5] border border-[#D5CFBE] p-7 flex flex-col justify-between transition-all hover:shadow-md">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6C7D64]">
                Foundational
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A2219] mt-1">
                Scholar Free
              </h3>
              <p className="text-xs text-[#4F5E4B] mt-1">
                Essential tools to start zero-base tracking and solve daily questions.
              </p>
            </div>

            <div className="flex items-baseline gap-1.5 pb-4 border-b border-[#EBE7DC]">
              <span className="font-serif text-4xl font-bold text-[#1A2219]">₹0</span>
              <span className="text-xs text-[#6C7D64] font-medium">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-[#283826]">
              {[
                "Daily MCQ & PYQ practice ledger with zero-base tracking",
                "Official NTA & SAT syllabus tracker with live status updates",
                "Community topic explanation reader and peer ratings",
                "Standard Pomodoro study hall timer with ambient audio",
                "Buddy4Study scholarship listings & application deadline alerts",
                "Daily student activity email notification & evening report",
              ].map((perk, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#6C7D64] mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <button
              disabled={currentTier === "FREE"}
              className="w-full py-3 rounded-xl border border-[#D5CFBE] font-sans font-semibold text-xs text-[#4F5E4B] bg-[#FAF9F5] hover:bg-[#F0EDE4] transition-colors disabled:opacity-75"
            >
              {currentTier === "FREE" ? "Current Tier (Free Active)" : "Free Active"}
            </button>
          </div>
        </div>

        {/* Tier 2: Premium (₹499 for 3 months) */}
        <div className="relative rounded-3xl bg-[#FAF9F5] border-2 border-emerald-600/70 p-7 flex flex-col justify-between shadow-xl ring-1 ring-emerald-500/20 scale-[1.02] z-10">
          {/* Top Banner Tag */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-700 text-white font-mono font-bold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-white" />
            <span>Most Popular Choice</span>
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                Accelerated
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A2219] mt-1 flex items-center gap-2">
                BEYOND Premium
              </h3>
              <p className="text-xs text-[#4F5E4B] mt-1">
                For serious aspirants who need unlimited AI derivations and milestone roadmaps.
              </p>
            </div>

            <div className="pb-4 border-b border-[#EBE7DC]">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl font-bold text-[#1A2219]">₹499</span>
                <span className="text-xs text-[#6C7D64] font-medium">/ 3 months</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-1">
                Effective ₹166/month • Save 40%
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#283826]">
              {[
                "Unlimited Nemotron Ultra AI derivations for JEE, NEET, SAT & GRE",
                "30-Day Personalized Syllabus Milestone Roadmaps with tracking",
                "24/7 Virtual Private Study Booths with binaural acoustic rooms",
                "Unlimited Buddy4Study & NSP SOP Generator exports (PDF download)",
                "2x Star Multiplier on all explanations, PYQ drills & streaks",
                "Official BEYOND Premium Scholar Badge on Profile & Leaderboards",
                "Instant Welcome Bonus: +250 Scholar Stars added to balance",
              ].map((perk, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="font-medium">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => openUpgradeModal("PREMIUM")}
              className="w-full py-3.5 rounded-xl bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] font-sans font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{currentTier === "PREMIUM" ? "Renew Premium (₹499 / 3 mos)" : "Activate Premium (₹499 / 3 mos)"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tier 3: Gold (₹699 for 3 months) */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#FAF7EE] via-white to-[#FAF7EE] border-2 border-[#C8A95B] p-7 flex flex-col justify-between shadow-lg">
          {/* Top Banner Tag */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-[#C8A95B] text-[#283826] font-mono font-bold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1.5">
            <Crown className="w-3 h-3 fill-[#283826]" />
            <span>Elite Scholar Pass</span>
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
                Institutional Grade
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A2219] mt-1 flex items-center gap-2">
                BEYOND Gold
              </h3>
              <p className="text-xs text-[#4F5E4B] mt-1">
                The ultimate academic tier with 1-on-1 mentorship & verified digital credentials.
              </p>
            </div>

            <div className="pb-4 border-b border-[#EBE7DC]">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl font-bold text-[#1A2219]">₹699</span>
                <span className="text-xs text-[#6C7D64] font-medium">/ 3 months</span>
              </div>
              <div className="text-[11px] font-mono text-amber-800 font-semibold mt-1">
                Effective ₹233/month • Best Value
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#283826]">
              {[
                "Everything in BEYOND Premium included",
                "1-on-1 Academic Mentorship with Top Rankers (IIT-B, AIIMS, MIT alumni)",
                "Official Golden Embossed BEYOND Holographic Seal & Digital Student ID",
                "Personalized AI Weak-Topic Remediation Drills tailored to your errors",
                "Full Access to Offline Master Syllabus Compendium & Topper Notes (PDF 10MB)",
                "Priority Fast-Track Buddy4Study Recommendation Letters",
                "3x Star Multiplier on all verified activities & streaks",
                "Instant Welcome Bonus: +500 Scholar Stars added to balance",
              ].map((perk, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C8A95B] mt-0.5" />
                  <span className="font-medium">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => openUpgradeModal("GOLD")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#283826] via-[#364A33] to-[#283826] text-[#C8A95B] hover:brightness-110 font-sans font-bold text-xs tracking-wide transition-all shadow-md border border-[#C8A95B]/50 flex items-center justify-center gap-2"
            >
              <span>{currentTier === "GOLD" ? "Renew Gold (₹699 / 3 mos)" : "Activate Gold (₹699 / 3 mos)"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand Identity & Guarantee Footer */}
      <div className="mt-12 p-6 rounded-2xl bg-[#EBE7DC]/70 border border-[#D5CFBE] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#283826] bg-[#283826] shrink-0">
            <Image
              src="/images/profile-logo.png"
              alt="BEYOND"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1A2219]">
              The BEYOND Brand Guarantee
            </h4>
            <p className="text-xs text-[#4F5E4B]">
              Rigorous, human-reviewed, and zero AI fluff. Every derivation and question is audited for JEE, NEET, SAT & GRE.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#4F5E4B] shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#283826]" />
            <span>256-bit Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#C8A95B]" />
            <span>Verified Credentials</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <MembershipUpgradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentTier={currentTier}
        currentStars={currentStars}
        onUpgraded={(newTier) => {
          if (onUpgradeSuccess) onUpgradeSuccess(newTier);
        }}
      />
    </section>
  );
}
