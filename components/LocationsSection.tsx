'use client';

import Link from 'next/link';
import CinemaImage from '@/components/CinemaImage';

export default function LocationsSection() {
  return (
    <section className="section">
      <div className="container">

        {/* Header */}
        <div className="section-header">
          <div>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#999',
              display: 'block', marginBottom: 8,
            }}>
              Prime Locations
            </span>
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
              fontWeight: 700, lineHeight: 1.2,
              letterSpacing: '-0.02em', color: 'var(--heading)',
              marginBottom: 6,
            }}>
              Explore Prime Locations
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              Dubai&apos;s most coveted addresses, each with its own story.
            </p>
          </div>
          <Link
            href="/areas"
            style={{
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--heading)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-btn)', padding: '8px 16px',
              whiteSpace: 'nowrap', transition: 'border-color var(--transition)',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--heading)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            View More Areas
          </Link>
        </div>

        {/*
          3-col grid:
            col 1 spans 2 rows (Palm Jebel Ali — tall)
            col 2: Business Bay + Dubai Marina stacked
            col 3 spans 2 rows (Downtown Dubai — tall)
        */}
        <div className="loc-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '260px 260px',
          gap: 12,
        }}>
          <LocationCard name="Palm Jebel Ali"  slug="palm-jebel-ali"   image="/images/properties/616795878.jpg"                                               spanRows />
          <LocationCard name="Business Bay"    slug="business-bay"     image="/images/properties/Binghatti_Flare_in_JVT_Dubai_by_Binghatti_Developers_f712d33e54.webp" />
          <LocationCard name="Downtown Dubai"  slug="downtown-dubai"   image="/images/hero/img227.jpg"                                                        spanRows />
          <LocationCard name="Dubai Marina"    slug="dubai-marina"     image="/images/hero/img302.jpg" />
        </div>
      </div>

      <style jsx>{`
        .loc-card:hover .loc-img { transform: scale(1.06) !important; }
        .loc-card:hover .loc-overlay { background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.20) 60%, transparent 100%) !important; }
        .loc-card:hover .loc-name { transform: translateY(-3px); letter-spacing: 0.03em; }

        @media (max-width: 768px) {
          .loc-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: 150px 150px !important;
            gap: 8px !important;
          }
          .loc-card--tall { grid-row: auto !important; }
        }
        @media (max-width: 480px) {
          .loc-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: none !important;
          }
          .loc-card { height: 150px; }
          .loc-card--tall { grid-row: auto !important; height: 150px; }
        }
      `}</style>
    </section>
  );
}

function LocationCard({ name, slug, image, spanRows }: { name: string; slug: string; image: string; spanRows?: boolean }) {
  return (
    <Link
      href={`/areas/${slug}`}
      className={spanRows ? 'loc-card loc-card--tall' : 'loc-card'}
      style={{
        position: 'relative', borderRadius: 'var(--radius-md)',
        overflow: 'hidden', cursor: 'pointer', display: 'block',
        ...(spanRows ? { gridRow: '1 / 3' } : {}),
      }}
    >
      <CinemaImage
        src={image}
        alt={name}
        fill
        cinema
        sizes="(max-width: 768px) 50vw, 33vw"
        className="loc-img"
        style={{ objectFit: 'cover', transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1)' }}
      />
      <div className="loc-overlay" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
        transition: 'background 0.35s ease',
      }} />
      <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, zIndex: 1 }}>
        <span className="loc-name" style={{
          fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 600,
          color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          display: 'inline-block',
          transition: 'transform 0.30s cubic-bezier(0.34,1.56,0.64,1), letter-spacing 0.25s ease',
        }}>
          {name}
        </span>
      </div>
    </Link>
  );
}
