'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Nav from './Nav';
import Footer from './Footer';

function fmt(n: number) {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n.toFixed(0)}`;
}

function useAnimated(target: number, ms = 320) {
  const [val, setVal] = useState(target);
  const from  = useRef(target);
  const frame = useRef<number>();
  useEffect(() => {
    const start = from.current, end = target;
    if (start === end) return;
    let t0: number | null = null;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min((now - t0) / ms, 1);
      setVal(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else from.current = end;
    };
    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [target, ms]);
  return val;
}

/* ── Palette ── */
const CHAR  = '#1a1815';          /* warm charcoal – result card bg   */
const GOLD  = '#D5BA8C';          /* gold – hero number               */
const GDEEP = '#b8965a';          /* deeper gold – slider fill        */
const PAGE  = '#f5f3f0';          /* warm off-white – section bg      */
const BADGE = '#eeebe5';          /* value badge bg                   */

export default function MortgagePage() {
  const [price,   setPrice]   = useState(3_000_000);
  const [downPct, setDownPct] = useState(20);
  const [rate,    setRate]    = useState(4.5);
  const [term,    setTerm]    = useState(25);
  const [form,    setForm]    = useState({ name: '', email: '', phone: '' });
  const [sent,    setSent]    = useState(false);

  const { monthly, loan, interest, total } = useMemo(() => {
    const loan    = price * (1 - downPct / 100);
    const r       = rate / 100 / 12;
    const n       = term * 12;
    const monthly = r === 0 ? loan / n : loan * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
    const total   = monthly * n;
    return { monthly, loan, interest: total - loan, total };
  }, [price, downPct, rate, term]);

  const principalPct = (loan / total) * 100;
  const animMonthly  = useAnimated(monthly);
  const downAED      = price * (downPct / 100);
  const fill = (v: number, lo: number, hi: number) => `${((v-lo)/(hi-lo))*100}%`;

  const sliders = [
    { label: 'Property Price', sub: null,         min: 500_000,  max: 20_000_000, step: 50_000, value: price,   set: setPrice,   display: fmt(price),           minL: '500K',    maxL: '20M'    },
    { label: 'Down Payment',   sub: fmt(downAED), min: 10,        max: 40,         step: 1,      value: downPct, set: setDownPct, display: `${downPct}%`,         minL: '10%',     maxL: '40%'    },
    { label: 'Interest Rate',  sub: null,         min: 2.5,       max: 8,          step: 0.1,    value: rate,    set: setRate,    display: `${rate.toFixed(1)}%`, minL: '2.5%',    maxL: '8%'     },
    { label: 'Loan Term',      sub: null,         min: 5,         max: 30,         step: 1,      value: term,    set: setTerm,    display: `${term} yrs`,         minL: '5 yrs',   maxL: '30 yrs' },
  ];

  return (
    <>
      <Nav />

      {/* ── Hero strip ── */}
      <section style={{ background: CHAR, padding: '88px var(--gutter-lg) 36px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 500 }}>
          <span style={{
            display: 'inline-block', marginBottom: 10,
            fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)',
          }}>
            Financial Planning
          </span>
          <h1 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.75rem,3.5vw,2.375rem)',
            fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em',
            color: '#fff', marginBottom: 10,
          }}>
            Mortgage Calculator
          </h1>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>
            Drag the sliders — your monthly payment updates instantly.
          </p>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section style={{ background: PAGE, paddingBlock: 40 }}>
        <div className="container">
          <div className="mc-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 20, alignItems: 'start' }}>

            {/* Left — sliders */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
              padding: '28px 24px',
            }}>
              <p style={{
                fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#aaa79f', marginBottom: 24,
              }}>
                Loan Parameters
              </p>

              <div className="mc-sliders" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px 32px' }}>
                {sliders.map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2a2520', lineHeight: 1.3 }}>
                          {s.label}
                        </div>
                        {s.sub && (
                          <div style={{ fontSize: '0.6875rem', color: '#aaa79f', marginTop: 2 }}>
                            ≈ {s.sub}
                          </div>
                        )}
                      </div>
                      <span style={{
                        fontSize: '0.8125rem', fontWeight: 700,
                        color: CHAR, background: BADGE,
                        borderRadius: 6, padding: '3px 9px',
                        whiteSpace: 'nowrap', flexShrink: 0,
                        fontFamily: 'var(--font)',
                      }}>
                        {s.display}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={s.min} max={s.max} step={s.step}
                      value={s.value}
                      onChange={e => s.set(parseFloat(e.target.value))}
                      className="mlx-slider"
                      style={{ width: '100%', '--fill': fill(s.value, s.min, s.max) } as React.CSSProperties}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#bbb8b0', marginTop: 5 }}>
                      <span>{s.minL}</span><span>{s.maxL}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — result (sticky) */}
            <div style={{
              background: CHAR,
              borderRadius: 16,
              padding: '24px 20px',
              position: 'sticky',
              top: 80,
            }}>

              {/* Monthly payment */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: `${GOLD}99`,
                  marginBottom: 6,
                }}>
                  Monthly Payment
                </div>
                <div style={{
                  fontFamily: 'var(--font)',
                  fontSize: 'clamp(2rem,3.5vw,2.75rem)',
                  fontWeight: 800, letterSpacing: '-0.03em',
                  color: GOLD, lineHeight: 1,
                }}>
                  {fmt(animMonthly)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.30)', marginTop: 6 }}>
                  per month &middot; {term}-year term
                </div>
              </div>

              {/* Principal vs interest bar */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 7 }}>
                  <div style={{
                    height: '100%', width: `${principalPct}%`,
                    background: 'rgba(255,255,255,0.55)', borderRadius: 3,
                    transition: 'width 0.38s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.70)' }}>Principal {principalPct.toFixed(0)}%</span>
                  <span style={{ color: 'rgba(255,255,255,0.28)' }}>Interest {(100-principalPct).toFixed(0)}%</span>
                </div>
              </div>

              {/* Stats 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Loan Amount',    value: fmt(loan)     },
                  { label: 'Down Payment',   value: fmt(downAED)  },
                  { label: 'Total Interest', value: fmt(interest) },
                  { label: 'Total Cost',     value: fmt(total)    },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '10px 12px',
                  }}>
                    <div style={{
                      fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                      marginBottom: 4,
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* LTV */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '8px 12px', marginBottom: 16,
              }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.30)', fontWeight: 500 }}>
                  Loan-to-Value
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font)' }}>
                  {100-downPct}%
                </span>
              </div>

              <button
                onClick={() => document.getElementById('mortgage-form')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  width: '100%', padding: '12px',
                  background: '#fff', color: CHAR,
                  fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 700,
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  transition: 'opacity 0.18s ease',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Apply for This Mortgage
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section id="mortgage-form" style={{ background: '#fff', paddingBlock: 64 }}>
        <div className="container" style={{ maxWidth: 460 }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: CHAR, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="20" height="15" viewBox="0 0 22 16" fill="none">
                  <path d="M2 8l6 6L20 2" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 8 }}>
                We&apos;ll be in touch!
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
                Our mortgage specialist will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span style={{
                  display: 'inline-block', marginBottom: 10,
                  fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#999',
                }}>
                  Free Consultation
                </span>
                <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.375rem,2.5vw,1.875rem)', fontWeight: 700, color: 'var(--heading)', marginBottom: 8 }}>
                  Speak with a Mortgage Advisor
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                  No obligation — expert guidance tailored to your situation.
                </p>
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                const msg = `Mortgage enquiry — Price: ${fmt(price)}, Down: ${downPct}%, Rate: ${rate}%, Term: ${term}yr, Monthly: ${fmt(monthly)}`;
                await fetch('/api/enquire', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...form, message: msg, type: 'mortgage' }),
                }).catch(() => null);
                setSent(true);
              }}>
                {[
                  { name: 'name',  label: 'Full Name', type: 'text',  ph: 'Your name'        },
                  { name: 'email', label: 'Email',     type: 'email', ph: 'your@email.com'    },
                  { name: 'phone', label: 'Phone',     type: 'tel',   ph: '+971 50 000 0000'  },
                ].map(f => (
                  <div key={f.name} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', display: 'block', marginBottom: 7 }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type} placeholder={f.ph} required
                      value={form[f.name as keyof typeof form]}
                      onChange={e => setForm(d => ({ ...d, [f.name]: e.target.value }))}
                      style={{
                        width: '100%', padding: '11px 14px',
                        borderRadius: 10,
                        border: '1.5px solid #ddd9d3',
                        background: '#fff',
                        fontFamily: 'var(--font)', fontSize: '0.9375rem',
                        color: 'var(--heading)', outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#333')}
                      onBlur={e  => ((e.currentTarget as HTMLElement).style.borderColor = '#ddd9d3')}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '13px', marginTop: 6,
                    background: '#111', color: '#fff',
                    fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 700,
                    border: 'none', borderRadius: 10, cursor: 'pointer',
                    transition: 'opacity 0.18s ease',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                >
                  Book Free Consultation
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .mlx-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(
            to right,
            #555 var(--fill, 40%),
            #e8e5e0 var(--fill, 40%)
          );
        }
        .mlx-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid #555;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .mlx-slider::-webkit-slider-thumb:hover {
          background: #555;
          transform: scale(1.18);
        }
        .mlx-slider:active::-webkit-slider-thumb {
          transform: scale(1.08);
        }
        .mlx-slider::-moz-range-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 2.5px solid #555;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        }

        @media (max-width: 860px) {
          .mc-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .mc-sliders { grid-template-columns: 1fr !important; }
        }

        input::placeholder { color: #c4bfb8; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </>
  );
}
