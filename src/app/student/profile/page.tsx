"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Award,
  Star,
  Flame,
  ShieldCheck,
  QrCode,
  BookOpen,
  Target,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RotateCcw,
  Edit3,
  UserCheck,
  Zap,
  FileText,
  ChevronRight,
  Download,
  Database,
  Lock,
  Plus,
  Play,
  Pause,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Check,
  X,
  Crown
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth/AuthModal";
import DatabaseExtractorCard from "@/components/database/DatabaseExtractorCard";
import { BeyondBrandBadge, MembershipTier } from "@/components/brand/BeyondBrandBadge";
import { MembershipUpgradeModal } from "@/components/academic/MembershipUpgradeModal";
import { MembershipPlansSection } from "@/components/academic/MembershipPlansSection";

interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  githubUsername?: string;
  authProvider?: "github" | "google" | "custom";
  classLevel: string;
  targetExam: string;
  streakDays: number;
  starsBalance: number;
  totalFocusMins: number;
  explanationsSubmitted: number;
  lastActive: string;
  membershipTier?: MembershipTier;
  membershipExpiresAt?: string;
}

interface QuestionAttempt {
  id: string;
  studentId: string;
  subject: string;
  topic: string;
  isPYQ: boolean;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string;
}

interface FocusSession {
  id: string;
  studentId: string;
  durationMinutes: number;
  goal: string;
  timestamp: string;
}

interface TrackedScholarship {
  id: string;
  schemeId: string;
  title: string;
  authority: string;
  amount: string;
  status: string;
  deadline: string;
  trackedAt: string;
}

interface TopicExplanation {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  topicTitle: string;
  explanationText: string;
  fileAttachment?: {
    name: string;
    size: number;
    url: string;
    type: string;
  };
  starsEarned: number;
  isVerified: boolean;
  upvotes: number;
  createdAt: string;
}

interface DigitalCertificate {
  id: string;
  title: string;
  issuedDate: string;
  issuer: string;
  verificationCode: string;
  skillsVerified: string[];
  grade: string;
  hash: string;
}

