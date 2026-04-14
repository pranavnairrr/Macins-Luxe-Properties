'use client';

const developers = [
  { name: 'SOBHA',    label: 'SOBHA\nREALTY',    big: false },
  { name: 'wasl',     label: 'wasl',              big: true  },
  { name: 'DANUBE',   label: 'DANUBE\nPROPERTIES',big: false },
  { name: 'OMNIYAT',  label: 'OMNIYAT',           big: false },
  { name: 'MERAAS',   label: '⊞ MERAAS',          big: false },
];

export default function DeveloperLogos() {
  return (
    <section className="section--sm section--grey">
      <div className="container">
        <h2 style={{
          fontFamily: 'var(--font)',
          fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: 'var(--heading)',
          marginBottom: 36,
        }}>
          Developers We Work With
        </h2>

        <div className="dev-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--gap)',
        }}>
          {developers.map(dev => (
            <div
              key={dev.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--white)',
                padding: '20px 32px',
                height: 80,
                transition: 'border-color 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--heading)';
                el.style.transform = 'translateY(-4px) scale(1.03)';
                el.style.boxShadow = '0 8px 24px rgba(27,48,121,0.10)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = 'none';
              }}
            >
              <span style={{
                fontFamily: 'var(--font)',
                fontSize: dev.big ? '1.5rem' : '0.875rem',
                fontWeight: 700,
                color: 'var(--heading)',
                letterSpacing: dev.big ? '-0.03em' : '0.06em',
                textAlign: 'center',
                whiteSpace: 'pre-line',
                lineHeight: 1.2,
                textTransform: dev.big ? 'lowercase' : 'uppercase',
              }}>
                {dev.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .dev-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .dev-grid {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 12px !important;
            padding-bottom: 8px;
          }
          .dev-grid > div {
            flex: 0 0 140px;
            scroll-snap-align: start;
          }
        }
        .dev-grid::-webkit-scrollbar { display: none; }
        .dev-grid { scrollbar-width: none; }
      `}</style>
    </section>
  );
}
