import Link from "next/link";
import { Clock } from "lucide-react";
import { SERVICES } from "@/lib/data";

export default function ServicesPreview() {
  const featured = SERVICES.slice(0, 4);

  return (
    <section className="py-24 bg-rich-black">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
            What We Offer
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Our Services
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((service) => (
            <div
              key={service.id}
              className="bg-surface border border-border rounded-xl overflow-hidden group hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-text-muted text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </div>
                  <span className="text-lg font-mono font-medium text-gold">
                    {service.price}
                  </span>
                </div>

                <Link
                  href="/booking"
                  className="block w-full bg-gold text-charcoal py-2.5 text-xs font-semibold uppercase tracking-[1px] text-center hover:bg-gold-hover transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="border border-gold text-gold px-8 py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-subtle transition-all duration-200 inline-block"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
