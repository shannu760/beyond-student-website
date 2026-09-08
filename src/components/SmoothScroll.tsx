"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ArrowUp } from "lucide-react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // 2. Request Animation Frame Loop for Smooth Physics & Scroll Progress
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);

      // Update scroll reading progress bar
      if (progressBarRef.current) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0) {
          const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
          progressBarRef.current.style.transform = `scaleX(${progress})`;
        }
      }

      // Toggle back to top visibility
      if (window.scrollY > 450) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // 3. Smooth scroll for internal hash anchors
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, { offset: -70, duration: 1.2 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // 4. High-Performance IntersectionObserver for Scroll Reveals
    const revealElements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-stagger"
    );

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.08,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));

    // Observe newly mounted elements
    const mutationObserver = new MutationObserver(() => {
      const freshElements = document.querySelectorAll(
        ".scroll-reveal:not(.is-revealed), .scroll-reveal-scale:not(.is-revealed), .scroll-reveal-left:not(.is-revealed), .scroll-reveal-right:not(.is-revealed), .scroll-reveal-stagger:not(.is-revealed)"
      );
      freshElements.forEach((el) => revealObserver.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      revealObserver.disconnect();
      mutationObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Editorial Scroll Reading Progress Bar (Fixed Top) */}
      <div 
        ref={progressBarRef}
        id="scroll-reading-progress" 
        aria-hidden="true" 
      />

      {children}

      {/* Floating Smooth Back to Top Affordance */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] shadow-lg border border-[#3E523A] transition-all duration-300 cursor-pointer flex items-center justify-center ${
          showBackToTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </>
  );
}
