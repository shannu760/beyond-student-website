"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  PiggyBank,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  DollarSign
} from "lucide-react";

interface LiteracyModule {
  id: string;
  title: string;
  category: string;
  summary: string;
  keyTakeaways: string[];
  practicalExercise: string;
}

const MODULES: LiteracyModule[] = [
  {
    id: "mod-1",
    title: "Student Budgeting & The 50/30/20 Rule",
    category: "Money Basics",
    summary: "Learn how to manage monthly pocket money or study allowances responsibly without running out at month-end.",
    keyTakeaways: [
      "50% Needs: Books, stationary, transportation & essential study materials.",
      "30% Wants: Snacks, hobbies & personal social outings.",
      "20% Savings: Emergency fund & future project savings."
    ],
    practicalExercise: "Track every ₹10 expense for 7 days in a simple spreadsheet."
  },
  {
    id: "mod-2",
    title: "Banking Basics, Interest Rates & Inflation Impact",
    category: "Banking & Economics",
    summary: "Understand how savings accounts, fixed deposits (FD), and inflation affect your money's real purchasing power over time.",
    keyTakeaways: [
      "Inflation (6-7% in India): ₹100 today buys fewer goods next year unless invested.",
      "Simple vs Compound Interest: A = P(1 + r/n)^(nt). Time is your greatest asset.",
      "KYC & Account Safety: Never share debit card PINs, CVV codes, or net banking passwords."
    ],
    practicalExercise: "Calculate how much ₹1,000 will be worth in 5 years at 6% annual inflation."
  },
  {
    id: "mod-3",
    title: "Understanding Mutual Funds & Disciplined SIPs",
    category: "Compound Growth",
    summary: "Discover why Systematic Investment Plans (SIPs) in index funds offer disciplined long-term wealth creation without speculative day trading.",
    keyTakeaways: [
      "Rupee Cost Averaging: Regular monthly investments smooth out stock market volatility.",
      "Time in Market vs Timing the Market: Long horizons (5-10+ years) mitigate short-term risks.",
      "Expense Ratios & Direct Plans: Direct mutual funds save commission costs over decades."
    ],
    practicalExercise: "Use an online SIP calculator to model ₹500/month invested at 12% over 10 years vs 20 years."
  },
  {
    id: "mod-4",
    title: "Risk Management & Insurance Basics",
    category: "Protection & Risk",
    summary: "Understand the fundamental purpose of insurance as protection against catastrophic financial loss rather than an investment.",
    keyTakeaways: [
      "Health Insurance: Protects student families from unexpected hospitalization expenses.",
      "Term Life Insurance: Pure financial protection for family dependents without hidden investment commissions.",
      "Never confuse insurance with high-return investment schemes (avoid ULIP traps)."
    ],
    practicalExercise: "Identify the key difference between term insurance and endowment policies."
  },
  {
    id: "mod-5",
    title: "Income Tax Basics & PAN Card Awareness",
    category: "Civic & Tax Basics",
    summary: "Learn why every citizen needs a Permanent Account Number (PAN) and how basic tax brackets work for students earning through scholarships or internships.",
    keyTakeaways: [
      "PAN Card: Mandatory for formal bank accounts, scholarships, and investments in India.",
      "Tax Brackets & Rebates: Section 87A rebate exempts individual income up to ₹7 Lakhs under the New Tax Regime.",
      "Scholarship Exemption: Most merit scholarships for educational expenses are tax-exempt under Section 10(16)."
    ],
    practicalExercise: "Check eligibility requirements for obtaining a student PAN card online via NSDL / UTIITSL."
  },
  {
    id: "mod-6",
    title: "Digital Payment Safety, UPI Rules & Scam Defense",
    category: "Digital Safety",
    summary: "Essential guidelines to protect yourself from UPI phishing scams, fake scholarship processing fees, and suspicious link attacks.",
    keyTakeaways: [
      "NEVER enter your UPI PIN to RECEIVE money — UPI PIN is only required to send money.",
      "Official government scholarships (NSP) NEVER charge application fees via Telegram/WhatsApp.",
      "Verify link URLs before entering passwords or OTPs."
    ],
    practicalExercise: "Spot 3 red flags in sample phishing screenshots (unknown sender, urgent tone, strange domain)."
  }
];

export default function FinancialLiteracyPage() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompletedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              Financial Literacy for Students
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Responsible Education
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Foundational education on budgeting, banking, inflation, insurance, taxes, and digital scam protection.
          </p>
        </div>
      </div>

      {/* Mandatory Non-Trading Advisory Banner */}
      <div className="p-3.5 rounded-2xl bg-[#E8DCC3]/50 border border-[#3D4425]/15 text-[11px] text-[#3D4425] flex items-start sm:items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <strong className="text-[#252B18]">Responsible Financial Education Only:</strong> BEYOND does not provide investment advisory, financial product promotions, or speculative trading features. All modules are designed strictly for foundational financial literacy for students.
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-5">
        {MODULES.map((mod) => {
          const isDone = completedModules.includes(mod.id);
          return (
            <div
              key={mod.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 shadow-sm ${
                isDone
                  ? "bg-[#E8DCC3]/50 border-[#3D4425]/15 opacity-80"
                  : "bg-[#F8F4EC] border-[#3D4425]/20 hover:border-[#C8A95B]"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#3D4425]/10 pb-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[#3D4425] bg-[#E8DCC3] px-2.5 py-0.5 rounded">
                  {mod.category}
                </span>

                <button
                  onClick={() => toggleComplete(mod.id)}
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
                    isDone
                      ? "bg-emerald-700 border-emerald-700 text-white"
                      : "border-[#3D4425] text-[#3D4425] hover:bg-[#3D4425] hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? "Completed" : "Mark Complete (+40 Stars)"}</span>
                </button>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-[#252B18]">
                  {mod.title}
                </h3>
                <p className="text-xs text-[#69704A] mt-1">{mod.summary}</p>
              </div>

              <div className="bg-[#E8DCC3]/50 p-4 rounded-2xl border border-[#3D4425]/10 space-y-2">
                <div className="text-xs font-bold text-[#252B18]">Key Concepts:</div>
                <ul className="text-xs text-[#3D4425] space-y-1.5">
                  {mod.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3D4425] shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-[#3D4425] bg-white p-3 rounded-xl border border-[#3D4425]/10">
                <strong>Practical Exercise:</strong> {mod.practicalExercise}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
