import Link from "next/link";
import { Star } from "lucide-react";
import { BARBERS } from "@/lib/data";

export default function BarbersPreview() {
  return (
    <section className="py-24 bg-charcoal noise-bg">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
            Our Team
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Meet Our Barbers
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {BARBERS.map((barber) => (
            <div
              key={barber.id}
              className="bg-surface border border-border rounded-xl overflow-hidden group hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Portrait */}
              <div className="relative h-72 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-top transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${barber.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-xl font-bold text-text-primary">{barber.name}</h3>
                  <p className="text-gold text-sm">{barber.position}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {barber.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium uppercase tracking-wider text-text-muted bg-elevated px-2.5 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary">
                    {barber.rating} ({barber.reviews})
                  </span>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/barbers"
                    className="flex-1 border border-border text-text-secondary py-2.5 text-xs font-semibold uppercase tracking-[1px] text-center hover:border-gold hover:text-gold transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/booking"
                    className="flex-1 bg-gold text-charcoal py-2.5 text-xs font-semibold uppercase tracking-[1px] text-center hover:bg-gold-hover transition-colors"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/barbers"
            className="border border-gold text-gold px-8 py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-subtle transition-all duration-200 inline-block"
          >
            View All Barbers
          </Link>
        </div>
      </div>
    </section>
  );
}
