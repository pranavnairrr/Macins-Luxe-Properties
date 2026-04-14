'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function MapSection() {
  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container">

        {/* Header */}
        <div className="section-header" style={{ marginBottom: 36 }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--heading)',
              marginBottom: 8,
            }}>
              Explore Properties Across Dubai
            </h2>
            <p style={{
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--body)',
              maxWidth: 480,
            }}>
              View our exclusive listings plotted across the city&apos;s most sought-after districts.
            </p>
          </div>

          <a
            href="#"
            style={{
              fontFamily: 'var(--font)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--heading)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-btn)',
              padding: '8px 16px',
              whiteSpace: 'nowrap',
              transition: 'border-color var(--transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--heading)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            View All Listings
          </a>
        </div>

        {/* Map */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          height: 520,
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(26,37,53,0.08)',
          position: 'relative',
        }}>
          {/* Property count badge */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-btn)',
            padding: '6px 14px',
            fontFamily: 'var(--font)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--heading)',
            boxShadow: '0 2px 8px rgba(26,37,53,0.10)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {/* Dot */}
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--navy)',
              display: 'inline-block',
            }} />
            6 Properties
          </div>

          <MapView />
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="height: 520px"] { height: 320px !important; }
        }
        @media (max-width: 480px) {
          div[style*="height: 520px"] { height: 260px !important; }
        }
      `}</style>
    </section>
  );
}
