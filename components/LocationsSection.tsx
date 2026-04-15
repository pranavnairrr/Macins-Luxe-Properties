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
            image="/images/hero/img227.jpg"
            spanRows
          />

          {/* Dubai Marina */}
          <LocationCard
            name="Dubai Marina"
            image="/images/hero/img302.jpg"
          />

        </div>
      </div>

      <style jsx>{`
        /* ── Location card hover ── */
        .loc-card:hover .loc-img { transform: scale(1.06) !important; }
        .loc-card:hover .loc-overlay { background: linear-gradient(to top, rgba(10,18,40,0.82) 0%, rgba(10,18,40,0.20) 60%, transparent 100%) !important; }
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
        className="loc-img"
        style={{ objectFit: 'cover', transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1)' }}
      />
      {/* Gradient overlay — darkens on hover via CSS */}
      <div className="loc-overlay" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(10,18,40,0.65) 0%, transparent 55%)',
        transition: 'background 0.35s ease',
      }} />
      {/* Bottom-left label */}
      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
        zIndex: 1,
      }}>
        <span className="loc-name" style={{
          fontFamily: 'var(--font)',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#fff',
          textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          display: 'inline-block',
          transition: 'transform 0.30s cubic-bezier(0.34,1.56,0.64,1), letter-spacing 0.25s ease',
        }}>
          {name}
        </span>
      </div>
    </div>
  );
}
