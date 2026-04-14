'use client';

import Image from 'next/image';


export default function LocationsSection() {
  return (
    <section className="section">
      <div className="container">

        {/* Header */}
        <div className="section-header">
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--heading)',
          }}>
            Explore Prime Locations
          </h2>
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
            View More Areas
          </a>
        </div>

        {/*
          Grid layout (from luxe.md):
          columns: 1fr 1fr 1fr   (left primary spans 2 rows, middle 2 cells, right spans 2 rows)
          Actual layout from screenshots:
            [Palm Jebel Ali (tall)] [Business Bay] [Downtown Dubai (tall)]
            [Palm Jebel Ali (tall)] [Dubai Marina] [Downtown Dubai (tall)]
        */}
        <div className="loc-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '260px 260px',
          gap: 12,
        }}>

          {/* Palm Jebel Ali — spans both rows */}
          <LocationCard
            name="Palm Jebel Ali"
            image="/images/properties/616795878.jpg"
            spanRows
          />

          {/* Business Bay */}
          <LocationCard
            name="Business Bay"
            image="/images/properties/Binghatti_Flare_in_JVT_Dubai_by_Binghatti_Developers_f712d33e54.webp"
          />

          {/* Downtown Dubai — spans both rows */}
          <LocationCard
            name="Downtown Dubai"
            image="/images/hero/hero-4.jpg"
            spanRows
          />

          {/* Dubai Marina */}
          <LocationCard
            name="Dubai Marina"
            image="/images/hero/hero-3.jpg"
          />

        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .loc-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: 200px 200px 200px !important;
          }
          .loc-card--tall { grid-row: auto !important; }
        }
        @media (max-width: 480px) {
          .loc-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: none !important;
          }
          .loc-card { height: 220px; }
          .loc-card--tall { grid-row: auto !important; height: 220px; }
        }
      `}</style>
    </section>
  );
}

function LocationCard({ name, image, spanRows }: { name: string; image: string; spanRows?: boolean }) {
  return (
    <div
      className={spanRows ? 'loc-card loc-card--tall' : 'loc-card'}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        ...(spanRows ? { gridRow: '1 / 3' } : {}),
      }}
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        style={{ objectFit: 'cover', transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)' }}
        onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
        onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
      />
      {/* Bottom-left label */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
      }}>
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          {name}
        </span>
      </div>
      {/* Gradient overlay for text legibility */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: 'linear-gradient(to top, rgba(10,18,40,0.65) 0%, transparent 100%)',
      }} />
    </div>
  );
}
