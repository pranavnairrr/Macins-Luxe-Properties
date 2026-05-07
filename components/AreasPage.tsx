'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from './Nav';
import Footer from './Footer';
import { areas, type AreaData } from '@/lib/areas-data';

const EMIRATE_FILTERS = ['All', 'Dubai', 'Abu Dhabi'] as const;
type EmirateFilter = typeof EMIRATE_FILTERS[number];

const WHY_STATS = [
  { value: '5–8%', label: 'Rental Yield', desc: 'Among the highest in the world' },
  { value: '+18%', label: 'YoY Growth', desc: 'Transaction value increase 2025' },
  { value: '120+', label: 'Nationalities', desc: 'International investor base' },
  { value: '0%', label: 'Property Tax', desc: 'No annual property or capital gains tax' },
];

export default function AreasPage() {
  const [activeFilter, setActiveFilter] = useState<EmirateFilter>('All');

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const filtered = activeFilter === 'All' ? areas : areas.filter(a => a.emirate === activeFilter);

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(72px, 10vw, 100px) var(--gutter-lg) clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 620 }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 16 }}>
            Prime Locations
          </span>
          <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', marginBottom: 16 }}>
            Explore Prime Areas
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.70)' }}>
            From Downtown Dubai to Yas Island — discover UAE&apos;s most sought-after residential and investment districts.
          </p>
        </div>
      </section>

      {/* Areas grid */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          {/* Emirate filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
            {EMIRATE_FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600, padding: '8px 20px', borderRadius: 'var(--radius-pill)', border: activeFilter === f ? 'none' : '1px solid var(--border)', background: activeFilter === f ? 'var(--navy)' : 'transparent', color: activeFilter === f ? '#fff' : 'var(--heading)', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >{f}</button>
            ))}
          </div>

          <div className="areas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
            {filtered.map(area => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Dubai section */}
      <section className="section" style={{ background: 'var(--white-section)' }}>
        <div className="container">
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div data-reveal>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 16 }}>
                Why Invest
              </span>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--heading)', marginBottom: 20 }}>
                Why Dubai &amp; Abu Dhabi?
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--body)', marginBottom: 16 }}>
                The UAE offers one of the world&apos;s most compelling real estate investment environments — a combination of tax-free returns, world-class infrastructure, and a rapidly growing resident and tourist population.
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--body)', marginBottom: 28 }}>
                With no property tax, no capital gains tax, and rental yields consistently between 5–8%, Dubai and Abu Dhabi continue to attract investors from across the globe seeking both income and capital appreciation.
              </p>
              <Link href="/properties" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: 'var(--navy)', borderRadius: 'var(--radius-btn)', padding: '12px 24px', display: 'inline-block', textDecoration: 'none', transition: 'background 0.2s ease' }}>
                Explore Properties
              </Link>
            </div>
            <div data-reveal style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {WHY_STATS.map(s => (
                <div key={s.value} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '24px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(26,37,53,0.05)' }}>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: 6 }}>{s.value}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(48px, 6vw, 64px) var(--gutter-lg)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Not Sure Which Area Is Right for You?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.70)', marginBottom: 28 }}>
            Our area specialists will guide you to the perfect neighbourhood based on your lifestyle and investment goals.
          </p>
          <Link href="/contact" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: '#fff', borderRadius: 'var(--radius-btn)', padding: '12px 28px', display: 'inline-block' }}>
            Speak to an Area Specialist
          </Link>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 1024px) { .areas-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px) { .areas-grid { grid-template-columns: repeat(2, 1fr) !important; } .why-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .areas-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

function AreaCard({ area }: { area: AreaData }) {
  return (
    <Link href={`/areas/${area.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article
        data-reveal
        className="area-card"
        style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', aspectRatio: '3/4', cursor: 'pointer', transition: 'transform 0.28s ease, box-shadow 0.28s ease' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(26,37,53,0.16)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
      >
        <Image src={area.image} alt={area.name} fill sizes="25vw" style={{ objectFit: 'cover', transition: 'transform 600ms ease' }}
          onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.06)')}
          onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,33,61,0.85) 0%, rgba(3,33,61,0.20) 55%, transparent 80%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>{area.name}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
            <span>{area.avgPricePerSqft}/sqft</span>
            <span>·</span>
            <span>{area.rentalYield} yield</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
