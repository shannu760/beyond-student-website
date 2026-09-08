"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { SERVICES } from "@/lib/data";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "hair", label: "Hair" },
  { id: "beard", label: "Beard" },
  { id: "grooming", label: "Grooming" },
  { id: "packages", label: "Packages" },
];

export default function ServicesPage() {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? SERVICES : SERVICES.filter((s) => s.category === active);

  return (
    <div className="pt-24 md:pt-28 pb-24">
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
          What We Offer
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Our Services
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Premium grooming services tailored to your style. Every service includes a consultation.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 mb-12">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[1px] rounded-full whitespace-nowrap transition-all duration-200 ${
                active === cat.id
                  ? "bg-gold text-charcoal"
                  : "bg-surface text-text-secondary hover:text-text-primary border border-border hover:border-gold/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Cards */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="bg-surface border border-border rounded-xl overflow-hidden group hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-text-primary mb-2">{service.name}</h3>
                <p className="text-sm text-text-secondary mb-4">{service.description}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1.5 text-text-muted text-sm">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </div>
                  <span className="text-2xl font-mono font-medium text-gold">{service.price}</span>
                </div>

                <Link
                  href="/booking"
                  className="block w-full bg-gold text-charcoal py-3 text-sm font-semibold uppercase tracking-[1px] text-center hover:bg-gold-hover transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
