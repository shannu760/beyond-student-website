"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative h-[100vh] md:h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1585747860019-024afaff00b5?w=1920&h=1080&fit=crop')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-8 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-6 animate-fade-up">
            {BUSINESS_INFO.name}
          </p>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-[80px] font-bold leading-[1.05] text-text-primary mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            LOOK SHARP.
            <br />
            <span className="text-gold">FEEL CONFIDENT.</span>
          </h1>

          {/* Subtext */}
          <p className="text-text-secondary text-lg md:text-xl max-w-md mb-8 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Premium cuts, grooming, and styling from barbers who know your style.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/booking"
              className="bg-gold text-charcoal px-8 py-3.5 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-hover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Appointment
            </Link>
            <Link
              href="/services"
              className="border border-gold text-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-subtle transition-all duration-200"
            >
              Explore Services
            </Link>
          </div>

          {/* Trust */}
          <div className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-text-secondary text-sm">
              {BUSINESS_INFO.googleRating} Google Rating
            </span>
            <span className="text-text-muted text-sm">
              ({BUSINESS_INFO.totalReviews.toLocaleString()} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-text-muted/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
