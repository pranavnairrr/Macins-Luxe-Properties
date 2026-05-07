'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import type { HeroSlide } from '@/utils/site-settings';

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

/* ── Hero images — high-quality set ── */
const IMAGES = [
  '/images/hero/img102.jpg',
  '/images/hero/img106.jpg',
  '/images/hero/img110.jpg',
  '/images/hero/img114.jpg',
  '/images/hero/img121.jpg',
  '/images/hero/img123.jpg',
  '/images/hero/img129.jpg',
  '/images/hero/img137.jpg',
  '/images/hero/img138.jpg',
  '/images/hero/img14.jpg',
  '/images/hero/img143.jpg',
  '/images/hero/img146.jpg',
  '/images/hero/img185.jpg',
  '/images/hero/img20.jpg',
  '/images/hero/img201.jpg',
  '/images/hero/img227.jpg',
  '/images/hero/img302.jpg',
  '/images/hero/img306.jpg',
  '/images/hero/img328.jpg',
  '/images/hero/img333.jpg',
  '/images/hero/img358.jpg',
  '/images/hero/img508.jpg',
  '/images/hero/img512.jpg',
  '/images/hero/img565.jpg',
  '/images/hero/img619.jpg',
  '/images/hero/img64.jpg',
  '/images/hero/img692.jpg',
  '/images/hero/img697.jpg',
  '/images/hero/img708.jpg',
  '/images/hero/img737.jpg',
  '/images/hero/img767.jpg',
  '/images/hero/img79.jpg',
  '/images/hero/img803.jpg',
  '/images/hero/img807.jpg',
  '/images/hero/img862.jpg',
  '/images/hero/img90.jpg',
];

/* Fallback slides — image + cycling text content */
const FALLBACK_SLIDES = IMAGES.map((image, i) => ({ image, cta_href: '#' as string, ...TEXTS[i % TEXTS.length] }));

const RESIDENTIAL_TYPES = [
  'Apartment', 'Townhouse', 'Villa Compound', 'Land', 'Building',
  'Villa', 'Penthouse', 'Hotel Apartment', 'Floor',
];
const COMMERCIAL_TYPES = [
  'Office', 'Shop', 'Warehouse', 'Labour Camp', 'Villa', 'Bulk Unit',
  'Land', 'Floor', 'Building', 'Factory', 'Industrial Land',
  'Mixed Use Land', 'Showroom', 'Other Commercial',
];

/* Ken Burns GSAP end-states — desktop (scale + pan) */
const KB_VARIANTS = [
  { scale: 1.10, x: '-1.5%', y: '-1%'  },   // zoom-in drift up-left
  { scale: 1.09, x:  '2%',   y:  '0.5%' },  // pan right
  { scale: 1.09, x: '-2%',   y: '-0.5%' },  // pan left
  { scale: 1.07, x:  '1%',   y:  '1%'  },   // subtle zoom drift down-right
];


const AUTO_MS  = 5000;   // ms per slide
const FADE_MS  = 1400;   // cross-dissolve duration
const SEARCH_H = 136;    // px — glass search bar height at bottom (tabs + bar)

