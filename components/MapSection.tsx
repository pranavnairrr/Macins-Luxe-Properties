'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Hand } from 'lucide-react';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function MapSection() {
  const [mapLocked, setMapLocked] = useState(true);
  const lockTimer = useRef<ReturnType<typeof setTimeout>>();

  // Re-lock whenever the user scrolls the page
  useEffect(() => {
    const onScroll = () => {
      setMapLocked(true);
      clearTimeout(lockTimer.current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const unlockMap = () => {
    setMapLocked(false);
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => setMapLocked(true), 6000);
  };

  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container">

        {/* Header */}
        <div className="section-header" style={{ marginBottom: 36 }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--heading)',
              marginBottom: 8,
            }}>
              Explore Properties Across Dubai
            </h2>
            <p style={{
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--body)',
              maxWidth: 480,
            }}>
              View our exclusive listings plotted across the city&apos;s most sought-after districts.
            </p>
          </div>

          <a
            href="/properties"
            style={{
              fontFamily: 'var(--font)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--heading)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-btn)',
              padding: '8px 16px',
              whiteSpace: 'nowrap',
              transition: 'border-color var(--transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--heading)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            View All Listings
          </a>
        </div>

        {/* Map */}
        <div
          className="map-container"
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: 520,
            border: '1px solid var(--border)',
            boxShadow: '0 4px 24px rgba(26,37,53,0.08)',
            position: 'relative',
            /* Contain all Leaflet z-indices inside this stacking context
               so map panes (z-index 400-700) never bleed above the nav (z-index 50) */
            isolation: 'isolate',
          }}
        >
          {/* Property count badge */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-btn)',
            padding: '6px 14px',
            fontFamily: 'var(--font)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--heading)',
            boxShadow: '0 2px 8px rgba(26,37,53,0.10)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#111',
              display: 'inline-block',
            }} />
            6 Properties
          </div>

          <MapView />

          {/* Mobile-only: tap-to-interact overlay
              Blocks accidental map pan when user intends to scroll the page.
              Hidden on desktop via CSS. */}
          {mapLocked && (
            <div
              className="map-gesture-overlay"
              onClick={unlockMap}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(3,26,50,0.18)',
                cursor: 'pointer',
              }}
            >
              <div style={{
                background: 'rgba(3,26,50,0.78)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 10,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(213,186,140,0.25)',
                pointerEvents: 'none',
              }}>
                <Hand size={16} strokeWidth={1.5} color="rgba(213,186,140,0.9)" />
                <span style={{
                  color: '#fff',
                  fontFamily: 'var(--font)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}>
                  Tap to interact with map
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        /* Overlay only shows on touch/mobile — hidden on desktop */
        .map-gesture-overlay { display: none; }

        @media (max-width: 1024px) {
          .map-gesture-overlay { display: flex !important; }
        }
        @media (max-width: 768px) {
          .map-container { height: 320px !important; }
        }
        @media (max-width: 480px) {
          .map-container { height: 260px !important; }
        }
      `}</style>
    </section>
  );
}