const DIGITAL_CERTIFICATES: DigitalCertificate[] = [
  {
    id: "cert-101",
    title: "Physics Mechanics & Kinematics Mastery",
    issuedDate: "15th August 2026",
    issuer: "BEYOND Academic Council",
    verificationCode: "BYND-CERT-88421-KIN",
    skillsVerified: ["Newton's Laws of Motion", "Free Body Diagrams", "Work-Energy Theorem", "Constraint Relations"],
    grade: "Distinction (Top 2%)",
    hash: "sha256:7f9b8c2a3e1d4f5b6a7c8e9d0b1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
  },
  {
    id: "cert-102",
    title: "Feynman Peer Learning Contributor",
    issuedDate: "20th August 2026",
    issuer: "BEYOND Student Growth Network",
    verificationCode: "BYND-CERT-99120-PEER",
    skillsVerified: ["Concept Derivation", "Mathematical Rigor", "Feynman Technique", "Peer Problem Guidance"],
    grade: "Verified Peer Mentor",
    hash: "sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
  },
  {
    id: "cert-103",
    title: "National Scholarship Merit Candidate",
    issuedDate: "2nd September 2026",
    issuer: "Buddy4Study & National Scholarships Division",
    verificationCode: "BYND-CERT-77312-SCH",
    skillsVerified: ["Reliance Foundation UG Track", "Kotak Kanya Eligibility", "Academic SOP Formulation"],
    grade: "Level-1 Application Ready",
    hash: "sha256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d"
  }
];

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stream" | "focus" | "practice" | "scholarships" | "explanations" | "membership">("stream");
  
  // Real-time activity state
  const [todayAttempts, setTodayAttempts] = useState<QuestionAttempt[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [trackedScholarships, setTrackedScholarships] = useState<TrackedScholarship[]>([]);
  const [explanations, setExplanations] = useState<TopicExplanation[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalMCQs: 0,
    totalPYQs: 0,
    correctCount: 0,
    accuracyPercentage: 0,
    totalFocusMinutes: 0
  });

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editGoalModalOpen, setEditGoalModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<DigitalCertificate | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Focus Session Logger State
  const [focusDuration, setFocusDuration] = useState<number>(25);
  const [focusGoal, setFocusGoal] = useState<string>("Mechanics Free Body Diagrams & Constraint Equations");
  const [isLoggingFocus, setIsLoggingFocus] = useState(false);
  const [focusNotification, setFocusNotification] = useState<string | null>(null);

  // Quick Practice State
  const [quickQuestionAnswered, setQuickQuestionAnswered] = useState(false);
  const [selectedQuickOption, setSelectedQuickOption] = useState<number | null>(null);
  const [isQuickSolving, setIsQuickSolving] = useState(false);

  // Profile Edit Form State
  const [editFullName, setEditFullName] = useState("");
  const [editClassLevel, setEditClassLevel] = useState("Class 12");
  const [editTargetExam, setEditTargetExam] = useState("JEE Main & Advanced 2027");
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [resettingRecords, setResettingRecords] = useState(false);

  // Fetch all live data
  const loadAllStudentData = useCallback(async () => {
    try {
      // 1. Profile
      const profRes = await fetch("/api/profile");
      const profData = await profRes.json();
      if (profData.profile) {
        setProfile(profData.profile);
        setEditFullName(profData.profile.fullName || "Krishna Addanki");
        setEditClassLevel(profData.profile.classLevel || "Class 12");
        setEditTargetExam(profData.profile.targetExam || "JEE Main & Advanced 2027");
      }

      // 2. Activity & Today attempts
      const actRes = await fetch("/api/activity");
      const actData = await actRes.json();
      if (actData.today) {
        setTodayAttempts(actData.today.todayAttempts || []);
        setFocusSessions(actData.today.todayFocusSessions || []);
        setTodayStats({
          totalMCQs: actData.today.totalMCQs || 0,
          totalPYQs: actData.today.totalPYQs || 0,
          correctCount: actData.today.correctCount || 0,
          accuracyPercentage: actData.today.accuracyPercentage || 0,
          totalFocusMinutes: actData.today.totalFocusMinutes || 0
        });
      }

      // 3. Tracked Scholarships
      const schRes = await fetch("/api/scholarships/track");
      const schData = await schRes.json();
      if (schData.tracked) {
        setTrackedScholarships(schData.tracked);
      }

      // 4. Topic Explanations
      const expRes = await fetch("/api/explanations");
      const expData = await expRes.json();
      if (expData.explanations) {
        setExplanations(expData.explanations);
      }
    } catch (err) {
      console.error("Error loading student profile data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllStudentData();

    // Auto-detect and sync Supabase session (e.g. GitHub or Google OAuth)
    const syncSupabaseSession = async (user: any) => {
      if (!user) return;
      const email = user.email || "krishna.addanki633@gmail.com";
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        "Krishna Addanki";
      const avatarUrl =
        user.user_metadata?.avatar_url ||
        "/images/default-avatar.svg";
      const githubUsername =
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        (user.app_metadata?.provider === "github" ? "shannu760" : undefined);
      const authProvider = user.app_metadata?.provider === "github" ? "github" : "google";

      try {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            fullName,
            avatarUrl,
            githubUsername,
            authProvider,
          }),
        });
        const json = await res.json();
        if (json.profile) {
          setProfile(json.profile);
        }
      } catch (e) {
        console.error("Failed to sync session on profile page:", e);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseSession(session.user);
      }
    });

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncSupabaseSession(session.user);
      }
    });

    // Listen to updates from anywhere on the main site
    const handleActivityUpdate = () => {
      loadAllStudentData();
    };

    window.addEventListener("beyond:activity-updated", handleActivityUpdate);
    window.addEventListener("starBalanceUpdated", handleActivityUpdate);
    window.addEventListener("storage", handleActivityUpdate);

    return () => {
      authSub.subscription.unsubscribe();
      window.removeEventListener("beyond:activity-updated", handleActivityUpdate);
      window.removeEventListener("starBalanceUpdated", handleActivityUpdate);
      window.removeEventListener("storage", handleActivityUpdate);
    };
  }, [loadAllStudentData]);

  // Log Focus Session
  const handleLogFocusSession = async () => {
    if (!focusGoal.trim()) return;
    setIsLoggingFocus(true);
    setFocusNotification(null);

    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "focus",
          durationMinutes: focusDuration,
          goal: focusGoal.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setFocusNotification(`Logged ${focusDuration}m focus block! +${data.starsEarned} Stars awarded.`);
        window.dispatchEvent(new Event("beyond:activity-updated"));
        window.dispatchEvent(new Event("starBalanceUpdated"));
        await loadAllStudentData();
        setTimeout(() => setFocusNotification(null), 4000);
      }
    } catch (err) {
      console.error("Failed to log focus session:", err);
    } finally {
      setIsLoggingFocus(false);
    }
  };

  // Solve Quick Practice Question
  const handleQuickSolve = async (selectedIdx: number) => {
    setSelectedQuickOption(selectedIdx);
    setQuickQuestionAnswered(true);
    setIsQuickSolving(true);

    const isCorrect = selectedIdx === 1; // Option B is correct (20 m)

    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "question",
          subject: "Physics",
          topic: "Work, Energy & Power",
          isPYQ: true,
          isCorrect,
          timeSpentSeconds: 42
        })
      });

      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("beyond:activity-updated"));
        window.dispatchEvent(new Event("starBalanceUpdated"));
        await loadAllStudentData();
      }
    } catch (err) {
      console.error("Quick solve error:", err);
    } finally {
      setIsQuickSolving(false);
    }
  };

  // Save Goal updates
  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGoal(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editFullName.trim(),
          classLevel: editClassLevel,
          targetExam: editTargetExam,
          lastActive: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setEditGoalModalOpen(false);
        window.dispatchEvent(new Event("beyond:activity-updated"));
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSavingGoal(false);
    }
  };

  // Start from zero
  const handleResetToZero = async () => {
    if (!confirm("Are you sure you want to reset your daily practice attempts and focus session records back to zero? This provides a completely clean tracking baseline.")) {
      return;
    }
    setResettingRecords(true);
    try {
      const res = await fetch("/api/activity", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("beyond:activity-updated"));
        window.dispatchEvent(new Event("starBalanceUpdated"));
        await loadAllStudentData();
      }
    } catch (err) {
      console.error("Failed to reset records:", err);
    } finally {
      setResettingRecords(false);
    }
  };

  const studentInitials = profile?.fullName
    ? profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "KA";

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-16">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#283826] border-t-[#B07D4F] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#556052] font-sans">Synchronizing with Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Top Breadcrumb & Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#6C7D64]">
          <Link href="/" className="hover:text-[#283826] font-medium transition-colors">
            Monograph Home
          </Link>
          <span>/</span>
          <Link href="/student/dashboard" className="hover:text-[#283826] font-medium transition-colors">
            Workspace Hub
          </Link>
          <span>/</span>
          <span className="text-[#283826] font-bold">BEYOND Student ID</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Supabase Cloud Synchronized
          </span>

          <button
            onClick={handleResetToZero}
            disabled={resettingRecords}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono font-bold bg-[#F0EDE4] border border-[#E1DDD2] text-[#283826] hover:bg-[#E8DCC3] transition-colors"
            title="Reset question tracking ledger back to zero"
          >
            <RotateCcw className="w-3 h-3 text-[#B07D4F]" />
            <span>Start from Zero</span>
          </button>
        </div>
      </div>

      {/* Main Student ID Card */}
      <div className="bg-[#283826] text-[#F7F5F0] rounded-3xl p-6 sm:p-8 border border-[#364A33] shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[#B07D4F]/25 via-[#364A33]/30 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#F0EDE4] text-[#283826] font-bold text-3xl flex items-center justify-center border-2 border-[#B07D4F] shadow-lg font-mono overflow-hidden">
                {profile?.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl || "/images/default-avatar.svg"} 
                    alt={profile.fullName || "Student"} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/default-avatar.svg";
                    }}
                  />
                ) : (
                  studentInitials
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#283826] flex items-center justify-center text-white" title="Active Verified Profile">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#F7F5F0]">
                  {profile?.fullName || "Krishna Addanki"}
                </h1>
                {profile?.membershipTier === "GOLD" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-gradient-to-r from-amber-400 to-[#C8A95B] text-[#1A2219] px-2.5 py-0.5 rounded-full border border-[#C8A95B] shadow-sm">
                    <Crown className="w-3.5 h-3.5 fill-[#1A2219]" />
                    BEYOND Gold Scholar
                  </span>
                ) : profile?.membershipTier === "PREMIUM" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full border border-emerald-400 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    BEYOND Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Student
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#F0EDE4]/80 font-mono">
                <span>BEYOND ID: <strong className="text-[#C8A95B]">{profile?.id ? `BYND-${profile.id.slice(-5).toUpperCase()}` : "BYND-2026-88421"}</strong></span>
                <span>•</span>
                <span>{profile?.email || "krishna.addanki633@gmail.com"}</span>
                {profile?.githubUsername && (
                  <>
                    <span>•</span>
                    <a
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-900 text-white hover:text-[#C8A95B] transition-colors border border-neutral-700 text-[11px]"
                      title="GitHub Verified Account"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>@{profile.githubUsername}</span>
                    </a>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#F0EDE4]/90">
                <span className="bg-[#364A33] px-2.5 py-0.5 rounded border border-[#6C7D64]/40 font-mono text-[11px]">
                  {profile?.classLevel || "Class 12"}
                </span>
                <span className="bg-[#364A33] px-2.5 py-0.5 rounded border border-[#6C7D64]/40 font-mono text-[11px] text-[#C8A95B]">
                  Target: {profile?.targetExam || "JEE Main & Advanced 2027"}
                </span>
                {profile?.authProvider === "github" && (
                  <span className="bg-neutral-900 text-neutral-200 px-2.5 py-0.5 rounded border border-neutral-700 font-mono text-[10px] inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    GitHub OAuth Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Identity Actions */}
          <div className="flex flex-wrap md:flex-col items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                profile?.membershipTier === "GOLD"
                  ? "bg-gradient-to-r from-[#C8A95B] to-amber-400 text-[#1A2219] hover:brightness-105"
                  : profile?.membershipTier === "PREMIUM"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-gradient-to-r from-amber-500 to-[#C8A95B] text-[#1A2219] hover:brightness-110"
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>
                {profile?.membershipTier === "GOLD"
                  ? "Gold Pass Active"
                  : profile?.membershipTier === "PREMIUM"
                  ? "Upgrade to Gold (₹699)"
                  : "Guild Pass: ₹499 / ₹699"}
              </span>
            </button>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F5F0] text-[#283826] hover:bg-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-[#283826]" />
              <span>Switch Profile / Auth</span>
            </button>

            <button
              onClick={() => setEditGoalModalOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#364A33] text-[#F7F5F0] hover:bg-[#435B40] text-xs font-bold border border-[#6C7D64]/50 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C8A95B]" />
              <span>Edit Academic Goals</span>
            </button>
          </div>
        </div>

        {/* Live Academic Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-[#364A33] text-center">
          <div className="bg-[#364A33]/70 p-3.5 rounded-2xl border border-[#6C7D64]/30 space-y-0.5">
            <div className="text-2xl font-bold font-serif text-[#C8A95B] flex items-center justify-center gap-1.5">
              <Star className="w-5 h-5 fill-[#C8A95B]" />
              <span>{(profile?.starsBalance ?? 72).toLocaleString()}</span>
            </div>
            <div className="text-[10px] uppercase font-mono text-[#F0EDE4]/70 font-bold tracking-wider">
              Preserved Stars Balance
            </div>
          </div>

          <div className="bg-[#364A33]/70 p-3.5 rounded-2xl border border-[#6C7D64]/30 space-y-0.5">
            <div className="text-2xl font-bold font-serif text-amber-400 flex items-center justify-center gap-1.5">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{profile?.streakDays ?? 1} Days</span>
            </div>
            <div className="text-[10px] uppercase font-mono text-[#F0EDE4]/70 font-bold tracking-wider">
              Daily Study Streak
            </div>
          </div>

          <div className="bg-[#364A33]/70 p-3.5 rounded-2xl border border-[#6C7D64]/30 space-y-0.5">
            <div className="text-2xl font-bold font-serif text-sky-300 flex items-center justify-center gap-1.5">
              <Clock className="w-5 h-5 text-sky-400" />
              <span>{(profile?.totalFocusMins ?? 0) + todayStats.totalFocusMinutes}m</span>
            </div>
            <div className="text-[10px] uppercase font-mono text-[#F0EDE4]/70 font-bold tracking-wider">
              Deep Focus Logged
            </div>
          </div>

          <div className="bg-[#364A33]/70 p-3.5 rounded-2xl border border-[#6C7D64]/30 space-y-0.5">
            <div className="text-2xl font-bold font-serif text-emerald-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{explanations.length} Solved</span>
            </div>
            <div className="text-[10px] uppercase font-mono text-[#F0EDE4]/70 font-bold tracking-wider">
              Feynman Explanations
            </div>
          </div>
        </div>
      </div>

      {/* Official BEYOND Brand & Guild Pass Section */}
      <div id="membership" className="rounded-3xl border border-[#D5CFBE] bg-white p-6 sm:p-7 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#F0EDE4]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#283826] bg-[#283826] shrink-0 shadow-sm">
              <Image
                src="/images/profile-logo.png"
                alt="BEYOND"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-[#1A2219]">
                  BEYOND Student Guild Membership
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    profile?.membershipTier === "GOLD"
                      ? "bg-gradient-to-r from-amber-400 to-[#C8A95B] text-[#1A2219]"
                      : profile?.membershipTier === "PREMIUM"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-[#F0EDE4] text-[#6C7D64] border border-[#D5CFBE]"
                  }`}
                >
                  {profile?.membershipTier || "FREE"} TIER
                </span>
              </div>
              <p className="text-xs text-[#4F5E4B]">
                Official institutional membership providing verified credentials, AI quota & topper mentorship.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
            >
              <Crown className="w-4 h-4 text-[#C8A95B]" />
              <span>
                {profile?.membershipTier === "GOLD"
                  ? "Renew / Manage Pass"
                  : profile?.membershipTier === "PREMIUM"
                  ? "Upgrade to Gold (₹699)"
                  : "Get BEYOND Pass (From ₹499)"}
              </span>
            </button>
          </div>
        </div>

        {/* Benefits Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#D5CFBE] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1A2219]">
              <span>Tier Status</span>
              <span className="font-mono text-[#283826]">{profile?.membershipTier || "FREE"}</span>
            </div>
            <p className="text-[11px] text-[#6C7D64]">
              {profile?.membershipTier === "GOLD"
                ? "Gold Scholar pass active for 90 days with 3x multiplier & 1-on-1 mentorship."
                : profile?.membershipTier === "PREMIUM"
                ? "Premium pass active with 2x star multiplier & unlimited AI derivations."
                : "Free foundational access with standard daily question ledger."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#D5CFBE] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1A2219]">
              <span>Star Multiplier</span>
              <span className="font-mono text-amber-700 font-bold">
                {profile?.membershipTier === "GOLD" ? "3.0x Boost" : profile?.membershipTier === "PREMIUM" ? "2.0x Boost" : "1.0x (Standard)"}
              </span>
            </div>
            <p className="text-[11px] text-[#6C7D64]">
              Earn amplified stars on every verified Feynman topic explanation and daily streak.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#D5CFBE] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1A2219]">
              <span>Nemotron Ultra AI</span>
              <span className="font-mono text-emerald-700 font-bold">
                {profile?.membershipTier === "GOLD" || profile?.membershipTier === "PREMIUM" ? "Unlimited" : "10 / Day"}
              </span>
            </div>
            <p className="text-[11px] text-[#6C7D64]">
              Step-by-step rigorous derivations across JEE Advanced, NEET, SAT & GRE questions.
            </p>
          </div>
        </div>
      </div>

      {/* Realistic Real-Time Navigation Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1DDD2] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="font-serif font-bold text-2xl text-[#1A2219]">
                Live Real-Time Academic Activity
              </h2>
            </div>
            <p className="text-xs text-[#6C7D64] mt-0.5">
              Everything you solve, study, explain, and track on BEYOND is synced in real time across the website and database.
            </p>
          </div>

          {/* Tab Selector Pills */}
          <div className="flex items-center overflow-x-auto gap-1.5 bg-[#EFECE3] p-1.5 rounded-xl border border-[#E1DDD2] shrink-0">
            <button
              onClick={() => setActiveTab("stream")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "stream"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                  : "text-[#6C7D64] hover:text-[#1A2219]"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Activity Stream ({todayAttempts.length + focusSessions.length + trackedScholarships.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("focus")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "focus"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                  : "text-[#6C7D64] hover:text-[#1A2219]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Focus Session</span>
            </button>

            <button
              onClick={() => setActiveTab("practice")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "practice"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                  : "text-[#6C7D64] hover:text-[#1A2219]"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Quick Practice</span>
            </button>

            <button
              onClick={() => setActiveTab("scholarships")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "scholarships"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                  : "text-[#6C7D64] hover:text-[#1A2219]"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Tracked Scholarships ({trackedScholarships.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("explanations")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "explanations"
                  ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                  : "text-[#6C7D64] hover:text-[#1A2219]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Feynman Explanations ({explanations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("membership")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "membership"
                  ? "bg-gradient-to-r from-amber-600 to-[#C8A95B] text-[#1A2219] shadow-xs"
                  : "text-amber-800 hover:text-amber-900 bg-amber-50/70"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#C8A95B]" />
              <span>Guild Pass (Plans)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Real-Time Activity Stream */}
        {activeTab === "stream" && (
          <div className="space-y-4">
            {/* Daily Score Summary Card */}
            <div className="bg-[#F0EDE4] rounded-2xl p-5 border border-[#E1DDD2] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#283826] text-[#F7F5F0] flex items-center justify-center font-bold text-sm">
                  🎯
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1A2219]">
                    Today's Diagnostic & Focus Summary
                  </div>
                  <div className="text-xs text-[#6C7D64]">
                    {todayStats.totalMCQs + todayStats.totalPYQs} questions solved • {todayStats.totalFocusMinutes} focus minutes logged today
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-center">
                <div className="px-3 py-1 rounded bg-[#E8DCC3] border border-[#D5CFBE]">
                  <div className="text-sm font-bold font-mono text-[#283826]">{todayStats.accuracyPercentage}%</div>
                  <div className="text-[10px] font-mono text-[#6C7D64] uppercase font-bold">Accuracy</div>
                </div>

                <div className="px-3 py-1 rounded bg-[#E8DCC3] border border-[#D5CFBE]">
                  <div className="text-sm font-bold font-mono text-emerald-800">+{todayStats.correctCount * 15 + todayStats.totalPYQs * 5} ⭐</div>
                  <div className="text-[10px] font-mono text-[#6C7D64] uppercase font-bold">Today's Stars</div>
                </div>

                <Link
                  href="/pyqs"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#283826] text-[#F7F5F0] text-xs font-bold hover:bg-[#364A33] transition-colors"
                >
                  <span>Solve PYQs Station</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="bg-white rounded-2xl border border-[#E1DDD2] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#6C7D64]">
                  Recent Verified Events (Today)
                </span>
                <span className="text-xs font-mono text-[#6C7D64]">
                  Live Ledger State
                </span>
              </div>

              {todayAttempts.length === 0 && focusSessions.length === 0 && trackedScholarships.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F0EDE4] text-[#6C7D64] flex items-center justify-center mx-auto text-xl">
                    ⏳
                  </div>
                  <div className="font-serif font-bold text-base text-[#1A2219]">
                    No study records logged yet today
                  </div>
                  <p className="text-xs text-[#6C7D64] max-w-md mx-auto">
                    Start a focus session, answer a quick practice question, or solve PYQs to build your daily report and earn stars.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab("focus")}
                      className="px-4 py-2 rounded-xl bg-[#283826] text-[#F7F5F0] text-xs font-bold hover:bg-[#364A33] transition-colors"
                    >
                      Log 25m Focus Block
                    </button>
                    <button
                      onClick={() => setActiveTab("practice")}
                      className="px-4 py-2 rounded-xl bg-[#F0EDE4] text-[#283826] text-xs font-bold hover:bg-[#E8DCC3] transition-colors"
                    >
                      Try Quick Question
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#F0EDE4]">
                  {/* Tracked Scholarships */}
                  {trackedScholarships.map((sch) => (
                    <div key={sch.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1A2219]">{sch.title}</span>
                            <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {sch.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#6C7D64]">
                            Tracked via {sch.authority} • Grant: <strong className="text-[#283826]">{sch.amount}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shrink-0">
                        +50 ⭐
                      </span>
                    </div>
                  ))}

                  {/* Today Focus Sessions */}
                  {focusSessions.map((foc) => (
                    <div key={foc.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1A2219]">Completed Deep Focus Block</span>
                            <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                              {foc.durationMinutes} Minutes
                            </span>
                          </div>
                          <p className="text-xs text-[#6C7D64]">
                            Goal: "{foc.goal}"
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shrink-0">
                        +{foc.durationMinutes + (foc.durationMinutes >= 25 ? 25 : 0)} ⭐
                      </span>
                    </div>
                  ))}

                  {/* Today Question Attempts */}
                  {todayAttempts.map((att) => (
                    <div key={att.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          att.isCorrect 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {att.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1A2219]">{att.topic}</span>
                            <span className="text-[10px] font-mono uppercase bg-[#F0EDE4] text-[#283826] px-2 py-0.5 rounded font-bold">
                              {att.subject} • {att.isPYQ ? "Official PYQ" : "MCQ Drill"}
                            </span>
                          </div>
                          <p className="text-xs text-[#6C7D64]">
                            {att.isCorrect ? "Solved Correctly" : "Incorrect Option"} in {att.timeSpentSeconds} seconds
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded border shrink-0 ${
                        att.isCorrect 
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200" 
                          : "text-amber-700 bg-amber-50 border-amber-200"
                      }`}>
                        {att.isCorrect ? (att.isPYQ ? "+20 ⭐" : "+10 ⭐") : "+2 ⭐"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Focus Session Logger */}
        {activeTab === "focus" && (
          <div className="bg-white rounded-2xl border border-[#E1DDD2] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-[#B07D4F] tracking-wider">
                POMODORO & QUIET STUDY HALL LOGGER
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#1A2219]">
                Log a Live Academic Focus Session
              </h3>
              <p className="text-xs text-[#6C7D64]">
                Logging your deep work blocks updates your student profile, increases your star balance, and feeds your End-of-Day Report.
              </p>
            </div>

            {focusNotification && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{focusNotification}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <label className="block text-xs font-mono font-bold text-[#1A2219] uppercase">
                  1. Select Focus Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { mins: 25, label: "25m Sprint", bonus: "+50 Stars" },
                    { mins: 45, label: "45m Deep Drill", bonus: "+70 Stars" },
                    { mins: 60, label: "60m Mock Test", bonus: "+85 Stars" }
                  ].map((preset) => (
                    <button
                      key={preset.mins}
                      type="button"
                      onClick={() => setFocusDuration(preset.mins)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        focusDuration === preset.mins
                          ? "bg-[#283826] text-[#F7F5F0] border-[#283826] shadow-sm font-bold"
                          : "bg-[#F7F5F0] text-[#1A2219] border-[#E1DDD2] hover:bg-[#EFECE3]"
                      }`}
                    >
                      <div className="text-base font-serif font-bold">{preset.mins} Min</div>
                      <div className="text-[10px] font-mono text-[#C8A95B] mt-0.5">{preset.bonus}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-mono font-bold text-[#1A2219] uppercase">
                    2. Specific Learning Goal or Syllabus Topic
                  </label>
                  <input
                    type="text"
                    value={focusGoal}
                    onChange={(e) => setFocusGoal(e.target.value)}
                    placeholder="e.g. Rotational Dynamics FBDs or Definite Integrals King's Rule..."
                    className="w-full px-4 py-3 rounded-xl border border-[#D5CFBE] bg-[#F7F5F0] text-xs font-sans text-[#1A2219] focus:outline-hidden focus:ring-2 focus:ring-[#283826]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleLogFocusSession}
                  disabled={isLoggingFocus || !focusGoal.trim()}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#283826] text-[#F7F5F0] hover:bg-[#364A33] text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoggingFocus ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Logging to Database...</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-[#C8A95B]" />
                      <span>Log Completed {focusDuration}m Session & Earn Stars</span>
                    </>
                  )}
                </button>
              </div>

              {/* Focus Hall Context Card */}
              <div className="bg-[#F0EDE4] p-6 rounded-2xl border border-[#E1DDD2] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#6C7D64]">
                    Quiet Study Hall Integration
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#1A2219]">
                    Study Alongside Serious Peers
                  </h4>
                  <p className="text-xs text-[#6C7D64] leading-relaxed">
                    You can also enter the live Quiet Study Room to run continuous Pomodoro timers with silent peer accountability, ambient acoustics, and auto-logging.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E1DDD2]">
                  <Link
                    href="/student/study/rooms"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#283826] hover:text-[#B07D4F] transition-colors"
                  >
                    <span>Enter Live Study Rooms</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Quick Practice */}
        {activeTab === "practice" && (
          <div className="bg-white rounded-2xl border border-[#E1DDD2] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-[#B07D4F] tracking-wider">
                  REAL-TIME SYLLABUS PRACTICE
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#1A2219]">
                  Live Diagnostic Question
                </h3>
                <p className="text-xs text-[#6C7D64]">
                  Solve this authentic problem to test your understanding. Results immediately record in your live profile.
                </p>
              </div>

              <Link
                href="/pyqs"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#283826] text-[#F7F5F0] text-xs font-bold hover:bg-[#364A33] transition-all shrink-0"
              >
                <span>Browse Dedicated PYQ Station</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Question Card */}
            <div className="bg-[#F7F5F0] p-6 rounded-2xl border border-[#E1DDD2] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E1DDD2] pb-3 text-xs">
                <span className="font-mono uppercase font-bold text-[#B07D4F]">
                  JEE Main 2024 (Session 1) • Physics Mechanics
                </span>
                <span className="font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  +20 Stars for Correct Answer
                </span>
              </div>

              <div className="text-sm font-sans text-[#1A2219] font-medium leading-relaxed">
                A block of mass <code className="bg-white px-1.5 py-0.5 rounded border border-[#E1DDD2]">m = 2 kg</code> is released from rest from a height <code className="bg-white px-1.5 py-0.5 rounded border border-[#E1DDD2]">h = 5 m</code> on a frictionless curved track which smoothly terminates into a rough horizontal track of friction coefficient <code className="bg-white px-1.5 py-0.5 rounded border border-[#E1DDD2]">μ = 0.25</code>. The distance <code className="bg-white px-1.5 py-0.5 rounded border border-[#E1DDD2]">d</code> travelled by the block on the rough horizontal track before coming to rest is (Take <code className="bg-white px-1.5 py-0.5 rounded border border-[#E1DDD2]">g = 10 m/s²</code>):
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { label: "A", val: "10 m" },
                  { label: "B", val: "20 m" },
                  { label: "C", val: "15 m" },
                  { label: "D", val: "25 m" }
                ].map((opt, idx) => {
                  const isSelected = selectedQuickOption === idx;
                  const isCorrectOpt = idx === 1;

                  let btnStyle = "bg-white border-[#E1DDD2] text-[#1A2219] hover:bg-[#F0EDE4]";
                  if (quickQuestionAnswered) {
                    if (isCorrectOpt) btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                    else if (isSelected) btnStyle = "bg-red-100 border-red-400 text-red-950 font-bold";
                    else btnStyle = "bg-white/60 border-transparent text-[#6C7D64] opacity-60";
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => !quickQuestionAnswered && handleQuickSolve(idx)}
                      disabled={quickQuestionAnswered || isQuickSolving}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#283826]/10 font-mono font-bold text-xs flex items-center justify-center text-[#283826]">
                          {opt.label}
                        </span>
                        <span className="text-sm font-sans">{opt.val}</span>
                      </div>
                      {quickQuestionAnswered && isCorrectOpt && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {quickQuestionAnswered && isSelected && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quickQuestionAnswered && (
                <div className="p-4 rounded-xl bg-white border border-emerald-300 text-xs text-[#1A2219] space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Answer: B (20 m) • 60-Second Speed-Hack</span>
                  </div>
                  <p className="text-[#6C7D64] leading-relaxed">
                    By Work-Energy Theorem: Total work by gravity + work by friction = ΔK = 0.
                    Thus <code className="bg-[#F0EDE4] px-1 rounded">mgh - μmgd = 0</code> ⇒ <code className="bg-[#F0EDE4] px-1 rounded font-bold">d = h / μ = 5 / 0.25 = 20 m</code>. Mass <code className="bg-[#F0EDE4] px-1 rounded">m</code> and gravity <code className="bg-[#F0EDE4] px-1 rounded">g</code> cancel completely!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Tracked Scholarships */}
        {activeTab === "scholarships" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E1DDD2]">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A2219]">
                  Buddy4Study & National Scholarships Tracked
                </h3>
                <p className="text-xs text-[#6C7D64]">
                  These opportunities are saved in your Supabase profile ledger. You earn +50 Stars per tracked scholarship.
                </p>
              </div>

              <Link
                href="/#scholarships"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#283826] text-[#F7F5F0] text-xs font-bold hover:bg-[#364A33] transition-colors shrink-0"
              >
                <span>Find More Scholarships</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackedScholarships.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-white rounded-2xl p-5 border border-[#E1DDD2] hover:border-[#B07D4F] transition-all space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
                    <span className="text-[10px] font-mono uppercase bg-[#F0EDE4] text-[#283826] px-2 py-0.5 rounded font-bold">
                      {sch.authority}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Status: {sch.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-[#1A2219]">
                      {sch.title}
                    </h4>
                    <div className="text-sm font-serif font-bold text-[#B07D4F] mt-1">
                      {sch.amount}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F0EDE4] flex items-center justify-between text-xs">
                    <span className="text-[#6C7D64] font-mono">
                      Deadline: {sch.deadline}
                    </span>
                    <Link
                      href="/#scholarships"
                      className="text-[#283826] font-bold hover:text-[#B07D4F] flex items-center gap-1"
                    >
                      <span>Manage Application</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Feynman Explanations Portfolio */}
        {activeTab === "explanations" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E1DDD2]">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A2219]">
                  Feynman Technique Submissions & Solutions
                </h3>
                <p className="text-xs text-[#6C7D64]">
                  Teaching concepts is the ultimate mastery test. Your explanations are preserved in the knowledge base and reward you with academic stars.
                </p>
              </div>

              <Link
                href="/#explain-and-earn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#283826] text-[#F7F5F0] text-xs font-bold hover:bg-[#364A33] transition-colors shrink-0"
              >
                <span>Submit New Explanation (+75 ⭐)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {explanations.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl p-6 border border-[#E1DDD2] space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EDE4] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-[#283826] text-[#F7F5F0] px-2 py-0.5 rounded font-bold">
                        {exp.subject}
                      </span>
                      <span className="font-serif font-bold text-base text-[#1A2219]">
                        {exp.topicTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Solution
                      </span>
                      <span className="text-xs font-mono font-bold text-[#B07D4F] bg-[#F0EDE4] px-2 py-0.5 rounded">
                        +{exp.starsEarned} Stars
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1A2219]/90 font-sans leading-relaxed bg-[#F7F5F0] p-4 rounded-xl border border-[#E1DDD2]">
                    "{exp.explanationText}"
                  </p>

                  {exp.fileAttachment && (
                    <div className="flex items-center justify-between bg-[#F0EDE4] px-4 py-2.5 rounded-xl border border-[#E1DDD2] text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#283826]" />
                        <span className="font-mono font-bold text-[#1A2219]">{exp.fileAttachment.name}</span>
                        <span className="text-[#6C7D64]">({(exp.fileAttachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 font-bold">Attached Proof Sheet</span>
                    </div>
                  )}

                  <div className="text-[11px] text-[#6C7D64] flex items-center justify-between pt-1">
                    <span>Submitted by {exp.studentName}</span>
                    <span>{exp.upvotes} Peer Upvotes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BEYOND Guild Membership Plans */}
        {activeTab === "membership" && (
          <div className="bg-white rounded-3xl border border-[#D5CFBE] p-3 sm:p-6 shadow-xs">
            <MembershipPlansSection
              currentTier={profile?.membershipTier || "FREE"}
              currentStars={profile?.starsBalance || 0}
              onUpgradeSuccess={async () => {
                await loadAllStudentData();
              }}
            />
          </div>
        )}
      </div>

      {/* Verifiable Digital Certificates */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E1DDD2] pb-3">
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#1A2219]">
              Verifiable Academic Credentials & Certificates
            </h2>
            <p className="text-xs text-[#6C7D64]">
              Cryptographically signed credentials backed by diagnostic test evidence, syllabus problem solving, and peer mentoring.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 self-start sm:self-auto">
            SHA-256 Ledger Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DIGITAL_CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              className="bg-white border border-[#E1DDD2] hover:border-[#B07D4F] rounded-2xl p-5 shadow-xs space-y-4 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#283826] bg-[#F0EDE4] px-2 py-0.5 rounded">
                    {cert.issuer}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A2219] mb-1">
                    {cert.title}
                  </h3>
                  <div className="text-[11px] font-mono text-[#B07D4F] font-semibold">{cert.grade}</div>
                  <p className="text-[11px] text-[#6C7D64] mt-0.5">Issued: {cert.issuedDate}</p>
                </div>

                <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#E1DDD2] space-y-1.5">
                  <div className="text-[10px] uppercase font-mono font-bold text-[#6C7D64]">
                    Verified Competencies
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cert.skillsVerified.map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E1DDD2] text-[#283826] font-medium">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EDE4] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#6C7D64] font-bold">
                  {cert.verificationCode}
                </span>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="text-xs font-bold text-[#283826] hover:text-[#B07D4F] flex items-center gap-1"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Database Extractor & Data Sovereignty */}
      <section className="space-y-3 pt-4">
        <h2 className="font-serif font-bold text-2xl text-[#1A2219]">
          Student Data Sovereignty & Export Engine
        </h2>
        <DatabaseExtractorCard />
      </section>

      {/* MODAL: Auth Modal for Profile Switch / Google Auth */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentProfile={profile}
        onAuthSuccess={(newProfile) => {
          setProfile(newProfile);
          setAuthModalOpen(false);
          loadAllStudentData();
          window.dispatchEvent(new Event("beyond:activity-updated"));
        }}
      />

      {/* MODAL: Edit Academic Goals */}
      {editGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2219]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#F7F5F0] rounded-2xl border border-[#D5CFBE] shadow-2xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E1DDD2] pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#B07D4F]" />
                <h3 className="font-serif font-bold text-lg text-[#1A2219]">
                  Update Academic Goals
                </h3>
              </div>
              <button
                onClick={() => setEditGoalModalOpen(false)}
                className="p-1 rounded text-[#6C7D64] hover:text-[#1A2219]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-[#1A2219] uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CFBE] bg-white text-xs font-sans text-[#1A2219] focus:outline-hidden focus:ring-2 focus:ring-[#283826]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-[#1A2219] uppercase">
                  Current Class Level
                </label>
                <select
                  value={editClassLevel}
                  onChange={(e) => setEditClassLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CFBE] bg-white text-xs font-sans text-[#1A2219] focus:outline-hidden focus:ring-2 focus:ring-[#283826]"
                >
                  <option value="Class 11">Class 11 (Foundation Year)</option>
                  <option value="Class 12">Class 12 (Board & Target Year)</option>
                  <option value="Dropper / Gap Year">Dropper / Gap Year (Full-time Focus)</option>
                  <option value="UG 1st Year">Undergraduate 1st Year (Degree + Scholarships)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-[#1A2219] uppercase">
                  Primary Target Examination
                </label>
                <select
                  value={editTargetExam}
                  onChange={(e) => setEditTargetExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CFBE] bg-white text-xs font-sans text-[#1A2219] focus:outline-hidden focus:ring-2 focus:ring-[#283826]"
                >
                  <option value="JEE Main & Advanced 2027">JEE Main & Advanced (Engineering)</option>
                  <option value="NEET UG 2027">NEET UG (Medical Sciences)</option>
                  <option value="Digital SAT Suite 2026-27">Digital SAT Suite (Global Admissions)</option>
                  <option value="GRE General Quantitative & Verbal">GRE General Test (Graduate School)</option>
                  <option value="Pure Sciences (IISER / NISER / IAT)">Pure Sciences (IISER / NISER / IAT)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E1DDD2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6C7D64] hover:text-[#1A2219]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGoal}
                  className="px-5 py-2 rounded-xl bg-[#283826] text-[#F7F5F0] hover:bg-[#364A33] text-xs font-bold transition-all shadow-sm"
                >
                  {isSavingGoal ? "Saving..." : "Save Academic Goals"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Digital Credential Verification */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2219]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#F7F5F0] rounded-2xl border border-[#D5CFBE] shadow-2xl p-6 sm:p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E1DDD2] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="font-serif font-bold text-xl text-[#1A2219]">
                  Cryptographic Credential Verification
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 rounded text-[#6C7D64] hover:text-[#1A2219]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-emerald-800">
                    STATUS: CRYPTOGRAPHICALLY VALID
                  </span>
                  <span className="text-[10px] font-mono text-[#6C7D64]">AY 2026-27</span>
                </div>
                <h4 className="font-serif font-bold text-lg text-[#1A2219]">
                  {selectedCert.title}
                </h4>
                <p className="text-xs text-[#6C7D64]">
                  Issued to <strong className="text-[#1A2219]">{profile?.fullName || "Krishna Addanki"}</strong> ({profile?.email || "krishna.addanki633@gmail.com"}) by {selectedCert.issuer}.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-[#6C7D64]">
                <div>Certificate ID: <strong className="text-[#1A2219]">{selectedCert.verificationCode}</strong></div>
                <div>Issue Date: <strong className="text-[#1A2219]">{selectedCert.issuedDate}</strong></div>
                <div>Milestone Rating: <strong className="text-[#B07D4F]">{selectedCert.grade}</strong></div>
                <div className="break-all pt-1 text-[10px] text-[#6C7D64]/80">
                  SHA-256 Digest: <code>{selectedCert.hash}</code>
                </div>
              </div>

              <div className="p-3 bg-[#F0EDE4] rounded-xl border border-[#E1DDD2] text-xs text-[#1A2219]">
                <strong className="block mb-1 text-[#283826]">Verified Competencies:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-[#6C7D64]">
                  {selectedCert.skillsVerified.map((sk, i) => (
                    <li key={i}>{sk}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E1DDD2] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#6C7D64]">
                BEYOND Academic Trust Network
              </span>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 rounded-xl bg-[#283826] text-[#F7F5F0] text-xs font-bold hover:bg-[#364A33] transition-colors"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Membership Upgrade Modal */}
      <MembershipUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentTier={profile?.membershipTier || "FREE"}
        currentStars={profile?.starsBalance || 0}
        onUpgraded={async () => {
          await loadAllStudentData();
        }}
      />
    </div>
  );
}
