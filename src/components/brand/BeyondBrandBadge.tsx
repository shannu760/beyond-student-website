"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Sparkles, Star, Crown } from "lucide-react";

export type MembershipTier = "FREE" | "PREMIUM" | "GOLD";

interface BeyondBrandBadgeProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  showSubtitle?: boolean;
  tier?: MembershipTier;
  withLink?: boolean;
  href?: string;
  className?: string;
  sealMode?: boolean;
  variant?: "light" | "dark";
}

export function BeyondBrandBadge({
  size = "md",
  showWordmark = true,
  showSubtitle = true,
  tier,
  withLink = true,
  href = "/",
  className = "",
  sealMode = false,
  variant = "light",
}: BeyondBrandBadgeProps) {
  const sizeConfig = {
    xs: { icon: "w-5 h-5", text: "text-xs tracking-tight", sub: "text-[8px]" },
    sm: { icon: "w-7 h-7", text: "text-sm tracking-tight", sub: "text-[9px]" },
    md: { icon: "w-9 h-9", text: "text-lg tracking-tight", sub: "text-[10px]" },
    lg: { icon: "w-12 h-12", text: "text-2xl tracking-tight", sub: "text-xs" },
    xl: { icon: "w-16 h-16", text: "text-3xl tracking-tight", sub: "text-sm" },
  };

  const badgeContent = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Official Emblem */}
      <div className="relative shrink-0">
        <div
          className={`
            ${sizeConfig[size].icon} rounded-full overflow-hidden flex items-center justify-center
            transition-transform duration-300 group-hover:scale-105
            ${
              tier === "GOLD"
                ? "ring-2 ring-[#C8A95B] shadow-[0_0_12px_rgba(200,169,91,0.5)] bg-gradient-to-tr from-[#3D331A] via-[#283826] to-[#C8A95B]/40"
                : tier === "PREMIUM"
                ? "ring-2 ring-emerald-500/70 shadow-sm bg-[#283826]"
                : "ring-1 ring-[#364A33] shadow-xs bg-[#283826]"
            }
          `}
        >
          <Image
            src="/images/profile-logo.png"
            alt="BEYOND"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Small Corner Badge Indicator */}
        {tier === "GOLD" && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-[#C8A95B] border border-[#283826] flex items-center justify-center text-[#283826] shadow-xs">
            <Crown className="w-2.5 h-2.5 fill-[#283826]" />
          </div>
        )}
        {tier === "PREMIUM" && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-[#283826] flex items-center justify-center text-white shadow-xs">
            <Star className="w-2.5 h-2.5 fill-white" />
          </div>
        )}
      </div>

      {/* Wordmark & Subtitle */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif font-bold ${sizeConfig[size].text} ${
                variant === "dark"
                  ? "text-[#F7F5F0] group-hover:text-white"
                  : "text-[#1A2219] group-hover:text-[#283826]"
              } transition-colors leading-none`}
            >
              BEYOND
            </span>

            {/* Membership Tag */}
            {tier === "GOLD" && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 to-[#C8A95B] text-[#1A2219] border border-[#C8A95B] shadow-xs">
                Gold
              </span>
            )}
            {tier === "PREMIUM" && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-emerald-500 text-white border border-emerald-400 shadow-xs">
                Premium
              </span>
            )}
          </div>

          {showSubtitle && (
            <span
              className={`uppercase font-sans font-semibold tracking-widest ${
                variant === "dark" ? "text-[#D5CFBE]" : "text-[#6C7D64]"
              } ${sizeConfig[size].sub} mt-0.5 leading-none`}
            >
              Student Growth Network
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (sealMode) {
    return (
      <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
        tier === "GOLD" 
          ? "bg-gradient-to-r from-[#283826] via-[#364A33] to-[#252B18] border-[#C8A95B]/60 text-[#F7F5F0] shadow-xl"
          : tier === "PREMIUM"
          ? "bg-[#283826] border-emerald-500/50 text-[#F7F5F0] shadow-md"
          : "bg-[#F0EDE4] border-[#D5CFBE] text-[#1A2219]"
      } ${className}`}>
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-3 ring-[#C8A95B] shadow-lg">
            <Image
              src="/images/profile-logo.png"
              alt="BEYOND Official Seal"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#C8A95B] border-2 border-[#283826] flex items-center justify-center text-[#283826]">
            <Award className="w-3 h-3" />
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg">BEYOND Certified</span>
            {tier === "GOLD" ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C8A95B] text-[#283826] uppercase">
                Gold Scholar
              </span>
            ) : tier === "PREMIUM" ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white uppercase">
                Premium Scholar
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8DCC3] text-[#283826] uppercase">
                Standard ID
              </span>
            )}
          </div>
          <p className="text-xs opacity-80 font-sans">
            Official Academic Identity & Verifiable Syllabus Ledger
          </p>
        </div>
      </div>
    );
  }

  if (withLink) {
    return (
      <Link href={href} className="inline-block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#283826] rounded-lg">
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
