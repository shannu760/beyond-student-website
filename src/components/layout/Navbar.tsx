
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "BEYOND AI", href: "/ai" },
  { label: "LEARN", href: "/learn" },
  { label: "CONNECT", href: "/connect" },
  { label: "DISCOVER", href: "/discover" },
  { label: "IDEA LAB", href: "/idea-lab" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "ABOUT", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-3 bg-olive-dark text-cream" : "py-5 bg-transparent text-olive-dark"}`}>
      <div className="section-container flex items-center justify-between mx-auto px-6 max-w-7xl">
        <Link href="/" className="font-display font-bold text-base tracking-wider uppercase">BEYOND</Link>
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} className={`text-[13px] font-medium tracking-[0.06em] uppercase ${scrolled ? "text-cream" : "text-olive-dark"}`}>{l.label}</Link>
          ))}
        </div>
        <Link href="/join" className="btn-primary">JOIN</Link>
      </div>
    </nav>
  );
}
