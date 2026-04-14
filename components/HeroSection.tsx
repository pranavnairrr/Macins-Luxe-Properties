'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

/* ══════════════════════════════════════════════════════════════════
   LuxeDrift  —  Cinematic Ken Burns Hero Slider
   ──────────────────────────────────────────────────────────────────
   Named effect: LuxeDrift
   · 4 Ken Burns variants cycle per slide (zoom-in, pan-right,
     pan-left, zoom-out) — driven by GSAP on the slide wrapper
   · 1.4 s cross-dissolve between slides (CSS opacity transition)
   · Animated thin progress bar replaces dot pagination
   · Slide counter  01 / 21  bottom-right
   · GSAP staggered text reveal on every slide change
   ══════════════════════════════════════════════════════════════════ */

/* ── Text content — 7 variants cycling across all slides ── */
const TEXTS = [
  {
    badge: 'New Launch',
    title: 'Binghatti Skyflame\nin Majan',
    sub:   'Skyflame emerges as a striking new residential landmark in the heart of Majan.',
    cta:   'View Details',
  },
  {
    badge: 'Off-Plan',
    title: "Invest in Tomorrow's\nPrime Locations",
    sub:   "Strategic off-plan opportunities with world-class developers — securing your future in the region's most dynamic real estate market.",
    cta:   'Explore Projects',
  },
  {
    badge: 'Premium Listing',
    title: 'Unparalleled Views,\nTimeless Design',
    sub:   'Architecturally distinguished homes that set new standards for luxury living.',
    cta:   'View Details',
  },
  {
    badge: 'Exclusive',
    title: 'Where Lifestyle\nMeets Legacy',
    sub:   'Iconic residences at the intersection of prestige, comfort, and outstanding investment value.',
    cta:   'Explore Now',
  },
  {
    badge: 'Luxury Collection',
    title: 'The Finest Addresses\nin Dubai',
    sub:   'Curated properties at the intersection of prestige and performance. Discover truly exceptional living.',
    cta:   'View Collection',
  },
  {
    badge: 'New Development',
    title: 'Crafted for Those\nWho Demand More',
    sub:   "Developments that redefine luxury living in Dubai's most coveted residential districts.",
    cta:   'View Details',
  },
  {
    badge: 'Waterfront Living',
    title: "Life at the\nWater's Edge",
    sub:   'Premium waterfront properties with breathtaking skyline views and world-class amenities.',
    cta:   'Explore Now',
  },
];

/* ── All property + hero images ── */
const IMAGES = [
  '/images/properties/stunning-real-estate-of-a-modern-home-striking-architectural-details-free-photo.jpg',
  '/images/properties/de1f5af128319b892e1da1d82d85deefd2bf8e02271170047e2743971120aaeb.avif',
  '/images/properties/809786214-800x600.jpeg',
  '/images/properties/gulfnews_2025-12-12_kjm4wss9_Bugatti-Residences-by-Binghatti.avif',
  '/images/properties/Binghatti-Hills-at-Dubai-HIlls.jpeg',
  '/images/properties/binghatti-luxuria-hero-banner.avif',
  '/images/properties/Binghatti-Hillside-at-Dubai-Science-Park.webp',
  '/images/properties/Binghatti-Falre-JVT-Towers.jpg',
  '/images/properties/binghatti-hillcrest-hero-banner.avif',
  '/images/properties/sc2XBvXuMy7kd2utsgdQJGRdJ95XNwYBnPlqEL9P.png',
  '/images/properties/DhwUVQqZWV.webp',
  '/images/properties/Grove.avif',
  '/images/properties/7c21bee256ef0219ac3bb7297ba9b8f26edb599f1f48d4ab5e0f6eb71cd56ee0.avif',
  '/images/properties/0363bcd81373d842e3736d5901a18e1cc8d1ca44aa7575ff44201a8f2f086424.avif',
  '/images/properties/3(1)_1771865424.avif',
  '/images/properties/616795878.jpg',
  '/images/properties/Binghatti_Flare_in_JVT_Dubai_by_Binghatti_Developers_f712d33e54.webp',
  '/images/hero/hero-1.webp',
  '/images/hero/hero-2.jpg',
  '/images/hero/hero-3.jpg',
  '/images/hero/hero-4.jpg',
];

/* Each slide = image + cycling text content */
const slides = IMAGES.map((image, i) => ({ image, ...TEXTS[i % TEXTS.length] }));

/* Ken Burns GSAP end-states — 4 directional variants */
const KB_VARIANTS = [
  { scale: 1.10, x: '-1.5%', y: '-1%'  },   // zoom-in drift up-left
  { scale: 1.09, x:  '2%',   y:  '0.5%' },  // pan right
  { scale: 1.09, x: '-2%',   y: '-0.5%' },  // pan left
  { scale: 1.07, x:  '1%',   y:  '1%'  },   // subtle zoom drift down-right
];

