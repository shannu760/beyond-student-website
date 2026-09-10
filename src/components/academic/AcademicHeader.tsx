"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  ArrowUpRight, 
  Menu, 
  X, 
  BookOpen, 
  Tv, 
  Star,
  Activity,
  Bell,
  CheckCircle2,
  Lock,
  RotateCcw,
  Calendar,
  Award,
  Compass,
  ShieldCheck
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { DailyReportNotificationModal } from "@/components/academic/DailyReportNotificationModal";
import { BeyondBrandBadge } from "@/components/brand/BeyondBrandBadge";

export function AcademicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [starsBalance, setStarsBalance] = useState(1525);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const fetchProfileAndNotifications = async () => {
    try {
      // Fetch profile
      const profRes = await fetch("/api/profile");
      const profJson = await profRes.json();
      if (profJson.profile) {
        setCurrentProfile(profJson.profile);
        if (typeof profJson.profile.starsBalance === "number") {
          setStarsBalance(profJson.profile.starsBalance);
        }
      }

      // Fetch daily report notification status
      const repRes = await fetch("/api/daily-report");
      const repJson = await repRes.json();
      if (repJson.hasUnreadNotification !== undefined) {
        setHasUnreadNotification(Boolean(repJson.hasUnreadNotification));
      }
    } catch (e) {
      console.error("Header data fetch error:", e);
    }
  };

  useEffect(() => {
    fetchProfileAndNotifications();

    // Custom event listeners for real-time sync across components
    const handleActivityUpdate = () => {
      fetchProfileAndNotifications();
    };

    window.addEventListener("beyond:activity-updated", handleActivityUpdate);
    window.addEventListener("beyond:open-auth", () => setAuthModalOpen(true));
    window.addEventListener("beyond:open-report", () => setReportModalOpen(true));

    return () => {
      window.removeEventListener("beyond:activity-updated", handleActivityUpdate);
      window.removeEventListener("beyond:open-auth", () => setAuthModalOpen(true));
      window.removeEventListener("beyond:open-report", () => setReportModalOpen(true));
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#E1DDD2] text-[#1A2219]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Official BEYOND Brand Badge */}
          <BeyondBrandBadge 
            size="sm" 
            href="/"
          />

          {/* Desktop High-Efficiency Editorial Navigation */}
          <nav className="hidden xl:flex items-center gap-3.5 text-xs font-semibold text-[#556052]">
            <a href="#syllabus-radar" className="hover:text-[#283826] transition-colors flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              <span>Syllabus & NTA</span>
            </a>
            <Link href="/pyqs" className="hover:text-[#283826] transition-colors flex items-center gap-1 text-[#283826] font-bold">
              <BookOpen className="w-3.5 h-3.5 text-[#283826]" />
              <span>Official PYQs & AI Solver</span>
            </Link>
            <a href="#videos" className="hover:text-[#283826] transition-colors flex items-center gap-1">
              <Tv className="w-3.5 h-3.5 text-[#B07D4F]" />
              <span>Videos</span>
            </a>
            <a href="#schedule" className="hover:text-[#283826] transition-colors flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#6C7D64]" />
              <span>Study Planner</span>
            </a>
            <a href="#explain-and-earn" className="hover:text-[#283826] transition-colors flex items-center gap-1 text-[#B07D4F] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#B07D4F]" />
              <span>Explain & Earn</span>
            </a>
            <a href="#study-hall" className="hover:text-[#283826] transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#283826]" />
              <span>Quiet Study Rooms</span>
            </a>
            <a href="#scholarships" className="hover:text-[#283826] transition-colors flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#B07D4F]" />
              <span>Scholarships</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E8DDC8] text-[#283826]">NSP</span>
            </a>
            <Link href="/about" className="hover:text-[#283826] transition-colors font-medium">
              <span>About</span>
            </Link>
            <Link href="/student/dashboard" className="text-[#283826] hover:text-[#364A33] transition-colors font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#283826]" />
              <span>Hub</span>
            </Link>
          </nav>

          {/* Header Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Live Star Balance Pill */}
            <a 
              href="#explain-and-earn" 
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#F0EDE4] border border-[#E1DDD2] text-xs font-mono font-bold text-[#B07D4F] hover:border-[#B07D4F] transition-all shadow-2xs"
              title="Current Preserved Star Balance"
            >
              <Star className="w-3.5 h-3.5 fill-[#B07D4F]" />
              <span>{starsBalance.toLocaleString()}</span>
            </a>

            {/* Notification Bell with Unread Badge */}
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="relative p-2 rounded-lg bg-[#F0EDE4] hover:bg-[#E8DDC8] border border-[#E1DDD2] text-[#283826] transition-colors cursor-pointer"
              title="Daily Report Notification"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotification && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-600 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            {/* Google Authentication Trigger */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-white border border-[#D5CFBE] text-xs font-medium text-[#1A2219] transition-all shadow-2xs cursor-pointer group"
              title="Sign in with Google or view student profile"
            >
              {currentProfile?.avatarUrl ? (
                <img
                  src={currentProfile.avatarUrl}
                  alt={currentProfile.fullName || "Student"}
                  className="w-5 h-5 rounded-full object-cover border border-[#283826]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/user-avatar.jpg";
                  }}
                />
              ) : (
                /* Google G SVG */
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span className="font-semibold truncate max-w-[90px]">
                {currentProfile?.fullName ? currentProfile.fullName.split(" ")[0] : "Google Sign-In"}
              </span>
            </button>

            {/* Workspace Button */}
            <Link
              href="/student/dashboard"
              className="px-3 py-1.5 text-xs font-semibold text-[#F7F5F0] bg-[#283826] hover:bg-[#364A33] rounded transition-all shadow-xs flex items-center gap-1"
            >
              <span>Workspace</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#F7F5F0]" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="relative p-2 rounded text-[#283826] hover:bg-[#F0EDE4]"
              aria-label="Daily Report"
            >
              <Bell className="w-5 h-5" />
              {hasUnreadNotification && (
                <span className="absolute 1 top-1 right-1 w-2.5 h-2.5 bg-amber-600 rounded-full animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded text-[#1A2219] hover:bg-[#F0EDE4]"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="xl:hidden bg-[#F7F5F0] border-b border-[#E1DDD2] px-6 py-4 space-y-3">
            <Link
              href="/pyqs"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-semibold text-[#283826] py-1"
            >
              <BookOpen className="w-4 h-4 text-[#283826]" />
              <span>Official PYQs & Nemotron Ultra AI Solver</span>
            </Link>
            <a
              href="#syllabus-radar"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-medium text-[#1A2219] py-1"
            >
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Syllabus & Real-Time NTA Tracking</span>
            </a>
            <a
              href="#videos"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-medium text-[#1A2219] py-1"
            >
              <Tv className="w-4 h-4 text-[#B07D4F]" />
              <span>Curated Videos (English, Hindi, Telugu)</span>
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-medium text-[#1A2219] py-1"
            >
              <Calendar className="w-4 h-4 text-[#6C7D64]" />
              <span>Study Planner</span>
            </a>
            <a
              href="#explain-and-earn"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-[#B07D4F] py-1"
            >
              <Star className="w-4 h-4 fill-[#B07D4F] text-[#B07D4F]" />
              <span>Explain a Topic & Earn Stars (+75 Stars)</span>
            </a>
            <a
              href="#study-hall"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-medium text-[#1A2219] py-1"
            >
              <Users className="w-4 h-4 text-[#283826]" />
              <span>Quiet Study Rooms</span>
            </a>
            <a
              href="#scholarships"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-medium text-[#1A2219] py-1"
            >
              <Award className="w-4 h-4 text-[#B07D4F]" />
              <span>National Scholarship Radar (AY 2026-27)</span>
            </a>
            <Link
              href="/student/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-[#283826] py-1"
            >
              <Compass className="w-4 h-4 text-[#283826]" />
              <span>Student Hub & Dashboard</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-medium text-[#1A2219] py-1"
            >
              <ShieldCheck className="w-4 h-4 text-[#283826]" />
              <span>About & Trust Charter</span>
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 text-sm font-medium text-[#1A2219] py-1"
            >
              <Activity className="w-4 h-4 text-[#B07D4F]" />
              <span>How BEYOND Works (4 Growth Loops)</span>
            </Link>

            <div className="pt-3 border-t border-[#E1DDD2] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full py-2 text-xs font-semibold text-[#1A2219] bg-[#EAE6DB] rounded border border-[#D5CFBE] flex items-center justify-center gap-2"
              >
                {/* Google G SVG */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{currentProfile?.fullName ? currentProfile.fullName : "Sign In with Google"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setReportModalOpen(true);
                }}
                className="w-full py-2 text-xs font-semibold text-[#283826] bg-[#F0EDE4] rounded border border-[#E1DDD2] flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>View Today's End-of-Day Report</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentProfile={currentProfile}
        onAuthSuccess={(updated) => {
          setCurrentProfile(updated);
          if (typeof updated.starsBalance === "number") {
            setStarsBalance(updated.starsBalance);
          }
        }}
      />

      {/* End-of-Day Report Notification Modal */}
      <DailyReportNotificationModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReportUpdated={() => {
          fetchProfileAndNotifications();
        }}
      />
    </>
  );
}
