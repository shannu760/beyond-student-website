"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PORTFOLIO } from "@/lib/data";

const CATEGORIES = ["all", "haircuts", "fades", "beard", "styling", "before-after"];

export default function PortfolioPage() {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered =
    active === "all"
      ? PORTFOLIO
      : PORTFOLIO.filter((p) => p.category === active);

  return (
    <div className="pt-24 md:pt-28 pb-24">
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
          Our Craft
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Our Work
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          See the quality of our craftsmanship. Every cut tells a story.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 mb-12">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[1px] rounded-full whitespace-nowrap transition-all duration-200 ${
                active === cat
                  ? "bg-gold text-charcoal"
                  : "bg-surface text-text-secondary hover:text-text-primary border border-border hover:border-gold/30"
              }`}
            >
              {cat.replace("-", " / ")}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-4 group cursor-pointer"
              onClick={() => setLightbox(item.image)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <div
                  className="bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${item.image}')`,
                    aspectRatio: idx % 3 === 0 ? "3/4" : idx % 3 === 1 ? "1/1" : "4/3",
                  }}
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-all duration-300 flex items-end opacity-0 group-hover:opacity-100">
                  <div className="p-4 w-full">
                    <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-gold mb-1 block">
                      {item.category.replace("-", " / ")}
                    </span>
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                  </div>
                </div>
                {item.type === "before-after" && (
                  <div className="absolute top-3 right-3 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    Before / After
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-rich-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-surface rounded-full flex items-center justify-center hover:bg-elevated transition-colors"
          >
            <X className="w-5 h-5 text-text-primary" />
          </button>
          <img
            src={lightbox}
            alt="Portfolio"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
