"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-24 md:bottom-8 right-5 z-40">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-16 right-0 bg-surface border border-border rounded-lg px-4 py-2 whitespace-nowrap shadow-xl animate-fade-in">
          <p className="text-sm text-text-primary font-medium">Chat with us!</p>
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-elevated rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3 text-text-muted" />
          </button>
        </div>
      )}

      {/* Button */}
      <a
        href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
          `Hi ${BUSINESS_INFO.name}! I'd like to book an appointment.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-whatsapp flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 animate-pulse-gold"
        style={{
          boxShadow: "0 4px 24px rgba(37, 211, 102, 0.3)",
          animationDuration: "3s",
        }}
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
