"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, ChevronRight, BookOpen } from "lucide-react";

interface Pathway {
  id: string;
  name: string;
  admissionRoute: string;
  duration: string;
  coreCurriculum: string[];
  careerReality: string;
  misconception: string;
  alignmentScore: number;
}

const PATHWAYS: Pathway[] = [
  {
    id: "engineering",
    name: "Engineering (B.Tech CSE / ECE)",
    admissionRoute: "JEE Main / JEE Advanced (NTA)",
    duration: "4 Years (8 Semesters)",
    coreCurriculum: [
      "Discrete Mathematics & Calculus",
      "Data Structures & Algorithm Design",
      "Computer Architecture & OS",
      "Digital Signal Processing & Circuits"
    ],
    careerReality: "Heavy focus on analytical reasoning, algorithmic logic, software systems, and engineering projects.",
    misconception: "Myth: 'You only code all day.' Reality: Strong foundation in applied mathematics and system logic is essential.",
    alignmentScore: 88,
  },
  {
    id: "medical",
    name: "Medical Sciences (MBBS / BDS)",
    admissionRoute: "NEET UG (NTA / NMC)",
    duration: "5.5 Years (Inc. 1 Year Internship)",
    coreCurriculum: [
      "Human Anatomy & Embryology",
      "Physiology & Biochemistry",
      "Pathology, Microbiology & Pharmacology",
      "Clinical Diagnostics & Patient Care"
    ],
    careerReality: "Extensive memorization of biological mechanisms, clinical diagnostic rotations, high patient empathy, long training curve.",
    misconception: "Myth: 'MBBS ends after graduation.' Reality: Specialization (MD/MS) is required for independent clinical practice.",
    alignmentScore: 54,
  },
  {
    id: "pure_sciences",
    name: "Pure Sciences (BS-MS Physics / Math)",
    admissionRoute: "IISER IAT / NISER NEST / CUET",
    duration: "4-5 Years",
    coreCurriculum: [
      "Classical & Analytical Mechanics",
      "Quantum Mechanics & Statistical Physics",
      "Electrodynamics & Relativity",
      "Experimental Lab Research"
    ],
    careerReality: "Fundamental theoretical discovery, research papers, computational simulations, higher degree progression (Ph.D.).",
    misconception: "Myth: 'Pure science has limited careers.' Reality: High demand in quantum computing, data modeling, and research institutes.",
    alignmentScore: 76,
  },
];

