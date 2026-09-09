"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, BookOpen, Compass, Award } from "lucide-react";
import { BeyondBrandBadge } from "@/components/brand/BeyondBrandBadge";

export function AcademicFooter() {
  return (
    <footer className="bg-[#F0EDE4] border-t border-[#E1DDD2] text-[#1A2219] py-8 md:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Monograph Brand Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E1DDD2]">
          <div className="space-y-2">
            <BeyondBrandBadge size="md" href="/" />
            <p className="text-xs text-[#556052] font-serif italic max-w-md mt-2">
              &quot;Helping students understand where they stand, where they should go, and exactly what to do next.&quot;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#556052]">
            <span className="px-3 py-1 rounded bg-[#FAF8F5] border border-[#E1DDD2]">
              Class 11–12 & JEE/NEET
            </span>
            <span className="px-3 py-1 rounded bg-[#FAF8F5] border border-[#E1DDD2]">
              AY 2026–27 Edition
            </span>
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Platform Modules */}
          <div className="space-y-3">
            <div className="font-mono font-bold uppercase text-[10px] text-[#283826] tracking-wider">
              Academic Modules
            </div>
            <ul className="space-y-2 text-[#556052]">
              <li><a href="#schedule" className="hover:text-[#283826]">Daily Study Schedule</a></li>
              <li><a href="#study-hall" className="hover:text-[#283826]">Quiet Study Hall (Pomodoro)</a></li>
              <li><a href="#diagnostic" className="hover:text-[#283826]">Diagnostic Guidance Engine</a></li>
              <li><a href="#mastery" className="hover:text-[#283826]">Topic Mastery Ledger</a></li>
              <li><a href="#scholarships" className="hover:text-[#283826]">Scholarship Radar (NSP)</a></li>
            </ul>
          </div>

          {/* Col 2: Student Workspaces */}
          <div className="space-y-3">
            <div className="font-mono font-bold uppercase text-[10px] text-[#283826] tracking-wider">
              Student Workspaces
            </div>
            <ul className="space-y-2 text-[#556052]">
              <li><Link href="/student/dashboard" className="hover:text-[#283826]">Growth Dashboard</Link></li>
              <li><Link href="/student/study/planner" className="hover:text-[#283826]">Personalized Planner</Link></li>
              <li><Link href="/student/study/rooms" className="hover:text-[#283826]">Live Focus Rooms</Link></li>
              <li><Link href="/student/exams" className="hover:text-[#283826]">Diagnostic Quizzes</Link></li>
              <li><Link href="/student/profile" className="hover:text-[#283826]">BEYOND Student ID</Link></li>
            </ul>
          </div>

          {/* Col 3: Official References */}
          <div className="space-y-3">
            <div className="font-mono font-bold uppercase text-[10px] text-[#283826] tracking-wider">
              Official Anchors
            </div>
            <ul className="space-y-2 text-[#556052]">
              <li>
                <a href="https://jeemain.nta.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#283826] flex items-center gap-1">
                  <span>NTA JEE Main Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://neet.nta.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#283826] flex items-center gap-1">
                  <span>NTA NEET UG Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#283826] flex items-center gap-1">
                  <span>National Scholarship Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.ugc.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#283826] flex items-center gap-1">
                  <span>UGC Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Minor Safety & Privacy */}
          <div className="space-y-3">
            <div className="font-mono font-bold uppercase text-[10px] text-[#283826] tracking-wider">
              Student Privacy & Safety
            </div>
            <p className="text-[#556052] text-[11px] leading-relaxed">
              BEYOND is built with age-appropriate safety defaults. Zero public phone/address exposure, zero pay-to-win ranking, and strictly no speculative gambling or trading features.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Monograph Stamp */}
        <div className="pt-8 border-t border-[#E1DDD2] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#6C7D64]">
          <div>
            © 2026 BEYOND Student Growth Network. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-[#283826] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
            <span>Academic Integrity & Privacy Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
