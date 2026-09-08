"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, User, Clock, Scissors } from "lucide-react";
import { SERVICES, BARBERS } from "@/lib/data";

export default function QuickBooking() {
  const [service, setService] = useState("");
  const [barber, setBarber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <section className="relative z-20 -mt-16 md:-mt-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Service */}
            <div className="md:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                Service
              </label>
              <div className="relative">
                <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary appearance-none cursor-pointer focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                >
                  <option value="">Select service</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Barber */}
            <div className="md:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                Barber
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select
                  value={barber}
                  onChange={(e) => setBarber(e.target.value)}
                  className="w-full bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary appearance-none cursor-pointer focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                >
                  <option value="">Any barber</option>
                  {BARBERS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Time */}
            <div className="md:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary appearance-none cursor-pointer focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                >
                  <option value="">Select time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            {/* CTA */}
            <div className="md:col-span-1">
              <Link
                href="/booking"
                className="w-full bg-gold text-charcoal py-3 px-6 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-hover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] block text-center"
              >
                Find Slots
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
