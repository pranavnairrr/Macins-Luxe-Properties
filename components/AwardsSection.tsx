'use client';

const awards = [
  { name: 'The Black Onyx Awards',         year: '2025', featured: true },
  { name: 'Emaar Broker Award Q2',          year: '2025' },
  { name: 'Samana Insider Club',            year: '2025' },
  { name: 'Emaar H1 Broker Award',          year: '2025' },
  { name: 'Binghatti Annual Broker Award',  year: '2025' },
  { name: 'Emaar Broker Award Q1',          year: '2025' },
];


export default function AwardsSection() {
  const featured = awards.find(a => a.featured)!;
  const list = awards.filter(a => !a.featured);

  return (
    <section className="section">
      <div className="container">

        <h2 className="awards-heading">
          Our Recognitions &amp; Achievements
        </h2>

        {/* Featured award */}
        <div className="award-featured">
          <span className="award-label">{featured.name}</span>
          <span className="award-label">{featured.year}</span>
        </div>

        {/* Award rows — fill + text reveal on hover */}
        <div className="awards-list">
          {list.map(award => (
            <div key={award.name} className="award-row">
              {/* Arrow that slides in on hover */}
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

        /* ── Featured card ── */
        .award-featured {
          background: var(--white-section);
          border-radius: var(--radius-md);
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: background 0.4s cubic-bezier(0.4,0,0.2,1);
          margin-bottom: 4px;
        }
        .award-featured:hover {
          background: var(--heading);
        }
        .award-featured .award-label {
          font-family: var(--font);
          font-size: 1rem;
          font-weight: 600;
          color: var(--heading);
          transition: color 0.4s ease;
          position: relative;
          z-index: 1;
        }
        .award-featured:hover .award-label {
          color: #fff;
        }


        /* ── Award rows list ── */
        .awards-list {
          border-top: 1px solid var(--border);
        }
        .award-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 20px;
          height: 0;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
          border-radius: 0;
          cursor: pointer;
          position: relative;

          /* Reveal animation */
          background: transparent;
          transition:
            height 0.35s cubic-bezier(0.4,0,0.2,1),
            padding 0.35s cubic-bezier(0.4,0,0.2,1),
            background 0.35s ease,
            border-radius 0.35s ease;
        }

        /* All rows visible by default (height auto = always open) */
        .award-row {
          height: auto;
          padding: 20px 20px;
        }

        /* Arrow — hidden by default, slides in on hover */
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

        /* Hover state — dark fill, white text, arrow slides in */
        .award-row:hover {
          background: var(--heading);
          border-radius: var(--radius-sm);
          border-bottom-color: transparent;
        }
        .award-row:hover .award-row-name,
        .award-row:hover .award-row-year {
          color: #fff;
        }
        .award-row:hover .award-arrow {
          opacity: 1;
          transform: translateX(0);
          color: rgba(255,255,255,0.75);
        }
        /* Hide the top border of the row immediately after a hovered row */
        .award-row:hover + .award-row {
          border-top: none;
        }

        @media (max-width: 640px) {
          .award-featured { padding: 28px 20px; }
          .awards-heading { margin-bottom: 28px; }
        }
      `}</style>
    </section>
  );
}
