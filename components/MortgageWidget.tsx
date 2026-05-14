'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import MortgageCalculator from './MortgageCalculator';

function quickEMI(price: number, downPct = 20, termYears = 25, rate = 4.49): number {
  const loan = price * (1 - downPct / 100);
  if (loan <= 0) return 0;
  const r = rate / 100 / 12;
  const n = termYears * 12;
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${Math.round(n).toLocaleString()}`;
}

export default function MortgageWidget({ price }: { price: number }) {
  const [open, setOpen] = useState(false);
  const estEMI = quickEMI(price);

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 12,
      overflow: 'hidden', background: 'var(--white)',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid var(--border)' : 'none',
          transition: 'background 0.15s ease',
          textAlign: 'left',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--white-section)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'var(--white-section)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Calculator size={16} color="var(--navy)" strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)' }}>
              Mortgage Estimate
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 1 }}>
              From {fmt(Math.round(estEMI))}/mo · 20% down · 25 yrs
            </div>
          </div>
        </div>

        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.22s ease',
            flexShrink: 0,
          }}
        >
          <path d="M4 6l4 4 4-4" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded calculator */}
      {open && (
        <div style={{ padding: '24px 20px 20px' }}>
          <MortgageCalculator defaultPrice={price} />
        </div>
      )}
    </div>
  );
}
