import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Compass, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Users, 
  Award, 
  ExternalLink, 
  AlertTriangle,
  ArrowRight,
  Layers,
  Lock
} from "lucide-react";
import { AcademicHeader } from "@/components/academic/AcademicHeader";
import { AcademicFooter } from "@/components/academic/AcademicFooter";

export const metadata = {
  title: "About & Trust Charter — BEYOND Student Growth Network",
  description: "Official product thesis, strategic positioning, safety charter, and what BEYOND is and is not.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#F7F5F0] text-[#1A2219] selection:bg-[#283826] selection:text-[#F7F5F0]">
      {/* Top Monograph Navigation Header */}
      <AcademicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 space-y-12">
        {/* Monograph Lead Banner */}
        <div className="space-y-4 border-b border-[#E1DDD2] pb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#283826] text-[#C8A95B]">
              BEYOND Constitution • Version 1.0
            </span>
            <span className="text-[10px] font-mono text-[#6C7D64]">
              Official Product Blueprint
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A2219] leading-tight">
            A Student Growth Network, <br />
            <span className="italic font-normal text-[#6C7D64]">Not Another Generic AI Chatbot.</span>
          </h1>

          <p className="font-serif text-base sm:text-lg text-[#3D4425] leading-relaxed max-w-2xl">
            BEYOND replaces generic chatbot noise with a structured academic operating system. Its long-term purpose is to help Class 11–12, JEE, NEET, and undergraduate students answer one recurring question:
          </p>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#283826] text-[#F7F5F0] border border-[#C8A95B]/40 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C8A95B] font-bold">The Core Question</span>
              <div className="font-serif text-lg sm:text-xl font-bold text-white italic">
                &ldquo;What should I do next?&rdquo;
              </div>
            </div>
            <Compass className="w-8 h-8 text-[#C8A95B] shrink-0" />
          </div>
        </div>

        {/* Section 1: What BEYOND Is NOT */}
        <section className="space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6C7D64] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#283826]" />
              <span>Boundary Charter</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A2219]">
              What BEYOND Is NOT
            </h2>
            <p className="text-xs text-[#556052] leading-relaxed">
              We stand apart through clear boundaries. BEYOND is built to protect focus, uphold trust, and respect student agency:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "Not a generic ChatGPT wrapper",
                desc: "We don't feed prompts blindly to an LLM. BEYOND couples grounded student context, official syllabus matrices, and verified NTA/NSP records before recommending actions."
              },
              {
                title: "Not a social media clone",
                desc: "Zero infinite scroll feeds, zero vanity metrics, and zero algorithmic dopamine loops designed to steal your focus. Every room and discussion has a concrete learning objective."
              },
              {
                title: "Not a coaching institute",
                desc: "We do not replace your teachers or claim proprietary exam rank secrets. We provide personal diagnostic clarity, study structure, and peer productivity."
              },
              {
                title: "Not a scholarship guarantee service",
                desc: "We curate verified government (NSP) and foundation schemes with strict checklists. All final eligibility and awards rest exclusively with the official granting bodies."
              },
              {
                title: "Not a trading or investment platform",
                desc: "Our financial literacy curriculum is 100% educational — covering budgeting, inflation, and digital scam defense. Zero student-facing speculative trading or crypto."
              },
              {
                title: "Not a job marketplace for minors",
                desc: "We protect student years for foundational learning, skill development, and creative exploration. We never monetize underage labor or introduce commercial student gigs."
              },
              {
                title: "Not a replacement for educators or parents",
                desc: "Teachers, counselors, parents, and examination authorities remain central. We equip students with longitudinal self-awareness and parents with high-level progress visibility."
              },
              {
                title: "Not a system that decides your career for you",
                desc: "We never deliver deterministic career verdicts. We offer real-world course reality exploration, diagnostic alignment evidence, and suggested next steps to test yourself."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E1DDD2] space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#9C3826]">
                  <XCircle className="w-4 h-4 shrink-0 text-[#9C3826]" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-[#556052] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: The 4-Floor Student Operating Architecture */}
        <section className="space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6C7D64] font-bold">
              <Layers className="w-4 h-4 text-[#283826]" />
              <span>Product Architecture</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A2219]">
              The 4-Floor Student Operating System
            </h2>
            <p className="text-xs text-[#556052] leading-relaxed">
              Every feature in BEYOND integrates into a purposeful vertical progression:
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                floor: "Floor 4 — Idea & Future Layer",
                title: "BEYOND Idea Lab & Project Builder",
                desc: "Turn your academic ideas into real software, hardware, or research prototypes with AI feasibility analysis, community voting, and 100% student IP ownership."
              },
              {
                floor: "Floor 3 — Opportunities & Financial Literacy",
                title: "National Scholarship Radar & Money Education",
                desc: "Verified AY 2026–27 schemes from the National Scholarship Portal (NSP), document preparation checklists, and foundational budgeting, inflation, and digital safety modules."
              },
              {
                floor: "Floor 2 — Skills & Decisions",
                title: "Diagnostic Pathways & Course Reality Explorer",
                desc: "Real-world B.Tech CSE, MBBS, and B.Sc. Physics curriculum breakdown, AI syllabus diagnostics, chapter quizzes, and programming fundamentals."
              },
              {
                floor: "Floor 1 — Learning + Community",
                title: "Quiet Study Rooms & Peer Help",
                desc: "Live silent study rooms with ambient soundscapes, Pomodoro task tracking, peer concept explanations, and BEYOND Star reputation."
              },
              {
                floor: "BASE — BEYOND Intelligence",
                title: "Context-Aware Student Guidance AI",
                desc: "The intelligence layer combining official curriculum matrices, student mastery signals, and privacy-preserving retrieval to answer 'What should I do next?'"
              }
            ].map((f, i) => (
              <div 
                key={i} 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A95B] bg-[#283826] inline-block px-2 py-0.5 rounded">
                    {f.floor}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1A2219]">{f.title}</h3>
                  <p className="text-xs text-[#556052] max-w-xl">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Official Source Anchors */}
        <section className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E1DDD2] space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#283826] font-bold">
              Verification Standards
            </span>
            <h2 className="font-serif text-xl font-bold text-[#1A2219]">
              Regulatory Anchors & Official Portals
            </h2>
            <p className="text-xs text-[#556052] leading-relaxed">
              BEYOND does not invent exam rules or scholarship dates. All factual data is anchored directly to official governing authorities:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a 
              href="https://jeemain.nta.nic.in/information-bulletin/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl bg-white border border-[#E1DDD2] hover:border-[#283826] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-[#1A2219]">NTA JEE Main Official Bulletin</div>
                <div className="text-[10px] text-[#6C7D64]">Current Session Syllabus & Guidelines</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6C7D64] group-hover:text-[#283826]" />
            </a>

            <a 
              href="https://neet.nta.nic.in/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl bg-white border border-[#E1DDD2] hover:border-[#283826] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-[#1A2219]">NTA NEET UG Official Portal</div>
                <div className="text-[10px] text-[#6C7D64]">Medical Entrance Notices & Information</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6C7D64] group-hover:text-[#283826]" />
            </a>

            <a 
              href="https://scholarships.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl bg-white border border-[#E1DDD2] hover:border-[#283826] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-[#1A2219]">National Scholarship Portal (NSP)</div>
                <div className="text-[10px] text-[#6C7D64]">AY 2026–27 Government Schemes & OTR</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6C7D64] group-hover:text-[#283826]" />
            </a>

            <a 
              href="https://www.ugc.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl bg-white border border-[#E1DDD2] hover:border-[#283826] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-[#1A2219]">University Grants Commission (UGC)</div>
                <div className="text-[10px] text-[#6C7D64]">Higher Education Curriculum Standards</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6C7D64] group-hover:text-[#283826]" />
            </a>
          </div>
        </section>

        {/* Section 4: Safety & Privacy Charter */}
        <section className="p-6 rounded-3xl bg-[#283826] text-[#F7F5F0] space-y-4 shadow-md">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#C8A95B]" />
            <h2 className="font-serif text-xl font-bold text-white">
              Minor Safety & Privacy First Design
            </h2>
          </div>
          <p className="text-xs text-[#D5CFBE] leading-relaxed">
            BEYOND is architected for students, including under-18 learners. We adhere to rigorous safety defaults:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#F0EDE4]">
            <li className="flex items-center gap-2 bg-[#364A33] p-2.5 rounded-xl border border-[#6C7D64]/30">
              <CheckCircle2 className="w-4 h-4 text-[#C8A95B] shrink-0" />
              <span>Zero public phone, email, or physical address exposure</span>
            </li>
            <li className="flex items-center gap-2 bg-[#364A33] p-2.5 rounded-xl border border-[#6C7D64]/30">
              <CheckCircle2 className="w-4 h-4 text-[#C8A95B] shrink-0" />
              <span>No direct unmoderated private DMs between minors</span>
            </li>
            <li className="flex items-center gap-2 bg-[#364A33] p-2.5 rounded-xl border border-[#6C7D64]/30">
              <CheckCircle2 className="w-4 h-4 text-[#C8A95B] shrink-0" />
              <span>100% student ownership of Idea Lab submissions</span>
            </li>
            <li className="flex items-center gap-2 bg-[#364A33] p-2.5 rounded-xl border border-[#6C7D64]/30">
              <CheckCircle2 className="w-4 h-4 text-[#C8A95B] shrink-0" />
              <span>Zero financial transactions or speculative trading</span>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <div className="pt-6 text-center space-y-3">
          <h3 className="font-serif text-xl font-bold text-[#1A2219]">Ready to experience structured academic growth?</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/student/dashboard" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#283826] text-[#F7F5F0] text-xs font-mono font-bold hover:bg-[#364A33] transition-all shadow-sm"
            >
              <span>Open Student Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#C8A95B]" />
            </Link>
            <Link 
              href="/how-it-works" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E1DDD2] text-[#283826] text-xs font-mono font-bold hover:bg-[#FAF8F5] transition-all"
            >
              <span>Explore How BEYOND Works</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <AcademicFooter />
    </div>
  );
}
