'use client';

const awards = [
  { name: 'The Black Onyx Awards',         year: '2025' },
  { name: 'Emaar Broker Award Q2',          year: '2025' },
  { name: 'Samana Insider Club',            year: '2025' },
  { name: 'Emaar H1 Broker Award',          year: '2025' },
  { name: 'Binghatti Annual Broker Award',  year: '2025' },
  { name: 'Emaar Broker Award Q1',          year: '2025' },
];

export default function AwardsSection() {
  return (
    <section className="section">
      <div className="container">

        <h2 className="awards-heading">
          Our Recognitions &amp; Achievements
        </h2>

        <div className="awards-list">
          {awards.map(award => (
            <div key={award.name} className="award-row">
              <svg className="award-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="award-row-name">{award.name}</span>
              <span className="award-row-year">{award.year}</span>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .awards-heading {
          font-family: var(--font);
          font-size: clamp(1.75rem, 2.75vw, 2.375rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--heading);
          margin-bottom: 36px;
        }

        .awards-list {
          border-top: 1px solid var(--border);
        }

        .award-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 20px;
          border-bottom: 1px solid var(--border);
          border-radius: 0;
          cursor: pointer;
          background: transparent;
          transition: background 0.3s ease, border-radius 0.3s ease, border-color 0.3s ease;
        }

        .award-arrow {
          color: var(--muted);
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }

        .award-row-name {
          font-family: var(--font);
          font-size: 1rem;
          font-weight: 600;
          color: var(--heading);
          flex: 1;
          transition: color 0.3s ease;
        }

        .award-row-year {
          font-family: var(--font);
          font-size: 1rem;
          font-weight: 600;
          color: var(--heading);
          transition: color 0.3s ease;
        }

        .award-row:hover {
          background: var(--heading);
          border-radius: var(--radius-sm);
          border-bottom-color: transparent;
        }
        .award-row:hover .award-row-name,
        .award-row:hover .award-row-year { color: #fff; }
        .award-row:hover .award-arrow {
          opacity: 1;
          transform: translateX(0);
          color: rgba(255,255,255,0.75);
        }
        .award-row:hover + .award-row { border-top: none; }

        @media (max-width: 640px) {
          .awards-heading { margin-bottom: 28px; }
          .award-row { padding: 16px 12px; }
        }
      `}</style>
    </section>
  );
}
