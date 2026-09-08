import Link from "next/link";
import { PORTFOLIO } from "@/lib/data";

export default function PortfolioPreview() {
  const items = PORTFOLIO.slice(0, 6);

  return (
    <section className="py-24 bg-rich-black">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
            Our Craft
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Our Work
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-4 group cursor-pointer"
            >
              <div className="relative rounded-lg overflow-hidden">
                <div
                  className="bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${item.image}')`,
                    aspectRatio: idx % 3 === 0 ? "3/4" : idx % 3 === 1 ? "1/1" : "4/3",
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-all duration-300 flex items-end opacity-0 group-hover:opacity-100">
                  <div className="p-4 w-full">
                    <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-gold mb-1 block">
                      {item.category}
                    </span>
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="border border-gold text-gold px-8 py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-subtle transition-all duration-200 inline-block"
          >
            View Full Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