export function DiagnosticPathwaySimulator() {
  const [activePathway, setActivePathway] = useState<string>("engineering");
  const selected = PATHWAYS.find((p) => p.id === activePathway) || PATHWAYS[0];

  return (
    <section id="diagnostic" className="py-16 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826] mb-1">
              Decision Support Engine
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A2219]">
              Academic Diagnostic & Pathway Simulator
            </h2>
            <p className="text-xs sm:text-sm text-[#556052] mt-1">
              Transparent, evidence-based guidance to evaluate engineering vs medical vs pure science streams.
            </p>
          </div>

          <div className="text-xs font-mono text-[#283826] bg-[#F0EDE4] px-3.5 py-2 rounded border border-[#E1DDD2]">
            Current Alignment: <strong className="text-[#283826]">88% Engineering</strong>
          </div>
        </div>

        {/* Alignment Matrix Banner */}
        <div className="bg-[#FAF8F5] rounded border border-[#E1DDD2] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6C7D64]">
                Diagnostic Baseline
              </span>
              <h3 className="font-serif font-bold text-xl text-[#1A2219]">
                JEE Main 2027 Diagnostic Evaluation
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-[#283826]">88%</span>
              <span className="text-xs font-mono uppercase font-bold text-[#283826] bg-[#283826]/10 px-2 py-0.5 rounded">
                Strong Alignment
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-[#283826] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Evidence & Demonstrated Strengths</span>
              </div>
              <ul className="text-xs text-[#556052] space-y-1.5 list-disc list-inside">
                <li>High accuracy in Kinematics, Dynamics, and Coordinate Geometry.</li>
                <li>Consistent problem-solving endurance averaging 4 hours/day.</li>
                <li>Strong conceptual reasoning demonstrated in recent diagnostic quizzes.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-[#B07D4F] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#B07D4F]" />
                <span>Uncertainties & Recommended Tests</span>
              </div>
              <ul className="text-xs text-[#556052] space-y-1.5 list-disc list-inside">
                <li>Higher error rate under strict 60-second timed pressure in Chemistry.</li>
                <li>Need to test pure mathematics abstraction vs applied coding projects.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pathway Comparison Tabs */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 border-b border-[#E1DDD2] pb-3">
            {PATHWAYS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePathway(p.id)}
                className={`
                  px-4 py-2 text-xs font-mono font-bold rounded transition-colors
                  ${
                    activePathway === p.id
                      ? "bg-[#283826] text-[#F7F5F0]"
                      : "bg-[#F0EDE4] text-[#556052] hover:text-[#1A2219]"
                  }
                `}
              >
                {p.name} ({p.alignmentScore}%)
              </button>
            ))}
          </div>

          {/* Selected Pathway Details Card */}
          <div className="bg-[#FAF8F5] rounded border border-[#E1DDD2] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E1DDD2]">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1A2219]">{selected.name}</h4>
                <div className="text-xs font-mono text-[#6C7D64]">
                  Route: {selected.admissionRoute} • Duration: {selected.duration}
                </div>
              </div>
              <div className="text-xs font-mono text-[#283826] bg-[#F0EDE4] px-3 py-1 rounded border border-[#E1DDD2]">
                Aptitude Match: <strong>{selected.alignmentScore}%</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-[#556052]">
                  Core Academic Curriculum (What You Actually Study)
                </div>
                <ul className="space-y-1.5">
                  {selected.coreCurriculum.map((c, i) => (
                    <li key={i} className="text-xs text-[#1A2219] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#283826]" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-[#556052]">
                  Career Reality & Common Misconceptions
                </div>
                <p className="text-xs text-[#556052] leading-relaxed">
                  {selected.careerReality}
                </p>
                <div className="p-3 rounded bg-[#F0EDE4] border border-[#E1DDD2] text-xs text-[#556052] italic font-serif">
                  {selected.misconception}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Next 30 Days Roadmap */}
        <div className="bg-[#F0EDE4] rounded border border-[#E1DDD2] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#1A2219]">
              Recommended Next 30 Days Trial Roadmap
            </h4>
            <span className="text-[11px] font-mono text-[#6C7D64]">Actionable Experiments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded bg-[#FAF8F5] border border-[#E1DDD2] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#283826]">Week 1</span>
              <div className="text-xs font-bold text-[#1A2219]">Mechanics Diagnostic</div>
              <p className="text-[11px] text-[#556052]">Complete 25 rotational dynamics PYQs under time limits.</p>
            </div>

            <div className="p-3 rounded bg-[#FAF8F5] border border-[#E1DDD2] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#283826]">Week 2</span>
              <div className="text-xs font-bold text-[#1A2219]">Chemistry Speed Test</div>
              <p className="text-[11px] text-[#556052]">Execute 45-minute sectional test on coordination bonding.</p>
            </div>

            <div className="p-3 rounded bg-[#FAF8F5] border border-[#E1DDD2] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#283826]">Week 3</span>
              <div className="text-xs font-bold text-[#1A2219]">Calculus Application</div>
              <p className="text-[11px] text-[#556052]">Solve 15 advanced definite integral graph problems.</p>
            </div>

            <div className="p-3 rounded bg-[#FAF8F5] border border-[#E1DDD2] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#B07D4F]">Week 4</span>
              <div className="text-xs font-bold text-[#1A2219]">Milestone Review</div>
              <p className="text-[11px] text-[#556052]">Re-evaluate alignment score with updated topic metrics.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
