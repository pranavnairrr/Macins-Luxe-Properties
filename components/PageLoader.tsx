'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/*
 * PageLoader — pure CSS @keyframes, zero React state transitions
 * -------------------------------------------------------------
 * CSS handles all animation (no race conditions on reload).
 * React only unmounts the component after the exit finishes.
 *
 * Timeline:
 *   0.03 s  logo fades + rises in       (0.30 s)
 *   0.12 s  underline bar grows         (0.38 s)
 *   0.60 s  overlay slides up + fades   (0.28 s)
 *   0.90 s  component removed from DOM
 */

export default function PageLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <>
      <div className="pl-overlay">
        <div className="pl-logo">
          <Image
            src="/images/logo-luxe-loader.png"
            alt="Macins Luxe"
            width={220}
            height={76}
            priority
            style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxWidth: 220 }}
          />
        </div>

        <div className="pl-track">
          <div className="pl-bar" />
        </div>
      </div>

      <style jsx global>{`
        /* ── entrance: logo ── */
        @keyframes pl-logo-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* ── entrance: bar fill ── */
        @keyframes pl-bar-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ── exit: overlay slides up + fades ── */
        @keyframes pl-overlay-out {
          from { opacity: 1; transform: translateY(0);     }
          to   { opacity: 0; transform: translateY(-20px); }
        }

        .pl-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          /* exit fires at 0.60 s, lasts 0.28 s */
          animation: pl-overlay-out 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0.60s both;
        }

        .pl-logo {
          animation: pl-logo-in 0.30s cubic-bezier(0.22, 1, 0.36, 1) 0.03s both;
        }

        .pl-track {
          width: 130px;
          height: 1.5px;
          background: rgba(26, 37, 53, 0.10);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 20px;
        }

        .pl-bar {
          height: 100%;
          background: #1A2535;
          border-radius: 2px;
          transform-origin: left center;
          transform: scaleX(0);
          animation: pl-bar-fill 0.38s cubic-bezier(0.4, 0, 0.2, 1) 0.12s both;
        }
      `}</style>
    </>
  );
}
