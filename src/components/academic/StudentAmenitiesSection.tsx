"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  Coffee, 
  PiggyBank, 
  Users, 
  Brain, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Bed,
  Utensils,
  ChevronRight,
  Target
} from "lucide-react";

interface AmenityCategory {
  id: string;
  title: string;
  tag: string;
  iconName: string;
  problemSolved: string;
  keyFeatures: { title: string; desc: string }[];
  actionLink: string;
  actionText: string;
}

const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    id: "mental-health",
    title: "Exam Anxiety & Stress First-Aid",
    tag: "Well-being & Recovery",
    iconName: "HeartPulse",
    problemSolved: "Severe exam panic, isolation, perfectionism, fear of failure, and sleepless nights during competitive prep.",
    keyFeatures: [
      { title: "5-Min Box Breathing Reset", desc: "Clinically proven parasympathetic breathing pacer to stop acute test anxiety in under 5 minutes." },
      { title: "Anonymous Peer Empathy Corner", desc: "Safely share academic struggles and read how senior toppers navigated identical self-doubt." },
      { title: "Official Tele-MANAS SOS Helplines", desc: "Direct, toll-free 24/7 national tele-counseling contact (14416 / 1800-891-4416) with zero judgment." }
    ],
    actionLink: "/student/wellness",
    actionText: "Open Calm Sanctuary"
  },
  {
    id: "academic-clarity",
    title: "Syllabus De-Congestion & PYQ Vault",
    tag: "Core Academics",
    iconName: "BookOpen",
    problemSolved: "Information overload from 50+ Telegram groups, endless unorganized PDFs, and lack of clarity on high-yield topics.",
    keyFeatures: [
      { title: "NTA Weightage Heatmaps", desc: "Chapter-by-chapter frequency of past 10-year questions (JEE Main, Advanced & NEET UG)." },
      { title: "Formula & Derivation Cards", desc: "Concise, verified formulas and boundary condition notes ready for instant 15-minute daily revision." },
      { title: "Active Weakness Remediation", desc: "System auto-generates 5 targeted MCQs fixing only the conceptual traps you failed previously." }
    ],
    actionLink: "/student/exams",
    actionText: "Access High-Yield Vault"
  },
  {
    id: "focus-environment",
    title: "Silent Virtual Study Halls (Zero Video)",
    tag: "Deep Work Focus",
    iconName: "Clock",
    problemSolved: "Hostel/PG noise, social media scrolling procrastination, and studying alone without peer accountability.",
    keyFeatures: [
      { title: "Pomodoro Synchronous Cycles", desc: "Join 25:00 and 45:00 deep-work rounds synchronized with other serious aspirants globally." },
      { title: "Goal-Commitment Wall", desc: "Declare your exact session target (e.g. 'Solve 10 Rotational Dynamics PYQs') before timer starts." },
      { title: "Ambient Lo-Fi Soundscapes", desc: "Curated research library silence, gentle rain, and brown noise to induce deep theta focus." }
    ],
    actionLink: "#study-hall",
    actionText: "Enter Quiet Study Hall"
  },
  {
    id: "living-budget",
    title: "Student Budget, Diet & Hostel Living",
    tag: "Daily Life Survival",
    iconName: "PiggyBank",
    problemSolved: "Financial stress, managing monthly allowance, poor mess nutrition leading to brain fog, and chaotic sleep cycles.",
    keyFeatures: [
      { title: "Monthly Allowance & Mess Tracker", desc: "Categorize expenditures across rent, mess, books, and emergency needs with zero financial jargon." },
      { title: "High-Focus Dorm Nutrition Guide", desc: "Affordable, non-drowsy food combinations that sustain afternoon cognitive endurance." },
      { title: "Circadian Rhythm Sleep Engine", desc: "Scientific sleep & wake calculator tailored to synchronize with official exam shifts (9 AM - 12 PM)." }
    ],
    actionLink: "/student/financial-literacy",
    actionText: "View Student Survival Guide"
  },
  {
    id: "opportunities",
    title: "National Scholarship Radar (AY 2026–27)",
    tag: "Financial Support",
    iconName: "ShieldCheck",
    problemSolved: "Missing critical government financial grants due to obscure portal deadlines and confusing document requirements.",
    keyFeatures: [
      { title: "NSP & Central Sector Direct Filter", desc: "Discover 100% verified schemes based on your state, category, board marks, and family income." },
      { title: "Pre-Application Document Audit", desc: "Checklist for Aadhaar bank seeding, income certificates, bonafide certificates, and marksheets." },
      { title: "Zero-Fee Guarantee", desc: "Direct links to official .gov.in portals. Strictly no hidden agent fees or misleading guarantees." }
    ],
    actionLink: "#scholarships",
    actionText: "Explore Scholarships"
  },
  {
    id: "career-reality",
    title: "Degree Reality Simulator & Idea Lab",
    tag: "Future Decisions",
    iconName: "Compass",
    problemSolved: "Blindly selecting branches based on coaching marketing without knowing what the curriculum actually involves.",
    keyFeatures: [
      { title: "Syllabus Reality Explorer", desc: "Inspect actual 4-year curricula: B.Tech CSE vs ECE vs MBBS vs Pure Sciences (BS-MS)." },
      { title: "Student Idea Lab", desc: "Turn your science or engineering ideas into structured research prototypes with community feedback." },
      { title: "Verified Skill Portfolios", desc: "Build a living portfolio of completed projects, code, and academic milestones for your future." }
    ],
    actionLink: "#diagnostic",
    actionText: "Simulate Career Path"
  }
];

