'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

/* ── Slide data ── */
const slides = [
  {
    image:  '/images/hero/hero-1.webp',
    badge:  'New Launch',
    title:  'Binghatti Skyflame\nIn Majan',
    sub:    'Skyflame emerges as a striking new residential landmark in the heart of Majan.',
    cta:    'View Details',
  },
  {
    image:  '/images/hero/hero-2.jpg',
    badge:  'Off-Plan',
    title:  'Invest in Tomorrow\'s\nPrime Locations',
    sub:    'Strategic off-plan opportunities with world-class developers — securing your future in the region\'s most dynamic real estate market.',
    cta:    'Explore Projects',
  },
  {
    image:  '/images/hero/hero-3.jpg',
    badge:  'Premium Listing',
    title:  'Unparalleled Views,\nTimeless Design',
    sub:    'Architecturally distinguished homes that set new standards for luxury. Your ideal address, curated by Macins Luxe.',
    cta:    'View Details',
  },
  {
    image:  '/images/hero/hero-4.jpg',
    badge:  'Exclusive',
    title:  'Where Lifestyle Meets\nLegacy',
    sub:    'Iconic residences that transcend the ordinary — at the intersection of prestige, comfort, and outstanding investment value.',
    cta:    'Explore Now',
  },
];

const AUTO_INTERVAL = 6000;
/* Search bar height — glass bar sits on the image */
const SEARCH_H = 96;

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const btnRef   = useRef<HTMLAnchorElement>(null);

  /* ── GSAP timeline — fires on every slide change ── */
  const animateIn = useCallback(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .fromTo(badgeRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo(titleRef.current, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.3')
      .fromTo(subRef.current,   { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.8')
      .fromTo(btnRef.current,   { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.5');
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(a => (a + 1) % slides.length), AUTO_INTERVAL);
  }, []);

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    resetTimer();
  }, [resetTimer]);

  const goPrev = useCallback(() => goTo((active - 1 + slides.length) % slides.length), [active, goTo]);
  const goNext = useCallback(() => goTo((active + 1) % slides.length), [active, goTo]);

  /* start auto-advance */
  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  /* animate on slide change */
  useEffect(() => { animateIn(); }, [active, animateIn]);

  const slide = slides[active];

  return (
    <section
      aria-label="Hero slider"
      style={{
        position: 'relative',
        /* Fills exactly the remaining viewport height below the 72px nav */
        height: 'calc(100vh - 72px)',
        minHeight: 560,
        overflow: 'hidden',
      }}
    >
      {/* ── Slide images ── */}
      {slides.map((s, i) => (
        <div
          key={s.image}
          aria-hidden={i !== active}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === active ? 1 : 0,
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)',
            zIndex: i === active ? 1 : 0,
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

      {/* ── Subtle vignette — bottom dark for search bar legibility + left-side text shadow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: [
            /* left vignette: text legibility only, no blue tint */
            'linear-gradient(to right, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 40%, transparent 65%)',
            /* bottom vignette: glass bar + dots sit on dark gradient */
            'linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.20) 28%, transparent 55%)',
          ].join(', '),
        }}
      />

      {/* ── Hero content — left-aligned, vertically centred above search bar ── */}
      <div
        className="hero-content-wrap"
        style={{
          position: 'absolute',
          /* Start content roughly 18% from top, give space for the search bar at bottom */
          top: '50%',
          transform: 'translateY(-60%)',
          left: 0,
          zIndex: 3,
          paddingInline: 'var(--gutter-lg)',
          maxWidth: 620,
        }}
      >
        {/* Badge */}
        <span
          ref={badgeRef}
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.60)',
            borderRadius: 'var(--radius-pill)',
            padding: '5px 14px',
            marginBottom: 18,
          }}
        >
          {slide.badge}
        </span>

        {/* Headline — GSAP target, 1.2 s slide-up + fade */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(2rem, 3.75vw, 3.25rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: 16,
            whiteSpace: 'pre-line',
          }}
        >
          {slide.title}
        </h1>

        {/* Subtext */}
        <p
          ref={subRef}
          style={{
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 460,
            marginBottom: 32,
          }}
        >
          {slide.sub}
        </p>

        {/* Outlined white CTA */}
        <a
          ref={btnRef}
          href="#"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font)',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.85)',
            borderRadius: 'var(--radius-btn)',
            padding: '12px 28px',
            transition: 'background var(--transition), color var(--transition), border-color var(--transition)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#fff';
            el.style.color = 'var(--heading)';
            el.style.borderColor = '#fff';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'transparent';
            el.style.color = '#fff';
            el.style.borderColor = 'rgba(255,255,255,0.85)';
          }}
        >
          {slide.cta}
        </a>
      </div>

      {/* ── Prev arrow ── */}
      <button
        aria-label="Previous slide"
        onClick={goPrev}
        style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.30)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background var(--transition)',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
      >
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true">
          <path d="M8 1L1 8l7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Next arrow ── */}
      <button
        aria-label="Next slide"
        onClick={goNext}
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.30)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background var(--transition)',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
      >
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true">
          <path d="M1 1l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Slide dots ── */}
      <div
        style={{
          position: 'absolute',
          bottom: SEARCH_H + 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width:        i === active ? 24 : 8,
              height:       8,
              borderRadius: 'var(--radius-pill)',
              background:   i === active ? '#fff' : 'rgba(255,255,255,0.40)',
              border:       'none',
              cursor:       'pointer',
              padding:      0,
              transition:   'width var(--transition), background var(--transition)',
            }}
          />
        ))}
      </div>

      {/* ── Search bar — glassmorphic, floats on the image ── */}
      <div
        className="hero-search-wrap"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          padding: '0 var(--gutter-lg) 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '0.01em',
        }}>
          Find Your Dream Off-Plan Property
        </p>

        {/* Glass row */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.20)',
          borderRadius: 'var(--radius-btn)',
          overflow: 'hidden',
          height: 50,
        }}>
          {/* Search icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4"/>
              <path d="M11 11l3 3" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search off-plan"
            style={{
              flex: 1,
              fontFamily: 'var(--font)',
              fontSize: '0.9375rem',
              color: '#fff',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '0 16px',
            }}
          />

          <button
            style={{
              fontFamily: 'var(--font)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#fff',
              background: 'var(--navy)',
              border: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.15)',
              padding: '0 32px',
              cursor: 'pointer',
              transition: 'background var(--transition)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-dark)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}
          >
            Search
          </button>
        </div>
      </div>
      <style jsx>{`
        input::placeholder { color: rgba(255,255,255,0.55); }
        @media (max-width: 640px) {
          .hero-content-wrap {
            padding-inline: var(--gutter) !important;
            max-width: 100% !important;
          }
          .hero-content-wrap h1 {
            font-size: clamp(1.6rem, 7vw, 2.5rem) !important;
          }
          .hero-search-wrap {
            padding-inline: var(--gutter) !important;
            padding-bottom: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
