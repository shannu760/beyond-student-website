import Link from "next/link";
import { Star } from "lucide-react";
import { BARBERS } from "@/lib/data";

export default function BarbersPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      {/* Header */}
      <div className="text-center mb-16 px-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
          Our Team
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Meet Our Barbers
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Experienced professionals who take pride in every cut. Choose your barber and book directly.
        </p>
      </div>

      {/* Barber Cards */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {BARBERS.map((barber) => (
            <div
              key={barber.id}
              className="bg-surface border border-border rounded-xl overflow-hidden group hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Portrait */}
              <div className="relative h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-top transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${barber.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-2xl font-bold text-text-primary">{barber.name}</h3>
                  <p className="text-gold text-sm font-medium">{barber.position}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary">
                    {barber.rating} ({barber.reviews} reviews)
                  </span>
                </div>

                <p className="text-sm text-text-muted mb-4">
                  {barber.experience} experience
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {barber.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium uppercase tracking-wider text-text-muted bg-elevated px-3 py-1.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <Link
                  href="/booking"
                  className="block w-full bg-gold text-charcoal py-3 text-sm font-semibold uppercase tracking-[1px] text-center hover:bg-gold-hover transition-colors"
                >
                  Book with {barber.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
