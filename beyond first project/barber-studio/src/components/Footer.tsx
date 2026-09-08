import Link from "next/link";
import { MapPin, Phone, Clock, Camera, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-xl font-bold text-text-primary mb-4">
              {BUSINESS_INFO.name}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {BUSINESS_INFO.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Services", href: "/services" },
                { label: "Barbers", href: "/barbers" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Reviews", href: "/reviews" },
                { label: "Contact", href: "#location" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-6">
              Opening Hours
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <span className="text-text-secondary">Mon – Fri</span>
                  <p className="text-text-primary">{BUSINESS_INFO.hours.weekday}</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <span className="text-text-secondary">Saturday</span>
                  <p className="text-text-primary">{BUSINESS_INFO.hours.saturday}</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <span className="text-text-secondary">Sunday</span>
                  <p className="text-text-primary">{BUSINESS_INFO.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-6">
              Contact
            </h4>
            <div className="space-y-3 text-sm mb-6">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS_INFO.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-text-secondary hover:text-gold transition-colors"
              >
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {BUSINESS_INFO.address}
              </a>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-2 text-text-secondary hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {BUSINESS_INFO.phone}
              </a>
            </div>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-secondary hover:text-gold hover:bg-elevated transition-all"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-secondary hover:text-whatsapp hover:bg-elevated transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
