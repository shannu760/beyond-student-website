"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, BUSINESS_INFO } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
          scrolled
            ? "bg-rich-black/95 backdrop-blur-md border-b border-border h-14"
            : "bg-transparent h-[72px]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-8">
          {/* Logo */}
          <Link href="/" className="font-display text-xl font-bold text-text-primary tracking-wide">
            {BUSINESS_INFO.name}
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-semibold uppercase tracking-[0.5px] text-text-secondary hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-whatsapp transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <Phone className="w-5 h-5" />
            </a>
            <Link
              href="/booking"
              className="bg-gold text-charcoal px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[1px] hover:bg-gold-hover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-rich-black/95 backdrop-blur-md border-b border-border h-[60px] flex items-center justify-between px-5 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-primary p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link href="/" className="font-display text-lg font-bold text-text-primary tracking-wide">
          {BUSINESS_INFO.name}
        </Link>

        <a
          href={`tel:${BUSINESS_INFO.phone}`}
          className="text-text-secondary p-1"
          aria-label="Call us"
        >
          <Phone className="w-5 h-5" />
        </a>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-rich-black/98 backdrop-blur-sm flex flex-col items-center justify-center gap-8 md:hidden animate-fade-in">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-semibold text-text-primary hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            className="bg-gold text-charcoal px-8 py-3 text-sm font-semibold uppercase tracking-[1px] mt-4"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </>
  );
}
