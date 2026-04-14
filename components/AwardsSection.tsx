'use client';

const awards = [
  { name: 'The Black Onyx Awards',     year: '2025', featured: true },
  { name: 'Emaar Broker Award Q2',     year: '2025' },
  { name: 'Samana Insider Club',       year: '2025' },
  { name: 'Emaar H1 Broker Award',     year: '2025' },
  { name: 'Binghatti Annual Broker Award', year: '2025' },
  { name: 'Emaar Broker Award Q1',     year: '2025' },
];

/* Trophy SVG — minimal outline */
function TrophyIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <rect x="20" y="60" width="24" height="6" rx="2" fill="var(--muted)"/>
      <rect x="16" y="66" width="32" height="6" rx="2" fill="var(--muted)"/>
      <path d="M12 4h40v24c0 11.046-8.954 20-20 20S12 39.046 12 28V4z" stroke="var(--muted)" strokeWidth="2" fill="none"/>
      <path d="M12 10H4a4 4 0 0 0 0 8l8 4M52 10h8a4 4 0 0 1 0 8l-8 4" stroke="var(--muted)" strokeWidth="2"/>
      <circle cx="32" cy="24" r="6" stroke="var(--muted)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export default function AwardsSection() {
  const featured = awards.find(a => a.featured)!;
  const list = awards.filter(a => !a.featured);

  return (
    <section className="section">
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
          Our Recognitions &amp; Achievements
        </h2>

        {/* Featured award card */}
        <div style={{
          background: 'var(--white-section)',
          borderRadius: 'var(--radius-md)',
          padding: '40px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 0,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--heading)',
          }}>
            {featured.name}
          </span>
          {/* Centred trophy */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            <TrophyIcon size={72} />
          </div>
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--heading)',
          }}>
            {featured.year}
          </span>
        </div>

        {/* Award list rows */}
        {list.map((award) => (
          <div
            key={award.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--heading)',
            }}>
              {award.name}
            </span>
            <span style={{
              fontFamily: 'var(--font)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--heading)',
            }}>
              {award.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
