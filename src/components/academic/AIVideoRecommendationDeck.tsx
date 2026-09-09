"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Target,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Zap,
  Check,
} from "lucide-react";
import { useAIVideoRecommendations } from "@/hooks/useAIVideoRecommendations";
import { RecommendedVideo, RecommendationTag } from "@/lib/videoRecommendationEngine";

interface AIVideoRecommendationDeckProps {
  onSelectChapterFilter?: (chapter: string) => void;
}

export function AIVideoRecommendationDeck({ onSelectChapterFilter }: AIVideoRecommendationDeckProps) {
  const {
    tasks,
    performance,
    recommendations,
    completedCount,
    totalTasksCount,
    activeTask,
    updateTaskStatus,
    setScenario,
    lastEventMessage,
    isClient,
  } = useAIVideoRecommendations();

  const [activeTab, setActiveTab] = useState<"cards" | "schedule">("cards");

  const getTagBadgeStyle = (tag: RecommendationTag) => {
    switch (tag) {
      case "Mastery Step-Up":
        return "bg-gradient-to-r from-amber-500/15 to-[#C8A95B]/25 text-amber-900 border-amber-500/40";
      case "Diagnostic Remediation":
        return "bg-gradient-to-r from-rose-500/15 to-orange-500/20 text-rose-900 border-rose-400/40";
      case "Active Task Match":
        return "bg-gradient-to-r from-emerald-500/15 to-[#283826]/20 text-emerald-900 border-emerald-500/40";
      case "Syllabus Pace-Setter":
        return "bg-gradient-to-r from-sky-500/15 to-blue-500/20 text-blue-900 border-sky-400/40";
      default:
        return "bg-[#EFECE3] text-[#283826] border-[#D5CFBE]";
    }
  };

  const getTagIcon = (tag: RecommendationTag) => {
    switch (tag) {
      case "Mastery Step-Up":
        return <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />;
      case "Diagnostic Remediation":
        return <AlertTriangle className="w-3 h-3 text-rose-600" />;
      case "Active Task Match":
        return <Target className="w-3 h-3 text-emerald-700" />;
      case "Syllabus Pace-Setter":
        return <TrendingUp className="w-3 h-3 text-blue-700" />;
      default:
        return <Sparkles className="w-3 h-3 text-[#B07D4F]" />;
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#F2EEE4] via-[#F7F5F0] to-[#FAF8F5] border-2 border-[#283826]/25 p-5 sm:p-7 shadow-lg space-y-6 relative overflow-hidden">
      {/* Decorative Subtle Radial Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-radial from-[#C8A95B]/15 via-transparent to-transparent pointer-events-none blur-2xl" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E1DDD2] relative z-10">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#283826] text-[#F7F5F0] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Adaptive Copilot Active
            </span>
            <span className="text-[11px] font-mono text-[#6C7D64]">
              Real-Time Dynamic Video Dispatch
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A2219] flex items-center gap-2">
            <span>Curriculum Recommendations Personalized to Your Performance</span>
          </h3>

          <p className="text-xs text-[#556052] font-sans max-w-2xl leading-relaxed">
            These video lectures update in <strong>real time</strong> as you check off study planner blocks, complete diagnostic questions, and conquer prerequisite concepts.
          </p>
        </div>

        {/* Live Performance Snapshot Widget */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-[#D5CFBE] shadow-2xs text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">
            <span className="text-[#6C7D64] block text-[9px] uppercase font-bold">Tasks Completed</span>
            <span className="font-bold text-[#283826] text-sm">
              {completedCount} / {totalTasksCount}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">
            <span className="text-[#6C7D64] block text-[9px] uppercase font-bold">Diagnostic Accuracy</span>
            <span className={`font-bold text-sm ${performance.accuracyPercentage < 60 ? "text-amber-700" : "text-emerald-700"}`}>
              {performance.accuracyPercentage}%
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E1DDD2]">
            <span className="text-[#6C7D64] block text-[9px] uppercase font-bold">Primary Weak Area</span>
            <span className="font-bold text-rose-800 text-xs truncate max-w-[120px] block" title={performance.weakTopics[0]}>
              {performance.weakTopics[0] || "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Scenario Simulation Control Toolbar */}
      <div className="p-3.5 rounded-xl bg-white/90 border border-[#D5CFBE] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-[#556052] text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B07D4F]" />
            Simulate Student Milestone:
          </span>

          <button
            type="button"
            onClick={() => setScenario("rotational_mastery")}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-emerald-50 text-[#283826] hover:text-emerald-800 border border-[#D5CFBE] hover:border-emerald-400 font-mono text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            ✅ Completed Rotational Dynamics
          </button>

          <button
            type="button"
            onClick={() => setScenario("electrostatics_remediation")}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-rose-50 text-[#283826] hover:text-rose-800 border border-[#D5CFBE] hover:border-rose-400 font-mono text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            ⚠️ Flag Electrostatics Error (42%)
          </button>

          <button
            type="button"
            onClick={() => setScenario("calculus_active")}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-blue-50 text-[#283826] hover:text-blue-800 border border-[#D5CFBE] hover:border-blue-400 font-mono text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            🎯 Active Definite Integrals Block
          </button>

          <button
            type="button"
            onClick={() => setScenario("reset")}
            className="p-1 text-[#6C7D64] hover:text-[#1A2219] transition-colors"
            title="Reset to default schedule state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {lastEventMessage && (
          <div className="text-[11px] font-mono text-[#283826] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300 animate-in fade-in duration-300">
            {lastEventMessage}
          </div>
        )}
      </div>

      {/* Quick In-Deck Study Schedule Sync Strip */}
      <div className="bg-[#FAF8F5] rounded-xl border border-[#D5CFBE] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#556052]">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#283826]" />
            Your Daily Study Ledger (Check to Trigger Real-Time Video Adaptation):
          </span>
          <span className="text-[10px] text-[#6C7D64]">
            Synced with Today&apos;s Focus Schedule
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => updateTaskStatus(task.id)}
              className={`p-2.5 rounded-lg border text-left transition-all flex items-start justify-between gap-2 text-xs cursor-pointer ${
                task.status === "completed"
                  ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-2xs"
                  : task.status === "in_progress"
                  ? "bg-amber-50/90 border-amber-400 text-amber-950 shadow-2xs"
                  : "bg-white border-[#E1DDD2] text-[#556052] hover:border-[#283826]"
              }`}
            >
              <div className="space-y-0.5 truncate flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="font-bold uppercase text-[#283826]">{task.subject}</span>
                  <span className="text-[#6C7D64]">• {task.priority || "Plan"}</span>
                </div>
                <div className="font-semibold text-xs text-[#1A2219] truncate" title={task.topic}>
                  {task.topic}
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  task.status === "completed"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : task.status === "in_progress"
                    ? "bg-amber-100 border-amber-400 text-amber-800 font-mono text-[9px] font-bold"
                    : "border-[#D5CFBE] bg-white text-transparent hover:border-[#283826]"
                }`}
              >
                {task.status === "completed" ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : task.status === "in_progress" ? (
                  "▶"
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Real-Time Recommended Video Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#556052]">
          <span>AI Ranked Video Lectures ({recommendations.length} Matched):</span>
          <span className="text-[11px] text-[#283826] font-normal normal-case">
            Prioritized by pedagogical necessity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.slice(0, 3).map((video, idx) => (
            <div
              key={video.id + idx}
              className="bg-white rounded-xl border border-[#D5CFBE] hover:border-[#283826] transition-all duration-300 shadow-xs flex flex-col justify-between overflow-hidden group hover:shadow-md"
            >
              {/* Thumbnail Area */}
              <div className="relative h-40 w-full bg-[#1A2219] overflow-hidden">
                <img
                  src={video.thumbnailUrl || "/images/showcase-1.png"}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/showcase-1.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Top Badge: Recommendation Tag */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border shadow-2xs backdrop-blur-xs bg-white/95 ${getTagBadgeStyle(
                      video.recommendationTag
                    )}`}
                  >
                    {getTagIcon(video.recommendationTag)}
                    <span>{video.recommendationTag}</span>
                  </span>

                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-white border border-white/20">
                    {video.duration}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="text-[10px] font-mono text-[#C8A95B] font-bold uppercase">
                    {video.exam} • {video.subject} • {video.language}
                  </div>
                  <div className="font-serif font-bold text-xs line-clamp-1 text-[#F7F5F0]">
                    {video.chapterName}
                  </div>
                </div>
              </div>

              {/* Card Body with AI Rationale Callout */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#1A2219] line-clamp-2 leading-snug group-hover:text-[#283826]">
                    {video.title}
                  </h4>

                  <div className="text-xs text-[#5E685B] flex items-center gap-1 truncate">
                    <span>Educator:</span>
                    <strong className="text-[#283826]">{video.instructor}</strong>
                    <span className="text-[#6C7D64]">({video.channelName})</span>
                  </div>

                  {/* AI Rationale Box */}
                  <div className="p-2.5 rounded-lg bg-[#F7F5F0] border border-[#E1DDD2] text-[11px] font-sans text-[#4A5547] leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#B07D4F] shrink-0 mt-0.5" />
                    <p className="line-clamp-3">
                      {video.aiRationale}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-[#EFECE3] flex items-center justify-between gap-2">
                  {onSelectChapterFilter && (
                    <button
                      type="button"
                      onClick={() => onSelectChapterFilter(video.chapterName)}
                      className="text-[11px] font-mono text-[#6C7D64] hover:text-[#283826] underline transition-colors"
                    >
                      Filter Full Catalog
                    </button>
                  )}

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Watch Now</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
