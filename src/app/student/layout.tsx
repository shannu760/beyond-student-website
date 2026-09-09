"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  BookOpen,
  Users,
  Target,
  Award,
  Lightbulb,
  Flame,
  Star,
  ChevronRight,
  Menu,
  X,
  Search,
  ArrowLeft,
  Rocket,
  PiggyBank,
  Code2,
  FileText,
  Crown
} from "lucide-react";
import { BeyondBrandBadge } from "@/components/brand/BeyondBrandBadge";

const NAV_ITEMS = [
  { name: "Growth Hub", href: "/student/dashboard", icon: Compass },
  { name: "Study Planner", href: "/student/study/planner", icon: BookOpen },
  { name: "Quiet Study Rooms", href: "/student/study/rooms", icon: Users, badge: "Live" },
  { name: "Diagnostic Exams", href: "/student/exams", icon: Target },
  { name: "Course Explorer", href: "/student/guidance/courses", icon: Compass },
  { name: "Project Builder", href: "/student/projects", icon: Rocket },
  { name: "Skill Assessments", href: "/student/skills", icon: Code2 },
  { name: "Community & Peer Help", href: "/student/community", icon: Users },
  { name: "Idea Lab", href: "/student/ideas", icon: Lightbulb },
  { name: "Opportunities Radar", href: "/student/opportunities", icon: Search },
  { name: "Financial Literacy", href: "/student/financial-literacy", icon: PiggyBank },
  { name: "Academic Guidance", href: "/student/ai", icon: FileText },
  { name: "BEYOND Student ID", href: "/student/profile", icon: Award }
];

export default function StudentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const json = await res.json();
      if (json.profile) {
        setProfile(json.profile);
      }
    } catch (e) {
      console.error("Failed to load student profile in layout:", e);
    }
  };

  React.useEffect(() => {
    fetchProfile();

    const handleUpdate = () => {
      fetchProfile();
    };

    window.addEventListener("beyond:activity-updated", handleUpdate);
    window.addEventListener("starBalanceUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("beyond:activity-updated", handleUpdate);
      window.removeEventListener("starBalanceUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "KA";

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A2219] flex flex-col font-sans selection:bg-[#283826] selection:text-[#F7F5F0]">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#283826] border-b border-[#364A33] text-[#F7F5F0] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-[#364A33] text-[#F7F5F0] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <BeyondBrandBadge
            size="sm"
            tier={profile?.membershipTier}
            href="/student/dashboard"
            variant="dark"
          />
        </div>

        {/* Header Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#364A33] border border-[#6C7D64]/40 text-[#F7F5F0] text-xs font-semibold hover:bg-[#435B40] transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Monograph Home</span>
          </Link>

          {/* Membership Tier Indicator */}
          <Link
            href="/student/profile#membership"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono font-bold transition-all border shadow-xs ${
              profile?.membershipTier === "GOLD"
                ? "bg-gradient-to-r from-[#3D331A] to-[#283826] border-[#C8A95B] text-amber-300 hover:brightness-110"
                : profile?.membershipTier === "PREMIUM"
                ? "bg-emerald-950/70 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/50"
                : "bg-[#364A33] border-[#6C7D64]/40 text-[#F0EDE4] hover:bg-[#435B40]"
            }`}
            title="BEYOND Guild Pass (Premium ₹499 / Gold ₹699)"
          >
            {profile?.membershipTier === "GOLD" ? (
              <>
                <Crown className="w-3.5 h-3.5 text-[#C8A95B] fill-[#C8A95B]" />
                <span className="hidden sm:inline">Gold Scholar</span>
              </>
            ) : profile?.membershipTier === "PREMIUM" ? (
              <>
                <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span className="hidden sm:inline">Premium</span>
              </>
            ) : (
              <>
                <Crown className="w-3.5 h-3.5 text-[#C8A95B]" />
                <span className="hidden sm:inline">Pass: ₹499</span>
              </>
            )}
          </Link>

          {/* Streaks Pill */}
          <div className="flex items-center gap-1.5 bg-[#364A33] px-3 py-1.5 rounded border border-[#6C7D64]/40 text-xs font-semibold text-[#F7F5F0] shadow-sm">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline font-mono">{profile?.streakDays ?? 1} Days</span>
          </div>

          {/* Stars Ledger Balance */}
          <div className="flex items-center gap-1.5 bg-[#364A33] px-3 py-1.5 rounded border border-[#B07D4F]/50 text-xs font-semibold text-[#B07D4F] shadow-sm">
            <Star className="w-4 h-4 text-[#B07D4F] fill-[#B07D4F]" />
            <span className="font-mono text-[#F7F5F0]">{(profile?.starsBalance ?? 642).toLocaleString()} Stars</span>
          </div>

          {/* Student Profile Quick Avatar */}
          <Link
            href="/student/profile"
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#6C7D64]/40 group"
          >
            <div className="w-8 h-8 rounded bg-[#F0EDE4] text-[#283826] font-bold text-xs flex items-center justify-center border border-[#E1DDD2] group-hover:scale-105 transition-transform font-mono overflow-hidden">
              {profile?.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.fullName} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/default-avatar.svg";
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-[#F7F5F0] group-hover:text-[#F0EDE4] transition-colors">
                {profile?.fullName || "Krishna Addanki"}
              </div>
              <div className="text-[10px] text-[#F0EDE4]/80 font-mono">
                {profile?.classLevel || "Class 12"} • {profile?.targetExam ? profile.targetExam.split(" ")[0] : "JEE"}
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex relative">
        {/* Left Navigation Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] z-30 h-[calc(100vh-57px)] w-64 bg-[#283826] border-r border-[#364A33] text-[#F0EDE4] p-4 flex flex-col justify-between transition-transform duration-300 ease-out-expo
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="space-y-6 overflow-y-auto pr-1">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#6C7D64] px-3 mb-2 font-semibold">
                Academic Modules
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all group
                        ${
                          isActive
                            ? "bg-[#364A33] text-[#F7F5F0] font-bold border border-[#6C7D64]/40 shadow-inner"
                            : "text-[#F0EDE4]/80 hover:bg-[#364A33]/50 hover:text-[#F7F5F0]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-[#F7F5F0]"
                              : "text-[#6C7D64] group-hover:text-[#F7F5F0]"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider bg-emerald-700/40 text-emerald-200 border border-emerald-500/40">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar Widget */}
          <div className="pt-4 border-t border-[#364A33]">
            <Link
              href="/student/study/rooms"
              className="p-3.5 rounded bg-[#364A33] border border-[#6C7D64]/40 flex flex-col gap-1.5 group block hover:border-[#6C7D64] transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F7F5F0]">
                  <Users className="w-3.5 h-3.5 text-[#F0EDE4]" />
                  <span>Quiet Study Rooms</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#F0EDE4] group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-[#F0EDE4]/80 leading-snug">
                Join 128 peers studying silently right now.
              </p>
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
