'use client';

export default function StatsSection() {
  const stats = [
    { number: 'AED 3B+',  label: 'Properties Sold',  desc: 'We sell over AED 3 Billion worth of properties every year' },
    { number: '200+',     label: 'Professionals',    desc: 'We have over 200 realtors and marketing professionals' },
    { number: '17+ YEARS',label: 'Experience',       desc: 'We have been in the real estate business since 2008' },
    { number: '5,000+',   label: 'Happy Clients',    desc: 'We have served over 6000 happy clients since 2007' },
  ];

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
          marginBottom: 40,
        }}>
          Most Followed Real Estate Brand in the UAE
        </h2>

        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--gap)',
        }}>
          {stats.map(s => (
            <div
              key={s.label}
              className="stat-card"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 28,
                boxShadow: '0 1px 4px rgba(27,48,121,0.06)',
                transition: 'transform 0.30s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.30s ease, border-color 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow = '0 12px 32px rgba(27,48,121,0.14)';
                el.style.borderColor = 'var(--navy-light)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 1px 4px rgba(27,48,121,0.06)';
                el.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{
                fontFamily: 'var(--font)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--heading)',
              }}>
                {s.number}
              </div>
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'var(--heading)',
                marginTop: 4,
                lineHeight: 1.4,
              }}>
                {s.label}
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'var(--body)',
                lineHeight: 1.6,
                marginTop: 8,
              }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .stats-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px)  { .stat-card  { padding: 13px !important; } }
      `}</style>
    </section>
  );
}
