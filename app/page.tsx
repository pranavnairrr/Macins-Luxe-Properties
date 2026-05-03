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
import { createClient } from '@/utils/supabase/server';
import type { ListingRecord } from '@/components/staff/PropertyListingForm';
import { getHeroSlides, getStats, getCompanyInfo } from '@/utils/site-settings';

function toCard(l: ListingRecord): PropertyCard {
  return {
    id: l.id,
    image: l.images[0] ?? '/images/properties/Binghatti-Hills-at-Dubai-HIlls.jpeg',
    badge: l.badge,
    developerLogoText: l.developer.split(' ')[0].toUpperCase(),
    title: l.name,
    developer: l.developer,
    price: l.price,
    location: l.location,
    beds: l.beds,
  }
}

export default async function Home() {
  const supabase = createClient();
  const [{ data }, heroSlides, stats, companyInfo] = await Promise.all([
    supabase.from('listings').select('*').eq('status', 'published').order('created_at', { ascending: true }),
    getHeroSlides().catch(() => []),
    getStats().catch(() => []),
    getCompanyInfo().catch(() => null),
  ]);

  const listings = (data as ListingRecord[]) ?? [];
  const premiumCards: PropertyCard[] = listings.filter(l => l.category === 'premium').map(toCard);
  const offplanCards: PropertyCard[] = listings.filter(l => l.category === 'offplan').map(toCard);

  return (
    <>
      {/* 1. NAV */}
      <Nav />

      {/* 2. HERO SLIDER */}
      <HeroSection slides={heroSlides} />

      {/* 3. PREMIUM LUXURY DEVELOPMENTS */}
      {premiumCards.length > 0 && (
        <PropertyCardsSection
          title="Premium Luxury Developments"
          ctaText="More Off-plan Projects"
          cards={premiumCards}
        />
      )}

      {/* 4. CTA BANNER */}
      <CTABanner />

      {/* 5. LATEST OFFPLAN LAUNCHES */}
      {offplanCards.length > 0 && (
        <PropertyCardsSection
          title="Latest Offplan Launches"
          ctaText="More Off-plan Projects"
          cards={offplanCards}
          grey
        />
      )}

      {/* 6. MAP — Dubai property locations */}
      <MapSection />

      {/* 7. DEVELOPER LOGOS STRIP */}
      <DeveloperLogos />

      {/* 8. EXPLORE PRIME LOCATIONS */}
      <LocationsSection />

      {/* 9. STATS ROW */}
      <StatsSection stats={stats} />

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
      <Footer companyInfo={companyInfo ?? undefined} />

      {/* Global enquire modal */}
      <EnquireModal />
    </>
  );
}
