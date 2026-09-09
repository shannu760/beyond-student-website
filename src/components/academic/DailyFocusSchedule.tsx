"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, BookOpen, ChevronRight, Calendar, AlertCircle } from "lucide-react";

interface StudyBlock {
  id: string;
  subject: string;
  topic: string;
  subtopics: string;
  allocatedMinutes: number;
  completedMinutes: number;
  status: "completed" | "in_progress" | "planned";
  priority: "High" | "Medium" | "Revision";
}

const INITIAL_BLOCKS: StudyBlock[] = [
  {
    id: "block-1",
    subject: "Physics",
    topic: "Rotational Dynamics",
    subtopics: "Moment of Inertia, Theorems of Parallel & Perpendicular Axes, 8 PYQs",
    allocatedMinutes: 45,
    completedMinutes: 45,
    status: "completed",
    priority: "High",
  },
  {
    id: "block-2",
    subject: "Mathematics",
    topic: "Definite Integrals",
    subtopics: "Properties of Definite Integrals, Leibniz Rule, 6 Practice Problems",
    allocatedMinutes: 60,
    completedMinutes: 35,
    status: "in_progress",
    priority: "High",
  },
  {
    id: "block-3",
    subject: "Chemistry",
    topic: "Coordination Compounds",
    subtopics: "Crystal Field Splitting Theory, Octahedral & Tetrahedral Complexes",
    allocatedMinutes: 45,
    completedMinutes: 0,
    status: "planned",
    priority: "Medium",
  },
  {
    id: "block-4",
    subject: "Diagnostic Quiz",
    topic: "Electrostatics Dipole Remediation",
    subtopics: "5 Concept Correction MCQs based on error analysis from Test #03",
    allocatedMinutes: 20,
    completedMinutes: 0,
    status: "planned",
    priority: "Revision",
  },
];

export function DailyFocusSchedule() {
  const [blocks, setBlocks] = useState<StudyBlock[]>(INITIAL_BLOCKS);

  const toggleBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (b.status === "completed") {
          return { ...b, status: "planned", completedMinutes: 0 };
        } else {
          return { ...b, status: "completed", completedMinutes: b.allocatedMinutes };
        }
      })
    );
  };

  const totalAllocated = blocks.reduce((acc, b) => acc + b.allocatedMinutes, 0);
  const totalCompleted = blocks.reduce((acc, b) => acc + b.completedMinutes, 0);

  return (
    <section id="schedule" className="py-10 md:py-12 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826] mb-1">
              Syllabus & Focus Ledger
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A2219]">
              Today&apos;s Academic Study Schedule
            </h2>
            <p className="text-xs sm:text-sm text-[#556052] mt-1">
              Structured study blocks mapped directly to your Class 12 & JEE 2027 curriculum.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#F0EDE4] px-4 py-2 rounded border border-[#E1DDD2] text-xs font-mono">
            <div>
              <span className="text-[#556052] block text-[10px] uppercase">Progress</span>
              <span className="font-bold text-[#283826]">{totalCompleted} / {totalAllocated} Mins</span>
            </div>
            <div className="h-6 w-px bg-[#E1DDD2]" />
            <div>
              <span className="text-[#556052] block text-[10px] uppercase">Day Streak</span>
              <span className="font-bold text-[#B07D4F]">12 Days</span>
            </div>
          </div>
        </div>

        {/* Ledger Table Container */}
        <div className="bg-[#FAF8F5] rounded border border-[#E1DDD2] overflow-hidden shadow-xs">
          
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0EDE4] border-b border-[#E1DDD2] text-[11px] font-mono uppercase tracking-wider font-bold text-[#556052]">
            <div className="col-span-1">Status</div>
            <div className="col-span-3">Subject & Topic</div>
            <div className="col-span-5">Curriculum Subtopics & Exercises</div>
            <div className="col-span-2">Time Allocation</div>
            <div className="col-span-1 text-right">Priority</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#E1DDD2]">
            {blocks.map((block) => {
              const isDone = block.status === "completed";
              const inProgress = block.status === "in_progress";

              return (
                <div
                  key={block.id}
                  onClick={() => toggleBlock(block.id)}
                  className={`
                    grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center cursor-pointer transition-colors
                    ${isDone ? "bg-[#F0EDE4]/40 text-[#556052]" : "hover:bg-[#F0EDE4]/70"}
                  `}
                >
                  {/* Status Checkbox */}
                  <div className="md:col-span-1 flex items-center gap-2">
                    <button
                      type="button"
                      className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${isDone ? "bg-[#283826] border-[#283826] text-[#F7F5F0]" : "border-[#6C7D64] bg-white"}
                      `}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className="md:hidden text-xs font-mono font-bold uppercase text-[#283826]">
                      {block.subject}
                    </span>
                  </div>

                  {/* Subject & Topic */}
                  <div className="md:col-span-3">
                    <div className="text-xs font-mono font-bold text-[#283826] hidden md:block">
                      {block.subject}
                    </div>
                    <div className={`text-sm font-serif font-bold text-[#1A2219] ${isDone ? "line-through opacity-70" : ""}`}>
                      {block.topic}
                    </div>
                  </div>

                  {/* Subtopics */}
                  <div className="md:col-span-5 text-xs text-[#556052] leading-relaxed">
                    {block.subtopics}
                  </div>

                  {/* Time Allocation */}
                  <div className="md:col-span-2 flex items-center gap-2 text-xs font-mono text-[#556052]">
                    <Clock className="w-3.5 h-3.5 text-[#6C7D64]" />
                    <span>
                      {block.completedMinutes}/{block.allocatedMinutes}m
                    </span>
                    {inProgress && (
                      <span className="text-[10px] uppercase font-bold text-[#B07D4F] bg-[#F0EDE4] px-1.5 py-0.5 rounded border border-[#B07D4F]/30">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Priority Tag */}
                  <div className="md:col-span-1 text-left md:text-right">
                    <span
                      className={`
                        text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border
                        ${
                          block.priority === "High"
                            ? "bg-[#283826]/10 text-[#283826] border-[#283826]/20"
                            : block.priority === "Revision"
                            ? "bg-[#B07D4F]/10 text-[#B07D4F] border-[#B07D4F]/30"
                            : "bg-[#6C7D64]/10 text-[#6C7D64] border-[#6C7D64]/30"
                        }
                      `}
                    >
                      {block.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
