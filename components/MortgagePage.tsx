'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import Nav from './Nav';
import Footer from './Footer';

/* ── Palette ─────────────────────────────────────────────── */
const OBS    = '#080808';
const GOLD   = '#D5BA8C';
const AMBER  = '#E8A020';
const DANGER = '#E8352B';
const CARD   = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

/* ── Helpers ─────────────────────────────────────────────── */
function fmt(n: number): string {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${Math.round(n).toLocaleString()}`;
}
function fmtShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return `${Math.round(n)}`;
}

function useAnimated(target: number, ms = 380) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef<number>();
  useEffect(() => {
    const start = fromRef.current, end = target;
    if (Math.abs(start - end) < 0.01) return;
    let t0: number | null = null;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min((now - t0) / ms, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(start + (end - start) * ease);
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
      else fromRef.current = end;
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, ms]);
  return val;
}

function calcEMI(loan: number, ratePct: number, termYears: number): number {
  if (loan <= 0 || termYears <= 0) return 0;
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loan / n;
  return loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

function maxLoanFromEMI(capacity: number, ratePct: number, termYears: number): number {
  if (capacity <= 0 || termYears <= 0) return 0;
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return capacity * n;
  return capacity * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
}

function computeAmortization(loan: number, ratePct: number, termYears: number) {
  if (loan <= 0 || termYears <= 0) return { years: [], monthly: 0, totalCost: 0 };
  const r = ratePct / 100 / 12;
  const monthly = calcEMI(loan, ratePct, termYears);
  const years: { year: number; cumInterest: number; cumPrincipal: number }[] = [];
  let balance = loan;
  let cumInterest = 0;
  let cumPrincipal = 0;
  for (let y = 0; y < termYears; y++) {
    for (let m = 0; m < 12; m++) {
      const intPart  = balance * r;
      const prinPart = Math.min(monthly - intPart, balance);
      cumInterest  += intPart;
      cumPrincipal += prinPart;
      balance       = Math.max(balance - prinPart, 0);
    }
    years.push({ year: y + 1, cumInterest, cumPrincipal });
  }
  return { years, monthly, totalCost: monthly * termYears * 12 };
}

/* ── CBUAE 2026 Hook ─────────────────────────────────────── */
function useMortgageApproval({
  salary, existingEMIs, ccLimit,
  propertyPrice, downPct, marketRate,
  loanTerm, age, nationality, homeType,
}: {
  salary: number; existingEMIs: number; ccLimit: number;
  propertyPrice: number; downPct: number; marketRate: number;
  loanTerm: number; age: number;
  nationality: 'expat' | 'national'; homeType: 'first' | 'second';
}) {
  return useMemo(() => {
    const stressRate    = marketRate + 2;
    const effectiveTerm = Math.max(1, Math.min(loanTerm, 65 - age));

    /* LTV cap per CBUAE */
    let ltvCap: number;
    if (nationality === 'expat') {
      ltvCap = homeType === 'second' ? 0.60
             : propertyPrice > 5_000_000 ? 0.70 : 0.80;
    } else {
      ltvCap = homeType === 'second' ? 0.70
             : propertyPrice > 5_000_000 ? 0.75 : 0.85;
    }

    const maxLoanByLTV  = propertyPrice * ltvCap;
    const requestedLoan = propertyPrice * (1 - downPct / 100);
    const ccDebt        = ccLimit * 0.05;
    const allowableEMI  = salary * 0.50 - existingEMIs - ccDebt;
    const maxLoanByDBR  = Math.max(0, maxLoanFromEMI(allowableEMI, stressRate, effectiveTerm));
    const maxApproved   = Math.min(maxLoanByLTV, maxLoanByDBR);

    const actualEMI  = calcEMI(requestedLoan, marketRate, effectiveTerm);
    const stressEMI  = calcEMI(requestedLoan, stressRate, effectiveTerm);
    const dbr        = salary > 0 ? (existingEMIs + ccDebt + stressEMI) / salary : 1;

    const status: 'approved' | 'borderline' | 'exceeded' =
      dbr > 0.50 ? 'exceeded' : dbr > 0.45 ? 'borderline' : 'approved';

    const fillPct    = maxApproved > 0 ? Math.min(requestedLoan / maxApproved, 1.15) * 100 : 105;
    const downAED    = propertyPrice * downPct / 100;
    const totalInterest = actualEMI * effectiveTerm * 12 - requestedLoan;
    const totalCost     = actualEMI * effectiveTerm * 12 + downAED;

    return {
      stressRate, effectiveTerm, ltvCap,
      maxLoanByLTV, maxLoanByDBR, maxApproved,
      requestedLoan, actualEMI, stressEMI,
      dbr, status, fillPct, downAED, totalInterest, totalCost,
    };
  }, [salary, existingEMIs, ccLimit, propertyPrice, downPct, marketRate, loanTerm, age, nationality, homeType]);
}

/* ── HouseFill ───────────────────────────────────────────── */
function HouseFill({ fillPct, status }: { fillPct: number; status: 'approved' | 'borderline' | 'exceeded' }) {
  const fillRef = useRef<SVGRectElement>(null);
  const SVG_H   = 220;

  const fillColor = fillPct > 100 ? DANGER : fillPct > 85 ? AMBER : GOLD;

  useEffect(() => {
    if (!fillRef.current) return;
    const targetY = SVG_H * (1 - Math.min(fillPct, 115) / 100);
    gsap.to(fillRef.current, { y: targetY, duration: 0.85, ease: 'power2.out' });
  }, [fillPct]);

  const STATUS_CFG = {
    approved:   { label: 'APPROVED',                   color: '#22C55E', icon: '✓' },
    borderline: { label: 'BORDERLINE — REVIEW ADVISED', color: AMBER,    icon: '!' },
    exceeded:   { label: 'CBUAE LIMIT EXCEEDED',        color: DANGER,   icon: '✕' },
  };
  const sc = STATUS_CFG[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <svg viewBox="0 0 200 220" width={170} height={187} style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id="houseClip">
            <rect x="138" y="8"  width="22" height="54" rx="2" />
            <path d="M 5 92 L 100 18 L 195 92 L 175 92 L 175 210 L 25 210 L 25 92 Z" />
          </clipPath>
        </defs>

        {/* Animated fill — clipped to house silhouette */}
        <g clipPath="url(#houseClip)">
          <rect ref={fillRef} x="0" y={SVG_H} width="200" height={SVG_H}
            fill={fillColor} opacity={0.72}
            style={{ transition: 'fill 0.4s ease' }} />
        </g>

        {/* House outline */}
        <path d="M 5 92 L 100 18 L 195 92 L 175 92 L 175 210 L 25 210 L 25 92 Z"
          fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        <rect x="138" y="8" width="22" height="54" rx="2"
          fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        <line x1="5" y1="92" x2="195" y2="92" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

        {/* Windows */}
        <rect x="38"  y="112" width="36" height="30" rx="3"
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <line x1="56" y1="112" x2="56" y2="142" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="38" y1="127" x2="74" y2="127" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        <rect x="126" y="112" width="36" height="30" rx="3"
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <line x1="144" y1="112" x2="144" y2="142" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="126" y1="127"  x2="162" y2="127" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Door */}
        <path d="M 82 210 L 82 172 Q 100 162 118 172 L 118 210"
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      </svg>

      {/* Status badge */}
      <div style={{
        padding: '5px 14px', borderRadius: 999,
        background: `${sc.color}18`, border: `1px solid ${sc.color}50`,
        fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: sc.color,
        textAlign: 'center', transition: 'all 0.3s ease',
      }}>
        {sc.icon}&nbsp; {sc.label}
      </div>

      <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.48)', textAlign: 'center' }}>
        {Math.min(fillPct, 100).toFixed(0)}% of max approved
      </div>
    </div>
  );
}

/* ── DBR Gauge ───────────────────────────────────────────── */
function DBRGauge({ dbr }: { dbr: number }) {
  const arcRef  = useRef<SVGPathElement>(null);
  const animPct = useAnimated(dbr * 100, 420);
  const cx = 100, cy = 105, r = 72;
  const totalLen     = Math.PI * r;          // semicircle arc length ≈ 226
  const activeFrac   = Math.min(dbr / 0.50, 1.1);
  const gaugeColor   = dbr > 0.50 ? DANGER
                     : dbr > 0.45 ? '#FF6B35'
                     : dbr > 0.40 ? AMBER
                     : GOLD;

  useEffect(() => {
    if (!arcRef.current) return;
    const offset = Math.max(0, totalLen * (1 - activeFrac));
    gsap.to(arcRef.current, { strokeDashoffset: offset, duration: 0.65, ease: 'power2.out' });
    if (dbr > 0.50) {
      gsap.fromTo(arcRef.current,
        { x: -3 },
        { x: 3, repeat: 4, yoyo: true, duration: 0.055, ease: 'none',
          onComplete: () => gsap.set(arcRef.current, { x: 0 }) }
      );
    }
  }, [activeFrac, dbr, totalLen]);

  /* Tick marks: 0%, 10%…50% DBR → 0, 0.2, 0.4, 0.6, 0.8, 1.0 of arc */
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1.0].map(t => {
    const angle = Math.PI * (1 - t);
    return {
      x1: cx + (r - 9)  * Math.cos(angle), y1: cy - (r - 9)  * Math.sin(angle),
      x2: cx + (r + 5)  * Math.cos(angle), y2: cy - (r + 5)  * Math.sin(angle),
      lx: cx + (r + 18) * Math.cos(angle), ly: cy - (r + 18) * Math.sin(angle),
      label: `${t * 50}%`,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg viewBox="0 20 200 115" style={{ width: '100%', maxWidth: 230 }}>
        {/* Background arc */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" strokeLinecap="round" />
        {/* Active arc */}
        <path ref={arcRef}
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={gaugeColor} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={totalLen} strokeDashoffset={totalLen}
          style={{ transition: 'stroke 0.3s ease' }} />
        {/* Ticks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            <text x={t.lx} y={t.ly + 3.5} textAnchor="middle"
              fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="var(--font)">
              {t.label}
            </text>
          </g>
        ))}
        {/* Centre value */}
        <text x={cx} y={cy - 4} textAnchor="middle"
          fill={gaugeColor} fontSize="20" fontWeight="800" fontFamily="var(--font)"
          style={{ transition: 'fill 0.3s ease' }}>
          {animPct.toFixed(1)}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle"
          fill="rgba(255,255,255,0.28)" fontSize="9.5" fontFamily="var(--font)">
          DBR
        </text>
      </svg>
      <div style={{
        fontSize: '0.625rem', color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
      }}>
        Debt Burden Ratio · CBUAE limit 50%
      </div>
    </div>
  );
}

/* ── Amortization Chart ──────────────────────────────────── */
function AmortizationChart({
  loan, marketRate, effectiveTerm,
}: {
  loan: number; marketRate: number; effectiveTerm: number;
}) {
  const [hovered,  setHovered]  = useState<{ year: number; ci: number; cp: number; svgX: number } | null>(null);
  const [showHike, setShowHike] = useState(false);
  const clipRef = useRef<SVGRectElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);

  const W = 700, H = 210, ML = 58, MR = 16, MT = 18, MB = 34;
  const cW = W - ML - MR;
  const cH = H - MT - MB;

  const base = useMemo(() => computeAmortization(loan, marketRate,     effectiveTerm), [loan, marketRate,     effectiveTerm]);
  const hike = useMemo(() => computeAmortization(loan, marketRate + 1, effectiveTerm), [loan, marketRate,     effectiveTerm]);

  const maxY = Math.max(base.totalCost, hike.totalCost) * 1.04;
  const N    = effectiveTerm;

  const sx = (year: number) => ML + (year / N) * cW;
  const sy = (v: number)    => MT + cH - (v / maxY) * cH;
  const bottom                = MT + cH;

  function buildInterest(d: typeof base) {
    if (!d.years.length) return '';
    const fwd = d.years.map(y => `${sx(y.year).toFixed(1)},${sy(y.cumInterest).toFixed(1)}`).join(' ');
    const back = [...d.years].reverse().map(y => `${sx(y.year).toFixed(1)},${bottom.toFixed(1)}`).join(' ');
    return `${ML},${bottom} ${fwd} ${back} ${ML},${bottom}`;
  }

  function buildPrincipal(d: typeof base) {
    if (!d.years.length) return '';
    const fwd  = d.years.map(y => `${sx(y.year).toFixed(1)},${sy(y.cumInterest + y.cumPrincipal).toFixed(1)}`).join(' ');
    const back = [...d.years].reverse().map(y => `${sx(y.year).toFixed(1)},${sy(y.cumInterest).toFixed(1)}`).join(' ');
    return `${ML},${bottom} ${fwd} ${back} ${ML},${bottom}`;
  }

  /* Reveal animation on mount */
  useEffect(() => {
    if (!clipRef.current) return;
    gsap.fromTo(clipRef.current,
      { attr: { width: 0 } },
      { attr: { width: cW + MR }, duration: 1.5, ease: 'power2.inOut', delay: 0.2 }
    );
  }, [cW]);

  const extraInterest = hike.totalCost - base.totalCost;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !base.years.length) return;
    const scale  = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scale;
    const yearF  = ((mouseX - ML) / cW) * N;
    const idx    = Math.max(0, Math.min(Math.round(yearF) - 1, base.years.length - 1));
    const pt     = base.years[idx];
    setHovered({ year: pt.year, ci: pt.cumInterest, cp: pt.cumPrincipal, svgX: sx(pt.year) });
  };

  const xTicks = [0, 5, 10, 15, 20, 25].filter(y => y <= N);
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD, marginBottom: 5 }}>
            Amortization Breakdown
          </div>
          <h3 style={{ fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Principal vs Interest — {N}-Year Payoff
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, fontSize: '0.625rem', color: 'rgba(255,255,255,0.40)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: 'rgba(213,186,140,0.65)', display: 'inline-block' }} />
              Principal (equity)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: 'rgba(232,53,43,0.55)', display: 'inline-block' }} />
              Interest (cost)
            </span>
          </div>
          {/* Rate hike toggle */}
          <button onClick={() => setShowHike(h => !h)} style={{
            padding: '5px 13px', borderRadius: 999, cursor: 'pointer',
            fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.05em',
            border: `1px solid ${showHike ? DANGER : 'rgba(255,255,255,0.14)'}`,
            background: showHike ? `${DANGER}12` : 'transparent',
            color: showHike ? DANGER : 'rgba(255,255,255,0.42)',
            transition: 'all 0.2s ease',
          }}>
            {showHike ? '▲ +1% Hike Active' : 'Show +1% Rate Hike'}
          </button>
        </div>
      </div>

      {/* Rate hike callout */}
      {showHike && (
        <div style={{
          padding: '9px 14px', borderRadius: 8, marginBottom: 14,
          background: `${DANGER}10`, border: `1px solid ${DANGER}28`,
          fontSize: '0.75rem', color: DANGER, fontWeight: 600,
        }}>
          +1% rate hike costs an extra {fmt(extraInterest)} over {N} years
        </div>
      )}

      {/* Chart */}
      <div style={{ position: 'relative' }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}>
          <defs>
            <clipPath id="chartReveal">
              <rect ref={clipRef} x={ML} y={0} width={0} height={H} />
            </clipPath>
          </defs>

          <g clipPath="url(#chartReveal)">
            {/* Hike areas (behind base) */}
            {showHike && <>
              <polygon points={buildInterest(hike)}   fill="rgba(232,53,43,0.12)"   style={{ transition: 'all 0.6s ease' }} />
              <polygon points={buildPrincipal(hike)}  fill="rgba(213,186,140,0.10)" style={{ transition: 'all 0.6s ease' }} />
            </>}

            {/* Base areas */}
            <polygon points={buildInterest(base)}  fill="rgba(232,53,43,0.32)" />
            <polygon points={buildPrincipal(base)} fill="rgba(213,186,140,0.48)" />

            {/* Interest boundary line */}
            <polyline
              points={`${ML},${bottom} ` + base.years.map(y =>
                `${sx(y.year).toFixed(1)},${sy(y.cumInterest).toFixed(1)}`).join(' ')}
              fill="none" stroke="rgba(232,53,43,0.55)" strokeWidth="1.5" />

            {/* Total paid line */}
            <polyline
              points={`${ML},${bottom} ` + base.years.map(y =>
                `${sx(y.year).toFixed(1)},${sy(y.cumInterest + y.cumPrincipal).toFixed(1)}`).join(' ')}
              fill="none" stroke={`${GOLD}55`} strokeWidth="1.5" />

            {/* Hover cursor */}
            {hovered && (
              <line x1={hovered.svgX} y1={MT} x2={hovered.svgX} y2={bottom}
                stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeDasharray="4 3" />
            )}
          </g>

          {/* Axes */}
          <line x1={ML} y1={bottom} x2={ML + cW} y2={bottom} stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
          <line x1={ML} y1={MT}     x2={ML}      y2={bottom} stroke="rgba(255,255,255,0.09)" strokeWidth="1" />

          {/* X-axis ticks */}
          {xTicks.map(y => (
            <text key={y} x={sx(y)} y={bottom + 17} textAnchor="middle"
              fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="var(--font)">
              {y === 0 ? 'Start' : `Yr ${y}`}
            </text>
          ))}

          {/* Y-axis ticks */}
          {yTicks.map(t => (
            <g key={t}>
              <line x1={ML - 4} y1={sy(maxY * t)} x2={ML} y2={sy(maxY * t)}
                stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <text x={ML - 7} y={sy(maxY * t) + 3} textAnchor="end"
                fill="rgba(255,255,255,0.40)" fontSize="10" fontFamily="var(--font)">
                {fmtShort(maxY * t)}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover tooltip */}
        {hovered && (() => {
          const pct = hovered.svgX / W;
          return (
            <div style={{
              position: 'absolute', top: 0,
              left: pct < 0.62 ? `${pct * 100 + 1}%` : undefined,
              right: pct >= 0.62 ? `${(1 - pct) * 100 + 1}%` : undefined,
              background: 'rgba(8,8,8,0.96)',
              border: `1px solid ${BORDER}`,
              borderRadius: 10, padding: '10px 14px',
              pointerEvents: 'none',
              backdropFilter: 'blur(16px)',
              minWidth: 176, zIndex: 10,
            }}>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
                End of Year {hovered.year}
              </div>
              {[
                { label: 'Equity gained',  value: fmt(hovered.cp), color: GOLD   },
                { label: 'Interest paid',  value: fmt(hovered.ci), color: DANGER },
                { label: 'Total outflow',  value: fmt(hovered.ci + hovered.cp), color: '#fff' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ── Reusable Slider ─────────────────────────────────────── */
function Slider({ label, sub, min, max, step, value, onChange, minL, maxL, display }: {
  label: string; sub?: string | null; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void;
  minL: string; maxL: string; display: string;
}) {
  const pct = `${((value - min) / (max - min)) * 100}%`;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', lineHeight: 1.3 }}>
            {label}
          </div>
          {sub && <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.50)', marginTop: 2 }}>{sub}</div>}
        </div>
        <span style={{
          fontSize: '0.6875rem', fontWeight: 700, color: '#fff',
          background: 'rgba(255,255,255,0.07)', border: `1px solid ${BORDER}`,
          borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0,
          fontFamily: 'var(--font)',
        }}>
          {display}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="mse-slider"
        style={{ width: '100%', '--fill': pct } as React.CSSProperties} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: 'rgba(255,255,255,0.38)', marginTop: 4 }}>
        <span>{minL}</span><span>{maxL}</span>
      </div>
    </div>
  );
}

/* ── Toggle Pills ────────────────────────────────────────── */
function Toggle({ value, options, onChange }: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font)', fontSize: '0.625rem', fontWeight: 700,
          background: value === o.value ? 'rgba(255,255,255,0.11)' : 'transparent',
          color: value === o.value ? '#fff' : 'rgba(255,255,255,0.32)',
          transition: 'all 0.18s ease', letterSpacing: '0.04em',
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function MortgagePage() {
  const [salary,       setSalary]       = useState(35_000);
  const [existingEMIs, setExistingEMIs] = useState(0);
  const [ccLimit,      setCcLimit]      = useState(0);
  const [showCC,       setShowCC]       = useState(false);
  const [price,        setPrice]        = useState(3_000_000);
  const [downPct,      setDownPct]      = useState(20);
  const [marketRate,   setMarketRate]   = useState(4.49);
  const [loanTerm,     setLoanTerm]     = useState(25);
  const [age,          setAge]          = useState(35);
  const [nationality,  setNationality]  = useState<'expat' | 'national'>('expat');
  const [homeType,     setHomeType]     = useState<'first' | 'second'>('first');
  const [form,         setForm]         = useState({ name: '', email: '', phone: '' });
  const [sent,         setSent]         = useState(false);

  const m = useMortgageApproval({
    salary, existingEMIs, ccLimit, propertyPrice: price, downPct,
    marketRate, loanTerm, age, nationality, homeType,
  });

  const animEMI = useAnimated(m.actualEMI);
  const animMax = useAnimated(m.maxApproved);

  const agePct = `${((age - 22) / (62 - 22)) * 100}%`;

  return (
    <>
      <Nav />

      {/* ── Hero ── */}
      <section style={{ background: OBS, paddingTop: 100, paddingBottom: 44, paddingInline: 'var(--gutter-lg)', textAlign: 'center' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
            padding: '4px 14px', borderRadius: 999,
            background: `${GOLD}10`, border: `1px solid ${GOLD}28`,
          }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD }}>
              CBUAE 2026 · Stress-Tested · Dubai
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font)', fontSize: 'clamp(2rem,4vw,2.75rem)',
            fontWeight: 800, letterSpacing: '-0.03em', color: '#fff',
            marginBottom: 14, lineHeight: 1.15,
          }}>
            Mortgage Sanction Engine
          </h1>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.38)', maxWidth: 420, margin: '0 auto' }}>
            Real bank logic. Stress-tested at market rate +2%. DBR capped at 50% per CBUAE mandate.
          </p>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section style={{ background: OBS, paddingBlock: '8px 64px', paddingInline: 'var(--gutter)' }}>
        <div className="container">
          <div className="mse-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 200px 1fr', gap: 14, alignItems: 'start' }}>

            {/* LEFT — inputs */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px 18px', backdropFilter: 'blur(20px)' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 18 }}>
                Your Financial Profile
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Slider label="Monthly Salary" min={10_000} max={300_000} step={1_000}
                  value={salary} onChange={setSalary}
                  minL="AED 10K" maxL="AED 300K" display={fmt(salary)} />

                <Slider label="Existing Monthly EMIs" min={0} max={50_000} step={500}
                  value={existingEMIs} onChange={setExistingEMIs}
                  minL="AED 0" maxL="AED 50K" display={existingEMIs === 0 ? 'None' : fmt(existingEMIs)} />

                {/* Credit card toggle */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showCC ? 10 : 0 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                      Credit Card Limits
                    </span>
                    <button onClick={() => setShowCC(s => !s)} style={{
                      fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999,
                      border: `1px solid rgba(255,255,255,0.14)`, background: 'transparent',
                      color: 'rgba(255,255,255,0.38)', cursor: 'pointer',
                    }}>
                      {showCC ? 'Remove' : 'Add +'}
                    </button>
                  </div>
                  {showCC && (
                    <Slider label="Total CC Limit" sub="5% of limit counted as monthly debt (CBUAE)"
                      min={0} max={500_000} step={10_000}
                      value={ccLimit} onChange={setCcLimit}
                      minL="0" maxL="500K" display={ccLimit === 0 ? 'None' : fmt(ccLimit)} />
                  )}
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                  Property Details
                </p>

                <Slider label="Property Price" min={500_000} max={20_000_000} step={50_000}
                  value={price} onChange={setPrice}
                  minL="500K" maxL="20M" display={fmt(price)} />

                <Slider label="Down Payment" sub={`≈ ${fmt(m.downAED)}`}
                  min={5} max={40} step={1}
                  value={downPct} onChange={setDownPct}
                  minL="5%" maxL="40%" display={`${downPct}%`} />

                <Slider label="Market Rate (p.a.)" min={2.5} max={7} step={0.05}
                  value={marketRate} onChange={setMarketRate}
                  minL="2.5%" maxL="7%" display={`${marketRate.toFixed(2)}%`} />

                <Slider label="Loan Tenure" min={5} max={25} step={1}
                  value={loanTerm} onChange={setLoanTerm}
                  minL="5 yrs" maxL="25 yrs" display={`${loanTerm} yrs`} />

                {/* Age */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Your Age</span>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 700, color: '#fff',
                      background: 'rgba(255,255,255,0.07)', border: `1px solid ${BORDER}`,
                      borderRadius: 6, padding: '2px 8px', fontFamily: 'var(--font)',
                    }}>
                      {age} yrs · max {m.effectiveTerm}yr term
                    </span>
                  </div>
                  <input type="range" min={22} max={62} step={1} value={age}
                    onChange={e => setAge(parseInt(e.target.value))}
                    className="mse-slider"
                    style={{ width: '100%', '--fill': agePct } as React.CSSProperties} />
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 7 }}>
                      Nationality
                    </div>
                    <Toggle value={nationality} onChange={v => setNationality(v as 'expat' | 'national')}
                      options={[{ value: 'expat', label: 'Expat' }, { value: 'national', label: 'UAE National' }]} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 7 }}>
                      Home Type
                    </div>
                    <Toggle value={homeType} onChange={v => setHomeType(v as 'first' | 'second')}
                      options={[{ value: 'first', label: '1st Home' }, { value: 'second', label: '2nd Home' }]} />
                  </div>
                </div>
              </div>
            </div>

            {/* CENTRE — house + badges */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 20 }}>
              <HouseFill fillPct={m.fillPct} status={m.status} />

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>
                  Stress Rate
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: '1.1875rem', fontWeight: 800, color: AMBER }}>
                  {m.stressRate.toFixed(2)}%
                </div>
                <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>
                  {marketRate.toFixed(2)}% + 2%
                </div>
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>
                  LTV Cap
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: '1.1875rem', fontWeight: 800, color: GOLD }}>
                  {(m.ltvCap * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>
                  {nationality === 'expat' ? 'Expat' : 'UAE'} · {homeType === 'first' ? '1st' : '2nd'}
                </div>
              </div>
            </div>

            {/* RIGHT — verdict */}
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 16, padding: '22px 18px',
              position: 'sticky', top: 80,
              backdropFilter: 'blur(20px)',
            }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 18 }}>
                Sanction Verdict
              </p>

              {/* Max approved */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>
                  Max Approved Loan
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem,2.2vw,1.875rem)', fontWeight: 800, letterSpacing: '-0.03em', color: GOLD, lineHeight: 1 }}>
                  {fmt(animMax)}
                </div>
                <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                  min(LTV cap, DBR allowance)
                </div>
              </div>

              {/* Actual EMI */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)', marginBottom: 4 }}>
                  Actual EMI (Market Rate)
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>
                  {fmt(animEMI)}
                  <span style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'rgba(255,255,255,0.50)', marginLeft: 5 }}>/mo</span>
                </div>
              </div>

              {/* Stress EMI */}
              <div style={{ padding: '9px 11px', borderRadius: 8, marginBottom: 16, background: `${AMBER}0D`, border: `1px solid ${AMBER}22` }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: AMBER, marginBottom: 3 }}>
                  Bank Stress-Test EMI
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 700, color: AMBER }}>
                  {fmt(m.stressEMI)}<span style={{ fontSize: '0.625rem', fontWeight: 400, marginLeft: 4 }}>/mo</span>
                </div>
              </div>

              {/* DBR Gauge */}
              <div style={{ marginBottom: 14 }}>
                <DBRGauge dbr={m.dbr} />
              </div>

              {/* Stats 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 14 }}>
                {[
                  { label: 'Loan Amount',    value: fmt(m.requestedLoan)  },
                  { label: 'Down Payment',   value: fmt(m.downAED)        },
                  { label: 'Total Interest', value: fmt(m.totalInterest)  },
                  { label: 'Total Outflow',  value: fmt(m.totalCost)      },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)', marginBottom: 3 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => document.getElementById('mse-form')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  width: '100%', padding: '12px',
                  background: GOLD, color: '#080808',
                  fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 700,
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  transition: 'opacity 0.18s ease', letterSpacing: '0.02em',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.82')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Speak with a Mortgage Advisor
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Amortization Chart ── */}
      <section style={{ background: '#0C0C0C', paddingBlock: 56, paddingInline: 'var(--gutter)' }}>
        <div className="container">
          <AmortizationChart
            loan={m.requestedLoan}
            marketRate={marketRate}
            effectiveTerm={m.effectiveTerm}
          />
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="mse-form" style={{ background: OBS, paddingBlock: 64, paddingInline: 'var(--gutter)' }}>
        <div className="container" style={{ maxWidth: 448 }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: `${GOLD}15`, border: `1px solid ${GOLD}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
              }}>
                <svg width="18" height="14" viewBox="0 0 22 16" fill="none">
                  <path d="M2 8l6 6L20 2" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                We&apos;ll be in touch!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>
                Our mortgage specialist will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <span style={{ display: 'inline-block', marginBottom: 10, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
                  Free Consultation
                </span>
                <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  Speak with a Mortgage Advisor
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.7 }}>
                  No obligation — expert guidance tailored to your situation.
                </p>
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                const msg = `Mortgage enquiry — Price: ${fmt(price)}, Loan: ${fmt(m.requestedLoan)}, EMI: ${fmt(m.actualEMI)}, DBR: ${(m.dbr * 100).toFixed(1)}%`;
                await fetch('/api/enquire', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...form, message: msg, type: 'mortgage' }),
                }).catch(() => null);
                setSent(true);
              }}>
                {[
                  { name: 'name',  label: 'Full Name', type: 'text',  ph: 'Your name'       },
                  { name: 'email', label: 'Email',     type: 'email', ph: 'your@email.com'   },
                  { name: 'phone', label: 'Phone',     type: 'tel',   ph: '+971 50 000 0000' },
                ].map(f => (
                  <div key={f.name} style={{ marginBottom: 13 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.52)', display: 'block', marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input type={f.type} placeholder={f.ph} required
                      value={form[f.name as keyof typeof form]}
                      onChange={e => setForm(d => ({ ...d, [f.name]: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: '1.5px solid rgba(255,255,255,0.09)',
                        background: 'rgba(255,255,255,0.04)',
                        fontFamily: 'var(--font)', fontSize: '0.9375rem',
                        color: '#fff', outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={e  => ((e.currentTarget as HTMLElement).style.borderColor = `${GOLD}80`)}
                      onBlur={e   => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)')}
                    />
                  </div>
                ))}
                <button type="submit" style={{
                  width: '100%', padding: '13px', marginTop: 4,
                  background: GOLD, color: '#080808',
                  fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 700,
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  transition: 'opacity 0.18s ease',
                }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.84')}
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
        .mse-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(
            to right,
            ${GOLD} var(--fill, 0%),
            rgba(255,255,255,0.09) var(--fill, 0%)
          );
        }
        .mse-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 15px; height: 15px;
          border-radius: 50%;
          background: ${GOLD};
          border: 2px solid #080808;
          box-shadow: 0 0 0 2px ${GOLD}45;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .mse-slider::-webkit-slider-thumb:hover {
          transform: scale(1.28);
          box-shadow: 0 0 0 4px ${GOLD}28;
        }
        .mse-slider:active::-webkit-slider-thumb { transform: scale(1.1); }
        .mse-slider::-moz-range-thumb {
          width: 15px; height: 15px;
          border-radius: 50%;
          background: ${GOLD};
          border: 2px solid #080808;
          cursor: pointer;
        }

        @media (max-width: 920px) {
          .mse-grid { grid-template-columns: 1fr !important; }
        }

        input::placeholder { color: rgba(255,255,255,0.20); }
      `}</style>
    </>
  );
}
