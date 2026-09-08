import { MapPin, Phone, Clock, ExternalLink, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function LocationSection() {
  return (
    <section id="location" className="py-24 bg-charcoal">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
            Visit Us
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Find Us
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-border h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.673!2d77.2187!3d28.6329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sConnaught%20Place!5e0!3m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.5) contrast(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BARBER STUDIO Location"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center gap-8">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full w-fit">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Open Today</span>
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                {BUSINESS_INFO.name}
              </h3>
              <p className="text-text-secondary">{BUSINESS_INFO.tagline}</p>
            </div>

            <div className="space-y-4">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS_INFO.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-text-secondary hover:text-gold transition-colors"
              >
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-gold" />
                <span>{BUSINESS_INFO.address}</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-3 text-text-secondary hover:text-gold transition-colors"
              >
                <Phone className="w-5 h-5 shrink-0 text-gold" />
                <span>{BUSINESS_INFO.phone}</span>
              </a>

              <div className="flex items-start gap-3 text-text-secondary">
                <Clock className="w-5 h-5 mt-0.5 shrink-0 text-gold" />
                <div>
                  <p>Mon – Fri: {BUSINESS_INFO.hours.weekday}</p>
                  <p>Saturday: {BUSINESS_INFO.hours.saturday}</p>
                  <p>Sunday: {BUSINESS_INFO.hours.sunday}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS_INFO.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold text-charcoal px-6 py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-gold-hover transition-all duration-200 inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Get Directions
              </a>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-whatsapp text-whatsapp px-6 py-3 text-sm font-semibold uppercase tracking-[1px] hover:bg-whatsapp/10 transition-all duration-200 inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
