'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const videos = [
  { thumb: '/images/properties/7c21bee256ef0219ac3bb7297ba9b8f26edb599f1f48d4ab5e0f6eb71cd56ee0.avif', label: 'AED 35,000,000' },
  { thumb: '/images/properties/0363bcd81373d842e3736d5901a18e1cc8d1ca44aa7575ff44201a8f2f086424.avif', label: 'AED 12,500,000' },
  { thumb: '/images/properties/3(1)_1771865424.avif', label: 'AED 8,750,000' },
];

export default function CEOVideoSection() {
  const [active, setActive] = useState(0);
  const textRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [textRef.current, videoRef.current].filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('ceo-revealed'); observer.unobserve(e.target); } }),
      { threshold: 0.15 },
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="ceo-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}>

          {/* ── Left: text ── */}
          <div ref={textRef} className="ceo-reveal ceo-reveal--left">
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(1.375rem, 2vw, 1.875rem)',
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-0.015em',
              color: 'var(--heading)',
              marginBottom: 20,
            }}>
              From the CEO&rsquo;s Desk to Your Screen
            </h2>

            <p style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--body)',
              marginBottom: 28,
            }}>
              Step inside our world of luxury living. Explore exclusive property
              showcases, captivating virtual tours, and insightful expert guidance—all
              curated to bring you closer to the lifestyle you deserve.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 36 }}>
              {[
                { label: 'Property Tours',     desc: 'Walk through some of the most stunning residences.' },
                { label: 'Lifestyle Insights', desc: 'Discover what makes each community truly unique.' },
                { label: 'Expert Guidance',    desc: 'Get tips, advice, and market updates directly from our team.' },
              ].map(item => (
                <li
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {/* Accent dash */}
                  <div style={{
                    width: 18,
                    height: 2,
                    background: 'var(--navy)',
                    borderRadius: 1,
                    marginTop: 10,
                    flexShrink: 0,
                  }} />
                  {/* Label + desc in one block so wrapping is natural */}
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--body)', margin: 0 }}>
                    <strong style={{ color: 'var(--heading)', fontWeight: 600 }}>{item.label}</strong>
                    {' — '}{item.desc}
                  </p>
                </li>
              ))}
            </ul>

            {/* YouTube button */}
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--heading)',
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-btn)',
                padding: '10px 20px',
                transition: 'border-color var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--heading)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {/* YouTube icon */}
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                <rect width="20" height="14" rx="3" fill="#FF0000"/>
                <path d="M8 4.5l5 2.5-5 2.5V4.5z" fill="#fff"/>
              </svg>
              Watch on YouTube
            </a>
          </div>

          {/* ── Right: video carousel ── */}
          <div ref={videoRef} className="ceo-reveal ceo-reveal--right">
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '16/9',
              background: 'var(--heading)',
            }}>
              <Image
                src={videos[active].thumb}
                alt="Video thumbnail"
                fill
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
              {/* Dark overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(10,18,40,0.45)',
              }} />
              {/* Price label */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                fontFamily: 'var(--font)',
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.01em',
              }}>
                {videos[active].label}
              </div>
              {/* Play button */}
              <button
                aria-label="Play video"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.92)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background var(--transition), transform var(--transition)',
                }}
                onMouseEnter={e => { (e.currentTarget.style.background = '#fff'); (e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.08)'); }}
                onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.92)'); (e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)'); }}
              >
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
                  <path d="M2 2l14 8-14 8V2z" fill="var(--navy)" />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Video ${i + 1}`}
                  style={{
                    width: i === active ? 24 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-pill)',
                    background: i === active ? 'var(--heading)' : 'var(--border)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'width var(--transition), background var(--transition)',
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        /* ── Scroll reveal ── */
        .ceo-reveal {
          opacity: 0;
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .ceo-reveal--left  { transform: translateX(-32px); }
        .ceo-reveal--right { transform: translateX(32px); transition-delay: 0.15s; }
        .ceo-reveal.ceo-revealed {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .ceo-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .ceo-reveal--left,
          .ceo-reveal--right { transform: translateY(24px); }
        }
      `}</style>
    </section>
  );
}
