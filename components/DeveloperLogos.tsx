'use client';

import Image from 'next/image';

const logos = [
  { src: '/images/logos/sobha-logo.svg',            alt: 'Sobha Realty',       h: 34 },
  { src: '/images/logos/binghatti-logo.svg',         alt: 'Binghatti',          h: 30 },
  { src: '/images/logos/damac-logo.png',             alt: 'DAMAC',              h: 34 },
  { src: '/images/logos/danube-logo.png',            alt: 'Danube Properties',  h: 36 },
  { src: '/images/logos/omniyat-logo.svg',           alt: 'Omniyat',            h: 28 },
  { src: '/images/logos/wasl-logo.webp',             alt: 'Wasl',               h: 32 },
  { src: '/images/logos/atp-logo.webp',              alt: 'ATP',                h: 38 },
  { src: '/images/logos/developer-extra-logo.png',   alt: 'Developer',          h: 34 },
];

/* Duplicate for seamless infinite loop */
const track = [...logos, ...logos];

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
      </div>

      {/* ── Marquee strip — full-width, no container clipping ── */}
      <div className="marquee-outer">
        <div className="marquee-track">
          {track.map((logo, i) => (
            <div key={i} className="marquee-item">
              <Image
                src={logo.src}
                alt={logo.alt}
                height={logo.h}
                width={160}
                style={{ height: logo.h, width: 'auto', maxWidth: 160, objectFit: 'contain' }}
                unoptimized={logo.src.endsWith('.svg')}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-outer {
          overflow: hidden;
          padding: 12px 0 4px;
          /* mask fades at edges */
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 72px;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }

        .marquee-outer:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: grayscale(1);
          opacity: 0.55;
          transition: filter 0.3s ease, opacity 0.3s ease;
          cursor: default;
        }

        .marquee-item:hover {
          filter: grayscale(0);
          opacity: 1;
        }

        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @media (max-width: 640px) {
          .marquee-track { gap: 48px; animation-duration: 20s; }
        }
      `}</style>
    </section>
  );
}
