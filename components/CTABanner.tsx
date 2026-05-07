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
        background: 'linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0.50) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="container" style={{ paddingBlock: 72 }}>

          {/* Eyebrow */}
          <span style={{
            display: 'block', fontSize: '0.6875rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)', marginBottom: 20,
          }}>
            Market Intelligence
          </span>

          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
            fontWeight: 700, color: '#fff',
            letterSpacing: '-0.02em', maxWidth: 520,
            marginBottom: 14, lineHeight: 1.2,
          }}>
            The Market Moves.<br />Stay Ahead of It.
          </h2>

          <p style={{
            fontSize: '1rem', lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 480, marginBottom: 32,
          }}>
            Exclusive quarterly intelligence from Macins Luxe — used by investors and end-users to make the most significant decisions of their lives.
          </p>

          <a
            href="/reports"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--heading)', background: '#fff',
              borderRadius: 'var(--radius-btn)', padding: '12px 28px',
              borderLeft: 'none',
              transition: 'background var(--transition), box-shadow var(--transition)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--white-section)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.20)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '#fff';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Request Your Report
          </a>
        </div>
      </div>
    </section>
  );
}
