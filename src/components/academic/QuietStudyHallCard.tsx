"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Play, Pause, RotateCcw, Volume2, CheckCircle2, ArrowRight, BookOpen, VolumeX, Sparkles } from "lucide-react";

interface PeerScholar {
  id: string;
  name: string;
  avatar: string;
  goal: string;
  status: "active" | "taking_quiz" | "break";
  minutesActive: number;
}

const PEER_SCHOLARS: PeerScholar[] = [
  { id: "1", name: "Aarav S.", avatar: "AS", goal: "Solving 10 Rotational Dynamics PYQs", status: "active", minutesActive: 38 },
  { id: "2", name: "Priya K.", avatar: "PK", goal: "Revising Newton Laws of Motion & Friction", status: "active", minutesActive: 44 },
  { id: "3", name: "Ishaan M.", avatar: "IM", goal: "Free Body Diagram Concept Mastery", status: "active", minutesActive: 22 },
  { id: "4", name: "Ananya R.", avatar: "AR", goal: "Projectile Motion Edge-Case Problems", status: "taking_quiz", minutesActive: 50 },
  { id: "5", name: "Rahul V.", avatar: "RV", goal: "Circular Motion & Banked Curves Review", status: "active", minutesActive: 19 },
  { id: "6", name: "Meera G.", avatar: "MG", goal: "Work-Energy Theorem & Variable Forces", status: "active", minutesActive: 31 },
  { id: "7", name: "Karan P.", avatar: "KP", goal: "Collision Physics & Coefficient of Restitution", status: "break", minutesActive: 45 },
  { id: "8", name: "Sana J.", avatar: "SJ", goal: "Moment of Inertia Standard Integrals", status: "active", minutesActive: 14 },
];

