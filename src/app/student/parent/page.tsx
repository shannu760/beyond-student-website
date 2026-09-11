"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";

export default function ParentDashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
      })
      .catch(() => {});
  }, []);

  const studentName = profile?.fullName || "Krishna Addanki";
  const classLevel = profile?.classLevel || "Class 12";
  const targetExam = profile?.targetExam || "JEE Main 2027";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              Parent Overview Dashboard
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#252B18] text-[#C8A95B] px-2.5 py-0.5 rounded-full border border-[#C8A95B]/40">
              Privacy Preserving
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            High-level academic progress, study consistency & deadline updates without invading student conversation privacy.
          </p>
        </div>
      </div>

      {/* Parent Summary Card */}
      <div className="bg-[#252B18] text-[#F3EBDD] rounded-3xl p-6 sm:p-8 border border-[#C8A95B]/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#69704A]/30 pb-3">
          <span className="text-[10px] font-mono uppercase text-[#C8A95B] font-bold">
            Student: {studentName} ({classLevel} • {targetExam})
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Progress
          </span>
        </div>

        <h2 className="font-accent font-bold text-2xl text-[#F3EBDD]">
          Academic Progress & Consistency Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#3D4425]/60 p-3.5 rounded-2xl border border-[#69704A]/20 text-center">
            <div className="text-2xl font-bold font-display text-[#C8A95B]">{profile?.streakDays ?? 1} Days</div>
            <div className="text-[10px] text-[#D9CAA8]/70 font-mono font-bold uppercase">Study Streak</div>
          </div>

          <div className="bg-[#3D4425]/60 p-3.5 rounded-2xl border border-[#69704A]/20 text-center">
            <div className="text-2xl font-bold font-display text-[#F3EBDD]">4.5 Hrs</div>
            <div className="text-[10px] text-[#D9CAA8]/70 font-mono font-bold uppercase">Daily Average</div>
          </div>

          <div className="bg-[#3D4425]/60 p-3.5 rounded-2xl border border-[#69704A]/20 text-center">
            <div className="text-2xl font-bold font-display text-emerald-400">88%</div>
            <div className="text-[10px] text-[#D9CAA8]/70 font-mono font-bold uppercase">Exam Alignment</div>
          </div>

          <div className="bg-[#3D4425]/60 p-3.5 rounded-2xl border border-[#69704A]/20 text-center">
            <div className="text-2xl font-bold font-display text-[#C8A95B]">2 Verified</div>
            <div className="text-[10px] text-[#D9CAA8]/70 font-mono font-bold uppercase">Certificates</div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#F8F4EC] border border-[#3D4425]/20 rounded-2xl p-5 space-y-3">
          <h3 className="font-display font-bold text-sm text-[#252B18] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3D4425]" />
            <span>Upcoming Scholarship & Exam Deadlines</span>
          </h3>

          <ul className="space-y-2 text-xs text-[#3D4425]">
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8DCC3]/60 border border-[#3D4425]/10">
              <div>
                <div className="font-bold">NSP Central Sector Scholarship</div>
                <div className="text-[10px] text-[#69704A]">Income & Marksheet verification required</div>
              </div>
              <span className="font-mono text-amber-800 font-bold text-[11px]">31st Oct</span>
            </li>

            <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8DCC3]/60 border border-[#3D4425]/10">
              <div>
                <div className="font-bold">JEE Main 2027 Session 1 Registration</div>
                <div className="text-[10px] text-[#69704A]">Official NTA Portal</div>
              </div>
              <span className="font-mono text-emerald-800 font-bold text-[11px]">15th Nov</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#F8F4EC] border border-[#3D4425]/20 rounded-2xl p-5 space-y-3">
          <h3 className="font-display font-bold text-sm text-[#252B18] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#3D4425]" />
            <span>Recent Achievements & Skill Badges</span>
          </h3>

          <ul className="space-y-2 text-xs text-[#3D4425]">
            <li className="p-2.5 rounded-xl bg-[#E8DCC3]/60 border border-[#3D4425]/10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Completed Physics Kinematics & Mechanics Mastery Diagnostic</span>
            </li>
            <li className="p-2.5 rounded-xl bg-[#E8DCC3]/60 border border-[#3D4425]/10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Resolved 14 peer student questions in Physics Community</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
