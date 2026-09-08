"use client";

import { useState } from "react";
import { Copy, Check, Gift, Users, MessageCircle } from "lucide-react";

const REWARD_TIERS = [
  { friends: 1, reward: "₹100 OFF", achieved: true },
  { friends: 3, reward: "₹250 OFF", achieved: false },
  { friends: 5, reward: "FREE GROOMING", achieved: false },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "BARBER123";
  const referred = 2;
  const completed = 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 md:pt-28 pb-24">
      {/* Header */}
      <div className="text-center mb-16 px-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
          <Gift className="w-8 h-8 text-gold" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Refer a Friend.
          <br />
          <span className="text-gold">Get Rewarded.</span>
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Share your code with friends. When they book, you both save.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {/* Referral Code Card */}
        <div className="bg-surface border border-dashed border-gold/40 rounded-xl p-8 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-3">
            Your Referral Code
          </p>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-elevated border border-border rounded-lg px-5 py-4 text-center">
              <span className="font-mono text-2xl font-bold text-gold tracking-widest">
                {referralCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center hover:bg-gold-hover transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-charcoal" />
              ) : (
                <Copy className="w-5 h-5 text-charcoal" />
              )}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 border border-gold text-gold py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-subtle transition-all flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Code
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Check out BARBER STUDIO! Use my code ${referralCode} for ₹100 off your first visit.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-whatsapp text-white py-3 text-sm font-semibold uppercase tracking-[1px] hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Share
            </a>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">Your Progress</p>
            <p className="text-sm text-gold font-medium">
              {referred}/3 to next reward
            </p>
          </div>
          <div className="w-full h-2 bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${(referred / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Reward Tiers */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-[2px] text-text-muted">
            Reward Tiers
          </h3>
          {REWARD_TIERS.map((tier) => (
            <div
              key={tier.friends}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                tier.achieved
                  ? "border-gold bg-gold/10"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    tier.achieved ? "bg-gold text-charcoal" : "bg-elevated text-text-muted"
                  }`}
                >
                  {tier.achieved ? <Check className="w-4 h-4" /> : tier.friends}
                </div>
                <span className="text-sm text-text-primary">
                  {tier.friends} Friend{tier.friends > 1 ? "s" : ""} Referred
                </span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  tier.achieved ? "text-gold" : "text-text-muted"
                }`}
              >
                {tier.reward}
              </span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <Users className="w-5 h-5 text-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{referred}</p>
            <p className="text-xs text-text-muted">Friends Referred</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <Gift className="w-5 h-5 text-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{completed}</p>
            <p className="text-xs text-text-muted">Bookings Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
