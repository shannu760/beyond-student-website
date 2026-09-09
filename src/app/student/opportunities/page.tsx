"use client";

import React, { useState } from "react";
import {
  Search,
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calendar,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { OFFICIAL_KNOWLEDGE_SOURCES } from "@/lib/ai/student-engine";

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  confidence: "Strong Match" | "Possible Match";
  awardAmount: string;
  deadline: string;
  officialSourceUrl: string;
  sourceOrganization: string;
  documents: string[];
  eligibility: string;
}

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sch-1",
    title: "Central Sector Scheme of Scholarships for College & University Students",
    provider: "Ministry of Education (Government of India)",
    confidence: "Strong Match",
    awardAmount: "₹12,000 / Year",
    deadline: "31st October 2026",
    officialSourceUrl: "https://scholarships.gov.in/",
    sourceOrganization: "National Scholarship Portal (NSP AY 2026-27)",
    documents: [
      "Class 12 Board Marksheet",
      "Family Income Certificate (< ₹4.5 Lakh/yr)",
      "Aadhaar Identity Proof / One-Time Registration (OTR)",
      "Bank Account Details Linked with Aadhaar",
      "Institution Bonafide Certificate"
    ],
    eligibility: "Top 20th percentile students in Class 12 Board examination pursuing regular degree courses."
  },
  {
    id: "sch-2",
    title: "PM-YASASVI Post-Matric Scholarship Scheme",
    provider: "Ministry of Social Justice & Empowerment",
    confidence: "Strong Match",
    awardAmount: "Up to ₹20,000 / Year",
    deadline: "15th November 2026",
    officialSourceUrl: "https://scholarships.gov.in/",
    sourceOrganization: "National Scholarship Portal (NSP)",
    documents: [
      "Class 10/12 Marksheet",
      "Valid Category Certificate (OBC/EBC/DNT)",
      "Annual Income Certificate (< ₹2.5 Lakh/yr)",
      "Domicile Certificate"
    ],
    eligibility: "Meritorious OBC/EBC/DNT students studying in Class 11-12 or undergraduate professional courses."
  },
  {
    id: "sch-3",
    title: "AICTE Pragati Scholarship for Female Students",
    provider: "AICTE (All India Council for Technical Education)",
    confidence: "Possible Match",
    awardAmount: "₹50,000 / Year",
    deadline: "30th November 2026",
    officialSourceUrl: "https://www.aicte-india.org/",
    sourceOrganization: "AICTE Official Portal",
    documents: [
      "Admission proof to AICTE approved B.Tech / Diploma institute",
      "Family Income Certificate (< ₹8 Lakh/yr)"
    ],
    eligibility: "Female students admitted to 1st year B.Tech/Engineering degree programs."
  },
  {
    id: "sch-4",
    title: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation (Application via Buddy4Study)",
    confidence: "Strong Match",
    awardAmount: "₹2,00,000 Total Degree Grant",
    deadline: "15th October 2026",
    officialSourceUrl: "https://www.buddy4study.com/page/reliance-foundation-undergraduate-scholarships",
    sourceOrganization: "Secondary Discovery • Buddy4Study Verified",
    documents: [
      "Class 10 & 12 Board Marksheet",
      "Current Year College Admission & Bonafide Letter",
      "Annual Family Income Proof (< ₹15 Lakh/yr, pref < ₹2.5L)",
      "Aadhaar Identity Proof",
      "Mandatory Aptitude Test Registration"
    ],
    eligibility: "1st year regular full-time undergraduate degree students across India who passed Class 12 with ≥ 60% marks."
  }
];

export default function OpportunitiesPage() {
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(SCHOLARSHIPS[0]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              Scholarship & Opportunity Radar
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Verified NSP AY 2026–27
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Grounded directly in National Scholarship Portal (NSP AY 2026–27) & official ministry schemes.
          </p>
        </div>
      </div>

      {/* Official Transparency & Non-Guarantee Advisory */}
      <div className="p-3.5 rounded-2xl bg-[#E8DCC3]/50 border border-[#3D4425]/15 text-[11px] text-[#3D4425] flex items-start sm:items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <strong className="text-[#252B18]">Official Source Transparency:</strong> National Scholarship Portal (NSP AY 2026–27) is the primary government authority. Buddy4Study schemes are secondary discovery links. BEYOND is an academic guidance network, not an application processing service or scholarship guarantee.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scholarship List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#69704A]">
            Matched Opportunities ({SCHOLARSHIPS.length})
          </div>

          {SCHOLARSHIPS.map((sch) => {
            const isSelected = selectedScholarship?.id === sch.id;
            return (
              <div
                key={sch.id}
                onClick={() => setSelectedScholarship(sch)}
                className={`tab-pill p-4 rounded-2xl border cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-[#252B18] text-[#F3EBDD] border-[#C8A95B] shadow-md"
                    : "bg-[#F8F4EC] text-[#252B18] border-[#3D4425]/20 hover:border-[#3D4425]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                      sch.confidence === "Strong Match"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {sch.confidence}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#C8A95B]">
                    {sch.awardAmount}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm leading-snug">
                  {sch.title}
                </h3>
                <p className={`text-[11px] ${isSelected ? "text-[#D9CAA8]/80" : "text-[#69704A]"}`}>
                  {sch.provider}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Scholarship Detail View with Smooth Transition */}
        {selectedScholarship && (
          <div key={selectedScholarship.id} className="lg:col-span-2 bg-[#F8F4EC] border border-[#3D4425]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm tab-pane-transition">
            <div className="border-b border-[#3D4425]/15 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D4425] font-bold">
                  {selectedScholarship.sourceOrganization}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified Source
                </span>
              </div>

              <h2 className="font-accent font-bold text-2xl text-[#252B18]">
                {selectedScholarship.title}
              </h2>
              <p className="text-xs text-[#69704A] font-medium">
                Provided by: {selectedScholarship.provider}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#E8DCC3]/60 p-4 rounded-2xl border border-[#3D4425]/10">
              <div>
                <div className="text-[10px] uppercase font-mono font-bold text-[#69704A]">Financial Support</div>
                <div className="text-lg font-bold font-display text-[#252B18]">{selectedScholarship.awardAmount}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-bold text-[#69704A]">Application Deadline</div>
                <div className="text-lg font-bold font-display text-[#252B18]">{selectedScholarship.deadline}</div>
              </div>
            </div>

            {/* Eligibility Summary */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-sm text-[#252B18] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#3D4425]" />
                <span>Eligibility Requirements</span>
              </h3>
              <p className="text-xs text-[#3D4425] leading-relaxed bg-[#E8DCC3]/40 p-3.5 rounded-xl border border-[#3D4425]/10">
                {selectedScholarship.eligibility}
              </p>
            </div>

            {/* Required Document Checklist */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-sm text-[#252B18] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3D4425]" />
                <span>Required Document Checklist</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#3D4425]">
                {selectedScholarship.documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#3D4425]/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply Action Link */}
            <div className="pt-4 border-t border-[#3D4425]/15 flex items-center justify-between">
              <div className="text-[11px] text-[#69704A] font-mono">
                Official Applications open on NSP Portal
              </div>
              <a
                href={selectedScholarship.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#252B18] text-[#F3EBDD] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#3D4425] transition-all shadow-md"
              >
                <span>Visit Official Scheme Portal</span>
                <ExternalLink className="w-4 h-4 text-[#C8A95B]" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
