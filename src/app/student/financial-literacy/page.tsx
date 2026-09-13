"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  PiggyBank,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  X,
  Loader2,
  ChevronRight,
  BadgeInfo,
  BarChart3,
  AlertTriangle,
  Building2,
  Sparkles,
  Bot,
  Send,
  Calculator,
  HelpCircle,
  ArrowRight
} from "lucide-react";

interface LiteracyModule {
  id: string;
  title: string;
  category: string;
  summary: string;
  keyTakeaways: string[];
  practicalExercise: string;
  icon: React.ReactNode;
  color: string;
  aiPrompts: string[];
}

interface OfficialStat {
  label: string;
  value: string;
  source: string;
}

interface ContentSection {
  title: string;
  points: string[];
}

interface SourceLink {
  name: string;
  url: string;
  description: string;
}

interface FinancialInfoResponse {
  topicId: string;
  headline: string;
  officialStats: OfficialStat[];
  sections: ContentSection[];
  sources: SourceLink[];
  lastUpdated: string;
  dataNote: string;
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
    practicalExercise: "Track every ₹10 expense for 7 days in a simple spreadsheet.",
    icon: <PiggyBank className="w-5 h-5" />,
    color: "emerald",
    aiPrompts: [
      "How do I create a 50/30/20 budget on ₹3,000 monthly allowance?",
      "What is the best zero-balance bank account for college students?",
      "How large should a student's emergency fund be?"
    ]
  },
  {
    id: "mod-2",
    title: "Banking Basics, Interest Rates & Inflation Impact",
    category: "Banking & Economics",
    summary: "Understand how savings accounts, fixed deposits (FD), and inflation affect your money's real purchasing power over time.",
    keyTakeaways: [
      "Inflation (5-7% in India): ₹100 today buys fewer goods next year unless invested.",
      "Simple vs Compound Interest: A = P(1 + r/n)^(nt). Time is your greatest asset.",
      "KYC & Account Safety: Never share debit card PINs, CVV codes, or net banking passwords."
    ],
    practicalExercise: "Calculate how much ₹1,000 will be worth in 5 years at 6% annual inflation.",
    icon: <Building2 className="w-5 h-5" />,
    color: "blue",
    aiPrompts: [
      "Why does keeping money in savings account lose value against inflation?",
      "How does the RBI Repo Rate affect SBI Fixed Deposit rates?",
      "Can a student under 18 open an independent bank account in India?"
    ]
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
    practicalExercise: "Use an online SIP calculator to model ₹500/month invested at 12% over 10 years vs 20 years.",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "violet",
    aiPrompts: [
      "What is the difference between Direct and Regular mutual fund plans?",
      "Can a student start a SIP with just ₹100 per month?",
      "Why are Index Funds recommended over active stock trading for beginners?"
    ]
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
    practicalExercise: "Identify the key difference between term insurance and endowment policies.",
    icon: <ShieldAlert className="w-5 h-5" />,
    color: "amber",
    aiPrompts: [
      "Why should you never treat life insurance as an investment product?",
      "What is Ayushman Bharat (PM-JAY) and are student families eligible?",
      "How does Pradhan Mantri Suraksha Bima Yojana provide ₹2 Lakh cover for ₹20/yr?"
    ]
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
    practicalExercise: "Check eligibility requirements for obtaining a student PAN card online via NSDL / UTIITSL.",
    icon: <BookOpen className="w-5 h-5" />,
    color: "orange",
    aiPrompts: [
      "Is scholarship money taxable under Section 10(16) of the Income Tax Act?",
      "How can a student get an instant e-PAN online using Aadhaar?",
      "Do students need to file an ITR if their stipend is under ₹7 Lakh?"
    ]
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
    practicalExercise: "Spot 3 red flags in sample phishing screenshots (unknown sender, urgent tone, strange domain).",
    icon: <CreditCard className="w-5 h-5" />,
    color: "red",
    aiPrompts: [
      "What should I do immediately if I was tricked by a UPI fraudulent link?",
      "Why is entering a UPI PIN always a debit transaction?",
      "How to report cyber fraud on the national 1930 helpline?"
    ]
  }
];

