'use client';

import { useState, useEffect } from 'react';

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setExpanded(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        href="https://wa.me/97144542588"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 20,
          zIndex: 998,
          height: 40,
          width: expanded ? 144 : 40,
          paddingLeft: expanded ? 12 : 0,
          paddingRight: expanded ? 14 : 0,
          borderRadius: 100,
          background: expanded
            ? (hovered ? 'rgba(32,192,92,0.88)' : 'rgba(37,211,102,0.82)')
            : (hovered ? 'rgba(32,192,92,0.80)' : 'rgba(37,211,102,0.72)'),
          backdropFilter: 'blur(14px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap: expanded ? 7 : 0,
          boxShadow: hovered
            ? '0 8px 28px rgba(37,211,102,0.45)'
            : '0 4px 16px rgba(37,211,102,0.30)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
          textDecoration: 'none',
          overflow: 'hidden',
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="white"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Label — fades in when expanded */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0,
          opacity: expanded ? 1 : 0,
          maxWidth: expanded ? 100 : 0,
          overflow: 'hidden',
          transition: 'opacity 0.3s ease 0.1s, max-width 0.4s cubic-bezier(0.4,0,0.2,1)',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            WhatsApp
          </span>
          <span style={{ fontFamily: 'var(--font)', fontSize: 9, fontWeight: 400, color: 'rgba(255,255,255,0.82)', lineHeight: 1.2 }}>
            Chat with us
          </span>
        </div>
      </a>

      <style jsx global>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);    opacity: 0.4; }
          100% { transform: scale(1.6);  opacity: 0;   }
        }
      `}</style>
    </>
  );
}
