'use client';

import { useEffect, useRef, useState } from 'react';

const YT_ID = 'I8T2asYxfss';

export default function CEOVideoSection() {
  const [playing, setPlaying] = useState(false);
  const textRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  /* Scroll reveal */
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
                  <div style={{
                    width: 18,
                    height: 2,
                    background: '#ccc',
                    borderRadius: 1,
                    marginTop: 10,
                    flexShrink: 0,
                  }} />
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--body)', margin: 0 }}>
                    <strong style={{ color: 'var(--heading)', fontWeight: 600 }}>{item.label}</strong>
                    {' — '}{item.desc}
                  </p>
                </li>
              ))}
            </ul>

            {/* YouTube button */}
            <a
              href="https://youtu.be/I8T2asYxfss?si=Zmhl-S0kVF3OI7JB"
              target="_blank"
              rel="noopener noreferrer"
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
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                <rect width="20" height="14" rx="3" fill="#FF0000"/>
                <path d="M8 4.5l5 2.5-5 2.5V4.5z" fill="#fff"/>
              </svg>
              Watch on YouTube
            </a>
          </div>

          {/* ── Right: YouTube embed ── */}
          <div ref={videoRef} className="ceo-reveal ceo-reveal--right">
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '16/9',
              background: '#000',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              position: 'relative',
              cursor: playing ? 'default' : 'pointer',
            }}>
              {playing ? (
                <iframe
                  src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0`}
                  title="From the CEO's Desk"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              ) : (
                <>
                  {/* High-res thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`}
                    alt="CEO video thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Subtle dark gradient */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                  }} />
                  {/* Play button */}
                  <button
                    onClick={() => setPlaying(true)}
                    aria-label="Play video"
                    className="ceo-play-btn"
                    style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 68, height: 68,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.95)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                      transition: 'transform 0.2s ease, background 0.2s ease',
                    }}
                  >
                    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden="true">
                      <path d="M2 2l18 10L2 22V2z" fill="#111" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
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

        .ceo-play-btn:hover {
          transform: translate(-50%, -50%) scale(1.1) !important;
          background: #fff !important;
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
