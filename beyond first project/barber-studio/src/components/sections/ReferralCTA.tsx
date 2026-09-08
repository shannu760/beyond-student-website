import Link from "next/link";
import { Gift, Users } from "lucide-react";

export default function ReferralCTA() {
  return (
    <section className="py-24 bg-rich-black relative overflow-hidden">
      {/* Subtle gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-gold" />
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Refer a Friend.
            <br />
            <span className="text-gold">Get Rewarded.</span>
          </h2>

          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            Share your referral code and earn discounts on every successful booking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/referral"
              className="bg-gold text-charcoal px-8 py-3.5 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-hover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Refer Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
