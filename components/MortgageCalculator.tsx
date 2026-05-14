'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

/* ── Math ────────────────────────────────────────────────── */
function calcEMI(loan: number, ratePct: number, termYears: number): number {
  if (loan <= 0 || termYears <= 0) return 0;
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loan / n;
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function maxLoanFromEMI(capacity: number, ratePct: number, termYears: number): number {
  if (capacity <= 0 || termYears <= 0) return 0;
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return capacity * n;
  return (capacity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

type BalancePoint = {
  year: number;
  balance: number;
  cumInterest: number;
  cumPrincipal: number;
};

function computeBalances(loan: number, ratePct: number, termYears: number): BalancePoint[] {
  if (loan <= 0 || termYears <= 0) return [];
  const r = ratePct / 100 / 12;
  const emi = calcEMI(loan, ratePct, termYears);
  const points: BalancePoint[] = [{ year: 0, balance: loan, cumInterest: 0, cumPrincipal: 0 }];
  let balance = loan;
  let cumInterest = 0;
  let cumPrincipal = 0;
  for (let y = 1; y <= termYears; y++) {
    for (let m = 0; m < 12; m++) {
      const intPart = balance * r;
      const prinPart = Math.min(emi - intPart, balance);
      cumInterest += intPart;
      cumPrincipal += prinPart;
      balance = Math.max(balance - prinPart, 0);
    }
    points.push({ year: y, balance, cumInterest, cumPrincipal });
  }
  return points;
}

/* ── Formatters ──────────────────────────────────────────── */
function fmt(n: number): string {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${Math.round(n).toLocaleString()}`;
}
function fmtShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${Math.round(n)}`;
}

/* ── Count-up hook ───────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, active = false) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    if (!active) return;
    setVal(0);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, active]);
  return val;
}

/* ── Slider ──────────────────────────────────────────────── */
function Slider({
  label, sub, min, max, step, value, onChange, minL, maxL, display,
}: {
  label: string; sub?: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void;
  minL: string; maxL: string; display: string;
}) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setRaw(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitEdit() {
    const parsed = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
    setEditing(false);
  }

  const pct = `${((value - min) / (max - min)) * 100}%`;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', lineHeight: 1.3 }}>
            {label}
          </div>
          {sub && (
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
          )}
        </div>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={raw}
            onChange={e => setRaw(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false); }}
            style={{
              fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)',
              background: 'var(--white)', border: '1.5px solid var(--navy)',
              borderRadius: 6, padding: '3px 10px', width: 120, flexShrink: 0,
              fontFamily: 'var(--font)', outline: 'none', textAlign: 'right',
            }}
          />
        ) : (
          <button
            onClick={startEdit}
            title="Click to type a value"
            style={{
              fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)',
              background: 'var(--white-section)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '3px 12px', whiteSpace: 'nowrap', flexShrink: 0,
              cursor: 'text', fontFamily: 'var(--font)', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
          >
            {display}
          </button>
        )}
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="mc-slider"
        style={{ width: '100%', '--fill': pct } as React.CSSProperties}
      />
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.6875rem', color: 'var(--muted)', marginTop: 5,
      }}>
        <span>{minL}</span>
        <span>{maxL}</span>
      </div>
    </div>
  );
}

