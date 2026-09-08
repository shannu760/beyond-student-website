"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Award, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Star, 
  TrendingUp, 
  BookOpen, 
  AlertCircle, 
  Calendar,
  Bell,
  RefreshCw,
  Share2,
  Check
} from "lucide-react";

interface DailyReportNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportUpdated?: () => void;
}

export function DailyReportNotificationModal({ 
  isOpen, 
  onClose,
  onReportUpdated 
}: DailyReportNotificationModalProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/daily-report");
      const json = await res.json();
      if (json.success && json.report) {
        setReport(json.report);
        setHasUnread(Boolean(json.hasUnreadNotification));
      }
    } catch (e) {
      console.error("Failed to load daily report:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReport();
    }
  }, [isOpen]);

  const handleAcknowledgeNotification = async () => {
    try {
      await fetch("/api/daily-report", { method: "PATCH" });
      setHasUnread(false);
      if (report) {
        setReport({ ...report, notificationRead: true });
      }
      if (onReportUpdated) onReportUpdated();
    } catch (e) {
      console.error("Failed to acknowledge notification:", e);
    }
  };

  const handleGenerateFreshReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/daily-report", { method: "POST" });
      const json = await res.json();
      if (json.success && json.report) {
        setReport(json.report);
        setHasUnread(true);
        if (onReportUpdated) onReportUpdated();
      }
    } catch (e) {
      console.error("Failed to generate fresh report:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleShareSummary = () => {
    if (!report) return;
    const text = `🎓 Beyond Daily Study Report (${report.date})\n` +
      `• MCQs: ${report.totalMCQs} | PYQs: ${report.totalPYQs}\n` +
      `• Accuracy: ${report.accuracyPercentage}%\n` +
      `• Focus Time: ${report.totalFocusMinutes} mins\n` +
      `• Stars Earned: +${report.starsEarnedToday} Stars\n` +
      `Beyond Student Growth Network • 2026`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const todayDisplay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2219]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#F7F5F0] paper-texture rounded-xl border border-[#D5CFBE] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#ECE7DC] border-b border-[#D5CFBE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#283826] text-[#F7F5F0] flex items-center justify-center font-serif font-bold text-lg shadow-2xs">
              <Award className="w-5 h-5 text-[#B07D4F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A2219]">
                  End-of-Day Performance Report
                </h3>
                {hasUnread && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                    <Bell className="w-2.5 h-2.5" />
                    New Notification
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5E685B] font-sans flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#6C7D64]" />
                <span>{todayDisplay}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E685B] hover:text-[#1A2219] hover:bg-[#DDD7C8] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Notification Alert Bar */}
          {hasUnread && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Daily Report Notification:</strong> Your study session ledger has completed for today. Review your metrics below.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAcknowledgeNotification}
                className="px-3 py-1 rounded bg-[#283826] hover:bg-[#364A33] text-white font-medium text-xs whitespace-nowrap transition-colors"
              >
                Mark as Read
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#6C7D64]">
              Retrieving end-of-day records from Supabase ledger...
            </div>
          ) : report ? (
            <>
              {/* Top Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#D5CFBE]">
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">
                    Questions Attempted
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-[#1A2219]">
                      {report.totalQuestions}
                    </span>
                    <span className="text-[11px] text-[#6C7D64]">
                      ({report.totalMCQs} MCQ / {report.totalPYQs} PYQ)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#D5CFBE]">
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">
                    Accuracy Rate
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-emerald-800">
                      {report.accuracyPercentage}%
                    </span>
                    <span className="text-[11px] text-[#6C7D64]">
                      ({report.correctCount} correct)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#D5CFBE]">
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">
                    Focus Time Logged
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-[#283826]">
                      {report.totalFocusMinutes}
                    </span>
                    <span className="text-[11px] text-[#6C7D64]">minutes</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#D5CFBE]">
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#6C7D64] block">
                    Stars Earned Today
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-[#B07D4F]">
                      +{report.starsEarnedToday}
                    </span>
                    <Star className="w-3.5 h-3.5 fill-[#B07D4F] text-[#B07D4F]" />
                  </div>
                </div>
              </div>

              {/* Accuracy Visual Progress Bar */}
              <div className="p-4 rounded-lg bg-[#EFECE3] border border-[#DDD7C8] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1A2219]">Daily Problem Mastery Index</span>
                  <span className="font-mono font-bold text-[#283826]">{report.accuracyPercentage}% Efficiency</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#D5CFBE] overflow-hidden">
                  <div 
                    className="h-full bg-[#283826] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, report.accuracyPercentage))}%` }}
                  />
                </div>
              </div>

              {/* Topic Breakdown: Mastered vs Needs Review */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mastered Topics */}
                <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#D5CFBE] space-y-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mastered Topics Today</span>
                  </div>
                  <ul className="space-y-1.5">
                    {report.masteredTopics && report.masteredTopics.length > 0 ? (
                      report.masteredTopics.map((topic: string, i: number) => (
                        <li key={i} className="text-xs text-[#283826] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-[#6C7D64]">Solve questions to identify mastered topics.</li>
                    )}
                  </ul>
                </div>

                {/* Review Needed */}
                <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#D5CFBE] space-y-2.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Recommended Revision for Tomorrow</span>
                  </div>
                  <ul className="space-y-1.5">
                    {report.reviewNeededTopics && report.reviewNeededTopics.length > 0 ? (
                      report.reviewNeededTopics.map((topic: string, i: number) => (
                        <li key={i} className="text-xs text-[#283826] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-[#6C7D64]">No weaknesses logged today!</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Report Timestamp & Verification Stamp */}
              <div className="p-3 rounded-lg bg-[#EAE6DB] border border-[#DDD7C8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#556052] font-mono">
                <div>
                  Report ID: <span className="font-semibold text-[#1A2219]">{report.id}</span>
                </div>
                <div>
                  Generated: {new Date(report.generatedAt).toLocaleTimeString()} • Verified Ledger
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-[#5E685B]">No activity recorded yet today.</p>
              <button
                type="button"
                onClick={handleGenerateFreshReport}
                disabled={generating}
                className="px-4 py-2 rounded-lg bg-[#283826] text-[#F7F5F0] text-xs font-semibold hover:bg-[#364A33] transition-colors"
              >
                {generating ? "Generating..." : "Generate Today's Scorecard"}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#ECE7DC] border-t border-[#D5CFBE] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleGenerateFreshReport}
            disabled={generating}
            className="text-xs text-[#283826] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
            <span>Recalculate Today's Score</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareSummary}
              className="px-3.5 py-1.5 rounded bg-white hover:bg-neutral-100 text-[#1A2219] font-medium border border-[#D5CFBE] transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Summary"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