const AUTO_MS  = 5000;   // ms per slide
const FADE_MS  = 1400;   // cross-dissolve duration
const SEARCH_H = 96;     // px — glass search bar height at bottom

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);

  /* GSAP refs — text elements */
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const btnRef   = useRef<HTMLAnchorElement>(null);

  /* ── GSAP: text stagger reveal ── */
  const animateText = useCallback(() => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
      .fromTo(titleRef.current, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1  }, '-=0.35')
      .fromTo(subRef.current,   { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72 }, '-=0.75')
      .fromTo(btnRef.current,   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, '-=0.5');
  }, []);

  /* ── GSAP: Ken Burns drift on active slide ── */
  const animateKenBurns = useCallback((idx: number) => {
    const el = slideRefs.current[idx];
    if (!el) return;
    const kb = KB_VARIANTS[idx % KB_VARIANTS.length];
    gsap.killTweensOf(el);
    gsap.fromTo(el,
      { scale: 1.0, x: 0, y: 0 },
      { ...kb, duration: (AUTO_MS + FADE_MS) / 1000, ease: 'power1.inOut' },
    );
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActive(a => (a + 1) % slides.length),
      AUTO_MS,
    );
  }, []);

  const goTo   = useCallback((i: number) => { setActive(i); resetTimer(); }, [resetTimer]);
  const goPrev = useCallback(() => goTo((active - 1 + slides.length) % slides.length), [active, goTo]);
  const goNext = useCallback(() => goTo((active + 1) % slides.length), [active, goTo]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  useEffect(() => {
    animateText();
    animateKenBurns(active);
  }, [active, animateText, animateKenBurns]);

  const slide = slides[active];

  return (
    <section
      aria-label="Hero slider — LuxeDrift"
      style={{
        position: 'relative',
        height: 'calc(100vh - 72px)',
        minHeight: 560,
        overflow: 'hidden',
      }}
    >
      {/* ── Slide layers ── */}
      {slides.map((s, i) => (
        <div
          key={s.image}
          ref={el => { slideRefs.current[i] = el; }}
          aria-hidden={i !== active}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === active ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1)`,
            zIndex: i === active ? 1 : 0,
            willChange: 'transform, opacity',
          }}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      ))}

      {/* ── Cinematic vignette — deep left + bottom ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: [
            'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 68%)',
            'linear-gradient(to top,   rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.22) 34%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* ── Hero copy ── */}
      <div
        className="hero-content-wrap"
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-60%)',
          left: 0,
          zIndex: 3,
          paddingInline: 'var(--gutter-lg)',
          maxWidth: 660,
        }}
      >
        <span ref={badgeRef} className="hero-badge">{slide.badge}</span>

        <h1 ref={titleRef} className="hero-title">{slide.title}</h1>

        <p ref={subRef} className="hero-sub">{slide.sub}</p>

        <a ref={btnRef} href="#" className="hero-cta">{slide.cta}</a>
      </div>

      {/* ── Slide counter  01 / 21 ── */}
      <div
        style={{
          position: 'absolute',
          bottom: SEARCH_H + 28,
          right: 'var(--gutter-lg)',
          zIndex: 4,
          fontFamily: 'var(--font)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.50)',
        }}
      >
        {String(active + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(slides.length).padStart(2, '0')}
      </div>

      {/* ── Prev arrow ── */}
      <button
        aria-label="Previous slide"
        onClick={goPrev}
        className="hero-arrow hero-arrow--prev"
      >
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true">
          <path d="M8 1L1 8l7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Next arrow ── */}
      <button
        aria-label="Next slide"
        onClick={goNext}
        className="hero-arrow hero-arrow--next"
      >
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true">
          <path d="M1 1l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Glass search bar ── */}
      <div
        className="hero-search-wrap"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          zIndex: 4,
          padding: '0 var(--gutter-lg) 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <p style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', letterSpacing: '0.01em' }}>
          Find Your Dream Off-Plan Property
        </p>
        <div style={{
          display: 'flex', alignItems: 'stretch',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.20)',
          borderRadius: 'var(--radius-btn)',
          overflow: 'hidden', height: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 16, flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4"/>
              <path d="M11 11l3 3" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search off-plan"
            style={{ flex: 1, fontFamily: 'var(--font)', fontSize: '0.9375rem', color: '#fff', background: 'transparent', border: 'none', outline: 'none', padding: '0 16px' }}
          />
          <button
            style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: 'var(--navy)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.15)', padding: '0 32px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-dark)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}
          >
            Search
          </button>
        </div>
      </div>

      <style jsx>{`
        input::placeholder { color: rgba(255,255,255,0.50); }

        /* ── Hero text ── */
        .hero-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.55);
          border-radius: var(--radius-pill);
          padding: 5px 14px;
          margin-bottom: 20px;
          backdrop-filter: blur(6px);
        }
        .hero-title {
          font-family: var(--font);
          font-size: clamp(2.1rem, 3.8vw, 3.5rem);
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: -0.025em;
          color: #fff;
          margin-bottom: 18px;
          white-space: pre-line;
          text-shadow: 0 2px 24px rgba(0,0,0,0.18);
        }
        .hero-sub {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.72;
          color: rgba(255,255,255,0.82);
          max-width: 480px;
          margin-bottom: 36px;
        }
        .hero-cta {
          display: inline-block;
          font-family: var(--font);
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.80);
          border-radius: var(--radius-btn);
          padding: 13px 32px;
          transition: background 0.28s ease, color 0.28s ease, border-color 0.28s ease, transform 0.22s ease, box-shadow 0.28s ease;
        }
        .hero-cta:hover {
          background: #fff;
          color: var(--heading);
          border-color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }

        /* ── Nav arrows ── */
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.22);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease;
        }
        .hero-arrow--prev { left: 20px; }
        .hero-arrow--next { right: 20px; }
        .hero-arrow:hover {
          background: rgba(255,255,255,0.26);
          border-color: rgba(255,255,255,0.50);
          transform: translateY(-50%) scale(1.10);
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .hero-content-wrap { padding-inline: 16px !important; max-width: 100% !important; }
          .hero-title { font-size: clamp(1.45rem, 6.5vw, 2.2rem) !important; white-space: normal !important; }
          .hero-sub { font-size: 0.8125rem !important; margin-bottom: 18px !important; line-height: 1.6 !important; }
          .hero-search-wrap { padding-inline: 16px !important; padding-bottom: 16px !important; }
          .hero-arrow { width: 28px !important; height: 28px !important; }
        }
      `}</style>
    </section>
  );
}
