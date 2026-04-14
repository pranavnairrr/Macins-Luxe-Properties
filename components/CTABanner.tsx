'use client';

import Image from 'next/image';

export default function CTABanner() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: 280, display: 'flex', alignItems: 'center' }}>
      {/* Background image */}
      <Image
        src="/images/properties/gulfnews_2025-12-12_kjm4wss9_Bugatti-Residences-by-Binghatti.avif"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
      />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(10,18,50,0.88) 50%, rgba(10,18,50,0.58) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="container" style={{ paddingBlock: 64 }}>
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            maxWidth: 560,
            marginBottom: 12,
          }}>
            Access the Latest Dubai Real Estate Insights
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.80)',
            marginBottom: 28,
          }}>
            Comprehensive annual reports with key trends, prices, and forecasts.
          </p>
          <a
            href="#"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--heading)',
              background: '#fff',
              borderRadius: 'var(--radius-btn)',
              padding: '12px 28px',
              transition: 'background var(--transition)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--white-section)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
          >
            Download Reports
          </a>
        </div>
      </div>
    </section>
  );
}
