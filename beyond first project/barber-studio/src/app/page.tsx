import Hero from "@/components/sections/Hero";
import QuickBooking from "@/components/sections/QuickBooking";
import TrustSection from "@/components/sections/TrustSection";
import ServicesPreview from "@/components/sections/ServicesPreview";
import BarbersPreview from "@/components/sections/BarbersPreview";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ReferralCTA from "@/components/sections/ReferralCTA";
import LocationSection from "@/components/sections/LocationSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickBooking />
      <TrustSection />
      <ServicesPreview />
      <BarbersPreview />
      <PortfolioPreview />
      <ReviewsSection />
      <ReferralCTA />
      <LocationSection />
    </>
  );
}