/* ── Balance Chart ───────────────────────────────────────── */
function BalanceChart({ balances, loan, term }: {
  balances: BalancePoint[];
  loan: number;
  term: number;
}) {
  const [hovered, setHovered] = useState<(BalancePoint & { svgX: number }) | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRef = useRef<SVGRectElement>(null);

  const W = 680, H = 190, ML = 52, MR = 16, MT = 16, MB = 36;
  const cW = W - ML - MR;
  const cH = H - MT - MB;
  const bottom = MT + cH;

  const halfwayPt = balances.find(p => p.balance <= loan / 2) ?? null;

  useEffect(() => {
    const clip = clipRef.current;
    if (!clip || !balances.length) return;
    clip.setAttribute('width', '0');
    let start: number | null = null;
    const dur = 1100;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      clip.setAttribute('width', `${ease * (cW + MR)}`);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!balances.length) return null;

  const sx = (year: number) => ML + (year / term) * cW;
  const sy = (bal: number) => MT + cH - (bal / loan) * cH;

  const linePath = balances
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.year).toFixed(1)} ${sy(p.balance).toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${sx(term).toFixed(1)} ${bottom} L ${sx(0).toFixed(1)} ${bottom} Z`;

  const xTick = (v: number) =>
    Math.round(ML + (v / term) * cW);

  const step = term <= 10 ? 2 : term <= 15 ? 5 : 5;
  const xTicks: number[] = [];
  for (let y = 0; y <= term; y += step) xTicks.push(y);
  if (xTicks[xTicks.length - 1] !== term) xTicks.push(term);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = W / rect.width;
    const mx = (e.clientX - rect.left) * scale;
    const yearF = ((mx - ML) / cW) * term;
    const idx = Math.max(0, Math.min(Math.round(yearF), balances.length - 1));
    const pt = balances[idx];
    setHovered({ ...pt, svgX: sx(pt.year) });
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', overflow: 'visible', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="mcAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--navy)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--navy)" stopOpacity="0.01" />
          </linearGradient>
          <clipPath id="mcChartClip">
            <rect ref={clipRef} x={ML} y={0} width="0" height={H + 4} />
          </clipPath>
        </defs>

        {/* Gridlines */}
        {yTicks.map(t => (
          <line
            key={t}
            x1={ML} y1={sy(loan * t)}
            x2={ML + cW} y2={sy(loan * t)}
            stroke="var(--border)" strokeWidth="1"
          />
        ))}

        <g clipPath="url(#mcChartClip)">
          {/* Area fill */}
          <path d={areaPath} fill="url(#mcAreaGrad)" />
          {/* Main line */}
          <path d={linePath} fill="none" stroke="var(--navy)" strokeWidth="1.5" strokeLinejoin="round" />

          {/* 50% paid crossover annotation */}
          {halfwayPt && (() => {
            const hx = sx(halfwayPt.year);
            const hy = sy(halfwayPt.balance);
            const labelRight = hx < ML + cW * 0.55;
            return (
              <g>
                <line
                  x1={hx} y1={MT} x2={hx} y2={bottom}
                  stroke="var(--gold)" strokeWidth="1" strokeDasharray="3 3"
                />
                <circle cx={hx} cy={hy} r="4" fill="var(--gold)" />
                <text
                  x={labelRight ? hx + 7 : hx - 7}
                  y={MT + 13}
                  textAnchor={labelRight ? 'start' : 'end'}
                  fill="var(--gold)" fontSize="9.5" fontWeight="600"
                  fontFamily="var(--font)"
                >
                  50% paid · Yr {halfwayPt.year}
                </text>
              </g>
            );
          })()}

          {/* Hover cursor */}
          {hovered && (
            <line
              x1={hovered.svgX} y1={MT}
              x2={hovered.svgX} y2={bottom}
              stroke="var(--heading)" strokeWidth="1"
              strokeDasharray="4 3" opacity="0.22"
            />
          )}
        </g>

        {/* Axis baseline */}
        <line x1={ML} y1={bottom} x2={ML + cW} y2={bottom} stroke="var(--border)" strokeWidth="1" />

        {/* X ticks */}
        {xTicks.map(y => (
          <text
            key={y}
            x={xTick(y)} y={bottom + 18}
            textAnchor="middle"
            fill="var(--muted)" fontSize="10.5" fontFamily="var(--font)"
          >
            {y === 0 ? 'Now' : `Yr ${y}`}
          </text>
        ))}

        {/* Y ticks */}
        {yTicks.filter(t => t > 0).map(t => (
          <text
            key={t}
            x={ML - 6} y={sy(loan * t) + 3.5}
            textAnchor="end"
            fill="var(--muted)" fontSize="10.5" fontFamily="var(--font)"
          >
            {fmtShort(loan * t)}
          </text>
        ))}
      </svg>

      {/* Hover tooltip */}
      {hovered && (() => {
        const pct = (hovered.svgX - ML) / cW;
        return (
          <div style={{
            position: 'absolute', top: 0,
            left: pct < 0.55 ? `calc(${(hovered.svgX / W) * 100}% + 12px)` : undefined,
            right: pct >= 0.55 ? `calc(${((W - hovered.svgX) / W) * 100}% + 12px)` : undefined,
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '10px 14px',
            boxShadow: 'var(--shadow-card)',
            pointerEvents: 'none', minWidth: 188, zIndex: 10,
          }}>
            <div style={{
              fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8,
            }}>
              End of Year {hovered.year}
            </div>
            {[
              { label: 'Remaining balance', value: fmt(hovered.balance), color: 'var(--navy)' },
              { label: 'Equity built', value: fmt(hovered.cumPrincipal), color: 'var(--heading)' },
              { label: 'Interest paid', value: fmt(hovered.cumInterest), color: 'var(--muted)' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 4 }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>{row.label}</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

/* ── Main Calculator ─────────────────────────────────────── */
type Stage = 'inputs' | 'calculating' | 'results' | 'eligibility';

export default function MortgageCalculator({
  defaultPrice = 3_000_000,
}: {
  defaultPrice?: number;
}) {
  const [stage, setStage] = useState<Stage>('inputs');
  const [progress, setProgress] = useState(0);
  const [showEligibility, setShowEligibility] = useState(false);

  // Core inputs
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  const [loanTerm, setLoanTerm] = useState(25);
  const RATE = 4.49; // UAE avg — fixed display, not user-adjustable

  // Eligibility inputs
  const [salary, setSalary] = useState(35_000);
  const [existingEMIs, setExistingEMIs] = useState(0);

  // Contact form
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [sent, setSent] = useState(false);

  const loan = price * (1 - downPct / 100);
  const emi = calcEMI(loan, RATE, loanTerm);
  const totalPaid = emi * loanTerm * 12;
  const totalInterest = totalPaid - loan;
  const downAED = price * (downPct / 100);

  const balances = useMemo(
    () => computeBalances(loan, RATE, loanTerm),
    [loan, loanTerm],
  );

  // Eligibility math
  const stressRate = RATE + 2;
  const stressEMI = calcEMI(loan, stressRate, loanTerm);
  const allowableEMI = salary * 0.5 - existingEMIs;
  const maxLoan = Math.max(0, maxLoanFromEMI(Math.max(0, allowableEMI), stressRate, loanTerm));
  const dbr = salary > 0 ? (existingEMIs + stressEMI) / salary : 1;
  const eligStatus =
    dbr > 0.5 ? 'exceeded' : dbr > 0.45 ? 'borderline' : 'approved';

  // Count-up during calculating phase
  const animEMI = useCountUp(emi, 1400, stage === 'calculating');

  const progressRaf = useRef<number>();

  function handleCalculate() {
    setStage('calculating');
    setProgress(0);
    if (progressRaf.current) cancelAnimationFrame(progressRaf.current);
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setProgress(p);
      if (p < 1) {
        progressRaf.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setStage('results'), 100);
      }
    };
    progressRaf.current = requestAnimationFrame(tick);
  }

  function resetToInputs() {
    setStage('inputs');
    setShowEligibility(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg =
      `Mortgage enquiry — Price: ${fmt(price)}, Loan: ${fmt(loan)}, ` +
      `EMI: ${fmt(emi)}/mo, Salary: ${fmt(salary)}, DBR: ${(dbr * 100).toFixed(1)}%`;
    await fetch('/api/enquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, message: msg, source: 'mortgage' }),
    }).catch(() => null);
    setSent(true);
  }

  const showInputs = stage === 'inputs' || stage === 'calculating';
  const showResults = stage === 'results' || stage === 'eligibility';

  return (
    <>
      <div style={{ maxWidth: 740, margin: '0 auto' }}>

        {/* ── Inputs ── */}
        {showInputs && (
          <div style={{ opacity: stage === 'calculating' ? 0.5 : 1, transition: 'opacity 0.35s ease' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <Slider
                label="Property Price"
                min={500_000} max={20_000_000} step={50_000}
                value={price} onChange={setPrice}
                minL="AED 500K" maxL="AED 20M" display={fmt(price)}
              />
              <Slider
                label="Down Payment"
                sub={`Down payment amount: ${fmt(downAED)}`}
                min={5} max={40} step={1}
                value={downPct} onChange={setDownPct}
                minL="5%" maxL="40%" display={`${downPct}%`}
              />
              <Slider
                label="Loan Term"
                min={5} max={25} step={1}
                value={loanTerm} onChange={setLoanTerm}
                minL="5 years" maxL="25 years" display={`${loanTerm} years`}
              />
            </div>

            {/* Rate pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 999,
                background: 'var(--white-section)', border: '1px solid var(--border)',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', fontWeight: 500 }}>
                  UAE average rate 4.49% p.a. · EIBOR-linked
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Calculating ── */}
        {stage === 'calculating' && (
          <div style={{ marginTop: 30 }}>
            <div style={{
              height: 3, borderRadius: 2,
              background: 'var(--border)', overflow: 'hidden', marginBottom: 14,
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, var(--navy), var(--gold))',
                width: `${progress * 100}%`,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                Calculating repayment schedule…
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800,
                  color: 'var(--navy)', fontFamily: 'var(--font)',
                  letterSpacing: '-0.04em', lineHeight: 1,
                }}>
                  {fmt(animEMI)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>/month</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Calculate button ── */}
        {stage === 'inputs' && (
          <>
            <button
              onClick={handleCalculate}
              style={{
                width: '100%', marginTop: 30, padding: '14px',
                background: 'var(--navy)', color: '#fff',
                fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 600,
                border: 'none', borderRadius: 'var(--radius-btn)',
                cursor: 'pointer', transition: 'background 0.18s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--navy-dark)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--navy)')}
            >
              Calculate my monthly payment
            </button>

            {/* Trust indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 18, flexWrap: 'wrap' }}>
              {['CBUAE 2026 Compliant', 'Stress-Tested +2%'].map(label => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.5" stroke="var(--gold)" strokeWidth="1" />
                    <path d="M3.5 6l1.8 1.8 3.2-3.6" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Results ── */}
        {showResults && (
          <div style={{ marginTop: 8 }}>
            {/* EMI hero */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10,
              }}>
                Estimated monthly payment
              </div>
              <div style={{
                fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)', fontWeight: 800,
                color: 'var(--navy)', fontFamily: 'var(--font)',
                letterSpacing: '-0.04em', lineHeight: 1,
              }}>
                {fmt(emi)}
                <span style={{
                  fontSize: '1rem', fontWeight: 400,
                  color: 'var(--muted)', marginLeft: 10,
                }}>
                  /month
                </span>
              </div>
            </div>

            {/* 3 stat pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
              {[
                { label: 'Total Interest', value: fmt(totalInterest) },
                { label: 'Total Cost', value: fmt(totalPaid + downAED) },
                { label: 'Loan Amount', value: fmt(loan) },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--white-section)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '12px 16px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--heading)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 14, flexWrap: 'wrap', gap: 8,
              }}>
                <div>
                  <div style={{
                    fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3,
                  }}>
                    Loan Balance Over Time
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--body)' }}>
                    {loanTerm}-year term · {RATE.toFixed(2)}% p.a.
                  </div>
                </div>
                <button
                  onClick={resetToInputs}
                  style={{
                    fontSize: '0.75rem', color: 'var(--navy)', fontWeight: 600,
                    background: 'none', border: '1px solid var(--border)',
                    borderRadius: 6, cursor: 'pointer', padding: '5px 12px',
                    transition: 'border-color 0.15s ease',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--heading)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                >
                  Adjust inputs
                </button>
              </div>
              <BalanceChart key={`${loan}-${loanTerm}`} balances={balances} loan={loan} term={loanTerm} />
            </div>

            {/* Eligibility CTA / expanded section */}
            {!showEligibility ? (
              <div style={{
                marginTop: 28, padding: '20px 24px',
                background: 'var(--white-section)', border: '1px solid var(--border)',
                borderRadius: 12, display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>
                    Want your full eligibility report?
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                    Add your income — get CBUAE stress-test results instantly.
                  </div>
                </div>
                <button
                  onClick={() => { setShowEligibility(true); setStage('eligibility'); }}
                  style={{
                    padding: '10px 22px', background: 'var(--navy)', color: '#fff',
                    fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                    border: 'none', borderRadius: 'var(--radius-btn)', cursor: 'pointer',
                    transition: 'background 0.18s ease', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--navy-dark)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--navy)')}
                >
                  Check eligibility
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 28, borderTop: '1px solid var(--border)', paddingTop: 28 }}>
                {/* Eligibility sliders */}
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 22 }}>
                  Your financial profile
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 26, marginBottom: 26 }}>
                  <Slider
                    label="Monthly Salary (net)" min={10_000} max={300_000} step={1_000}
                    value={salary} onChange={setSalary}
                    minL="AED 10K" maxL="AED 300K" display={fmt(salary)}
                  />
                  <Slider
                    label="Existing Monthly Obligations"
                    sub="Car loans, credit cards, other EMIs"
                    min={0} max={50_000} step={500}
                    value={existingEMIs} onChange={setExistingEMIs}
                    minL="None" maxL="AED 50K"
                    display={existingEMIs === 0 ? 'None' : fmt(existingEMIs)}
                  />
                </div>

                {/* Eligibility indicator */}
                {(() => {
                  const cfg = {
                    approved: {
                      label: 'Likely Eligible',
                      color: '#22C55E',
                      bg: 'rgba(34,197,94,0.07)',
                      desc: `DBR ${(dbr * 100).toFixed(1)}% — within CBUAE 50% limit`,
                    },
                    borderline: {
                      label: 'Borderline',
                      color: '#E8A020',
                      bg: 'rgba(232,160,32,0.07)',
                      desc: `DBR ${(dbr * 100).toFixed(1)}% — close to CBUAE limit. Consider reducing obligations.`,
                    },
                    exceeded: {
                      label: 'Limit Exceeded',
                      color: 'var(--red)',
                      bg: 'rgba(232,53,43,0.07)',
                      desc: `DBR ${(dbr * 100).toFixed(1)}% — exceeds CBUAE 50% cap. Reduce loan or obligations.`,
                    },
                  }[eligStatus];
                  return (
                    <div style={{
                      padding: '14px 18px', borderRadius: 10, marginBottom: 26,
                      background: cfg.bg, border: `1px solid ${cfg.color}44`,
                      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                        background: cfg.bg, border: `1.5px solid ${cfg.color}66`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: 11, height: 11, borderRadius: '50%', background: cfg.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: cfg.color }}>
                          {cfg.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                          {cfg.desc}
                        </div>
                      </div>
                      {maxLoan > 0 && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.625rem', color: 'var(--muted)', marginBottom: 2 }}>
                            Max approved loan
                          </div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--heading)' }}>
                            {fmt(maxLoan)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Contact form */}
                {!sent ? (
                  <>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>
                        Receive your full report
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                        Our mortgage specialist reviews your profile and responds within 24 hours — no obligation.
                      </div>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                      {[
                        { name: 'name', label: 'Full Name', type: 'text', ph: 'Your name' },
                        { name: 'email', label: 'Email', type: 'email', ph: 'your@email.com' },
                        { name: 'phone', label: 'Phone', type: 'tel', ph: '+971 50 000 0000' },
                      ].map(f => (
                        <div key={f.name}>
                          <label style={{
                            fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)',
                            display: 'block', marginBottom: 6,
                          }}>
                            {f.label}
                          </label>
                          <input
                            type={f.type} placeholder={f.ph} required
                            value={form[f.name as keyof typeof form]}
                            onChange={e => setForm(d => ({ ...d, [f.name]: e.target.value }))}
                            style={{
                              width: '100%', padding: '10px 14px',
                              border: '1.5px solid var(--border)', borderRadius: 8,
                              background: 'var(--white)', fontFamily: 'var(--font)',
                              fontSize: '0.9375rem', color: 'var(--heading)',
                              outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)')}
                            onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                          />
                        </div>
                      ))}
                      <button
                        type="submit"
                        style={{
                          width: '100%', padding: '13px', marginTop: 4,
                          background: 'var(--navy)', color: '#fff',
                          fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600,
                          border: 'none', borderRadius: 'var(--radius-btn)',
                          cursor: 'pointer', transition: 'background 0.18s ease',
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--navy-dark)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--navy)')}
                      >
                        Send my eligibility report
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center', padding: '32px 24px',
                    background: 'var(--white-section)', borderRadius: 12,
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'rgba(34,197,94,0.08)',
                      border: '1.5px solid rgba(34,197,94,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      <svg width="18" height="14" viewBox="0 0 22 16" fill="none">
                        <path d="M2 8l6 6L20 2" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 6 }}>
                      Report request sent
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                      Our mortgage specialist will contact you within 24 hours.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .mc-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(
            to right,
            var(--gold) var(--fill, 0%),
            var(--border) var(--fill, 0%)
          );
        }
        .mc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: var(--navy);
          border: 2.5px solid #fff;
          box-shadow: 0 0 0 1.5px var(--navy);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .mc-slider::-webkit-slider-thumb:hover {
          transform: scale(1.22);
          box-shadow: 0 0 0 4px rgba(3, 33, 61, 0.14);
        }
        .mc-slider:active::-webkit-slider-thumb {
          transform: scale(1.08);
        }
        .mc-slider::-moz-range-thumb {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: var(--navy);
          border: 2.5px solid #fff;
          cursor: pointer;
        }
        @media (max-width: 640px) {
          .mc-stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
