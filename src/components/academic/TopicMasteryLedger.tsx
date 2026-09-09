"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Target, ChevronRight, CheckCircle2, AlertCircle, ArrowUpRight, BookOpen } from "lucide-react";

interface TopicMasteryItem {
  id: string;
  subject: "Physics" | "Mathematics" | "Chemistry";
  topic: string;
  testedQuestions: number;
  accuracy: number;
  status: "Proficient" | "Developing" | "Needs Support";
  actionRecommended: string;
}

const MASTERY_ITEMS: TopicMasteryItem[] = [
  // Physics
  { id: "p1", subject: "Physics", topic: "Kinematics & Projectile Motion", testedQuestions: 42, accuracy: 92, status: "Proficient", actionRecommended: "Mentor Eligible" },
  { id: "p2", subject: "Physics", topic: "Newton Laws of Motion & Friction", testedQuestions: 36, accuracy: 85, status: "Proficient", actionRecommended: "Revision in 7 days" },
  { id: "p3", subject: "Physics", topic: "Rotational Dynamics & Torque", testedQuestions: 28, accuracy: 62, status: "Developing", actionRecommended: "Practice 5 PYQs" },
  { id: "p4", subject: "Physics", topic: "Electrostatics Dipole Fields", testedQuestions: 24, accuracy: 48, status: "Needs Support", actionRecommended: "Take Concept Diagnostic" },

  // Mathematics
  { id: "m1", subject: "Mathematics", topic: "Vectors & 3D Geometry", testedQuestions: 38, accuracy: 90, status: "Proficient", actionRecommended: "Maintain Accuracy" },
  { id: "m2", subject: "Mathematics", topic: "Limits & Continuity", testedQuestions: 30, accuracy: 74, status: "Developing", actionRecommended: "Solve L'Hopital Drills" },
  { id: "m3", subject: "Mathematics", topic: "Definite Integrals Properties", testedQuestions: 25, accuracy: 58, status: "Developing", actionRecommended: "Review Leibniz Rule" },
  { id: "m4", subject: "Mathematics", topic: "Complex Numbers & Geometry", testedQuestions: 20, accuracy: 45, status: "Needs Support", actionRecommended: "Remediation Quiz" },

  // Chemistry
  { id: "c1", subject: "Chemistry", topic: "Atomic Structure & Quantum Numbers", testedQuestions: 35, accuracy: 88, status: "Proficient", actionRecommended: "Mastered" },
  { id: "c2", subject: "Chemistry", topic: "Chemical Bonding (VSEPR & MOT)", testedQuestions: 32, accuracy: 78, status: "Developing", actionRecommended: "Hybridization Drills" },
  { id: "c3", subject: "Chemistry", topic: "Coordination Complexes Isomerism", testedQuestions: 22, accuracy: 60, status: "Developing", actionRecommended: "CFT Practice" },
  { id: "c4", subject: "Chemistry", topic: "Organic Hydrocarbon Mechanisms", testedQuestions: 26, accuracy: 52, status: "Needs Support", actionRecommended: "Electrophilic Addition" },
];

export function TopicMasteryLedger() {
  const [selectedSubject, setSelectedSubject] = useState<"All" | "Physics" | "Mathematics" | "Chemistry">("All");

  const filteredItems = selectedSubject === "All"
    ? MASTERY_ITEMS
    : MASTERY_ITEMS.filter((item) => item.subject === selectedSubject);

  return (
    <section id="mastery" className="py-10 md:py-12 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826] mb-1">
              Performance & Diagnostics
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A2219]">
              Topic-Level Academic Mastery
            </h2>
            <p className="text-xs sm:text-sm text-[#556052] mt-1">
              Objective concept mastery mapped directly to diagnostic quiz attempts and error classification.
            </p>
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F0EDE4] p-1 rounded border border-[#E1DDD2]">
            {(["All", "Physics", "Mathematics", "Chemistry"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedSubject(tab)}
                className={`
                  tab-pill px-3 py-1 text-xs font-mono font-bold rounded cursor-pointer
                  ${
                    selectedSubject === tab
                      ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                      : "text-[#556052] hover:text-[#1A2219]"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-[#FAF8F5] rounded border border-[#E1DDD2] overflow-hidden shadow-xs">
          
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0EDE4] border-b border-[#E1DDD2] text-[11px] font-mono uppercase tracking-wider font-bold text-[#556052]">
            <div className="col-span-2">Subject</div>
            <div className="col-span-4">Topic Area</div>
            <div className="col-span-2">Questions / Accuracy</div>
            <div className="col-span-2">Mastery State</div>
            <div className="col-span-2 text-right">Recommended Action</div>
          </div>

          {/* Table Rows with Smooth Transition */}
          <div key={selectedSubject} className="divide-y divide-[#E1DDD2] tab-pane-transition">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-6 py-4 items-center hover:bg-[#F0EDE4]/60 transition-colors"
              >
                {/* Subject */}
                <div className="sm:col-span-2 text-xs font-mono font-bold text-[#283826]">
                  {item.subject}
                </div>

                {/* Topic Name */}
                <div className="sm:col-span-4 text-sm font-serif font-bold text-[#1A2219]">
                  {item.topic}
                </div>

                {/* Questions & Accuracy */}
                <div className="sm:col-span-2 text-xs font-mono text-[#556052]">
                  <span>{item.testedQuestions} MCQs</span>
                  <span className="mx-1.5">•</span>
                  <strong className="text-[#1A2219]">{item.accuracy}%</strong>
                </div>

                {/* Mastery State Pill */}
                <div className="sm:col-span-2">
                  <span
                    className={`
                      text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border inline-block
                      ${
                        item.status === "Proficient"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : item.status === "Developing"
                          ? "bg-blue-100 text-blue-900 border-blue-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Recommended Action */}
                <div className="sm:col-span-2 text-left sm:text-right text-xs font-mono">
                  <a
                    href="#videos"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("beyond:task-updated", {
                          detail: {
                            taskId: item.id,
                            topic: item.topic,
                            status: item.status === "Needs Support" ? "in_progress" : "planned",
                            subject: item.subject,
                          },
                        })
                      );
                    }}
                    className="inline-flex items-center gap-1 text-[#283826] hover:text-[#B07D4F] font-semibold hover:underline transition-colors"
                  >
                    <span>{item.actionRecommended}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remediation Note */}
        <div className="p-4 rounded bg-[#F0EDE4] border border-[#E1DDD2] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#B07D4F] shrink-0 mt-0.5" />
          <div className="text-xs text-[#556052] leading-relaxed">
            <strong className="text-[#1A2219]">Neutral Pedagogical Guidance:</strong> Weak-topic remediation is designed for focused practice without public ranking or shame. Completing targeted remediation quizzes directly upgrades your mastery rating and syllabus readiness.
          </div>
        </div>

      </div>
    </section>
  );
}
