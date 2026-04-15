'use client';

import Image from 'next/image';

const points = [
  {
    num: '1.',
    title: 'Market Expertise',
    desc: 'Macins Luxe has in-depth knowledge of the Dubai real estate market, helping clients find ideal properties perfectly tailored to their needs.',
  },
  {
    num: '2.',
    title: 'Comprehensive Services',
    desc: 'From property buying and selling to leasing and property management, Macins Luxe offers a full suite of services.',
  },
  {
    num: '3.',
    title: 'Client-Centric Approach',
    desc: 'Known for its transparent and customer-focused service, Macins aims for long-term relationships with clients, ensuring a smooth experience.',
  },
];

export default function WhyChooseSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="why-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}>

          {/* ── Left: photo grid ── */}
          <div className="why-photos" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '240px 200px',
            gap: 12,
          }}>
            {/* Large top-left image spans 2 columns */}
            <div className="why-photo-main" style={{
              gridColumn: '1 / 3',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Image
                src="/images/properties/sc2XBvXuMy7kd2utsgdQJGRdJ95XNwYBnPlqEL9P.png"
                alt="Luxury property"
                fill
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Bottom left */}
            <div className="why-photo-sm" style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Image
                src="/images/properties/DhwUVQqZWV.webp"
                alt="Luxury interior"
                fill
                sizes="25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Bottom right */}
            <div className="why-photo-sm" style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Image
                src="/images/properties/Grove.avif"
                alt="Premium development"
                fill
                sizes="25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* ── Right: text ── */}
          <div className="why-text">
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(1.375rem, 2vw, 1.875rem)',
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-0.015em',
              color: 'var(--heading)',
              marginBottom: 16,
            }}>
              Why Choose Macins Luxe?
            </h2>
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--body)',
              marginBottom: 36,
            }}>
              With years of experience and deep market insights, we help you find
              properties perfectly aligned with your lifestyle and investment goals.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {points.map(p => (
                <div
                  key={p.num}
                  className="why-point"
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid transparent',
                    transition: 'border-color 0.25s ease, background 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--border)';
                    el.style.background = 'var(--white-section)';
                    el.style.transform = 'translateX(6px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'transparent';
                    el.style.background = 'transparent';
                    el.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
                    color: 'var(--heading)',
                    marginBottom: 8,
                  }}>
                    {p.num} {p.title}
                  </div>
                  <p style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
                    color: 'var(--body)',
                  }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .why-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 32px !important;
          }
          .why-text { order: 1; }
          .why-photos {
            order: 2;
            grid-template-columns: 1fr !important;
            grid-template-rows: 240px 180px !important;
          }
          .why-photo-main {
            grid-column: 1 !important;
            grid-row: 1 !important;
          }
          .why-photo-sm:first-of-type {
            grid-column: 1 !important;
            grid-row: 2 !important;
          }
          .why-photo-sm:last-of-type { display: none !important; }
        }
      `}</style>
    </section>
  );
}
