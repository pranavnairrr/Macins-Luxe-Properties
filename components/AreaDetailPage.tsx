'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import CinemaImage from './CinemaImage';
import Nav from './Nav';
import Footer from './Footer';
import type { AreaData } from '@/lib/areas-data';
import { areas } from '@/lib/areas-data';

const PropertyMap = dynamic(() => import('./MapView'), { ssr: false });

type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  beds?: string;
  images?: string[];
};

export default function AreaDetailPage({ area, listings }: { area: AreaData; listings: Listing[] }) {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const nearbyAreaData = areas.filter(a => area.nearbyAreas.includes(a.name));

  return (
    <>
      <Nav />

      {/* Full-bleed hero */}
      <section style={{ position: 'relative', height: '60vh', minHeight: 400, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <CinemaImage cinema priority src={area.heroImage} alt={area.name} fill sizes="100vw" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 50%, transparent 80%)' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', padding: 'clamp(32px, 5vw, 56px) var(--gutter-lg)' }}>
          <div className="container">
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.55)' }}>Home</Link>
              <span>/</span>
              <Link href="/areas" style={{ color: 'rgba(255,255,255,0.55)' }}>Areas</Link>
              <span>/</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{area.name}</span>
            </nav>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: 8 }}>
                  {area.name}
                </h1>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)' }}>{area.tagline}</p>
              </div>
              {listings.length > 0 && (
                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 'var(--radius-btn)', padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                  {listings.length} Properties Available
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>
            <div data-reveal>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--heading)', marginBottom: 20 }}>
                Overview
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.85, color: 'var(--body)', marginBottom: 24 }}>{area.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {area.highlights.map(h => (
                  <span key={h} style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--heading)', background: 'var(--white-section)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '5px 14px' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div data-reveal style={{ background: '#111', borderRadius: 'var(--radius-md)', padding: '28px 24px', color: '#fff' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)', marginBottom: 20 }}>
                Area Statistics
              </div>
              {[
                { label: 'Avg Price / sqft', value: area.avgPricePerSqft },
                { label: 'Rental Yield', value: area.rentalYield },
                { label: 'Property Types', value: area.propertyTypes.join(', ') },
              ].map(stat => (
                <div key={stat.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', paddingBottom: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.50)', marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{stat.value}</div>
                </div>
              ))}
              <Link href={`/properties?area=${encodeURIComponent(area.name)}`} style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-btn)', padding: '12px', textDecoration: 'none', marginTop: 8, transition: 'opacity 0.2s', border: '1px solid rgba(255,255,255,0.25)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                View Properties in {area.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Area Listings */}
      <section className="section" style={{ background: 'var(--white-section)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 32 }}>
            Properties in {area.name}
          </h2>
          {listings.length > 0 ? (
            <div className="listings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap)' }}>
              {listings.map(listing => (
                <Link key={listing.id} href={`/properties/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article
                    data-reveal
                    style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--white)', boxShadow: 'var(--shadow-card)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(26,37,53,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'; }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                      {listing.images?.[0] ? (
                        <Image src={listing.images[0]} alt={listing.title} fill sizes="33vw" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--white-section)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>No Image</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '16px 20px 20px' }}>
                      <h3 style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 4 }}>{listing.title}</h3>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 10 }}>{listing.location}</div>
                      <div style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: 'var(--heading)' }}>{listing.price}</div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '48px 32px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--body)', marginBottom: 20 }}>No listed properties in {area.name} right now. Contact us for off-market opportunities.</p>
              <Link href="/contact" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#111', borderRadius: 'var(--radius-btn)', padding: '12px 24px', textDecoration: 'none' }}>
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Map */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 24 }}>
            Location
          </h2>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 420, border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(26,37,53,0.08)' }}>
            <PropertyMap />
          </div>
        </div>
      </section>

      {/* Nearby Areas */}
      {nearbyAreaData.length > 0 && (
        <section className="section" style={{ background: 'var(--white-section)' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 28 }}>
              Nearby Areas
            </h2>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {nearbyAreaData.map(nearby => (
                <Link key={nearby.slug} href={`/areas/${nearby.slug}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ position: 'relative', width: 220, height: 140, borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'transform 0.25s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                  >
                    <Image src={nearby.image} alt={nearby.name} fill sizes="220px" style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                      <div style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{nearby.name}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 900px) {
          .overview-grid { grid-template-columns: 1fr !important; }
          .listings-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .listings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
