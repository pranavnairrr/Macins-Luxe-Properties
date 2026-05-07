'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import Footer from './Footer';
import StatsSection from './StatsSection';
import WhyChooseSection from './WhyChooseSection';
import AwardsSection from './AwardsSection';
import CinemaImage from './CinemaImage';
import type { StatItem, CompanyInfo } from '@/utils/site-settings';

const TIMELINE = [
  { year: '2007', event: 'Founded', desc: 'Macins Luxe Properties established in Dubai with a vision for luxury real estate.' },
  { year: '2010', event: 'Abu Dhabi Expansion', desc: 'Opened our second office on Reem Island, expanding into the Abu Dhabi market.' },
  { year: '2013', event: 'Developer Partnerships', desc: 'Forged strategic partnerships with Emaar, Damac, Binghatti and other top developers.' },
  { year: '2016', event: '1,000 Clients', desc: 'Reached the milestone of 1,000 satisfied clients across Dubai and Abu Dhabi.' },
  { year: '2018', event: 'AED 1 Billion', desc: 'Crossed AED 1 billion in annual property transactions for the first time.' },
  { year: '2020', event: 'Digital Pivot', desc: 'Launched digital-first services — virtual tours, online consultations, and a dedicated app.' },
  { year: '2022', event: 'AED 2 Billion', desc: 'Doubled annual transaction volume to AED 2 billion despite global market headwinds.' },
  { year: '2024', event: '200+ Team', desc: 'Our team of realtors and marketing professionals surpassed 200 members across two cities.' },
  { year: '2025', event: 'Award Season', desc: 'Won the Black Onyx Award, Emaar Broker Awards Q1 & Q2, and the Binghatti Annual Broker Award.' },
];

