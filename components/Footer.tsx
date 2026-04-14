'use client';

import Image from 'next/image';

const quickLinks  = ['Home', 'Projects', 'Areas', 'Blog', 'Developers'];
const companyLinks = ['About Us', 'Our Team', 'Reports', 'Careers', 'Contact Us'];
const buyFrom     = ['Emaar', 'Binghatti', 'Damac', 'Shoba Realty', 'Nakheel'];
const socialLinks = [
  { label: 'Facebook',  icon: 'f', href: '#' },
  { label: 'Instagram', icon: 'ig', href: '#' },
  { label: 'TikTok',    icon: 'tt', href: '#' },
  { label: 'LinkedIn',  icon: 'in', href: '#' },
  { label: 'YouTube',   icon: 'yt', href: '#' },
];

function SocialIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    f: (
      <svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor" aria-hidden="true">
        <path d="M6.5 18V9.75h2.8l.4-3H6.5V5.05c0-.87.242-1.463 1.491-1.463H9.8V.928A20.4 20.4 0 0 0 7.546.75C5.077.75 3.5 2.2 3.5 4.95v1.8H.7v3H3.5V18h3z"/>
      </svg>
    ),
    ig: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <rect x="1.5" y="1.5" width="13" height="13" rx="3.5"/>
        <circle cx="8" cy="8" r="3"/>
        <circle cx="11.5" cy="4.5" r="0.8" fill="currentColor" stroke="none"/>
      </svg>
    ),
    tt: (
      <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true">
        <path d="M13.5 4a4.5 4.5 0 0 1-4.5-4.5V0h-3v10.5A2 2 0 1 1 3.5 8.6V5.55a5 5 0 1 0 5.5 4.95V7.2a7.5 7.5 0 0 0 4.5 1.5V5.5A4.5 4.5 0 0 1 13.5 4z"/>
      </svg>
    ),
    in: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zM4.943 13.25V6.169H2.542v7.081h2.401zm-1.2-8.05a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8zM13.25 13.25V9.4c0-2.307-1.24-3.382-2.894-3.382-1.333 0-1.928.733-2.263 1.248V6.169H5.692v7.081h2.401V9.9c0-.215.016-.43.079-.584.173-.43.567-.874 1.229-.874.867 0 1.213.66 1.213 1.628v3.18h2.636z"/>
      </svg>
    ),
    yt: (
      <svg width="18" height="13" viewBox="0 0 18 13" fill="currentColor" aria-hidden="true">
        <path d="M17.6 2.03A2.25 2.25 0 0 0 16.02.45C14.63 0 9 0 9 0S3.37 0 1.98.45A2.25 2.25 0 0 0 .4 2.03 23.7 23.7 0 0 0 0 6.5a23.7 23.7 0 0 0 .4 4.47 2.25 2.25 0 0 0 1.58 1.58C3.37 13 9 13 9 13s5.63 0 7.02-.45a2.25 2.25 0 0 0 1.58-1.58A23.7 23.7 0 0 0 18 6.5a23.7 23.7 0 0 0-.4-4.47zM7.2 9.25V3.75L12 6.5 7.2 9.25z"/>
      </svg>
    ),
  };
  return icons[icon] ?? null;
}

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--navy)',
      color: '#fff',
      paddingTop: 56,
      paddingBottom: 32,
    }}>
      <div className="container">

        {/* ── Top bar: logo + phone/email ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 32,
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          marginBottom: 40,
          flexWrap: 'wrap',
          gap: 24,
        }}>
          {/* Logo */}
          <Image
            src="/images/logo-white.png"
            alt="Macins Luxe"
            width={160}
            height={48}
            style={{ height: 48, width: 'auto', objectFit: 'contain' }}
          />

          {/* Contact */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'var(--font)',
              fontSize: '1.375rem',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.01em',
            }}>
              +971 4 4542588
            </div>
            <div style={{
              fontFamily: 'var(--font)',
              fontSize: '0.9375rem',
              color: 'rgba(255,255,255,0.70)',
              marginTop: 4,
            }}>
              info@macinsluxe.com
            </div>
          </div>
        </div>

        {/* ── 5-column link grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr 1fr',
          gap: 40,
          marginBottom: 48,
        }}>

          {/* Quick Links */}
          <div>
            <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              Quick Links
            </div>
            {quickLinks.map(link => (
              <a key={link} href="#" className="text-footer-link">{link}</a>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              Company
            </div>
            {companyLinks.map(link => (
              <a key={link} href="#" className="text-footer-link">{link}</a>
            ))}
          </div>

          {/* Buy from */}
          <div>
            <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              Buy from
            </div>
            {buyFrom.map(link => (
              <a key={link} href="#" className="text-footer-link">{link}</a>
            ))}
          </div>

          {/* Our Offices */}
          <div>
            <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              Our Offices
            </div>
            <p style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.70)', lineHeight: 1.7, marginBottom: 16 }}>
              Office 102-106, Building 02<br />Business Bay, Dubai
            </p>
            <p style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.70)', lineHeight: 1.7 }}>
              Office 149 &amp; 150<br />Wafra Square, Reem Island<br />Abu Dhabi
            </p>
          </div>

          {/* Follow Us */}
          <div>
            <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              Follow Us
            </div>
            {socialLinks.map(s => (
              <a
                key={s.label}
                href={s.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: 'var(--font)',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 2,
                  transition: 'color var(--transition)',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)')}
              >
                <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SocialIcon icon={s.icon} />
                </span>
                {s.label}
              </a>
            ))}
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.15)',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' }}>
            Copyright &copy; 2025, Macins Luxe | ORN No: 11929
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms & Conditions'].map(l => (
              <a
                key={l}
                href="#"
                style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', transition: 'color var(--transition)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="1.5fr 1fr 1fr 1.5fr 1fr"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="1.5fr 1fr 1fr 1.5fr 1fr"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="justify-content: space-between"][style*="paddingBottom: 32"] {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}
