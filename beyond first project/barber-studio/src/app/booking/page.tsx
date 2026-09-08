"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Scissors,
  User,
  Calendar,
  Clock,
  CreditCard,
} from "lucide-react";
import { SERVICES, BARBERS, TIME_SLOTS, UNAVAILABLE_SLOTS } from "@/lib/data";

const STEPS = [
  { id: 1, label: "Service", icon: Scissors },
  { id: 2, label: "Barber", icon: User },
  { id: 3, label: "Date", icon: Calendar },
  { id: 4, label: "Time", icon: Clock },
  { id: 5, label: "Details", icon: User },
  { id: 6, label: "Pay", icon: CreditCard },
];

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const service = SERVICES.find((s) => s.id === selectedService);
  const barber = BARBERS.find((b) => b.id === selectedBarber);

  const canNext = () => {
    switch (step) {
      case 1: return !!selectedService;
      case 2: return !!selectedBarber;
      case 3: return !!selectedDate;
      case 4: return !!selectedTime;
      case 5: return form.name && form.phone;
      case 6: return true;
      default: return false;
    }
  };

  const next = () => {
    if (step === 6) {
      router.push("/confirmation");
      return;
    }
    if (canNext()) setStep(step + 1);
  };

  // Generate calendar days
  const today = new Date();
  const calendarDays: { date: Date; available: boolean }[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isSunday = d.getDay() === 0;
    calendarDays.push({ date: d, available: !isSunday });
  }

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Book Appointment
          </h1>
          <p className="text-text-secondary text-sm">
            Step {step} of {STEPS.length}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 px-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-gold text-charcoal"
                        : isCurrent
                        ? "bg-gold/20 text-gold border-2 border-gold"
                        : "bg-surface text-text-muted border border-border"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider mt-2 ${
                      isCurrent ? "text-gold" : isCompleted ? "text-gold" : "text-text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 md:w-12 mx-2 mb-6 transition-colors ${
                      step > s.id ? "bg-gold" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 min-h-[400px]">
          {/* Step 1: Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Choose Your Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedService === s.id
                        ? "border-gold bg-gold/10"
                        : "border-border bg-elevated hover:border-gold/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-text-primary">{s.name}</h3>
                      <span className="text-gold font-mono text-sm">{s.price}</span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{s.description}</p>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {s.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Barber */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Choose Your Barber</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BARBERS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBarber(b.id)}
                    className={`text-center p-4 rounded-lg border transition-all duration-200 ${
                      selectedBarber === b.id
                        ? "border-gold bg-gold/10"
                        : "border-border bg-elevated hover:border-gold/30"
                    }`}
                  >
                    <div
                      className="w-20 h-20 rounded-full bg-cover bg-center mx-auto mb-3 border-2 border-transparent"
                      style={{
                        backgroundImage: `url('${b.image}')`,
                        borderColor: selectedBarber === b.id ? "#C9A96E" : "transparent",
                      }}
                    />
                    <h3 className="font-semibold text-text-primary">{b.name}</h3>
                    <p className="text-xs text-gold">{b.position}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Choose Date</h2>
              <div className="grid grid-cols-7 gap-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-text-muted py-2">
                    {d}
                  </div>
                ))}
                {/* Offset for first day */}
                {Array.from({ length: today.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {calendarDays.slice(0, 28).map((d, i) => {
                  const dateStr = d.date.toISOString().split("T")[0];
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={i}
                      onClick={() => d.available && setSelectedDate(dateStr)}
                      disabled={!d.available}
                      className={`h-11 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-gold text-charcoal"
                          : d.available
                          ? "bg-elevated text-text-primary hover:bg-gold/20"
                          : "bg-transparent text-text-muted/30 cursor-not-allowed"
                      }`}
                    >
                      {d.date.getDate()}
                    </button>
                  );
                })}
              </div>
              {selectedDate && (
                <p className="text-sm text-text-secondary mt-4 text-center">
                  Selected:{" "}
                  <span className="text-gold font-medium">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Step 4: Time */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Choose Time</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const unavailable = UNAVAILABLE_SLOTS.includes(slot);
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => !unavailable && setSelectedTime(slot)}
                      disabled={unavailable}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-gold text-charcoal"
                          : unavailable
                          ? "bg-surface text-text-muted/40 cursor-not-allowed line-through"
                          : "bg-elevated text-text-primary border border-border hover:border-gold/30"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Details */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Your Details</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[1.5px] text-text-muted mb-2 block">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                    className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Payment Summary */}
          {step === 6 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Booking Summary</h2>
              <div className="bg-elevated rounded-lg p-6 border border-border space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Service</span>
                  <span className="text-text-primary font-medium">{service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Barber</span>
                  <span className="text-text-primary font-medium">{barber?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date</span>
                  <span className="text-text-primary font-medium">
                    {selectedDate &&
                      new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Time</span>
                  <span className="text-text-primary font-medium">{selectedTime}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Total</span>
                    <span className="text-gold font-mono text-xl font-medium">{service?.price}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-text-muted text-sm">Deposit required</span>
                    <span className="text-text-muted text-sm">₹100</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors px-4 py-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={next}
            disabled={!canNext()}
            className={`flex items-center gap-2 px-8 py-3 text-sm font-semibold uppercase tracking-[1px] transition-all duration-200 ${
              canNext()
                ? "bg-gold text-charcoal hover:bg-gold-hover hover:scale-[1.02] active:scale-[0.98]"
                : "bg-surface text-text-muted cursor-not-allowed"
            }`}
          >
            {step === 6 ? "Pay & Confirm" : "Continue"}
            {step < 6 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
