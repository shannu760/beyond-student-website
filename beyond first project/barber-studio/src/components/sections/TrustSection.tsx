"use client";

import { Star, Users, Award, Clock } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

const stats = [
  {
    icon: Star,
    value: `${BUSINESS_INFO.googleRating}★`,
    label: "Google Rating",
    color: "text-gold",
  },
  {
    icon: Users,
    value: BUSINESS_INFO.happyClients,
    label: "Happy Clients",
    color: "text-gold",
  },
  {
    icon: Award,
    value: "Experienced",
    label: "Professional Barbers",
    color: "text-gold",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Online Booking",
    color: "text-gold",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-charcoal noise-bg">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-border">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center px-4">
                <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
                <p className="text-3xl md:text-4xl font-bold text-text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
