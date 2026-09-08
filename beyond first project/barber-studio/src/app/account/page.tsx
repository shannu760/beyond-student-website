"use client";

import { useState } from "react";
import { Calendar, Clock, User, Gift, ChevronRight } from "lucide-react";

const TABS = ["Overview", "Bookings", "History", "Rewards", "Profile"];

const BOOKING_HISTORY = [
  { service: "Classic Haircut", barber: "Arjun", date: "28 Aug 2026", status: "completed" },
  { service: "Haircut + Beard", barber: "Vikram", date: "14 Aug 2026", status: "completed" },
  { service: "Beard Styling", barber: "Raj", date: "01 Aug 2026", status: "cancelled" },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-2">
            My Account
          </h1>
          <p className="text-text-secondary text-sm">Manage your bookings and rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Tabs */}
          <div className="lg:col-span-1">
            {/* Desktop sidebar */}
            <div className="hidden lg:block bg-surface border border-border rounded-xl p-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-gold/10 text-gold"
                      : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Mobile tabs */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-[1px] rounded-full whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "bg-gold text-charcoal"
                      : "bg-surface text-text-secondary border border-border"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="space-y-6">
                {/* Upcoming Appointment */}
                <div className="bg-surface border border-gold/20 rounded-xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-[2px] text-gold mb-4">
                    Upcoming Appointment
                  </p>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">Haircut + Beard</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> Arjun
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> 12 September
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> 5:30 PM
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-success bg-success/10 px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 border border-border text-text-secondary py-2.5 text-xs font-semibold uppercase tracking-[1px] hover:border-gold hover:text-gold transition-colors">
                      Reschedule
                    </button>
                    <button className="flex-1 border border-error/30 text-error py-2.5 text-xs font-semibold uppercase tracking-[1px] hover:bg-error/10 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface border border-border rounded-xl p-5">
                    <Gift className="w-5 h-5 text-gold mb-2" />
                    <p className="text-xl font-bold text-text-primary">₹100</p>
                    <p className="text-xs text-text-muted">Referral Rewards Earned</p>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-5">
                    <User className="w-5 h-5 text-gold mb-2" />
                    <p className="text-xl font-bold text-text-primary">BARBER123</p>
                    <p className="text-xs text-text-muted">Your Referral Code</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings */}
            {activeTab === "Bookings" && (
              <div className="space-y-4">
                <div className="bg-surface border border-gold/20 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-text-primary">Haircut + Beard</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Arjun · 12 September · 5:30 PM
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase text-success bg-success/10 px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {activeTab === "History" && (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="divide-y divide-border">
                  {BOOKING_HISTORY.map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-elevated transition-colors">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{b.service}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {b.barber} · {b.date}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                          b.status === "completed"
                            ? "text-success bg-success/10"
                            : "text-error bg-error/10"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            {activeTab === "Rewards" && (
              <div className="space-y-6">
                <div className="bg-surface border border-dashed border-gold/40 rounded-xl p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-2">
                    Total Earned
                  </p>
                  <p className="text-3xl font-bold text-gold">₹100</p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-2">
                    Your Referral Code
                  </p>
                  <p className="font-mono text-xl font-bold text-gold tracking-widest">BARBER123</p>
                </div>
              </div>
            )}

            {/* Profile */}
            {activeTab === "Profile" && (
              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Guest User"
                    className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue=""
                    placeholder="you@email.com"
                    className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                  />
                </div>
                <button className="bg-gold text-charcoal px-6 py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-hover transition-colors">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
