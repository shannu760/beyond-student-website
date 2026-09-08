import { Star } from "lucide-react";
import { REVIEWS, BUSINESS_INFO } from "@/lib/data";

export default function ReviewsPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      {/* Header */}
      <div className="text-center mb-16 px-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
          Testimonials
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
          What Our Clients Say
        </h1>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-gold text-gold" />
            ))}
          </div>
          <span className="text-3xl font-bold text-text-primary">{BUSINESS_INFO.googleRating}</span>
        </div>
        <p className="text-text-secondary">
          Google Rating · {BUSINESS_INFO.totalReviews.toLocaleString()} reviews
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-surface border border-border rounded-xl p-6 hover:border-gold/20 transition-colors"
            >
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= review.rating ? "fill-gold text-gold" : "text-border"
                    }`}
                  />
                ))}
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center text-xs font-bold text-gold">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{review.name}</p>
                  <p className="text-xs text-text-muted">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
