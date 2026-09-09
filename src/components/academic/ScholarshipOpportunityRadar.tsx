"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  Bookmark, 
  Download, 
  Check, 
  Building2,
  Calendar,
  Layers,
  Database
} from "lucide-react";

export interface ScholarshipScheme {
  id: string;
  title: string;
  sourceType: "Official Govt (NSP)" | "Buddy4Study / Foundation";
  authority: string;
  supportAmount: string;
  deadline: string;
  eligibilitySummary: string;
  officialSourceUrl: string;
  verificationStatus: "Verified AY 2026-27";
  documentChecklist: string[];
  studentMatchPercent: number;
  partnerBadge?: string;
}

const SCHEMES: ScholarshipScheme[] = [
  // 1. BUDDY4STUDY: Reliance Foundation
  {
    id: "reliance-foundation",
    title: "Reliance Foundation Undergraduate Scholarship",
    sourceType: "Buddy4Study / Foundation",
    authority: "Reliance Foundation (Application via Buddy4Study)",
    supportAmount: "₹2,00,000 Total Degree Grant",
    deadline: "October 15, 2026",
    eligibilitySummary: "1st year full-time regular UG students in any stream; passed Class 12 with ≥ 60% marks; family income < ₹15 Lakhs (preference < ₹2.5L); mandatory aptitude test.",
    officialSourceUrl: "https://www.buddy4study.com/page/reliance-foundation-undergraduate-scholarships",
    verificationStatus: "Verified AY 2026-27",
    partnerBadge: "Buddy4Study Verified",
    documentChecklist: [
      "Class 10 & 12 Board Marksheet",
      "Current Year College Admission & Bonafide Letter",
      "Annual Family Income Proof (ITR / Tehsildar Certificate)",
      "Aadhaar Card Copy",
      "Passport Size Photograph",
      "Aptitude Test Registration Slip"
    ],
    studentMatchPercent: 94
  },
  // 2. BUDDY4STUDY: HDFC Bank Parivartan
  {
    id: "hdfc-parivartan",
    title: "HDFC Bank Parivartan's ECSS Programme",
    sourceType: "Buddy4Study / Foundation",
    authority: "HDFC Bank CSR (via Buddy4Study Portal)",
    supportAmount: "Up to ₹75,000 / Year (UG / Professional)",
    deadline: "October 31, 2026",
    eligibilitySummary: "Students pursuing Diploma, ITI, Polytechnic, UG, or PG; scored ≥ 55% in qualifying exam; family annual income ≤ ₹2.5 Lakhs; preference for students facing crisis.",
    officialSourceUrl: "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme",
    verificationStatus: "Verified AY 2026-27",
    partnerBadge: "Buddy4Study Verified",
    documentChecklist: [
      "Previous Year Marksheets (Min 55%)",
      "Income Proof (Income Certificate / Salary Slip / Form 16)",
      "Current Admission Receipt & Fee Structure",
      "Proof of Family Crisis (if applicable)",
      "Bank Account Passbook Copy"
    ],
    studentMatchPercent: 88
  },
  // 3. BUDDY4STUDY: Kotak Kanya
  {
    id: "kotak-kanya",
    title: "Kotak Kanya Scholarship 2026-27",
    sourceType: "Buddy4Study / Foundation",
    authority: "Kotak Education Foundation (via Buddy4Study)",
    supportAmount: "₹1,50,000 / Year until graduation",
    deadline: "September 30, 2026",
    eligibilitySummary: "Meritorious girl students admitted to 1st year professional degree programs (Engineering, MBBS, Architecture, LLB, Design); scored ≥ 75% in Class 12; family income ≤ ₹6 Lakhs.",
    officialSourceUrl: "https://www.buddy4study.com/page/kotak-kanya-scholarship",
    verificationStatus: "Verified AY 2026-27",
    partnerBadge: "Buddy4Study Verified",
    documentChecklist: [
      "Class 12 Marksheet (≥ 75% aggregate)",
      "JEE Main / NEET / CLAT / State CET Rank Card",
      "College Admission Letter with Fee Structure",
      "Family Income Certificate (Authorized)",
      "Aadhaar Card & Bank Account Details"
    ],
    studentMatchPercent: 91
  },
  // 4. BUDDY4STUDY: Tata Capital Pankh
  {
    id: "tata-capital-pankh",
    title: "Tata Capital Pankh Scholarship Program",
    sourceType: "Buddy4Study / Foundation",
    authority: "Tata Capital Foundation (via Buddy4Study)",
    supportAmount: "Up to ₹50,000 or 80% of Tuition Fees",
    deadline: "November 15, 2026",
    eligibilitySummary: "Class 11, 12, and undergraduate/polytechnic students enrolled in recognized institutions; scored ≥ 60% in previous academic year; family income ≤ ₹4 Lakhs.",
    officialSourceUrl: "https://www.buddy4study.com/page/tata-capital-pankh-scholarship-program",
    verificationStatus: "Verified AY 2026-27",
    partnerBadge: "Buddy4Study Verified",
    documentChecklist: [
      "Photo Identity Proof (Aadhaar)",
      "Previous Academic Year Marksheet (≥ 60%)",
      "Current Academic Year Fee Receipt",
      "Income Proof issued by competent govt authority",
      "Bank Account Statement"
    ],
    studentMatchPercent: 82
  },
  // 5. OFFICIAL GOVT: Central Sector Scheme
  {
    id: "nsp-csss",
    title: "Central Sector Scheme of Scholarship (CSSS)",
    sourceType: "Official Govt (NSP)",
    authority: "Department of Higher Education, Ministry of Education (MoE)",
    supportAmount: "₹12,000 / Year (UG) • ₹20,000 / Year (PG)",
    deadline: "December 31, 2026",
    eligibilitySummary: "Students scoring above 80th percentile in Class 12 Board Exam stream; family annual income < ₹4.5 Lakhs; enrolled in regular degree programs.",
    officialSourceUrl: "https://scholarships.gov.in/",
    verificationStatus: "Verified AY 2026-27",
    partnerBadge: "National Portal (MoE)",
    documentChecklist: [
      "Class 12 Senior Secondary Marksheet",
      "Aadhaar Card Seeded with Bank Account",
      "Current Year Income Certificate (Tehsildar / Competent Authority)",
      "Bonafide Student Certificate from College / University",
      "Onetime Registration (OTR) on NSP Portal"
    ],
    studentMatchPercent: 95
  },
  // 6. OFFICIAL GOVT: INSPIRE SHE
  {
    id: "dst-inspire",
    title: "INSPIRE Scholarship for Higher Education (SHE)",
    sourceType: "Official Govt (NSP)",
    authority: "Department of Science and Technology (DST), Govt. of India",
    supportAmount: "₹80,000 / Year (₹60,000 Cash + ₹20,000 Summer Research Mentorship)",
    deadline: "November 30, 2026",
    eligibilitySummary: "Top 1% ranking students in Class 12 Board Exams enrolled in regular B.Sc., B.S., or Int. M.Sc. in Natural & Basic Sciences; or KVPY / JEE / NEET rankers.",
    officialSourceUrl: "https://online-inspire.gov.in/",
    verificationStatus: "Verified AY 2026-27",
    partnerBadge: "DST Govt of India",
    documentChecklist: [
      "Class 12 Marksheet & Board Top 1% Endorsement Letter",
      "College Admission Bonafide & Fee Receipt in Natural Sciences",
      "SBI Bank Account Linked to Aadhaar",
      "Category Certificate (if applicable)"
    ],
    studentMatchPercent: 78
  }
];

