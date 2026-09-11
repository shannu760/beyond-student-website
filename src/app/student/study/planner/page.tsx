"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Target,
  Flame,
  Star,
  ChevronRight,
  Filter,
  Calendar
} from "lucide-react";
import { StudyPlanItem } from "@/lib/ai/student-ai-types";

const INITIAL_TASKS: StudyPlanItem[] = [
  {
    id: "task-1",
    subject: "Physics",
    topic: "Electrostatics — Electric Dipole & Gauss Law",
    durationMinutes: 45,
    activityType: "Weak Topic Remediation",
    priority: "High",
    completed: false
  },
  {
    id: "task-2",
    subject: "Mathematics",
    topic: "Calculus Limits & Continuity Problems",
    durationMinutes: 60,
    activityType: "Problem Solving",
    priority: "High",
    completed: true
  },
  {
    id: "task-3",
    subject: "Chemistry",
    topic: "Organic Chemistry Reaction Mechanisms",
    durationMinutes: 45,
    activityType: "Concept Review",
    priority: "Medium",
    completed: false
  },
  {
    id: "task-4",
    subject: "Physics",
    topic: "15-Min Chapter Diagnostic Quiz",
    durationMinutes: 15,
    activityType: "Mock Test",
    priority: "High",
    completed: false
  }
];

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState<StudyPlanItem[]>(INITIAL_TASKS);
  const [streakDays, setStreakDays] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newSubject, setNewSubject] = useState("Physics");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile?.streakDays) setStreakDays(data.profile.streakDays);
      })
      .catch(() => {});
  }, []);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newTask: StudyPlanItem = {
      id: `task-${Date.now()}`,
      subject: newSubject,
      topic: newTopic,
      durationMinutes: 45,
      activityType: "Concept Review",
      priority: "Medium",
      completed: false
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTopic("");
    setShowAddModal(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              Adaptive Study Planner
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#E8DCC3] text-[#3D4425] px-2.5 py-0.5 rounded-full border border-[#3D4425]/20">
              Today&apos;s Focus
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Personalized daily schedule mapped directly to your JEE Main 2027 weak topics.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3D4425] text-[#F3EBDD] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#252B18] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C8A95B]" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Daily Progress Stats Card */}
      <div className="bg-[#252B18] text-[#F3EBDD] rounded-3xl p-6 border border-[#C8A95B]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#C8A95B] font-bold">
            Daily Completion Metric
          </div>
          <h2 className="font-accent font-bold text-2xl text-[#F3EBDD]">
            {completedCount} of {tasks.length} Planned Sessions Completed
          </h2>
          <p className="text-xs text-[#D9CAA8]/80 max-w-lg">
            Completing all planned sessions today earns <strong className="text-[#C8A95B]">+100 BEYOND Stars ⭐</strong> and protects your {streakDays}-day streak.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center bg-[#3D4425] px-4 py-3 rounded-2xl border border-[#69704A]/30">
            <div className="text-2xl font-bold font-display text-[#C8A95B]">
              {Math.round((completedCount / tasks.length) * 100)}%
            </div>
            <div className="text-[10px] text-[#E8DCC3]/70 font-mono uppercase font-bold">Done</div>
          </div>
          <div className="text-center bg-[#3D4425] px-4 py-3 rounded-2xl border border-[#69704A]/30">
            <div className="text-2xl font-bold font-display text-[#F3EBDD]">
              {tasks.reduce((acc, t) => acc + (t.completed ? t.durationMinutes : 0), 0)}m
            </div>
            <div className="text-[10px] text-[#E8DCC3]/70 font-mono uppercase font-bold">Studied</div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#69704A] px-1">
          <span>Scheduled Study Sessions</span>
          <span>Status</span>
        </div>

        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm ${
              task.completed
                ? "bg-[#E8DCC3]/50 border-[#3D4425]/15 opacity-70"
                : "bg-[#F8F4EC] border-[#3D4425]/20 hover:border-[#C8A95B] hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  task.completed
                    ? "bg-emerald-700 border-emerald-700 text-white"
                    : "border-[#3D4425] hover:border-[#C8A95B]"
                }`}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#252B18] text-[#C8A95B]">
                    {task.subject}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                      task.activityType === "Weak Topic Remediation"
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : task.activityType === "Mock Test"
                        ? "bg-blue-100 text-blue-900 border-blue-300"
                        : "bg-emerald-100 text-emerald-900 border-emerald-300"
                    }`}
                  >
                    {task.activityType}
                  </span>
                </div>

                <h3
                  className={`font-display font-bold text-base ${
                    task.completed ? "line-through text-[#69704A]" : "text-[#252B18]"
                  }`}
                >
                  {task.topic}
                </h3>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-mono font-bold text-[#3D4425] flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.durationMinutes} mins</span>
              </div>
              <div className="text-[10px] font-mono text-[#C8A95B] font-bold mt-1">
                +30 Stars
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#252B18]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F4EC] border border-[#3D4425]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <h3 className="font-accent font-bold text-xl text-[#252B18]">Add Custom Study Session</h3>
            
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3 py-2 text-xs text-[#252B18] font-medium"
                >
                  <option>Physics</option>
                  <option>Mathematics</option>
                  <option>Chemistry</option>
                  <option>General Biology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                  Topic & Goal
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Organic Hydrocarbons Practice Questions"
                  className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3 py-2 text-xs text-[#252B18] placeholder-[#69704A]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#3D4425] hover:bg-[#E8DCC3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3D4425] text-[#F3EBDD] font-bold text-xs uppercase tracking-wider hover:bg-[#252B18]"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