export function StudentAmenitiesSection() {
  const [activeTab, setActiveTab] = useState<string>("mental-health");
  const activeAmenity = AMENITY_CATEGORIES.find((c) => c.id === activeTab) || AMENITY_CATEGORIES[0];

  return (
    <section id="amenities" className="py-10 md:py-14 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Section Header */}
        <div className="space-y-3 pb-6 border-b border-[#E1DDD2]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#283826]" />
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826]">
              Crucial Student Amenities & Problem Solver
            </span>
          </div>
          
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A2219] tracking-tight leading-tight">
            Every essential resource serious students need — <span className="italic font-normal text-[#283826]">without the noise.</span>
          </h2>
          
          <p className="text-sm sm:text-base text-[#556052] leading-relaxed max-w-3xl font-sans">
            Students don’t just fail exams due to lack of study; they struggle with anxiety, isolation, information overload, poor hostel food, and financial stress. BEYOND integrates the physical, mental, and academic amenities required to sustain elite performance.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap gap-2 pb-2">
          {AMENITY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`
                px-4 py-2 text-xs font-mono font-bold rounded transition-all flex items-center gap-2
                ${
                  activeTab === cat.id
                    ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                    : "bg-[#F0EDE4] text-[#556052] hover:text-[#1A2219] hover:bg-[#E8DDC8]"
                }
              `}
            >
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Active Amenity Detailed Showcase Box */}
        <div className="bg-[#FAF8F5] rounded border border-[#E1DDD2] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6C7D64] bg-[#F0EDE4] px-2 py-0.5 rounded border border-[#E1DDD2]">
                {activeAmenity.tag}
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#1A2219] mt-1.5">
                {activeAmenity.title}
              </h3>
            </div>

            <a
              href={activeAmenity.actionLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#283826] text-[#F7F5F0] text-xs font-semibold hover:bg-[#364A33] transition-all shadow-sm shrink-0"
            >
              <span>{activeAmenity.actionText}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Problem Being Solved */}
          <div className="p-4 rounded bg-[#F0EDE4]/70 border border-[#E1DDD2] space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase text-[#B07D4F] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>The Real Student Challenge It Solves</span>
            </div>
            <p className="text-xs text-[#1A2219] font-serif italic leading-relaxed">
              &quot;{activeAmenity.problemSolved}&quot;
            </p>
          </div>

          {/* Key Amenities Delivered with Staggered Scroll Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 scroll-reveal-stagger">
            {activeAmenity.keyFeatures.map((feat, idx) => (
              <div key={idx} className="p-4 rounded bg-[#FAF8F5] border border-[#E1DDD2] space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#283826] shrink-0" />
                    <h4 className="font-sans font-bold text-xs text-[#1A2219]">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-[#556052] leading-relaxed pl-6">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency SOS & High-Impact Callout */}
          {activeAmenity.id === "mental-health" && (
            <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Immediate Confidential Support:</strong> Tele-MANAS (Govt of India Toll-Free): <strong className="font-mono text-emerald-900">14416</strong> or <strong className="font-mono text-emerald-900">1800-891-4416</strong>
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                24x7 Free & Anonymous
              </span>
            </div>
          )}
        </div>

        {/* High Utilization Commitment Banner */}
        <div className="p-6 rounded bg-[#283826] text-[#F7F5F0] border border-[#364A33] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 max-w-2xl">
            <h4 className="font-serif font-bold text-lg text-[#F7F5F0]">
              Built for High Daily Utility — Not Passive Browsing
            </h4>
            <p className="text-xs text-[#F0EDE4]/80 leading-relaxed font-sans">
              Serious academic progress requires using these amenities as daily habits. Complete your daily study blocks, log into quiet study rooms, and review your mastery ledger every evening.
            </p>
          </div>

          <Link
            href="/student/dashboard"
            className="px-6 py-3 rounded bg-[#F7F5F0] text-[#283826] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm shrink-0 text-center"
          >
            Launch Student Hub
          </Link>
        </div>

      </div>
    </section>
  );
}
