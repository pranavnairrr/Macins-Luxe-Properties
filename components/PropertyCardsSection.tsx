'use client';

import Image from 'next/image';

export interface PropertyCard {
  image:       string;
  badge:       string;        // "Handover: Q4 2027"
  developerLogo?: string;     // path to logo img, or text fallback
  developerLogoText?: string;
  title:       string;
  developer:   string;
  priceLabel?: string;
  price:       string;
  location:    string;
  beds:        string;        // "1, 2, Studio"
}

interface Props {
  title:   string;
  ctaText: string;
  cards:   PropertyCard[];
  grey?:   boolean;
}

/* Bed icon */
function BedIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="5.5" width="14" height="6" rx="1" stroke="var(--muted)" strokeWidth="1.1"/>
      <rect x="2" y="2" width="5" height="4" rx="0.8" stroke="var(--muted)" strokeWidth="1.1"/>
      <rect x="8" y="2" width="5" height="4" rx="0.8" stroke="var(--muted)" strokeWidth="1.1"/>
      <line x1="0.5" y1="8" x2="14.5" y2="8" stroke="var(--muted)" strokeWidth="1.1"/>
    </svg>
  );
}

/* Location pin icon */
function PinIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M5.5 0C2.74 0 0.5 2.24 0.5 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" fill="var(--muted)"/>
      <circle cx="5.5" cy="5" r="1.8" fill="var(--white)"/>
    </svg>
  );
}

export default function PropertyCardsSection({ title, ctaText, cards, grey }: Props) {
  return (
    <section className={`section${grey ? ' section--grey' : ''}`}>
      <div className="container">

        {/* ── Section header ── */}
        <div className="section-header">
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--heading)',
          }}>
            {title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              {ctaText}
            </a>
            {/* Prev / Next */}
            {(['prev','next'] as const).map(dir => (
              <button
                key={dir}
                aria-label={dir === 'prev' ? 'Previous' : 'Next'}
                style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  background: 'var(--white)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition), background var(--transition)',
                }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--heading)'); (e.currentTarget.style.background = 'var(--white-section)'); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border)');  (e.currentTarget.style.background = 'var(--white)'); }}
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                  <path d={dir === 'prev' ? 'M6 1L1 6l5 5' : 'M1 1l5 5-5 5'} stroke="var(--heading)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--gap)',
        }}>
          {cards.map(card => (
            <article
              key={card.title}
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
                transition: 'box-shadow var(--transition-slow), transform var(--transition-slow)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
                />
                {/* Handover badge */}
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'rgba(0,0,0,0.48)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 4,
                  backdropFilter: 'blur(4px)',
                }}>
                  {card.badge}
                </span>
                {/* Developer logo or text badge */}
                {card.developerLogo ? (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: '#fff',
                    padding: '4px 10px',
                    borderRadius: 4,
                    maxHeight: 28,
                    display: 'flex', alignItems: 'center',
                  }}>
                    <Image src={card.developerLogo} alt={card.developer} width={60} height={20} style={{ objectFit: 'contain', height: 18, width: 'auto' }} />
                  </div>
                ) : card.developerLogoText ? (
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    background: '#fff',
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: 'var(--heading)',
                  }}>
                    {card.developerLogoText}
                  </span>
                ) : null}
              </div>

              {/* Body */}
              <div style={{ padding: '20px 20px 0' }}>
                <h3 style={{
                  fontFamily: 'var(--font)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                  color: 'var(--heading)',
                  marginBottom: 4,
                }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 12 }}>
                  by {card.developer}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontWeight: 400 }}>
                      {card.priceLabel ?? 'Starting Price'}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)' }}>
                      {card.price}
                    </div>
                  </div>
                </div>
                {/* Meta row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  paddingBottom: 16,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 12,
                  fontSize: '0.8125rem',
                  color: 'var(--muted)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <BedIcon /> {card.beds}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <PinIcon /> {card.location}
                  </span>
                </div>
              </div>

              {/* Enquire Now CTA */}
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  background: 'var(--cta-bg)',
                  color: 'var(--cta-text)',
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: 'none',
                  borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'background var(--transition)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1E2D3D')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--cta-bg)')}
              >
                Enquire Now
              </button>
            </article>
          ))}
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
