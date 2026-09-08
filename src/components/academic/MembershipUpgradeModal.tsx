"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Crown,
  Star,
  Sparkles,
  CheckCircle2,
  X,
  ShieldCheck,
  ArrowRight,
  Zap,
  Check,
  Lock,
  Award,
  BookOpen,
  Users,
  Compass,
  FileCheck,
} from "lucide-react";
import { BeyondBrandBadge, MembershipTier } from "@/components/brand/BeyondBrandBadge";

interface MembershipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: MembershipTier;
  currentStars?: number;
  onUpgraded?: (newTier: MembershipTier, bonusStars: number) => void;
}

export function MembershipUpgradeModal({
  isOpen,
  onClose,
  currentTier = "FREE",
  currentStars = 0,
  onUpgraded,
}: MembershipUpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<"PREMIUM" | "GOLD">(
    currentTier === "PREMIUM" ? "GOLD" : "PREMIUM"
  );
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [upiId, setUpiId] = useState("student@oksbi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = {
    PREMIUM: {
      title: "BEYOND Premium",
      badge: "Most Popular",
      price: 499,
      durationMonths: 3,
      monthlyEquivalent: 166,
      bonusStars: 250,
      accentColor: "emerald",
      tagline: "Accelerate your mastery with unlimited AI derivations & exam-grade roadmaps",
      perks: [
        "Unlimited Nemotron Ultra AI derivations for JEE, NEET, SAT & GRE",
        "30-Day Automated Milestone Syllabus Roadmaps (NTA & College Board aligned)",
        "24/7 Virtual Private Study Booths with binaural acoustic focus channels",
        "Unlimited Buddy4Study & NSP Scholarship SOP Generator exports",
        "2x Star Multiplier on all explanations, PYQ drills & daily streaks",
        "Official BEYOND Premium Scholar Badge visible across all leaderboards",
        "Instant Welcome Gift: +250 Bonus Scholar Stars",
      ],
    },
    GOLD: {
      title: "BEYOND Gold",
      badge: "Elite Scholar",
      price: 699,
      durationMonths: 3,
      monthlyEquivalent: 233,
      bonusStars: 500,
      accentColor: "amber",
      tagline: "The definitive academic pass with 1-on-1 mentorship & verified digital credentials",
      perks: [
        "Everything in BEYOND Premium included",
        "1-on-1 Academic Mentorship with Top Rankers (IIT-B, AIIMS, MIT alumni)",
        "Official Golden Embossed BEYOND Holographic Seal & Digital Student ID",
        "Personalized AI Weak-Topic Remediation Drills based on error analysis",
        "Full Access to Offline Master Syllabus Compendium & Topper Notes (up to 10MB)",
        "Priority Fast-Track Buddy4Study Recommendation Letters & verification",
        "3x Star Multiplier on all explanations, PYQ drills & daily streaks",
        "Instant Welcome Gift: +500 Bonus Scholar Stars",
      ],
    },
  };

  const currentPlan = plans[selectedTier];

  const handleActivatePlan = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Calculate 90 days expiration
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      const bonusStars = currentPlan.bonusStars;
      const updatedStars = currentStars + bonusStars;

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipTier: selectedTier,
          membershipExpiresAt: expiresAt,
          starsBalance: updatedStars,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to activate membership. Please try again.");
      }

      // Notify other components via custom event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("beyond:activity-updated"));
      }

      setIsSuccess(true);
      if (onUpgraded) {
        onUpgraded(selectedTier, bonusStars);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during activation.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A2219]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#F7F5F0] rounded-3xl border border-[#D5CFBE] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with authentic brand motif */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#283826] via-[#364A33] to-[#1E291C] text-[#F7F5F0] flex items-center justify-between border-b border-[#C8A95B]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C8A95B] bg-[#283826] shrink-0">
              <Image
                src="/images/profile-logo.png"
                alt="BEYOND Brand Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#F7F5F0]">
                  BEYOND Student Guild
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C8A95B] text-[#283826] uppercase">
                  Official Pass
                </span>
              </div>
              <p className="text-xs text-[#D5CFBE] font-sans">
                Elevate your prep with high-yield academic privileges & verified credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#D5CFBE] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSuccess ? (
            /* Success View */
            <div className="text-center py-8 px-4 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#283826] to-[#C8A95B] p-1 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#283826] flex items-center justify-center">
                    <Image
                      src="/images/profile-logo.png"
                      alt="BEYOND Emblem"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-[#283826] flex items-center justify-center text-[#283826]">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#1A2219]">
                  Welcome to BEYOND {selectedTier === "GOLD" ? "Gold Scholar" : "Premium Member"}!
                </h3>
                <p className="text-sm text-[#4F5E4B] max-w-md mx-auto">
                  Your 3-month membership has been activated successfully. Your BEYOND badge and
                  scholar privileges are live on your profile and leaderboards.
                </p>
              </div>

              {/* Perks snapshot */}
              <div className="p-5 rounded-2xl bg-white border border-[#D5CFBE] max-w-md mx-auto text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE4]">
                  <div className="flex items-center gap-2">
                    <BeyondBrandBadge size="sm" tier={selectedTier} withLink={false} />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#283826]">
                    Valid for 90 Days
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#4F5E4B]">
                  <span>Bonus Stars Credited:</span>
                  <span className="font-mono font-bold text-amber-700">+{currentPlan.bonusStars} Stars ⭐</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#4F5E4B]">
                  <span>Amount Paid:</span>
                  <span className="font-mono font-bold text-[#1A2219]">₹{currentPlan.price} (3 Months)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#283826] text-[#F7F5F0] font-sans font-semibold text-sm hover:bg-[#364A33] transition-colors shadow-md"
              >
                <span>Continue to Scholar Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Plan Switcher Tabs */}
              <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#EBE7DC] border border-[#D5CFBE]">
                <button
                  type="button"
                  onClick={() => setSelectedTier("PREMIUM")}
                  className={`p-3.5 rounded-xl text-left transition-all relative ${
                    selectedTier === "PREMIUM"
                      ? "bg-white shadow-md border border-emerald-500/50"
                      : "hover:bg-white/50 text-[#6C7D64]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-[#1A2219]">
                      Premium Tier
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 uppercase">
                      ₹499 / 3 mos
                    </span>
                  </div>
                  <p className="text-xs text-[#4F5E4B] leading-tight">
                    ₹166/mo • Unlimited AI & Roadmaps
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTier("GOLD")}
                  className={`p-3.5 rounded-xl text-left transition-all relative ${
                    selectedTier === "GOLD"
                      ? "bg-gradient-to-br from-amber-50 to-white shadow-md border-2 border-[#C8A95B]"
                      : "hover:bg-white/50 text-[#6C7D64]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-[#C8A95B]" />
                      <span className="font-serif font-bold text-sm text-[#1A2219]">
                        Gold Scholar
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#C8A95B] text-[#283826] uppercase">
                      ₹699 / 3 mos
                    </span>
                  </div>
                  <p className="text-xs text-[#4F5E4B] leading-tight">
                    ₹233/mo • 1-on-1 Mentorship & ID
                  </p>
                </button>
              </div>

              {/* Selected Plan Details & Perks */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  selectedTier === "GOLD"
                    ? "bg-gradient-to-b from-[#FAF7EE] to-white border-[#C8A95B]/70 shadow-sm"
                    : "bg-white border-emerald-500/40 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EDE4]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-[#1A2219]">
                        {currentPlan.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          selectedTier === "GOLD"
                            ? "bg-[#C8A95B] text-[#283826]"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {currentPlan.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#4F5E4B] mt-0.5">{currentPlan.tagline}</p>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="flex items-baseline gap-1 sm:justify-end">
                      <span className="font-serif text-3xl font-bold text-[#1A2219]">
                        ₹{currentPlan.price}
                      </span>
                      <span className="text-xs text-[#6C7D64] font-medium">/ 3 months</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#6C7D64]">
                      (Effective ₹{currentPlan.monthlyEquivalent} per month)
                    </span>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="mt-4 space-y-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6C7D64] block">
                    Exclusive Scholar Benefits Included:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {currentPlan.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#283826]">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            selectedTier === "GOLD" ? "text-[#C8A95B]" : "text-emerald-600"
                          }`}
                        />
                        <span className="leading-snug">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="p-4 rounded-2xl bg-[#F0EDE4] border border-[#D5CFBE] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4F5E4B] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Secure Instant Payment Mode
                  </span>
                  <span className="text-[10px] text-[#6C7D64]">100% Student Guarantee</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "UPI", label: "UPI / QR", desc: "GPay, PhonePe, Paytm" },
                    { id: "CARD", label: "Debit / Credit", desc: "Visa, MC, RuPay" },
                    { id: "NETBANKING", label: "Net Banking", desc: "All Indian Banks" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        paymentMethod === method.id
                          ? "bg-white border-[#283826] font-semibold text-[#1A2219] shadow-xs"
                          : "bg-[#F7F5F0] border-[#D5CFBE] text-[#6C7D64] hover:bg-white/60"
                      }`}
                    >
                      <div className="font-sans font-bold">{method.label}</div>
                      <div className="text-[10px] text-[#86967E] truncate">{method.desc}</div>
                    </button>
                  ))}
                </div>

                {paymentMethod === "UPI" && (
                  <div className="pt-1">
                    <label className="text-[11px] font-medium text-[#4F5E4B] block mb-1">
                      Enter UPI ID / VPA (Fast Instant Activation):
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#D5CFBE] text-xs text-[#1A2219] focus:outline-none focus:ring-1 focus:ring-[#283826]"
                    />
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#6C7D64]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Encrypted 256-bit Student Transaction</span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleActivatePlan}
                  className={`w-full sm:w-auto px-7 py-3 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    selectedTier === "GOLD"
                      ? "bg-gradient-to-r from-[#283826] via-[#364A33] to-[#283826] text-[#C8A95B] hover:brightness-110 border border-[#C8A95B]/40"
                      : "bg-[#283826] text-[#F7F5F0] hover:bg-[#364A33]"
                  } disabled:opacity-50`}
                >
                  {isProcessing ? (
                    <span>Activating BEYOND Pass...</span>
                  ) : (
                    <>
                      <span>Pay ₹{currentPlan.price} & Activate BEYOND {selectedTier === "GOLD" ? "Gold" : "Premium"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
