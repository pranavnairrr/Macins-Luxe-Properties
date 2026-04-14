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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}>

          {/* ── Left: photo grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '240px 200px',
            gap: 12,
          }}>
            {/* Large top-left image spans 2 columns */}
            <div style={{
              gridColumn: '1 / 3',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Image
                src="/images/hero/hero-2.jpg"
                alt="Office space"
                fill
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Bottom left */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Image
                src="/images/hero/hero-3.jpg"
                alt="Team meeting"
                fill
                sizes="25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Bottom right */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Image
                src="/images/hero/hero-4.jpg"
                alt="Luxury property"
                fill
                sizes="25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* ── Right: text ── */}
          <div>
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
                <div key={p.num}>
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
          div[style*="grid-template-columns: 1fr 1fr"][style*="gap: 64"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