export default function HeroSection({ slides: propSlides }: { slides?: HeroSlide[] }) {
  const slides = propSlides && propSlides.length > 0
    ? propSlides.map(s => ({ image: s.image_url, badge: s.badge, title: s.title, sub: s.sub, cta: s.cta, cta_href: s.cta_href }))
    : FALLBACK_SLIDES
  const [active, setActive]   = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Search bar state ── */
  const [searchTab, setSearchTab]           = useState<'All' | 'Ready' | 'Off-Plan'>('All');
  const [typeOpen, setTypeOpen]             = useState(false);
  const [areaOpen, setAreaOpen]             = useState(false);
  const [priceOpen, setPriceOpen]           = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Residential' | 'Commercial' | ''>('');
  const [selectedSubtype, setSelectedSubtype]   = useState('');
  const [minArea, setMinArea]               = useState('');
  const [maxArea, setMaxArea]               = useState('');
  const [minPrice, setMinPrice]             = useState('');
  const [maxPrice, setMaxPrice]             = useState('');
  const [searchText, setSearchText]         = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

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

  /* ── GSAP: Ken Burns drift on active slide (desktop only) ── */
  const animateKenBurns = useCallback((idx: number) => {
    /* Skip on mobile — zoom upscales the pixel grid causing visible blur */
    if (typeof window !== 'undefined' && window.innerWidth <= 640) return;
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

  /* ── Track outgoing slide, reset its transform after fade ──
     Fixes mobile flickering caused by:
     1. will-change:transform,opacity on all 21 slides simultaneously (GPU overload)
     2. Stale GSAP transform on slides re-entering the cycle
  ── */
  useEffect(() => {
    const prev = prevActiveRef.current;
    if (prev !== active) {
      setOutgoing(prev);
      prevActiveRef.current = active;

      /* After cross-dissolve finishes, clear the outgoing slide's
         GSAP transform so it starts clean next time it's shown.     */
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        const el = slideRefs.current[prev];
        if (el) {
          gsap.killTweensOf(el);
          gsap.set(el, { scale: 1, x: 0, y: 0 });
        }
        setOutgoing(null);
      }, FADE_MS + 100);
    }
    animateText();
    animateKenBurns(active);

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [active, animateText, animateKenBurns]);

  /* ── Close search dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
        setAreaOpen(false);
        setPriceOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const slide = slides[active];

  return (
    <section
      aria-label="Hero slider — LuxeDrift"
      className="hero-section"
      style={{
        position: 'relative',
        height: '100vh',
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
          className="hero-slide"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === active ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1)`,
            zIndex: i === active ? 1 : 0,
            willChange: (i === active || i === outgoing) ? 'transform, opacity' : 'auto',
          }}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i < 3}
            quality={90}
            sizes="(max-width: 640px) 100vw, 100vw"
            className="hero-img"
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

        <a ref={btnRef} href={slide.cta_href ?? '#'} className="hero-cta">{slide.cta}</a>
      </div>

      {/* ── Slide counter  01 / 21 ── */}
      <div
        className="hero-counter"
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
        ref={searchRef}
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
        {/* Label + status tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', letterSpacing: '0.01em', margin: 0 }}>
            Find Your Dream Property
          </p>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['All', 'Ready', 'Off-Plan'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSearchTab(tab)}
                style={{
                  fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 600,
                  padding: '5px 14px', borderRadius: 'var(--radius-pill)',
                  border: searchTab === tab ? '1px solid rgba(213,186,140,0.80)' : '1px solid rgba(255,255,255,0.25)',
                  background: searchTab === tab ? 'rgba(213,186,140,0.20)' : 'transparent',
                  color: searchTab === tab ? '#D5BA8C' : 'rgba(255,255,255,0.70)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >{tab}</button>
            ))}
          </div>
        </div>

        {/* Main search row */}
        <div style={{
          display: 'flex', alignItems: 'stretch',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.20)',
          borderRadius: 'var(--radius-btn)',
          height: 50, position: 'relative',
        }}>

          {/* ── Property Type dropdown ── */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => { setTypeOpen(o => !o); setAreaOpen(false); setPriceOpen(false); }}
              style={{
                height: '100%', display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 16px', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 500,
                color: selectedSubtype ? '#fff' : 'rgba(255,255,255,0.65)',
                background: 'transparent', border: 'none',
                borderRight: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {selectedSubtype ? `${selectedCategory}: ${selectedSubtype}` : selectedCategory || 'Property Type'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.65 }}>
                <path d="M2 4l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {typeOpen && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, width: 460,
                background: 'rgba(12,20,46,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(213,186,140,0.20)', borderRadius: 10,
                boxShadow: '0 -12px 40px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 20,
              }}>
                <div style={{ padding: '10px 16px 8px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.55)', fontFamily: 'var(--font)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  Property Type
                </div>
                <div style={{ display: 'flex' }}>
                  {/* Residential */}
                  <div style={{ flex: 1, padding: '10px 0', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ padding: '2px 16px 8px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.70)', fontFamily: 'var(--font)' }}>Residential</div>
                    {RESIDENTIAL_TYPES.map(type => (
                      <button key={type} onClick={() => { setSelectedCategory('Residential'); setSelectedSubtype(type); setTypeOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 16px', fontFamily: 'var(--font)', fontSize: '0.875rem', color: (selectedSubtype === type && selectedCategory === 'Residential') ? '#D5BA8C' : 'rgba(255,255,255,0.82)', background: (selectedSubtype === type && selectedCategory === 'Residential') ? 'rgba(213,186,140,0.10)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s ease, color 0.15s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(213,186,140,0.08)'; (e.currentTarget as HTMLElement).style.color = '#D5BA8C'; }}
                        onMouseLeave={e => { const a = selectedSubtype === type && selectedCategory === 'Residential'; (e.currentTarget as HTMLElement).style.background = a ? 'rgba(213,186,140,0.10)' : 'transparent'; (e.currentTarget as HTMLElement).style.color = a ? '#D5BA8C' : 'rgba(255,255,255,0.82)'; }}
                      >{type}</button>
                    ))}
                  </div>
                  {/* Commercial */}
                  <div style={{ flex: 1, padding: '10px 0' }}>
                    <div style={{ padding: '2px 16px 8px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.70)', fontFamily: 'var(--font)' }}>Commercial</div>
                    {COMMERCIAL_TYPES.map(type => (
                      <button key={type} onClick={() => { setSelectedCategory('Commercial'); setSelectedSubtype(type); setTypeOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 16px', fontFamily: 'var(--font)', fontSize: '0.875rem', color: (selectedSubtype === type && selectedCategory === 'Commercial') ? '#D5BA8C' : 'rgba(255,255,255,0.82)', background: (selectedSubtype === type && selectedCategory === 'Commercial') ? 'rgba(213,186,140,0.10)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s ease, color 0.15s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(213,186,140,0.08)'; (e.currentTarget as HTMLElement).style.color = '#D5BA8C'; }}
                        onMouseLeave={e => { const a = selectedSubtype === type && selectedCategory === 'Commercial'; (e.currentTarget as HTMLElement).style.background = a ? 'rgba(213,186,140,0.10)' : 'transparent'; (e.currentTarget as HTMLElement).style.color = a ? '#D5BA8C' : 'rgba(255,255,255,0.82)'; }}
                      >{type}</button>
                    ))}
                  </div>
                </div>
                {(selectedSubtype) && (
                  <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button onClick={() => { setSelectedCategory(''); setSelectedSubtype(''); setTypeOpen(false); }} style={{ fontFamily: 'var(--font)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.40)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Clear selection</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Area (sq ft) ── */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => { setAreaOpen(o => !o); setTypeOpen(false); setPriceOpen(false); }}
              style={{
                height: '100%', display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 16px', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 500,
                color: (minArea || maxArea) ? '#fff' : 'rgba(255,255,255,0.65)',
                background: 'transparent', border: 'none',
                borderRight: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {(minArea || maxArea) ? `${minArea || '0'} – ${maxArea || '∞'} sqft` : 'Area (sq ft)'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: areaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.65 }}>
                <path d="M2 4l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {areaOpen && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, width: 280, background: 'rgba(12,20,46,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(213,186,140,0.20)', borderRadius: 10, boxShadow: '0 -12px 40px rgba(0,0,0,0.5)', padding: 16, zIndex: 20 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.55)', fontFamily: 'var(--font)', marginBottom: 12 }}>Area (sq ft)</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font)', display: 'block', marginBottom: 6 }}>Minimum</label>
                    <input type="number" placeholder="Min sq ft" value={minArea} onChange={e => setMinArea(e.target.value)} className="hero-range-input" style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font)', fontSize: '0.875rem', color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font)', display: 'block', marginBottom: 6 }}>Maximum</label>
                    <input type="number" placeholder="Max sq ft" value={maxArea} onChange={e => setMaxArea(e.target.value)} className="hero-range-input" style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font)', fontSize: '0.875rem', color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <button onClick={() => setAreaOpen(false)} style={{ marginTop: 12, width: '100%', padding: '8px', fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600, color: '#fff', background: 'var(--navy)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Done</button>
              </div>
            )}
          </div>

          {/* ── Price (AED) ── */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => { setPriceOpen(o => !o); setTypeOpen(false); setAreaOpen(false); }}
              style={{
                height: '100%', display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 16px', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 500,
                color: (minPrice || maxPrice) ? '#fff' : 'rgba(255,255,255,0.65)',
                background: 'transparent', border: 'none',
                borderRight: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {(minPrice || maxPrice) ? `AED ${minPrice || '0'} – ${maxPrice || '∞'}` : 'Price (AED)'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: priceOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.65 }}>
                <path d="M2 4l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {priceOpen && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, width: 280, background: 'rgba(12,20,46,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(213,186,140,0.20)', borderRadius: 10, boxShadow: '0 -12px 40px rgba(0,0,0,0.5)', padding: 16, zIndex: 20 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.55)', fontFamily: 'var(--font)', marginBottom: 12 }}>Price (AED)</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font)', display: 'block', marginBottom: 6 }}>Minimum</label>
                    <input type="number" placeholder="Min AED" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="hero-range-input" style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font)', fontSize: '0.875rem', color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font)', display: 'block', marginBottom: 6 }}>Maximum</label>
                    <input type="number" placeholder="Max AED" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="hero-range-input" style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font)', fontSize: '0.875rem', color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <button onClick={() => setPriceOpen(false)} style={{ marginTop: 12, width: '100%', padding: '8px', fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600, color: '#fff', background: 'var(--navy)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Done</button>
              </div>
            )}
          </div>

          {/* ── Text search ── */}
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4"/>
              <path d="M11 11l3 3" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by location, developer..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ flex: 1, fontFamily: 'var(--font)', fontSize: '0.9375rem', color: '#fff', background: 'transparent', border: 'none', outline: 'none', padding: '0 12px' }}
          />

          {/* ── Search button ── */}
          <button
            style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: 'var(--navy)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.15)', padding: '0 28px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.2s ease', borderRadius: '0 var(--radius-btn) var(--radius-btn) 0' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-dark, #0f1e3d)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}
          >
            Search
          </button>
        </div>
      </div>

      <style jsx>{`
        input::placeholder { color: rgba(255,255,255,0.50); }
        .hero-range-input::placeholder { color: rgba(255,255,255,0.30) !important; }
        .hero-range-input::-webkit-outer-spin-button,
        .hero-range-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .hero-range-input { -moz-appearance: textfield; }

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

        /* ── Nav arrows — sit above the search bar in the clear bottom space ── */
        .hero-arrow {
          position: absolute;
          bottom: 152px;   /* above search bar (136px) + gap */
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
        .hero-arrow--prev { right: 72px; }
        .hero-arrow--next { right: 20px; }
        .hero-arrow:hover {
          background: rgba(255,255,255,0.26);
          border-color: rgba(255,255,255,0.50);
          transform: scale(1.10);
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .hero-section {
            height: 42vh !important;
            min-height: 260px !important;
          }
          .hero-content-wrap {
            padding-inline: 16px !important;
            max-width: 100% !important;
            top: 44% !important;
            transform: translateY(-52%) !important;
          }
          .hero-title { font-size: clamp(1.45rem, 6.5vw, 2.2rem) !important; white-space: normal !important; }
          .hero-sub { font-size: 0.8125rem !important; margin-bottom: 12px !important; line-height: 1.6 !important; }
          .hero-search-wrap { padding-inline: 16px !important; padding-bottom: 12px !important; }
          .hero-arrow { width: 28px !important; height: 28px !important; bottom: 80px !important; }
          .hero-counter { display: none !important; }
        }
      `}</style>
    </section>
  );
}