const COLOR_MAP: Record<string, { badge: string; icon: string; stat: string; ring: string }> = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "bg-emerald-100 text-emerald-700",
    stat: "bg-emerald-50 border-emerald-200",
    ring: "hover:border-emerald-400"
  },
  blue: {
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    icon: "bg-blue-100 text-blue-700",
    stat: "bg-blue-50 border-blue-200",
    ring: "hover:border-blue-400"
  },
  violet: {
    badge: "bg-violet-100 text-violet-800 border-violet-300",
    icon: "bg-violet-100 text-violet-700",
    stat: "bg-violet-50 border-violet-200",
    ring: "hover:border-violet-400"
  },
  amber: {
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "bg-amber-100 text-amber-700",
    stat: "bg-amber-50 border-amber-200",
    ring: "hover:border-amber-400"
  },
  orange: {
    badge: "bg-orange-100 text-orange-800 border-orange-300",
    icon: "bg-orange-100 text-orange-700",
    stat: "bg-orange-50 border-orange-200",
    ring: "hover:border-orange-400"
  },
  red: {
    badge: "bg-red-100 text-red-800 border-red-300",
    icon: "bg-red-100 text-red-700",
    stat: "bg-red-50 border-red-200",
    ring: "hover:border-red-400"
  }
};

export default function FinancialLiteracyPage() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activeModule, setActiveModule] = useState<LiteracyModule | null>(null);
  const [drawerContent, setDrawerContent] = useState<FinancialInfoResponse | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);

  // Global AI Mentor State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [allowanceInput, setAllowanceInput] = useState<number>(3000);
  const [budgetPlan, setBudgetPlan] = useState<any>(null);

  // Drawer AI Question State
  const [drawerAiQuery, setDrawerAiQuery] = useState("");
  const [drawerAiResponse, setDrawerAiResponse] = useState<string | null>(null);
  const [drawerAiLoading, setDrawerAiLoading] = useState(false);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const openDrawer = useCallback(async (mod: LiteracyModule) => {
    setActiveModule(mod);
    setDrawerContent(null);
    setInfoError(null);
    setDrawerAiResponse(null);
    setDrawerAiQuery("");
    setLoadingInfo(true);
    try {
      const res = await fetch(`/api/financial-info?topic=${mod.id}`);
      if (!res.ok) throw new Error("Failed to load content");
      const data: FinancialInfoResponse = await res.json();
      setDrawerContent(data);
    } catch {
      setInfoError("Could not load content. Please try again.");
    } finally {
      setLoadingInfo(false);
    }
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveModule(null);
    setDrawerContent(null);
    setInfoError(null);
    setDrawerAiResponse(null);
  }, []);

  // Handle Asking Drawer AI
  const handleAskDrawerAi = async (promptText?: string) => {
    const q = promptText || drawerAiQuery;
    if (!q.trim()) return;
    setDrawerAiLoading(true);
    setDrawerAiResponse(null);
    try {
      const res = await fetch("/api/ai/finance-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          topicId: activeModule?.id,
          mode: "chat"
        })
      });
      const data = await res.json();
      if (data?.answer) {
        setDrawerAiResponse(data.answer);
      } else {
        setDrawerAiResponse("Could not retrieve AI analysis right now. Please try again.");
      }
    } catch (err) {
      setDrawerAiResponse("Error connecting to FinAI service.");
    } finally {
      setDrawerAiLoading(false);
    }
  };

  // Handle Global FinAI Ask
  const handleAskGlobalAi = async (customQ?: string) => {
    const q = customQ || aiQuery;
    if (!q.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    setBudgetPlan(null);
    try {
      const res = await fetch("/api/ai/finance-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, mode: "chat" })
      });
      const data = await res.json();
      if (data?.answer) {
        setAiResponse(data.answer);
      }
    } catch (err) {
      setAiResponse("FinAI service temporarily unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  // Handle AI Budget Simulation
  const handleCalculateBudget = async () => {
    if (!allowanceInput || allowanceInput <= 0) return;
    setAiLoading(true);
    setBudgetPlan(null);
    setAiResponse(null);
    try {
      const res = await fetch("/api/ai/finance-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyAllowance: allowanceInput,
          mode: "budget_plan"
        })
      });
      const data = await res.json();
      if (data?.breakdown) {
        setBudgetPlan(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        setIsAiModalOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeDrawer]);

  // Lock body scroll when drawer or modal is open
  useEffect(() => {
    if (activeModule || isAiModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModule, isAiModalOpen]);

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
            Real official data from RBI, SBI, SEBI, NPCI & Income Tax India with interactive AI guidance.
          </p>
        </div>

        {/* AI Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAiModalOpen(true);
              setAiResponse(null);
              setBudgetPlan(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#252B18] text-[#F7F5F0] hover:bg-[#3D4425] rounded-full text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A95B]" />
            <span>FinAI Mentor & Calculator</span>
          </button>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 rounded-2xl bg-[#E8DCC3]/50 border border-[#3D4425]/15 text-[11px] text-[#3D4425] flex items-start sm:items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <strong className="text-[#252B18]">Responsible Financial Education Only:</strong> BEYOND does not provide investment advisory, financial product promotions, or speculative trading features. All content is sourced directly from RBI, SEBI, IRDAI, NPCI, Income Tax India and other official Indian government portals.
        </div>
      </div>

      {/* Quick AI Mentor Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#252B18] to-[#3D4425] text-[#F7F5F0] shadow-sm border border-[#3D4425]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8A95B] font-bold">
              BEYOND FinAI Active
            </span>
          </div>
          <h3 className="font-display font-bold text-base text-white">
            Have questions on scholarships, student taxes, or banking?
          </h3>
          <p className="text-xs text-stone-300">
            Ask FinAI for instant verified rules on Section 10(16), zero-balance student accounts, or 50/30/20 budgeting.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => {
              setIsAiModalOpen(true);
              handleAskGlobalAi("Is scholarship money taxable under Section 10(16)?");
            }}
            className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
          >
            Tax on Scholarships?
          </button>
          <button
            onClick={() => {
              setIsAiModalOpen(true);
              handleAskGlobalAi("How do I create a 50/30/20 budget on ₹3,000 allowance?");
            }}
            className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium bg-[#C8A95B] text-[#252B18] hover:bg-[#b89849] font-bold transition-colors"
          >
            Plan My Budget →
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        {MODULES.map((mod) => {
          const isDone = completedModules.includes(mod.id);
          const colors = COLOR_MAP[mod.color];
          return (
            <div
              key={mod.id}
              onClick={() => openDrawer(mod)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openDrawer(mod);
              }}
              className={`p-5 rounded-3xl border transition-all shadow-sm cursor-pointer group select-none ${
                isDone
                  ? "bg-[#E8DCC3]/40 border-[#3D4425]/15"
                  : `bg-[#F8F4EC] border-[#3D4425]/20 ${colors.ring} hover:shadow-md`
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${colors.icon}`}>
                  {mod.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${colors.badge}`}>
                      {mod.category}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => toggleComplete(mod.id, e)}
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all ${
                          isDone
                            ? "bg-emerald-700 border-emerald-700 text-white"
                            : "border-[#3D4425] text-[#3D4425] hover:bg-[#3D4425] hover:text-white"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="hidden sm:inline">{isDone ? "Done" : "+40 Stars"}</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#252B18] leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-[#69704A] mt-1 leading-relaxed">{mod.summary}</p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-[#3D4425]/40 group-hover:text-[#3D4425] transition-colors shrink-0 mt-1" />
              </div>

              {/* Key concepts row */}
              <div className="mt-3 ml-14 flex flex-wrap gap-1.5">
                {mod.keyTakeaways.map((pt, i) => (
                  <span key={i} className="text-[10px] text-[#3D4425]/70 bg-[#3D4425]/5 px-2 py-0.5 rounded-full border border-[#3D4425]/10">
                    {pt.split(":")[0]}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── GLOBAL FINAI MODAL & CALCULATOR ── */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F8F4EC] rounded-3xl border border-[#3D4425]/20 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#3D4425]/10 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#252B18]">FinAI Student Mentor</h3>
                  <p className="text-[11px] text-[#69704A]">RBI & SEBI Grounded Financial Guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#3D4425]/10 hover:bg-[#3D4425]/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[#3D4425]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Calculator Toggle / Input */}
              <div className="p-4 rounded-2xl bg-white border border-[#3D4425]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#3D4425]" />
                    <span className="text-xs font-bold text-[#252B18]">50/30/20 Student Budget Planner</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#69704A]">Monthly Pocket Money / Stipend</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#3D4425]">₹</span>
                  <input
                    type="number"
                    value={allowanceInput}
                    onChange={(e) => setAllowanceInput(Number(e.target.value))}
                    placeholder="Enter monthly amount (e.g. 3000)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#3D4425]/20 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#3D4425]"
                  />
                  <button
                    onClick={handleCalculateBudget}
                    disabled={aiLoading}
                    className="px-4 py-1.5 rounded-xl bg-[#252B18] hover:bg-[#3D4425] text-white text-xs font-mono font-bold transition-colors"
                  >
                    Simulate
                  </button>
                </div>

                {/* Budget Plan Display */}
                {budgetPlan && (
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                    <div className="font-bold text-emerald-900 flex items-center justify-between">
                      <span>Monthly Allocation Breakdown:</span>
                      <span className="font-mono">Total: ₹{budgetPlan.allowance}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 rounded-lg bg-white border border-emerald-200">
                        <div className="text-[10px] text-stone-500">Needs (50%)</div>
                        <div className="font-bold text-sm text-[#252B18]">₹{budgetPlan.breakdown.needs.amount}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border-emerald-200">
                        <div className="text-[10px] text-stone-500">Wants (30%)</div>
                        <div className="font-bold text-sm text-[#252B18]">₹{budgetPlan.breakdown.wants.amount}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border-emerald-200">
                        <div className="text-[10px] text-stone-500">Savings (20%)</div>
                        <div className="font-bold text-sm text-emerald-800">₹{budgetPlan.breakdown.savings.amount}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-800 pt-1 leading-relaxed">
                      💡 <strong>Action Plan</strong>: {budgetPlan.breakdown.recommendations.emergencyBuffer} {budgetPlan.breakdown.recommendations.sipSuggestion}
                    </div>
                  </div>
                )}
              </div>

              {/* Preset Questions */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-[#69704A] font-bold">Frequently Asked by Students:</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Is scholarship money taxable under Section 10(16)?",
                    "How do I open an SBI zero-balance account?",
                    "How does an Index Fund SIP differ from day trading?",
                    "How do I recognize a fake scholarship scam?"
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskGlobalAi(q)}
                      className="text-[10px] text-left px-2.5 py-1 rounded-full bg-white border border-[#3D4425]/15 hover:border-[#3D4425] hover:bg-[#3D4425]/5 text-[#3D4425] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Loading indicator */}
              {aiLoading && (
                <div className="flex items-center justify-center py-8 gap-2 text-[#69704A] text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#3D4425]" />
                  <span>Consulting Indian financial guidelines & regulations…</span>
                </div>
              )}

              {/* AI Response Box */}
              {aiResponse && !aiLoading && (
                <div className="p-4 rounded-2xl bg-white border border-[#3D4425]/15 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#69704A] border-b border-[#3D4425]/10 pb-1.5">
                    <span className="flex items-center gap-1 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> FinAI Verified Analysis
                    </span>
                    <span>RBI / SEBI / Tax Act Grounded</span>
                  </div>
                  <div className="text-xs text-[#252B18] leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Input Footer */}
            <div className="p-4 bg-white border-t border-[#3D4425]/10 flex items-center gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAskGlobalAi();
                }}
                placeholder="Ask any financial question (e.g., 'What is Section 87A rebate?')..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#3D4425]/20 focus:outline-none focus:ring-1 focus:ring-[#3D4425]"
              />
              <button
                onClick={() => handleAskGlobalAi()}
                disabled={aiLoading || !aiQuery.trim()}
                className="px-4 py-2 rounded-xl bg-[#252B18] hover:bg-[#3D4425] text-white text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DRAWER BACKDROP ── */}
      {activeModule && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeDrawer}
          aria-label="Close drawer"
        />
      )}

      {/* ── SLIDE-IN DRAWER ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-[#F8F4EC] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          activeModule ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Financial topic deep dive"
      >
        {activeModule && (
          <>
            {/* Drawer Header */}
            <div className="flex items-start justify-between p-5 border-b border-[#3D4425]/10 bg-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${COLOR_MAP[activeModule.color].icon}`}>
                  {activeModule.icon}
                </div>
                <div className="min-w-0">
                  <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${COLOR_MAP[activeModule.color].badge}`}>
                    {activeModule.category}
                  </span>
                  <h2 className="font-display font-bold text-sm text-[#252B18] leading-snug mt-0.5">
                    {activeModule.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full bg-[#3D4425]/10 hover:bg-[#3D4425]/20 flex items-center justify-center shrink-0 ml-2 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-[#3D4425]" />
              </button>
            </div>

            {/* Source attribution bar */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-[10px] text-emerald-800 shrink-0">
              <BadgeInfo className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium">Live data sourced from:</span>
              <span className="font-mono">RBI · SBI · SEBI · NPCI · Income Tax India · IRDAI · AMFI · NSDL</span>
            </div>

            {/* Drawer Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Loading state */}
              {loadingInfo && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 text-[#3D4425] animate-spin" />
                  <p className="text-sm text-[#69704A]">Fetching from official Indian sources…</p>
                </div>
              )}

              {/* Error state */}
              {infoError && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Could not load content</p>
                    <p className="text-xs text-red-700 mt-0.5">{infoError}</p>
                  </div>
                </div>
              )}

              {/* Content */}
              {drawerContent && !loadingInfo && (
                <div className="space-y-5">
                  {/* Headline stat */}
                  <div className="p-4 rounded-2xl bg-[#252B18] text-[#F7F5F0] border border-[#3D4425]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BarChart3 className="w-4 h-4 text-[#C8A95B]" />
                      <span className="text-[10px] font-mono uppercase font-bold text-[#C8A95B]">Key Figures</span>
                    </div>
                    <p className="text-xs leading-relaxed">{drawerContent.headline}</p>
                  </div>

                  {/* Official Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {drawerContent.officialStats.map((stat, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${COLOR_MAP[activeModule.color].stat}`}>
                        <div className="text-[10px] font-mono text-[#69704A] mb-0.5">{stat.label}</div>
                        <div className="text-sm font-bold text-[#252B18]">{stat.value}</div>
                        <div className="text-[9px] text-[#69704A]/70 mt-0.5">Source: {stat.source}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── IN-DRAWER ASK FINAI SECTION ── */}
                  <div className="p-4 rounded-2xl bg-white border border-[#3D4425]/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C8A95B]" />
                        <h4 className="text-xs font-bold text-[#252B18]">Ask FinAI About This Topic</h4>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">AI Mentor</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {activeModule.aiPrompts.map((prompt, pi) => (
                        <button
                          key={pi}
                          onClick={() => handleAskDrawerAi(prompt)}
                          className="text-[10px] text-left px-2.5 py-1 rounded-full bg-[#F8F4EC] border border-[#3D4425]/15 hover:border-[#3D4425] text-[#3D4425] transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={drawerAiQuery}
                        onChange={(e) => setDrawerAiQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAskDrawerAi();
                        }}
                        placeholder={`Ask FinAI a specific question about ${activeModule.category}...`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#3D4425]/20 focus:outline-none focus:ring-1 focus:ring-[#3D4425]"
                      />
                      <button
                        onClick={() => handleAskDrawerAi()}
                        disabled={drawerAiLoading || !drawerAiQuery.trim()}
                        className="px-3 py-1.5 rounded-xl bg-[#252B18] text-white text-xs font-mono font-bold disabled:opacity-40"
                      >
                        Ask
                      </button>
                    </div>

                    {/* Drawer AI Response */}
                    {drawerAiLoading && (
                      <div className="flex items-center gap-2 text-xs text-[#69704A] py-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3D4425]" />
                        <span>FinAI is reviewing regulations…</span>
                      </div>
                    )}

                    {drawerAiResponse && !drawerAiLoading && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#252B18] leading-relaxed whitespace-pre-wrap">
                        {drawerAiResponse}
                      </div>
                    )}
                  </div>

                  {/* Content Sections */}
                  {drawerContent.sections.map((section, si) => (
                    <div key={si} className="space-y-2">
                      <h3 className="text-xs font-bold text-[#252B18] border-b border-[#3D4425]/10 pb-1.5">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.points.map((point, pi) => (
                          <li key={pi} className="flex items-start gap-2 text-xs text-[#3D4425] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3D4425]/40 shrink-0 mt-1.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Official Source Links */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#252B18] border-b border-[#3D4425]/10 pb-1.5">
                      Official Sources — Verified Government & Bank Portals
                    </h3>
                    <div className="space-y-2">
                      {drawerContent.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#3D4425]/10 hover:border-[#3D4425]/30 hover:shadow-sm transition-all group"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#3D4425]/40 group-hover:text-[#3D4425] shrink-0 mt-0.5 transition-colors" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#252B18] group-hover:text-[#3D4425]">{src.name}</div>
                            <div className="text-[10px] text-[#69704A] mt-0.5 truncate">{src.url}</div>
                            <div className="text-[10px] text-[#69704A]/70 mt-0.5">{src.description}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Data note */}
                  <p className="text-[10px] text-[#69704A]/60 italic border-t border-[#3D4425]/10 pt-3">
                    {drawerContent.dataNote}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#3D4425]/10 bg-white shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(activeModule.id, e as unknown as React.MouseEvent);
                }}
                className={`w-full py-2.5 rounded-full text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                  completedModules.includes(activeModule.id)
                    ? "bg-emerald-700 text-white"
                    : "bg-[#252B18] text-white hover:bg-[#3D4425]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedModules.includes(activeModule.id) ? "Marked as Completed ✓" : "Mark as Completed (+40 Stars)"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