export function QuietStudyHallCard() {
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>("Library Silence");
  const [studentNotes, setStudentNotes] = useState("");
  const [sessionLoggedSuccess, setSessionLoggedSuccess] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  // Log focus session to persistent ledger API
  const logFocusSession = async (mins: number) => {
    if (mins <= 0 || isLogging) return;
    setIsLogging(true);
    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "focus",
          durationMinutes: mins,
          goal: "Physics Mechanics Sprint"
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionLoggedSuccess(`+${mins} Minutes Logged! (+${mins} Stars earned)`);
        window.dispatchEvent(new Event("beyond:activity-updated"));
        setTimeout(() => setSessionLoggedSuccess(null), 4000);
      }
    } catch (e) {
      console.error("Failed to log focus session:", e);
    } finally {
      setIsLogging(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    } else if (secondsLeft === 0 && timerRunning) {
      setTimerRunning(false);
      logFocusSession(selectedDuration);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsLeft, selectedDuration]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const setTimerDuration = (mins: number) => {
    setTimerRunning(false);
    setSelectedDuration(mins);
    setSecondsLeft(mins * 60);
  };

  return (
    <section id="study-hall" className="py-10 md:py-12 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E1DDD2]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826]">
                Live Focus Sync • 128 Others Studying Globally
              </span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A2219]">
              Quiet Study Room #04 — Physics Mechanics Sprint
            </h2>
            <p className="text-xs sm:text-sm text-[#556052] mt-1">
              A silent, deliberate study hall. Real student accountability without distracting video or chat noise.
            </p>
          </div>

          <div className="text-xs font-mono text-[#556052] bg-[#F0EDE4] px-3.5 py-1.5 rounded border border-[#E1DDD2]">
            Room Mode: <strong className="text-[#283826]">Silent Deep Work</strong>
          </div>
        </div>

        {/* Study Hall Main Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Pomodoro Focus Timer & Sound Controls */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-xl border border-[#E1DDD2] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Top Timer Mode Switcher */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E1DDD2]">
              <span className="text-xs font-mono font-bold uppercase text-[#556052]">Focus Timer</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerDuration(25)}
                  className={`text-xs font-mono font-bold px-3 py-1 rounded border transition-colors ${
                    selectedDuration === 25
                      ? "bg-[#283826] text-[#F7F5F0] border-[#283826]"
                      : "bg-[#F0EDE4] text-[#1A2219] border-[#E1DDD2] hover:bg-[#E8DDC8]"
                  }`}
                >
                  25:00
                </button>
                <button
                  type="button"
                  onClick={() => setTimerDuration(45)}
                  className={`text-xs font-mono font-bold px-3 py-1 rounded border transition-colors ${
                    selectedDuration === 45
                      ? "bg-[#283826] text-[#F7F5F0] border-[#283826]"
                      : "bg-[#F0EDE4] text-[#1A2219] border-[#E1DDD2] hover:bg-[#E8DDC8]"
                  }`}
                >
                  45:00
                </button>
              </div>
            </div>

            {/* Circular Digital Display */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="w-56 h-56 rounded-full border-4 border-[#E1DDD2] border-t-[#283826] flex flex-col items-center justify-center bg-[#F0EDE4]/50 shadow-inner">
                <div className="font-serif font-bold text-5xl text-[#1A2219] tracking-tight">
                  {formatTime(secondsLeft)}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#6C7D64] mt-2 font-bold">
                  {timerRunning ? "Focus Session Active" : "Session Paused"}
                </div>
              </div>

              {/* Notification Banner on Session Log */}
              {sessionLoggedSuccess && (
                <div className="mt-4 px-4 py-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>{sessionLoggedSuccess}</span>
                </div>
              )}

              {/* Timer Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-6 py-2.5 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{timerRunning ? "Pause Session" : "Start Focus"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setSecondsLeft(selectedDuration * 60);
                  }}
                  className="p-2.5 rounded-lg bg-[#F0EDE4] hover:bg-[#E8DDC8] text-[#556052] border border-[#E1DDD2] transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={isLogging}
                  onClick={() => logFocusSession(Math.round((selectedDuration * 60 - secondsLeft) / 60) || 5)}
                  className="px-3.5 py-2.5 rounded-lg bg-[#EAE6DB] hover:bg-[#DDD7C8] text-[#283826] border border-[#D5CFBE] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Log completed minutes into daily ledger"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Log Minutes</span>
                </button>
              </div>
            </div>

            {/* Ambient Sound Selector */}
            <div className="pt-4 border-t border-[#E1DDD2] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#556052]">
                <span className="font-mono font-bold uppercase text-[10px]">Ambient Study Audio</span>
                <span className="font-mono text-[10px] text-[#6C7D64]">Sound: {activeSound || "Muted"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Library Silence", "Gentle Rain", "Forest Breeze", "Mute"].map((sound) => (
                  <button
                    key={sound}
                    type="button"
                    onClick={() => setActiveSound(sound === "Mute" ? null : sound)}
                    className={`
                      px-3 py-1 text-xs rounded border font-mono transition-colors
                      ${
                        (sound === "Mute" && activeSound === null) || activeSound === sound
                          ? "bg-[#283826] text-[#F7F5F0] border-[#283826]"
                          : "bg-[#F0EDE4] text-[#556052] border-[#E1DDD2] hover:bg-[#E8DDC8]"
                      }
                    `}
                  >
                    {sound}
                  </button>
                ))}
              </div>
            </div>

            {/* Wrap-Up CTA */}
            <div className="pt-4 border-t border-[#E1DDD2] flex items-center justify-between">
              <span className="text-xs text-[#556052]">Ready to practice questions?</span>
              <a
                href="#practice-tracker"
                className="px-4 py-2 rounded bg-[#B07D4F] hover:bg-[#916239] text-[#F7F5F0] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <span>Jump to MCQs & PYQs Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Synchronous Peer Roster & Session Notes */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Peer Accountability List */}
            <div className="bg-[#FAF8F5] rounded-xl border border-[#E1DDD2] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1DDD2]">
                <span className="text-xs font-mono font-bold uppercase text-[#556052]">Active Scholars in Room</span>
                <span className="text-[10px] font-mono text-[#6C7D64] font-bold">8 / 12 Seats</span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {PEER_SCHOLARS.map((peer) => (
                  <div key={peer.id} className="flex items-start gap-3 p-2 rounded bg-[#F0EDE4]/60 border border-[#E1DDD2]">
                    <div className="w-7 h-7 rounded bg-[#283826] text-[#F7F5F0] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {peer.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A2219]">{peer.name}</span>
                        <span className="text-[10px] font-mono text-[#6C7D64]">{peer.minutesActive}m in room</span>
                      </div>
                      <p className="text-[11px] text-[#556052] truncate mt-0.5 font-serif italic">
                        &quot;{peer.goal}&quot;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distraction-Free Notes Scratchpad */}
            <div className="bg-[#FAF8F5] rounded-xl border border-[#E1DDD2] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#556052]">Session Notes & Formulas</span>
                <span className="text-[10px] font-mono text-[#6C7D64]">Auto-saved</span>
              </div>
              <textarea
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                placeholder="Capture key derivations, question numbers, or conceptual doubts here..."
                rows={4}
                className="w-full text-xs font-mono p-3 rounded bg-[#F0EDE4]/50 border border-[#E1DDD2] focus:border-[#283826] focus:outline-hidden text-[#1A2219] resize-none"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