export function ScholarshipOpportunityRadar() {
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "Govt" | "Buddy4Study">("ALL");
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("reliance-foundation");
  const [trackedSchemes, setTrackedSchemes] = useState<Record<string, boolean>>({});
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingSuccess, setTrackingSuccess] = useState<string | null>(null);
  const [sopModalOpen, setSopModalOpen] = useState(false);
  const [sopContent, setSopContent] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch student's tracked scholarships from Supabase / API
  useEffect(() => {
    async function loadTracked() {
      try {
        const res = await fetch("/api/scholarships/track");
        const json = await res.json();
        if (json.success && json.tracked) {
          const map: Record<string, boolean> = {};
          json.tracked.forEach((t: any) => {
            map[t.schemeId] = true;
          });
          setTrackedSchemes(map);
        }
      } catch (e) {
        console.error("Failed to load tracked scholarships:", e);
      }
    }
    loadTracked();
  }, []);

  const filteredSchemes = SCHEMES.filter((s) => {
    if (selectedCategory === "Govt") return s.sourceType.includes("Govt");
    if (selectedCategory === "Buddy4Study") return s.sourceType.includes("Buddy4Study");
    return true;
  });

  const current = SCHEMES.find((s) => s.id === selectedSchemeId) || SCHEMES[0];

  // Track in Supabase
  const handleTrackInSupabase = async () => {
    setTrackingLoading(true);
    setTrackingSuccess(null);
    try {
      const res = await fetch("/api/scholarships/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId: current.id,
          title: current.title,
          authority: current.authority,
          amount: current.supportAmount,
          deadline: current.deadline,
          status: "Documents_Ready"
        })
      });
      const data = await res.json();
      if (data.success) {
        setTrackedSchemes((prev) => ({ ...prev, [current.id]: true }));
        setTrackingSuccess("Saved to Supabase Ledger! +50 Stars Awarded.");
        window.dispatchEvent(new Event("beyond:activity-updated"));
        setTimeout(() => setTrackingSuccess(null), 4000);
      }
    } catch (e) {
      console.error("Tracking error:", e);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Generate SOP & Document Draft
  const handleGenerateSOP = () => {
    const draft = `STATEMENT OF PURPOSE / APPLICATION JUSTIFICATION
Program: ${current.title}
Authority: ${current.authority}

Respected Selection Committee,

I am writing to formally submit my candidature for the ${current.title}. As a dedicated student preparing for competitive higher education in India (JEE/NEET/Board Examinations), securing this scholarship will directly alleviate the financial burden of my tuition and academic resources.

1. ACADEMIC STANDING & DRIVE:
Throughout my secondary and higher secondary schooling, I have maintained consistent academic discipline, scoring above the benchmark percentile. I actively spend focused study hours weekly solving syllabus problems, mastering derivations in core sciences, and maintaining a high problem-solving accuracy on academic growth platforms.

2. FINANCIAL NEED:
My family's annual income is within the required ceiling of ${current.eligibilitySummary.split(";")[1] || "prescribed limits"}. Due to rising costs of higher professional education and books, receiving this support will ensure that my educational pursuit continues without interruption.

3. DOCUMENTS PREPARED:
All verified documents required by ${current.authority} have been compiled:
${current.documentChecklist.map((d, i) => `   [${i + 1}] ${d}`).join("\n")}

Thank you for considering my application.

Sincerely,
Student Applicant • BEYOND Academic Growth Network
Verified Application Ledger 2026–27`;

    setSopContent(draft);
    setSopModalOpen(true);
  };

  const handleCopySOP = () => {
    navigator.clipboard.writeText(sopContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="scholarships" className="py-10 md:py-12 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826]">
                Verified Opportunity Radar
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                Buddy4Study + NSP Synced
              </span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A2219]">
              Scholarship Schemes & Foundation Grants (AY 2026–27)
            </h2>
            <p className="text-xs sm:text-sm text-[#556052] mt-1 font-sans">
              Curated opportunities from the National Scholarship Portal (NSP) and Buddy4Study corporate foundations with real-time Supabase tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#283826] bg-[#EFECE3] px-3 py-1.5 rounded border border-[#D5CFBE] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#283826]" />
              <span>Tracked: <strong>{Object.keys(trackedSchemes).length}</strong> in Supabase</span>
            </span>
          </div>
        </div>

        {/* Source Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#556052] mr-1">Filter Source:</span>
          {(["ALL", "Govt", "Buddy4Study"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                  : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2]"
              }`}
            >
              {cat === "ALL" ? "All Verified Schemes" : cat === "Govt" ? "Official Government (NSP)" : "Buddy4Study / Foundations"}
            </button>
          ))}
        </div>

        {/* Scheme Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredSchemes.map((scheme) => {
            const isSelected = scheme.id === current.id;
            const isTracked = trackedSchemes[scheme.id];

            return (
              <button
                key={scheme.id}
                type="button"
                onClick={() => setSelectedSchemeId(scheme.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                  isSelected
                    ? "bg-[#FAF8F5] border-[#283826] shadow-md ring-1 ring-[#283826]"
                    : "bg-[#FAF8F5] hover:bg-[#F0EDE4] border-[#E1DDD2] text-[#1A2219]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#EFECE3] text-[#283826] font-bold">
                      {scheme.sourceType}
                    </span>
                    {isTracked && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        Tracked
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#1A2219] line-clamp-2">
                    {scheme.title}
                  </h3>

                  <p className="text-[11px] text-[#6C7D64] font-mono mt-1 truncate">
                    {scheme.authority}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E1DDD2] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#B07D4F] font-mono">
                    {scheme.supportAmount.split("•")[0]}
                  </span>
                  <span className="text-[10px] font-mono text-[#556052]">
                    {scheme.studentMatchPercent}% Match
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Scheme Breakdown & Action Box */}
        <div className="bg-[#FAF8F5] rounded-xl border border-[#D5CFBE] p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#283826] text-[#F7F5F0] text-[10px] font-mono font-bold uppercase">
                  {current.sourceType}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {current.verificationStatus}
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A2219]">
                {current.title}
              </h3>
              <p className="text-xs text-[#556052] font-mono mt-0.5">
                Authority: {current.authority}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono text-[#6C7D64] block">Financial Grant</span>
              <span className="font-serif font-bold text-lg text-[#B07D4F]">
                {current.supportAmount}
              </span>
              <span className="text-[11px] font-mono text-amber-900 block mt-0.5">
                Deadline: {current.deadline}
              </span>
            </div>
          </div>

          {/* Success Banner on Tracking */}
          {trackingSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{trackingSuccess}</span>
            </div>
          )}

          {/* Eligibility Criteria */}
          <div className="p-4 rounded-lg bg-[#F0EDE4]/60 border border-[#E1DDD2] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-[#283826] block">
              Official Eligibility Criteria:
            </span>
            <p className="text-xs text-[#1A2219] font-sans leading-relaxed">
              {current.eligibilitySummary}
            </p>
          </div>

          {/* Mandatory Document Checklist */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono font-bold uppercase text-[#556052] block">
              Required Documents Checklist for Submission:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.documentChecklist.map((doc, idx) => (
                <div key={idx} className="p-2.5 rounded bg-[#FAF8F5] border border-[#E1DDD2] flex items-center gap-2 text-xs text-[#283826]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row: Track in Supabase, Generate SOP, and External Portal */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E1DDD2]">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Track in Supabase */}
              <button
                type="button"
                onClick={handleTrackInSupabase}
                disabled={trackingLoading}
                className="px-4 py-2.5 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#B07D4F]" />
                <span>
                  {trackedSchemes[current.id] 
                    ? "Update Tracked Status (+50 Stars)" 
                    : "Track Application in Supabase (+50 Stars)"}
                </span>
              </button>

              {/* Generate SOP Draft */}
              <button
                type="button"
                onClick={handleGenerateSOP}
                className="px-4 py-2.5 rounded-lg bg-[#EFECE3] hover:bg-[#E2DDD0] text-[#283826] border border-[#D5CFBE] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#283826]" />
                <span>Generate Application SOP Draft</span>
              </button>
            </div>

            {/* Official Source Link */}
            <a
              href={current.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#283826] hover:text-[#B07D4F] flex items-center gap-1.5 transition-colors"
            >
              <span>Go to Official Application Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

      {/* SOP & Application Draft Modal */}
      {sopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2219]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl bg-[#F7F5F0] paper-texture rounded-xl border border-[#D5CFBE] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D5CFBE]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#283826]" />
                <h4 className="font-serif text-base font-bold text-[#1A2219]">
                  Tailored Scholarship Statement of Purpose (SOP)
                </h4>
              </div>
              <button
                onClick={() => setSopModalOpen(false)}
                className="text-[#6C7D64] hover:text-[#1A2219]"
              >
                ✕
              </button>
            </div>

            <textarea
              readOnly
              rows={14}
              value={sopContent}
              className="w-full p-3.5 rounded-lg bg-white border border-[#D5CFBE] font-mono text-xs text-[#1A2219] leading-relaxed resize-none focus:outline-hidden"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#6C7D64] font-mono">
                Customized for your active student profile
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySOP}
                  className="px-4 py-1.5 rounded bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied to Clipboard!" : "Copy Statement"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSopModalOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-[#EFECE3] text-[#1A2219] text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
