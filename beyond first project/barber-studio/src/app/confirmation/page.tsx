import Link from "next/link";
import { Check, Calendar, MessageCircle, Eye } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function ConfirmationPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-success" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
          You&apos;re Booked.
        </h1>
        <p className="text-text-secondary mb-8">
          Your appointment has been confirmed. We look forward to seeing you.
        </p>

        {/* Confirmation Card */}
        <div className="bg-surface border border-gold/20 rounded-xl p-8 mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-gold text-center mb-6">
            {BUSINESS_INFO.name}
          </p>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary text-sm">Service</span>
              <span className="text-text-primary font-medium text-sm">Classic Haircut</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary text-sm">Barber</span>
              <span className="text-text-primary font-medium text-sm">Arjun</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary text-sm">Date</span>
              <span className="text-text-primary font-medium text-sm">12 September</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary text-sm">Time</span>
              <span className="text-text-primary font-medium text-sm">5:30 PM</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary text-sm">Deposit</span>
              <span className="text-gold font-mono font-medium text-sm">₹100</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-text-secondary text-sm">Booking ID</span>
              <span className="text-text-primary font-mono font-medium text-sm">#BS10294</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mb-8">
          <button className="w-full bg-gold text-charcoal py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-hover transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Add to Calendar
          </button>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-whatsapp text-whatsapp py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-whatsapp/10 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Open WhatsApp
          </a>
          <Link
            href="/account"
            className="w-full border border-border text-text-secondary py-3 text-sm font-semibold uppercase tracking-[1px] hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Booking
          </Link>
        </div>

        {/* Reminder */}
        <div className="bg-elevated rounded-lg p-4">
          <p className="text-sm text-text-secondary">
            We&apos;ll send you a <span className="text-text-primary font-medium">WhatsApp/SMS reminder</span>{" "}
            24 hours before your appointment.
          </p>
        </div>
      </div>
    </div>
  );
}
