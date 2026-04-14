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

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={navRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: scrolled ? 'var(--white)' : 'var(--white)',
          borderBottom: '1px solid var(--border)',
          boxShadow: scrolled ? 'var(--shadow-nav)' : 'none',
          transition: 'box-shadow var(--transition-slow)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

            {/* ── Logo ── */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image
                src="/images/logo-black.png"
                alt="Macins Luxe"
                height={40}
                width={140}
                style={{ height: 40, width: 'auto', objectFit: 'contain' }}
                priority
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
                  className="nav-link-item"
                  style={{
                    fontFamily: 'var(--font)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--heading)',
                    letterSpacing: 0,
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    paddingBottom: 2,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop CTA ── */}
            <button
              className="nav-desktop"
              style={{
                fontFamily: 'var(--font)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--heading)',
                background: 'var(--white-section)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-btn)',
                padding: '9px 20px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--white-section)')}
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
              <span style={{
                display: 'block', height: 2, borderRadius: 2,
                background: 'var(--heading)',
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                transition: 'transform 0.25s var(--ease)',
              }} />
              <span style={{
                display: 'block', height: 2, borderRadius: 2,
                background: 'var(--heading)',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.2s',
              }} />
              <span style={{
                display: 'block', height: 2, borderRadius: 2,
                background: 'var(--heading)',
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                transition: 'transform 0.25s var(--ease)',
              }} />
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
          background: 'var(--white)',
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
              color: 'var(--heading)',
              padding: '14px 0',
              borderBottom: i < navLinks.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'block',
            }}
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
            color: 'var(--white-text)',
            background: 'var(--cta-bg)',
            border: 'none',
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
        .nav-link-item:hover { color: var(--navy) !important; }
        .nav-link-item:hover::after { width: 100%; }
      `}</style>
    </>
  );
}
