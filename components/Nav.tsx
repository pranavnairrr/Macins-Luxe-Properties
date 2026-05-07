'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { KeyRound, UserCircle } from 'lucide-react';

const navLinks = [
  { label: 'Areas',      href: '#' },
  { label: 'About Us',   href: '#' },
  { label: 'Our Team',   href: '#' },
  { label: 'Reports',    href: '#' },
  { label: 'Careers',    href: '#' },
  { label: 'Blog',       href: '#' },
  { label: 'Contact Us', href: '#' },
];

const RESIDENTIAL_TYPES = [
  'Apartment', 'Townhouse', 'Villa Compound', 'Land', 'Building',
  'Villa', 'Penthouse', 'Hotel Apartment', 'Floor',
];
const COMMERCIAL_TYPES = [
  'Office', 'Shop', 'Warehouse', 'Labour Camp', 'Villa', 'Bulk Unit',
  'Land', 'Floor', 'Building', 'Factory', 'Industrial Land',
  'Mixed Use Land', 'Showroom', 'Other Commercial',
];

/* ─────────────────────────────────────────────────────────
   Nav states
   · top   — transparent glass over hero image
   · scrolled — footer-colour (#1D3159) glass
───────────────────────────────────────────────────────── */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [propsOpen, setPropsOpen] = useState(false);
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false);
  const loginCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const propsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const openLogin  = useCallback(() => {
    if (loginCloseTimer.current) clearTimeout(loginCloseTimer.current);
    setLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    loginCloseTimer.current = setTimeout(() => setLoginOpen(false), 120);
  }, []);

  const openProps = useCallback(() => {
    if (propsCloseTimer.current) clearTimeout(propsCloseTimer.current);
    setPropsOpen(true);
  }, []);

  const closeProps = useCallback(() => {
    propsCloseTimer.current = setTimeout(() => setPropsOpen(false), 120);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll(); // init
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── Derived style values ── */
  const linkColor = scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)';
  const barColor  = scrolled ? 'rgba(255,255,255,0.90)' : 'var(--heading)';

  return (
    <>
      <header
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 72,
          /* White opaque at top, footer-colour glassy when scrolled */
          background: scrolled
            ? 'rgba(21,33,64,0.88)'
            : 'var(--white)',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(213,186,140,0.15)'
            : '1px solid var(--border)',
          transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        <div className="container" style={{ height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

            {/* ── Logo — black at top, gold when scrolled ── */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image
                src={scrolled ? '/images/logo-gold-luxe.svg' : '/images/logo-black.png'}
                alt="Macins Luxe"
                height={40}
                width={140}
                style={{ height: 40, width: 'auto', objectFit: 'contain', transition: 'opacity 0.35s ease' }}
                priority
                unoptimized={scrolled} /* SVG bypass */
              />
            </Link>

            {/* ── Desktop nav links ── */}
            <nav
              aria-label="Main navigation"
              style={{ display: 'flex', alignItems: 'center', gap: 28 }}
              className="nav-desktop"
            >
              {/* ── Properties mega-dropdown ── */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={openProps}
                onMouseLeave={closeProps}
              >
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 500,
                    color: linkColor, background: 'transparent', border: 'none',
                    cursor: 'pointer', padding: '4px 0', position: 'relative', paddingBottom: 2,
                    transition: 'color 0.25s ease', whiteSpace: 'nowrap',
                  }}
                  className={`nav-link-item${scrolled ? ' nav-link-scrolled' : ''}`}
                >
                  Properties
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: propsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', opacity: 0.6 }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Mega dropdown panel */}
                <div
                  onMouseEnter={openProps}
                  onMouseLeave={closeProps}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    left: '50%',
                    width: 500,
                    background: scrolled ? 'rgba(21,33,64,0.97)' : '#fff',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: scrolled ? '1px solid rgba(213,186,140,0.20)' : '1px solid var(--border)',
                    borderRadius: 12,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.20)',
                    overflow: 'hidden',
                    opacity: propsOpen ? 1 : 0,
                    transform: propsOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
                    pointerEvents: propsOpen ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    zIndex: 60,
                  }}
                >
                  {/* Header */}
                  <div style={{ padding: '10px 20px 8px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: scrolled ? 'rgba(213,186,140,0.55)' : 'var(--muted)', fontFamily: 'var(--font)', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)' }}>
                    Browse by Type
                  </div>
                  <div style={{ display: 'flex' }}>
                    {/* Residential column */}
                    <div style={{ flex: 1, padding: '10px 0', borderRight: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)' }}>
                      <div style={{ padding: '2px 20px 8px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: scrolled ? 'rgba(213,186,140,0.70)' : 'var(--navy)', fontFamily: 'var(--font)' }}>Residential</div>
                      {RESIDENTIAL_TYPES.map(type => (
                        <a key={type} href="#"
                          style={{ display: 'block', padding: '6px 20px', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 400, color: scrolled ? 'rgba(255,255,255,0.82)' : 'var(--heading)', textDecoration: 'none', transition: 'background 0.15s ease, color 0.15s ease' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = scrolled ? 'rgba(213,186,140,0.08)' : 'var(--white-section)'; (e.currentTarget as HTMLElement).style.color = scrolled ? '#D5BA8C' : 'var(--navy)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = scrolled ? 'rgba(255,255,255,0.82)' : 'var(--heading)'; }}
                        >{type}</a>
                      ))}
                    </div>
                    {/* Commercial column */}
                    <div style={{ flex: 1, padding: '10px 0' }}>
                      <div style={{ padding: '2px 20px 8px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: scrolled ? 'rgba(213,186,140,0.70)' : 'var(--navy)', fontFamily: 'var(--font)' }}>Commercial</div>
                      {COMMERCIAL_TYPES.map(type => (
                        <a key={type} href="#"
                          style={{ display: 'block', padding: '6px 20px', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 400, color: scrolled ? 'rgba(255,255,255,0.82)' : 'var(--heading)', textDecoration: 'none', transition: 'background 0.15s ease, color 0.15s ease' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = scrolled ? 'rgba(213,186,140,0.08)' : 'var(--white-section)'; (e.currentTarget as HTMLElement).style.color = scrolled ? '#D5BA8C' : 'var(--navy)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = scrolled ? 'rgba(255,255,255,0.82)' : 'var(--heading)'; }}
                        >{type}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`nav-link-item${scrolled ? ' nav-link-scrolled' : ''}`}
                  style={{
                    fontFamily: 'var(--font)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: linkColor,
                    letterSpacing: 0,
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    paddingBottom: 2,
                    transition: 'color 0.25s ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Login dropdown ── */}
            <div
              className="nav-desktop"
              style={{ position: 'relative', flexShrink: 0 }}
              onMouseEnter={openLogin}
              onMouseLeave={closeLogin}
            >
              {/* Trigger button */}
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '9px 4px',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = scrolled ? '#D5BA8C' : 'var(--navy)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)'; }}
              >
                Login
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
                  transform: loginOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.22s ease',
                  opacity: 0.7,
                }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown panel */}
              <div
                onMouseEnter={openLogin}
                onMouseLeave={closeLogin}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 220,
                  background: scrolled ? 'rgba(21,33,64,0.97)' : '#fff',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: scrolled ? '1px solid rgba(213,186,140,0.20)' : '1px solid var(--border)',
                  borderRadius: 10,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                  overflow: 'hidden',
                  opacity: loginOpen ? 1 : 0,
                  transform: loginOpen ? 'translateY(0)' : 'translateY(-8px)',
                  pointerEvents: loginOpen ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  zIndex: 60,
                }}
              >
                {/* Header label */}
                <div style={{
                  padding: '10px 16px 8px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: scrolled ? 'rgba(213,186,140,0.55)' : 'var(--muted)',
                  fontFamily: 'var(--font)',
                  borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)',
                }}>
                  Portal Access
                </div>

                {/* Staff Access */}
                <Link
                  href="/staff/login"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '13px 16px',
                    fontFamily: 'var(--font)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: scrolled ? 'rgba(255,255,255,0.90)' : 'var(--heading)',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid var(--border)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = scrolled ? 'rgba(213,186,140,0.10)' : 'var(--white-section)';
                    (e.currentTarget as HTMLElement).style.color = scrolled ? '#D5BA8C' : 'var(--navy)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = scrolled ? 'rgba(255,255,255,0.90)' : 'var(--heading)';
                  }}
                >
                  <span style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: scrolled ? 'rgba(213,186,140,0.15)' : 'var(--white-section)',
                    border: scrolled ? '1px solid rgba(213,186,140,0.25)' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><KeyRound size={15} strokeWidth={1.6} color={scrolled ? '#D5BA8C' : 'var(--heading)'} /></span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>Staff Access</div>
                    <div style={{ fontSize: '0.75rem', color: scrolled ? 'rgba(255,255,255,0.45)' : 'var(--muted)', marginTop: 2 }}>Internal portal</div>
                  </div>
                </Link>

                {/* Client Access — not linked */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px',
                  opacity: 0.45,
                  cursor: 'not-allowed',
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: scrolled ? 'rgba(255,255,255,0.06)' : 'var(--white-section)',
                    border: scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><UserCircle size={15} strokeWidth={1.6} color={scrolled ? 'rgba(255,255,255,0.55)' : 'var(--muted)'} /></span>
                  <div>
                    <div style={{
                      fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2,
                      color: scrolled ? 'rgba(255,255,255,0.70)' : 'var(--heading)',
                      fontFamily: 'var(--font)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      Client Access
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
                        textTransform: 'uppercase', padding: '2px 5px',
                        background: scrolled ? 'rgba(213,186,140,0.20)' : 'var(--white-card)',
                        color: scrolled ? 'rgba(213,186,140,0.80)' : 'var(--muted)',
                        borderRadius: 4,
                      }}>Soon</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: scrolled ? 'rgba(255,255,255,0.35)' : 'var(--muted)', marginTop: 2, fontFamily: 'var(--font)' }}>My properties</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Desktop CTA ── */}
            <button
              className="nav-desktop nav-cta"
              style={{
                fontFamily: 'var(--font)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: scrolled ? '#D5BA8C' : 'var(--heading)',
                background: scrolled ? 'rgba(213,186,140,0.10)' : 'var(--white-section)',
                border: scrolled
                  ? '1px solid rgba(213,186,140,0.45)'
                  : '1px solid var(--border)',
                borderRadius: 'var(--radius-btn)',
                padding: '9px 20px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = scrolled ? 'rgba(213,186,140,0.22)' : 'var(--border)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = scrolled ? 'rgba(213,186,140,0.10)' : 'var(--white-section)';
              }}
            >
              Macins AI
            </button>

            {/* ── Mobile hamburger ── */}
            <button
              className="nav-mobile"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 5,
                width: 36,
                height: 36,
                padding: 4,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {[
                menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                'none', /* middle bar — fades out */
                menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              ].map((transform, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'block',
                    height: 2,
                    borderRadius: 2,
                    background: barColor,
                    transform,
                    opacity: idx === 1 ? (menuOpen ? 0 : 1) : 1,
                    transition: idx === 1 ? 'opacity 0.2s' : 'transform 0.25s var(--ease)',
                  }}
                />
              ))}
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: '72px 0 0 0',
          zIndex: 49,
          background: 'rgba(21,33,64,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s var(--ease)',
          overflowY: 'auto',
          padding: '32px var(--gutter)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* ── Mobile Properties accordion ── */}
        <div>
          <button
            onClick={() => setMobilePropsOpen(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.88)', background: 'transparent', border: 'none',
              padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.10)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            Properties
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ transform: mobilePropsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', opacity: 0.6, flexShrink: 0 }}>
              <path d="M2 4l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {mobilePropsOpen && (
            <div style={{ paddingBottom: 8 }}>
              <div style={{ paddingTop: 10, paddingBottom: 4, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.65)', fontFamily: 'var(--font)' }}>Residential</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {RESIDENTIAL_TYPES.map(type => (
                  <a key={type} href="#" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6, padding: '5px 10px', textDecoration: 'none', transition: 'background 0.15s ease, color 0.15s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(213,186,140,0.12)'; (e.currentTarget as HTMLElement).style.color = '#D5BA8C'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
                  >{type}</a>
                ))}
              </div>
              <div style={{ paddingBottom: 4, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.65)', fontFamily: 'var(--font)' }}>Commercial</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {COMMERCIAL_TYPES.map(type => (
                  <a key={type} href="#" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6, padding: '5px 10px', textDecoration: 'none', transition: 'background 0.15s ease, color 0.15s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(213,186,140,0.12)'; (e.currentTarget as HTMLElement).style.color = '#D5BA8C'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
                  >{type}</a>
                ))}
              </div>
            </div>
          )}
        </div>

        {navLinks.map((link, i) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '1.0625rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.88)',
              padding: '14px 0',
              borderBottom: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
              display: 'block',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#D5BA8C')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.88)')}
          >
            {link.label}
          </Link>
        ))}
        {/* Mobile login section */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <div style={{
            fontSize: '0.6875rem', fontWeight: 700,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'rgba(213,186,140,0.55)', fontFamily: 'var(--font)',
            marginBottom: 12,
          }}>Portal Access</div>

          <Link
            href="/staff/login"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 8,
              background: 'rgba(213,186,140,0.08)',
              border: '1px solid rgba(213,186,140,0.20)',
              textDecoration: 'none', marginBottom: 8,
            }}
          >
            <KeyRound size={18} strokeWidth={1.6} color="#D5BA8C" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', fontFamily: 'var(--font)' }}>Staff Access</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font)' }}>Internal portal</div>
            </div>
          </Link>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            opacity: 0.45, cursor: 'not-allowed',
          }}>
            <UserCircle size={18} strokeWidth={1.6} color="rgba(255,255,255,0.55)" />
            <div>
              <div style={{
                fontSize: '0.9rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.80)', fontFamily: 'var(--font)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Client Access
                <span style={{
                  fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', padding: '2px 5px',
                  background: 'rgba(213,186,140,0.20)', color: 'rgba(213,186,140,0.80)',
                  borderRadius: 3,
                }}>Soon</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font)' }}>My properties</div>
            </div>
          </div>
        </div>

        <button
          style={{
            marginTop: 20,
            width: '100%',
            fontFamily: 'var(--font)',
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: '#D5BA8C',
            background: 'rgba(213,186,140,0.10)',
            border: '1px solid rgba(213,186,140,0.40)',
            borderRadius: 'var(--radius-btn)',
            padding: '14px',
            cursor: 'pointer',
          }}
        >
          Macins AI
        </button>
      </div>

      <style jsx global>{`
        .nav-desktop { display: flex; }
        .nav-mobile  { display: none; }

        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }

        /* ── Nav link underline reveal ── */
        .nav-link-item {
          transition: color 0.22s ease;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--navy);
          border-radius: 2px;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        /* Gold underline + colour when scrolled */
        .nav-link-scrolled::after { background: #D5BA8C; }
        .nav-link-item:hover       { color: var(--navy) !important; }
        .nav-link-scrolled:hover   { color: #D5BA8C !important; }
        .nav-link-item:hover::after { width: 100%; }
      `}</style>
    </>
  );
}