export default function AboutPage({ stats, companyInfo }: { stats?: StatItem[]; companyInfo?: CompanyInfo | null }) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('revealed'); } });
    }, { threshold: 0.12 });
    const els = document.querySelectorAll('[data-reveal]');
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const phone = companyInfo?.phone ?? '+971 4 4542588';
  const email = companyInfo?.email ?? 'info@macinsluxe.com';
  const addrDubai = companyInfo?.address_dubai ?? 'Office 102-106, Building 02\nBusiness Bay, Dubai';
  const addrAD = companyInfo?.address_abudhabi ?? 'Office 149 & 150\nWafra Square, Reem Island\nAbu Dhabi';

  return (
    <>
      <Nav />

      {/* ── Split Hero ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520 }}>
        <div style={{
          background: '#111',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(48px, 8vw, 80px)',
        }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)', marginBottom: 20 }}>
            About Macins Luxe
          </span>
          <h1 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: '#fff',
            marginBottom: 24,
          }}>
            Dubai&apos;s Most Trusted<br />Luxury Property Brand
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', maxWidth: 480, marginBottom: 36 }}>
            Since 2007, Macins Luxe Properties has been guiding clients to exceptional real estate across Dubai and Abu Dhabi. We combine deep market intelligence with a genuine commitment to every client&apos;s unique vision.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/properties" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: '#fff', borderRadius: 'var(--radius-btn)', padding: '12px 24px', transition: 'background 0.2s ease' }}>
              View Properties
            </Link>
            <Link href="/contact" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 'var(--radius-btn)', padding: '12px 24px', transition: 'border-color 0.2s ease' }}>
              Contact Us
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative', minHeight: 520 }}>
          <CinemaImage
            cinema
            priority
            src="/images/hero/img106.jpg"
            alt="Macins Luxe luxury properties Dubai"
            fill
            sizes="50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64, alignItems: 'start' }}>
            <div data-reveal>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: 16 }}>Our Story</span>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--heading)', marginBottom: 16 }}>
                18 Years of Luxury Real Estate Excellence
              </h2>
              <div style={{ width: 48, height: 3, background: '#ddd', borderRadius: 2 }} />
            </div>
            <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--body)' }}>
                Founded in 2007 by a team of seasoned property professionals, Macins Luxe Properties set out with a singular purpose: to redefine the luxury real estate experience in the UAE. What began as a boutique consultancy in Business Bay has grown into one of Dubai&apos;s most recognised and awarded property firms.
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--body)' }}>
                With offices in Business Bay, Dubai and Reem Island, Abu Dhabi, our 200-strong team of consultants, marketing specialists, and transaction coordinators serves clients from over 80 nationalities. We handle everything from first-time purchases and investment portfolios to ultra-prime off-plan acquisitions and developer partnerships.
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--body)' }}>
                Today, Macins Luxe facilitates over AED 3 billion in annual property transactions — a testament not just to our scale, but to the trust our clients place in us year after year. Every transaction, large or small, receives the same white-glove attention that has defined our brand since day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section" style={{ background: 'var(--white-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }} data-reveal>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: 12 }}>Our Journey</span>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--heading)' }}>
              Milestones That Define Us
            </h2>
          </div>

          <div className="timeline" style={{ position: 'relative', maxWidth: 860, margin: '0 auto' }}>
            {/* Centre line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--border)', transform: 'translateX(-50%)' }} />

            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                data-reveal
                className="timeline-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 40px 1fr',
                  gap: '0 24px',
                  marginBottom: 40,
                  alignItems: 'center',
                }}
              >
                {i % 2 === 0 ? (
                  <>
                    <div className="timeline-card" style={{ textAlign: 'right', padding: '20px 24px', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(26,37,53,0.06)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>{item.event}</div>
                      <div style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--body)' }}>{item.desc}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#111', border: '3px solid var(--white)', boxShadow: '0 0 0 2px #111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>{item.year.slice(2)}</span>
                      </div>
                    </div>
                    <div style={{ paddingLeft: 8 }}>
                      <span style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2vw, 1.875rem)', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{item.year}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ paddingRight: 8, textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2vw, 1.875rem)', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{item.year}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#111', border: '3px solid var(--white)', boxShadow: '0 0 0 2px #111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>{item.year.slice(2)}</span>
                      </div>
                    </div>
                    <div className="timeline-card" style={{ textAlign: 'left', padding: '20px 24px', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(26,37,53,0.06)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>{item.event}</div>
                      <div style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--body)' }}>{item.desc}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <StatsSection stats={stats} />

      {/* ── Why Choose ── */}
      <WhyChooseSection />

      {/* ── Awards ── */}
      <AwardsSection />

      {/* ── Our Offices ── */}
      <section className="section" style={{ background: 'var(--white-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }} data-reveal>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--heading)' }}>
              Our Offices
            </h2>
          </div>
          <div className="offices-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {[
              {
                city: 'Dubai',
                addr: addrDubai,
                mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.4!2d55.265!3d25.186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzA5LjYiTiA1NcKwMTUnNTQuMCJF!5e0!3m2!1sen!2sae!4v1',
              },
              {
                city: 'Abu Dhabi',
                addr: addrAD,
                mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.7!2d54.402!3d24.487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDI5JzEzLjIiTiA1NMKwMjQnMDcuMiJF!5e0!3m2!1sen!2sae!4v1',
              },
            ].map(office => (
              <div key={office.city} data-reveal style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,37,53,0.06)' }}>
                <iframe
                  src={office.mapSrc}
                  width="100%"
                  height="240"
                  style={{ border: 'none', display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  title={`Macins Luxe ${office.city} Office`}
                />
                <div style={{ padding: '24px 28px' }}>
                  <div style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 8 }}>
                    {office.city} Office
                  </div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--body)', whiteSpace: 'pre-line', marginBottom: 16 }}>{office.addr}</p>
                  <div style={{ fontSize: '0.875rem', color: 'var(--body)' }}>
                    <div style={{ marginBottom: 4 }}>{phone}</div>
                    <div>{email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Block ── */}
      <section style={{ background: '#111', padding: 'clamp(48px, 8vw, 80px) var(--gutter-lg)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#fff', marginBottom: 16 }}>
            Ready to Find Your Dream Property?
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Our team of experts is ready to guide you through Dubai&apos;s finest properties.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/properties" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: '#fff', borderRadius: 'var(--radius-btn)', padding: '14px 32px', transition: 'background 0.2s ease' }}>
              Browse Properties
            </Link>
            <Link href="/contact" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', border: '1px solid rgba(255,255,255,0.40)', borderRadius: 'var(--radius-btn)', padding: '14px 32px', transition: 'border-color 0.2s ease' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo ?? undefined} />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1); }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          .about-story-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .offices-grid { grid-template-columns: 1fr !important; }
          .timeline-row { grid-template-columns: 1fr !important; }
          .timeline-row > *:nth-child(2) { display: none; }
          .timeline-card { text-align: left !important; }
        }
      `}</style>
    </>
  );
}
