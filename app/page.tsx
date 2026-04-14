import Nav from '@/components/Nav';
import HeroSection from '@/components/HeroSection';
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
import Footer from '@/components/Footer';
import type { PropertyCard } from '@/components/PropertyCardsSection';

/* ── Property card data ── */
const premiumCards: PropertyCard[] = [
  {
    image: '/images/hero/hero-4.jpg',
    badge: 'Handover: Q3 2030',
    developerLogoText: 'EMAAR',
    title: 'Golf Vale',
    developer: 'Emaar Properties',
    price: 'AED 1.10M',
    location: 'Dubai South',
    beds: '1, 2, 3',
  },
  {
    image: '/images/hero/hero-2.jpg',
    badge: 'Handover: Q2 2027',
    developerLogoText: 'EMAAR',
    title: 'Mareva at The Oasis',
    developer: 'Emaar Properties',
    price: 'AED 13.47M',
    location: 'The Oasis',
    beds: '4, 5, 6',
  },
  {
    image: '/images/hero/hero-3.jpg',
    badge: 'Handover: Q4 2026',
    developerLogoText: 'EMAAR',
    title: 'Avelia at The Valley',
    developer: 'Emaar Properties',
    price: 'AED 7.25M',
    location: 'The Valley',
    beds: '3, 4',
  },
];

const offplanCards: PropertyCard[] = [
  {
    image: '/images/hero/hero-3.jpg',
    badge: 'Handover: Q4 2029',
    developerLogoText: 'DANUBE',
    title: 'Greenz by Danube',
    developer: 'Danube Properties',
    price: 'AED 3.5M',
    location: 'Majan',
    beds: '3, 4, 5',
  },
  {
    image: '/images/hero/hero-1.webp',
    badge: 'Handover: Q4 2027',
    developerLogoText: 'BINGHATTI',
    title: 'Binghatti Skyflame',
    developer: 'Binghatti Properties',
    price: 'AED 585K',
    location: 'Majan',
    beds: '1, 2, Studio',
  },
  {
    image: '/images/hero/hero-4.jpg',
    badge: 'Handover: Q3 2030',
    developerLogoText: 'EMAAR',
    title: 'Golf Vale',
    developer: 'Emaar Properties',
    price: 'AED 1.10M',
    location: 'Qulba South',
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

      {/* 3. CEO VIDEO */}
      <CEOVideoSection />

      {/* 4. STATS ROW */}
      <StatsSection />

      {/* 5. WHY CHOOSE */}
      <WhyChooseSection />

      {/* 6. PREMIUM LUXURY DEVELOPMENTS */}
      <PropertyCardsSection
        title="Premium Luxury Developments"
        ctaText="More Off-plan Projects"
        cards={premiumCards}
      />

      {/* 7. CTA BANNER */}
      <CTABanner />

      {/* 8. LATEST OFFPLAN LAUNCHES */}
      <PropertyCardsSection
        title="Latest Offplan Launches"
        ctaText="More Off-plan Projects"
        cards={offplanCards}
        grey
      />

      {/* 9. DEVELOPER LOGOS STRIP */}
      <DeveloperLogos />

      {/* 10. EXPLORE PRIME LOCATIONS */}
      <LocationsSection />

      {/* 11. RECOGNITIONS & ACHIEVEMENTS */}
      <AwardsSection />

      {/* 12. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 13. LATEST BLOGS */}
      <BlogsSection />

      {/* 14. FOOTER */}
      <Footer />
    </>
  );
}
