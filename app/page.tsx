import Nav from '@/components/Nav';
import HeroSection from '@/components/HeroSection';
import EnquireModal from '@/components/EnquireModal';
import CEOVideoSection from '@/components/CEOVideoSection';
import StatsSection from '@/components/StatsSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import PropertyCardsSection from '@/components/PropertyCardsSection';
import CTABanner from '@/components/CTABanner';
import DeveloperLogos from '@/components/DeveloperLogos';
import LocationsSection from '@/components/LocationsSection';
import AwardsSection from '@/components/AwardsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogsSection from '@/components/BlogsSection';
import MapSection from '@/components/MapSection';
import Footer from '@/components/Footer';
import type { PropertyCard } from '@/components/PropertyCardsSection';

/* ── Property card data ── */
const premiumCards: PropertyCard[] = [
  {
    image: '/images/properties/Binghatti-Hills-at-Dubai-HIlls.jpeg',
    badge: 'Handover: Q3 2030',
    developerLogoText: 'BINGHATTI',
    title: 'Binghatti Hills',
    developer: 'Binghatti Properties',
    price: 'AED 1.10M',
    location: 'Dubai Hills',
    beds: '1, 2, 3',
  },
  {
    image: '/images/properties/gulfnews_2025-12-12_kjm4wss9_Bugatti-Residences-by-Binghatti.avif',
    badge: 'Handover: Q2 2027',
    developerLogoText: 'BINGHATTI',
    title: 'Bugatti Residences',
    developer: 'Binghatti Properties',
    price: 'AED 13.47M',
    location: 'Business Bay',
    beds: '3, 4, 5',
  },
  {
    image: '/images/properties/binghatti-luxuria-hero-banner.avif',
    badge: 'Handover: Q4 2026',
    developerLogoText: 'BINGHATTI',
    title: 'Binghatti Luxuria',
    developer: 'Binghatti Properties',
    price: 'AED 7.25M',
    location: 'JVC',
    beds: '1, 2, 3',
  },
];

const offplanCards: PropertyCard[] = [
  {
    image: '/images/properties/Binghatti-Hillside-at-Dubai-Science-Park.webp',
    badge: 'Handover: Q4 2029',
    developerLogoText: 'BINGHATTI',
    title: 'Binghatti Hillside',
    developer: 'Binghatti Properties',
    price: 'AED 3.5M',
    location: 'Dubai Science Park',
    beds: '1, 2, 3',
  },
  {
    image: '/images/properties/Binghatti-Falre-JVT-Towers.jpg',
    badge: 'Handover: Q4 2027',
    developerLogoText: 'BINGHATTI',
    title: 'Binghatti Flare',
    developer: 'Binghatti Properties',
    price: 'AED 585K',
    location: 'JVT',
    beds: '1, 2, Studio',
  },
  {
    image: '/images/properties/binghatti-hillcrest-hero-banner.avif',
    badge: 'Handover: Q3 2026',
    developerLogoText: 'BINGHATTI',
    title: 'Binghatti Hillcrest',
    developer: 'Binghatti Properties',
    price: 'AED 1.10M',
    location: 'Dubai Hills',
    beds: '1, 2, Studio',
  },
];

export default function Home() {
  return (
    <>
      {/* 1. NAV */}
      <Nav />

      {/* 2. HERO SLIDER */}
      <HeroSection />

      {/* 3. PREMIUM LUXURY DEVELOPMENTS */}
      <PropertyCardsSection
        title="Premium Luxury Developments"
        ctaText="More Off-plan Projects"
        cards={premiumCards}
      />

      {/* 4. CTA BANNER */}
      <CTABanner />

      {/* 5. LATEST OFFPLAN LAUNCHES */}
      <PropertyCardsSection
        title="Latest Offplan Launches"
        ctaText="More Off-plan Projects"
        cards={offplanCards}
        grey
      />

      {/* 6. MAP — Dubai property locations */}
      <MapSection />

      {/* 7. DEVELOPER LOGOS STRIP */}
      <DeveloperLogos />

      {/* 8. EXPLORE PRIME LOCATIONS */}
      <LocationsSection />

      {/* 9. STATS ROW */}
      <StatsSection />

      {/* 10. WHY CHOOSE */}
      <WhyChooseSection />

      {/* 11. RECOGNITIONS & ACHIEVEMENTS */}
      <AwardsSection />

      {/* 12. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 13. LATEST BLOGS */}
      <BlogsSection />

      {/* 14. CEO VIDEO — last before footer */}
      <CEOVideoSection />

      {/* 15. FOOTER */}
      <Footer />

      {/* Global enquire modal */}
      <EnquireModal />
    </>
  );
}
