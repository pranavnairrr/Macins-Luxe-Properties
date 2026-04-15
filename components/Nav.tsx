'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'Projects',   href: '#' },
  { label: 'Areas',      href: '#' },
  { label: 'About Us',   href: '#' },
  { label: 'Our Team',   href: '#' },
  { label: 'Reports',    href: '#' },
  { label: 'Careers',    href: '#' },
  { label: 'Blog',       href: '#' },
  { label: 'Contact Us', href: '#' },
];

/* ─────────────────────────────────────────────────────────
   Nav states
   · top   — transparent glass over hero image
   · scrolled — footer-colour (#1D3159) glass
───────────────────────────────────────────────────────── */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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
            ? 'rgba(29,49,89,0.82)'
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
          background: 'rgba(29,49,89,0.96)',
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
        <button
          style={{
            marginTop: 32,
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
