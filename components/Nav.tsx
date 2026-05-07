'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { KeyRound, UserCircle, ChevronRight } from 'lucide-react';

const dropdownGroups = [
  {
    id: 'properties',
    label: 'Properties',
    items: [
      { label: 'Residential', href: '/properties?tab=Residential' },
      { label: 'Commercial',  href: '/properties?tab=Commercial'  },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    items: [
      { label: 'About Us', href: '/about'   },
      { label: 'Our Team', href: '/team'    },
      { label: 'Careers',  href: '/careers' },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      { label: 'Reports',    href: '/reports'   },
      { label: 'Blog',       href: '/blog'      },
      { label: 'Mortgage',   href: '/mortgage'  },
    ],
  },
] as const;

export default function Nav() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeDrop,     setActiveDrop]     = useState<string | null>(null);
  const [loginOpen,      setLoginOpen]      = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const dropTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loginTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDrop  = useCallback((id: string) => { if (dropTimer.current) clearTimeout(dropTimer.current); setActiveDrop(id); }, []);
  const closeDrop = useCallback(() => { dropTimer.current = setTimeout(() => setActiveDrop(null), 120); }, []);
  const openLogin  = useCallback(() => { if (loginTimer.current) clearTimeout(loginTimer.current); setLoginOpen(true); }, []);
  const closeLogin = useCallback(() => { loginTimer.current = setTimeout(() => setLoginOpen(false), 120); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const lc = scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)'; // link colour
  const bc = scrolled ? 'rgba(255,255,255,0.90)' : 'var(--heading)'; // bar colour

  /* shared dropdown panel styles */
  const panelBase = (open: boolean): React.CSSProperties => ({
    position: 'absolute', top: 'calc(100% + 12px)',
    background: scrolled ? 'rgba(3,33,61,0.97)' : '#fff',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: scrolled ? '1px solid rgba(213,186,140,0.20)' : '1px solid var(--border)',
    borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.14)', overflow: 'hidden',
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : 'translateY(-8px)',
    pointerEvents: open ? 'auto' : 'none',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    zIndex: 60,
  });

  const panelLabel: React.CSSProperties = {
    padding: '9px 16px 8px',
    fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase',
    color: scrolled ? 'rgba(213,186,140,0.55)' : 'var(--muted)',
    fontFamily: 'var(--font)',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)',
  };

  /* inline render — NOT a component, avoids remount-on-every-render */
  function renderDrop(group: typeof dropdownGroups[number]) {
    const open = activeDrop === group.id;
    return (
      <div
        key={group.id}
        style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
        onMouseEnter={() => openDrop(group.id)}
        onMouseLeave={closeDrop}
      >
        <button
          className={`nav-link-item${scrolled ? ' nav-link-scrolled' : ''}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 500,
            color: lc, background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 0,
            position: 'relative', transition: 'color 0.25s ease', whiteSpace: 'nowrap',
          }}
        >
          {group.label}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', opacity: 0.5 }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div
          onMouseEnter={() => openDrop(group.id)}
          onMouseLeave={closeDrop}
          style={{ ...panelBase(open), left: 0, minWidth: 200 }}
        >
          <div style={panelLabel}>{group.label}</div>
          {group.items.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 500,
                color: scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)',
                textDecoration: 'none',
                borderBottom: i < group.items.length - 1
                  ? (scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid var(--border)')
                  : 'none',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = scrolled ? 'rgba(213,186,140,0.08)' : 'var(--white-section)'; el.style.color = scrolled ? 'var(--gold)' : 'var(--navy)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)'; }}
            >
              {item.label}
              <ChevronRight size={13} strokeWidth={1.5} style={{ opacity: 0.35 }} />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  /* shared nav link style — zero padding so flexbox centres text cleanly */
  const navLinkStyle: React.CSSProperties = {
    fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 500,
    color: lc, whiteSpace: 'nowrap',
    position: 'relative', padding: 0,
    transition: 'color 0.25s ease',
    display: 'flex', alignItems: 'center',
  };

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 68,
        background: scrolled ? 'rgba(3,33,61,0.88)' : 'var(--white)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--border)',
        transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.18)' : 'none',
      }}>
        <div className="container" style={{ height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image
                src={scrolled ? '/images/logo-gold-luxe.svg' : '/images/logo-black.png'}
                alt="Macins Luxe" height={36} width={130}
                style={{ height: 36, width: 'auto', objectFit: 'contain', transition: 'opacity 0.35s ease' }}
                priority unoptimized={scrolled}
              />
            </Link>

            {/* Desktop nav — centred via auto side margins */}
            <nav
              aria-label="Main navigation"
              className="nav-desktop"
              style={{ display: 'flex', alignItems: 'center', gap: 28, marginInline: 'auto' }}
            >
              {renderDrop(dropdownGroups[0])}

              <Link href="/areas" className={`nav-link-item${scrolled ? ' nav-link-scrolled' : ''}`} style={navLinkStyle}>
                Areas
              </Link>

              {renderDrop(dropdownGroups[1])}
              {renderDrop(dropdownGroups[2])}

              <Link href="/contact" className={`nav-link-item${scrolled ? ' nav-link-scrolled' : ''}`} style={navLinkStyle}>
                Contact Us
              </Link>
            </nav>

            {/* Right group */}
            <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

              {/* Login */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} onMouseEnter={openLogin} onMouseLeave={closeLogin}>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: 0,
                    fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                    color: scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = scrolled ? 'var(--gold)' : 'var(--navy)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = scrolled ? 'rgba(255,255,255,0.88)' : 'var(--heading)'; }}
                >
                  Login
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ transform: loginOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', opacity: 0.55 }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div onMouseEnter={openLogin} onMouseLeave={closeLogin} style={{ ...panelBase(loginOpen), right: 0, width: 220 }}>
                  <div style={panelLabel}>Portal Access</div>
                  <Link href="/staff/login"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: scrolled ? 'rgba(255,255,255,0.90)' : 'var(--heading)', textDecoration: 'none', transition: 'background 0.15s', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid var(--border)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = scrolled ? 'rgba(213,186,140,0.10)' : 'var(--white-section)'; el.style.color = scrolled ? 'var(--gold)' : 'var(--navy)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = scrolled ? 'rgba(255,255,255,0.90)' : 'var(--heading)'; }}
                  >
                    <span style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: scrolled ? 'rgba(213,186,140,0.15)' : 'var(--white-section)', border: scrolled ? '1px solid rgba(213,186,140,0.25)' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <KeyRound size={15} strokeWidth={1.6} color={scrolled ? 'var(--gold)' : 'var(--heading)'} />
                    </span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>Staff Access</div>
                      <div style={{ fontSize: '0.75rem', color: scrolled ? 'rgba(255,255,255,0.45)' : 'var(--muted)', marginTop: 2 }}>Internal portal</div>
                    </div>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', opacity: 0.45, cursor: 'not-allowed' }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: scrolled ? 'rgba(255,255,255,0.06)' : 'var(--white-section)', border: scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCircle size={15} strokeWidth={1.6} color={scrolled ? 'rgba(255,255,255,0.55)' : 'var(--muted)'} />
                    </span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2, color: scrolled ? 'rgba(255,255,255,0.70)' : 'var(--heading)', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        Client Access
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 5px', background: scrolled ? 'rgba(213,186,140,0.20)' : 'var(--white-card)', color: scrolled ? 'rgba(213,186,140,0.80)' : 'var(--muted)', borderRadius: 4 }}>Soon</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: scrolled ? 'rgba(255,255,255,0.35)' : 'var(--muted)', marginTop: 2, fontFamily: 'var(--font)' }}>My properties</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                style={{
                  fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                  color: scrolled ? 'var(--gold)' : 'var(--heading)',
                  background: scrolled ? 'rgba(213,186,140,0.10)' : 'var(--white-section)',
                  border: scrolled ? '1px solid rgba(213,186,140,0.45)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)', padding: '8px 18px', cursor: 'pointer',
                  transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = scrolled ? 'rgba(213,186,140,0.22)' : 'var(--border)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = scrolled ? 'rgba(213,186,140,0.10)' : 'var(--white-section)'; }}
              >
                Macins AI
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="nav-mobile"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5, width: 36, height: 36, padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
            >
              {([
                menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                'none',
                menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              ] as const).map((transform, idx) => (
                <span key={idx} style={{ display: 'block', height: 2, borderRadius: 2, background: bc, transform, opacity: idx === 1 ? (menuOpen ? 0 : 1) : 1, transition: idx === 1 ? 'opacity 0.2s' : 'transform 0.25s var(--ease)' }} />
              ))}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed', inset: '68px 0 0 0', zIndex: 49,
          background: 'rgba(3,33,61,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s var(--ease)',
          overflowY: 'auto', padding: '32px var(--gutter)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {dropdownGroups.map(group => (
          <div key={group.id}>
            <button
              onClick={() => setMobileExpanded(e => e === group.id ? null : group.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 500, color: 'rgba(255,255,255,0.88)', background: 'transparent', border: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer', textAlign: 'left' }}
            >
              {group.label}
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ transform: mobileExpanded === group.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', opacity: 0.6, flexShrink: 0 }}>
                <path d="M2 4l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileExpanded === group.id && (
              <div style={{ paddingBottom: 4 }}>
                {group.items.map(item => (
                  <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 12px', marginBottom: 6, fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 500, color: 'rgba(255,255,255,0.80)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, textDecoration: 'none' }}
                  >
                    {item.label}
                    <ChevronRight size={15} strokeWidth={1.5} style={{ opacity: 0.4 }} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {[{ label: 'Areas', href: '/areas' }, { label: 'Contact Us', href: '/contact' }].map(link => (
          <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
            style={{ fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 500, color: 'rgba(255,255,255,0.88)', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.10)', display: 'block', transition: 'color 0.2s ease' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.88)')}
          >
            {link.label}
          </Link>
        ))}

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(213,186,140,0.55)', fontFamily: 'var(--font)', marginBottom: 12 }}>Portal Access</div>
          <Link href="/staff/login" onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, background: 'rgba(213,186,140,0.08)', border: '1px solid rgba(213,186,140,0.20)', textDecoration: 'none', marginBottom: 8 }}
          >
            <KeyRound size={18} strokeWidth={1.6} color="var(--gold)" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', fontFamily: 'var(--font)' }}>Staff Access</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font)' }}>Internal portal</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0.45, cursor: 'not-allowed' }}>
            <UserCircle size={18} strokeWidth={1.6} color="rgba(255,255,255,0.55)" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.80)', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Client Access
                <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 5px', background: 'rgba(213,186,140,0.20)', color: 'rgba(213,186,140,0.80)', borderRadius: 3 }}>Soon</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font)' }}>My properties</div>
            </div>
          </div>
        </div>

        <button style={{ marginTop: 20, width: '100%', fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--gold)', background: 'rgba(213,186,140,0.10)', border: '1px solid rgba(213,186,140,0.40)', borderRadius: 'var(--radius-btn)', padding: '14px', cursor: 'pointer' }}>
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

        .nav-link-item { transition: color 0.22s ease; }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: var(--navy);
          border-radius: 2px;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link-scrolled::after { background: var(--gold); }
        .nav-link-item:hover        { color: var(--navy) !important; }
        .nav-link-scrolled:hover    { color: var(--gold) !important; }
        .nav-link-item:hover::after { width: 100%; }
      `}</style>
    </>
  );
}
