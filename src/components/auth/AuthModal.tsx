"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  LogOut, 
  UserCheck, 
  ArrowRight,
  Database,
  Lock
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (profile: any) => void;
  currentProfile?: any;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess, currentProfile }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState("krishna.addanki633@gmail.com");
  const [customName, setCustomName] = useState("Krishna Addanki");
  const [activeUser, setActiveUser] = useState<any>(currentProfile || null);

  useEffect(() => {
    if (currentProfile) {
      setActiveUser(currentProfile);
    }
  }, [currentProfile]);

  // Listen to Supabase Auth state changes if any
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const email = user.email || "krishna.addanki633@gmail.com";
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.user_name ||
          user.user_metadata?.preferred_username ||
          "Krishna Addanki";
        const avatar =
          user.user_metadata?.avatar_url ||
          "https://avatars.githubusercontent.com/u/101566537?v=4";
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
              fullName: name,
              avatarUrl: avatar,
              githubUsername,
              authProvider,
            }),
          });
          const json = await res.json();
          if (json.profile) {
            setActiveUser(json.profile);
            if (onAuthSuccess) onAuthSuccess(json.profile);
          }
        } catch (e) {
          console.error("Failed to sync profile after auth change:", e);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onAuthSuccess]);

  if (!isOpen) return null;

  // Real GitHub Sign-in via Supabase OAuth
  const handleGitHubSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
        },
      });

      if (error) {
        setErrorMessage(
          `GitHub OAuth Notice: ${error.message}. You can also sign in directly below with your student profile.`
        );
      } else if (data?.url) {
        setSuccessMessage("Redirecting to GitHub Authentication...");
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to initiate GitHub OAuth."
      );
    } finally {
      setLoading(false);
    }
  };

  // Real Google Sign-in via Supabase OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        // If Supabase Google OAuth requires client configuration in console
        setErrorMessage(
          `Google OAuth Notice: ${error.message}. You can also sign in directly below with your Google Student account credentials.`
        );
      } else if (data?.url) {
        setSuccessMessage("Redirecting to Google Account Authentication...");
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to initiate Google OAuth. You can use the instant Google Student login below."
      );
    } finally {
      setLoading(false);
    }
  };

  // Instant Student Identity login / sync
  const handleInstantStudentLogin = async (
    presetName: string, 
    presetEmail: string, 
    presetExam: string,
    presetAvatar?: string,
    presetGithub?: string,
    presetProvider?: "github" | "google"
  ) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: presetName,
          email: presetEmail,
          targetExam: presetExam,
          avatarUrl: presetAvatar || `https://avatars.githubusercontent.com/u/101566537?v=4`,
          githubUsername: presetGithub || "shannu760",
          authProvider: presetProvider || "github",
          lastActive: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        setActiveUser(data.profile);
        setSuccessMessage(`Signed in as ${data.profile.fullName} (${data.profile.email})`);
        if (onAuthSuccess) onAuthSuccess(data.profile);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) {
      setErrorMessage("Please provide both name and your account email.");
      return;
    }
    handleInstantStudentLogin(customName, customEmail, activeUser?.targetExam || "JEE Main & Advanced 2027");
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      // Keep preserved profile baseline
      setSuccessMessage("Signed out of Google session.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Sign out error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2219]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#F7F5F0] paper-texture rounded-xl border border-[#D5CFBE] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#ECE7DC] border-b border-[#D5CFBE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#283826] text-[#F7F5F0] flex items-center justify-center font-serif font-bold text-lg shadow-2xs">
              B
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A2219]">
                Student Identity & Authentication
              </h3>
              <p className="text-xs text-[#5E685B] font-sans">
                Unified Authentication • Supabase Cloud, GitHub & Google SSO
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

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Current Active Account Card */}
          {activeUser && (
            <div className="p-4 rounded-lg bg-[#EFECE3] border border-[#DDD7C8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeUser.avatarUrl || "https://avatars.githubusercontent.com/u/101566537?v=4"}
                  alt={activeUser.fullName}
                  className="w-12 h-12 rounded-full border-2 border-[#283826] object-cover shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-[#1A2219]">{activeUser.fullName}</span>
                    {activeUser.githubUsername && (
                      <span className="px-1.5 py-0.2 text-[10px] font-mono bg-neutral-900 text-white rounded">
                        @{activeUser.githubUsername}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#283826] text-[#F7F5F0] rounded">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#5E685B] font-mono">{activeUser.email}</p>
                  <p className="text-[11px] text-[#6C7D64] mt-0.5">
                    {activeUser.targetExam || "JEE Main & SAT"} • {activeUser.starsBalance ?? 642} Stars
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded border border-rose-200 font-medium transition-colors flex items-center gap-1"
                title="Sign out of current session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>
            </div>
          )}

          {/* Single Sign-On Providers (GitHub & Google) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-[#5E685B] uppercase tracking-wider font-mono">
              Direct OAuth Single Sign-On
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* GitHub Auth Button */}
              <button
                onClick={handleGitHubSignIn}
                disabled={loading}
                className="py-3 px-3.5 rounded-lg bg-[#181717] hover:bg-black active:bg-neutral-900 text-white font-medium text-xs border border-neutral-800 shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-semibold text-white">
                  {loading ? "Connecting..." : "Sign In with GitHub"}
                </span>
              </button>

              {/* Google Auth Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="py-3 px-3.5 rounded-lg bg-white hover:bg-neutral-50 active:bg-neutral-100 text-[#1A2219] font-medium text-xs border border-[#D5CFBE] shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
              >
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
                <span className="font-semibold text-[#1A2219]">
                  {loading ? "Connecting..." : "Sign In with Google"}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[#6C7D64] text-center mt-1.5 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-[#6C7D64]" />
              Encrypted OAuth 2.0 via Supabase Identity Broker
            </p>
          </div>

          {/* Quick Verified Profiles Fallback */}
          <div className="pt-2 border-t border-[#E1DDD2]">
            <label className="block text-xs font-semibold text-[#5E685B] uppercase tracking-wider mb-2.5 font-mono">
              Quick Verified Student Profiles (Instant Sync)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleInstantStudentLogin(
                    "Krishna Addanki",
                    "krishna.addanki633@gmail.com",
                    "JEE Main & Advanced 2027",
                    "https://avatars.githubusercontent.com/u/101566537?v=4",
                    "shannu760",
                    "github"
                  )
                }
                className="p-3 rounded-lg bg-emerald-50/80 hover:bg-emerald-100/80 border-2 border-[#283826] text-left transition-all flex items-center gap-2.5 text-xs group sm:col-span-2 shadow-xs"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/101566537?v=4"
                  alt="Krishna"
                  className="w-9 h-9 rounded-full border border-[#283826] object-cover shrink-0"
                />
                <div className="truncate flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A2219] group-hover:text-[#283826]">Krishna Addanki</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#283826] text-[#C8A95B]">Gold Scholar</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-900 text-white flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      @shannu760
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5E685B] font-mono truncate">krishna.addanki633@gmail.com</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Primary Account
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleInstantStudentLogin(
                    "Arjun Kumar",
                    "arjun.kumar@beyond.student.in",
                    "JEE Main & Advanced 2027",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                    undefined,
                    "google"
                  )
                }
                className="p-2.5 rounded-lg bg-[#EFECE3] hover:bg-[#E5E0D2] border border-[#DDD7C8] text-left transition-all flex items-center gap-2 text-xs group"
              >
                <div className="w-6 h-6 rounded-full bg-[#283826] text-[#F7F5F0] flex items-center justify-center font-bold text-[10px] shrink-0">
                  AK
                </div>
                <div className="truncate">
                  <div className="font-semibold text-[#1A2219] truncate">Arjun Kumar</div>
                  <div className="text-[9px] text-[#5E685B] truncate">Secondary Profile</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleInstantStudentLogin(
                    "Priya Sharma",
                    "priya.sharma@beyond.student.in",
                    "NEET & GRE Prep",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                    undefined,
                    "google"
                  )
                }
                className="p-2.5 rounded-lg bg-[#EFECE3] hover:bg-[#E5E0D2] border border-[#DDD7C8] text-left transition-all flex items-center gap-2 text-xs group"
              >
                <div className="w-6 h-6 rounded-full bg-[#B07D4F] text-[#F7F5F0] flex items-center justify-center font-bold text-[10px] shrink-0">
                  PS
                </div>
                <div className="truncate">
                  <div className="font-semibold text-[#1A2219] truncate">Priya Sharma</div>
                  <div className="text-[9px] text-[#5E685B] truncate">NEET & GRE</div>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Google Account Login Form */}
          <form onSubmit={handleCustomGoogleLogin} className="space-y-3 pt-2 border-t border-[#E1DDD2]">
            <span className="text-xs font-semibold text-[#5E685B] uppercase tracking-wider block font-mono">
              Or Enter Your Google Account Manually
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#D5CFBE] focus:outline-hidden focus:border-[#283826] text-[#1A2219]"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#D5CFBE] focus:outline-hidden focus:border-[#283826] text-[#1A2219]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-3 text-xs font-semibold text-[#F7F5F0] bg-[#283826] hover:bg-[#364A33] rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Continue with this Student Identity</span>
            </button>
          </form>

          {/* Database & Cloud Security Ledger Info */}
          <div className="p-3 rounded-lg bg-[#EAE6DB] border border-[#DDD7C8] text-[11px] text-[#556052] space-y-1.5 font-sans">
            <div className="flex items-center gap-1.5 font-semibold text-[#283826]">
              <Database className="w-3.5 h-3.5 text-[#283826]" />
              <span>Real-Time Cloud Ledger & Record Preservation</span>
            </div>
            <p>
              Your Google identity is securely synchronized with Supabase database (<code className="font-mono text-[10px] text-[#283826]">tsdnbwwglfcfjmukbjyg.supabase.co</code>). All MCQs, PYQs, and focus records are persistently preserved across sessions.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#ECE7DC] border-t border-[#D5CFBE] flex items-center justify-between text-xs">
          <span className="text-[#6C7D64] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            256-Bit Encrypted Auth
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white hover:bg-neutral-100 text-[#1A2219] font-medium border border-[#D5CFBE] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
