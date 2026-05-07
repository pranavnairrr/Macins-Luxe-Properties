'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import Footer from './Footer';

const LENDERS = ['Emirates NBD', 'HSBC', 'Mashreq', 'RAK Bank', 'ADCB', 'FAB'];

function formatAED(n: number) {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n.toFixed(0)}`;
}

export default function MortgagePage() {
  const [propertyPrice, setPropertyPrice] = useState(3_000_000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(25);

  const [income, setIncome] = useState('');
  const [obligations, setObligations] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const { monthlyPayment, loanAmount, totalInterest, totalCost } = useMemo(() => {
    const loanAmount = propertyPrice * (1 - downPaymentPct / 100);
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const monthly = r === 0 ? loanAmount / n : loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalCost = monthly * n;
    const totalInterest = totalCost - loanAmount;
    return { monthlyPayment: monthly, loanAmount, totalInterest, totalCost };
  }, [propertyPrice, downPaymentPct, interestRate, loanTerm]);

  const principalPct = loanAmount / totalCost * 100;
  const interestPct = 100 - principalPct;

  const eligibility = useMemo(() => {
    const monthlyIncome = parseFloat(income) || 0;
    const monthlyObligations = parseFloat(obligations) || 0;
    const maxPayment = monthlyIncome * 0.50 - monthlyObligations;
    if (maxPayment <= 0) return null;
    const r = 4.5 / 100 / 12;
    const n = 25 * 12;
    const maxLoan = maxPayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    const maxProperty = maxLoan / 0.80;
    return { maxLoan, maxProperty };
  }, [income, obligations]);

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(72px, 10vw, 100px) var(--gutter-lg) clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 16 }}>
            Financial Planning
          </span>
          <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', marginBottom: 16 }}>
            Mortgage Calculator
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.70)' }}>
            Estimate your monthly repayments and check your eligibility for Dubai property financing.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="calc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }}>

            {/* Sliders */}
            <div data-reveal>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 32 }}>Adjust Your Loan</h2>

              {[
                { label: 'Property Price', min: 500_000, max: 20_000_000, step: 50_000, value: propertyPrice, onChange: setPropertyPrice, format: formatAED },
                { label: `Down Payment (${downPaymentPct}%)`, min: 10, max: 40, step: 1, value: downPaymentPct, onChange: setDownPaymentPct, format: (v: number) => `${v}%` },
                { label: 'Annual Interest Rate', min: 2.5, max: 8, step: 0.1, value: interestRate, onChange: setInterestRate, format: (v: number) => `${v.toFixed(1)}%` },
                { label: 'Loan Term', min: 5, max: 30, step: 1, value: loanTerm, onChange: setLoanTerm, format: (v: number) => `${v} years` },
              ].map(slider => (
                <div key={slider.label} style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)' }}>{slider.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)' }}>{slider.format(slider.value)}</span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.value}
                    onChange={e => slider.onChange(parseFloat(e.target.value))}
                    className="mlx-slider"
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>
                    <span>{slider.format(slider.min)}</span>
                    <span>{slider.format(slider.max)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Results panel */}
            <div data-reveal style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 4vw, 40px)', color: '#fff' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.60)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Monthly Payment
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--gold)' }}>
                  {formatAED(monthlyPayment)}
                </div>
              </div>

              {/* Donut chart */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <div style={{
                  width: 120, height: 120,
                  borderRadius: '50%',
                  background: `conic-gradient(#C9A96E 0% ${principalPct}%, rgba(255,255,255,0.20) ${principalPct}% 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--navy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.55)' }}>LTV</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{(100 - downPaymentPct)}%</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} />
                  Principal ({principalPct.toFixed(0)}%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
                  Interest ({interestPct.toFixed(0)}%)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
                {[
                  { label: 'Loan Amount', value: formatAED(loanAmount) },
                  { label: 'Total Interest', value: formatAED(totalInterest) },
                  { label: 'Total Cost', value: formatAED(totalCost) },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 8px' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { document.getElementById('mortgage-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ width: '100%', padding: '14px', background: 'var(--gold)', color: 'var(--heading)', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-btn)', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Apply for This Mortgage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Checker */}
      <section className="section" style={{ background: 'var(--white-section)' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }} data-reveal>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--heading)', marginBottom: 12 }}>
              Eligibility Checker
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--body)' }}>Based on 50% debt-to-income ratio and 80% LTV at 4.5% over 25 years.</p>
          </div>
          <div data-reveal style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: 'clamp(24px, 4vw, 40px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', display: 'block', marginBottom: 8 }}>Monthly Income (AED)</label>
                <input type="number" placeholder="e.g. 30000" value={income} onChange={e => setIncome(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)', fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', display: 'block', marginBottom: 8 }}>Monthly Obligations (AED)</label>
                <input type="number" placeholder="e.g. 5000" value={obligations} onChange={e => setObligations(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)', fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            {eligibility ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ textAlign: 'center', background: 'var(--white-section)', borderRadius: 'var(--radius-md)', padding: '20px 16px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Max Loan</div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--navy)' }}>{formatAED(eligibility.maxLoan)}</div>
                </div>
                <div style={{ textAlign: 'center', background: 'var(--navy)', borderRadius: 'var(--radius-md)', padding: '20px 16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Max Property Value</div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--gold)' }}>{formatAED(eligibility.maxProperty)}</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: '0.875rem' }}>
                Enter your income above to see your eligibility estimate.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partner Lenders */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 36 }} data-reveal>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 8 }}>Our Lending Partners</h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--body)' }}>We work with UAE&apos;s leading banks to secure the best mortgage rates for our clients.</p>
          </div>
          <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            {LENDERS.map(lender => (
              <div key={lender} style={{ padding: '12px 24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', background: 'var(--white)' }}>
                {lender}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <section id="mortgage-form" className="section" style={{ background: 'var(--navy)' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>We&apos;ll be in touch!</h2>
              <p style={{ color: 'rgba(255,255,255,0.70)' }}>Our mortgage specialist will contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                  Book a Free Mortgage Consultation
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.70)' }}>Speak with our expert mortgage advisors — no obligation.</p>
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                const payload = { ...formData, message: `Mortgage consultation request. Property price: ${formatAED(propertyPrice)}, Down: ${downPaymentPct}%, Rate: ${interestRate}%, Term: ${loanTerm}yr`, type: 'mortgage' };
                await fetch('/api/enquire', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
                setSubmitted(true);
              }}>
                {[{ name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' }, { name: 'email', label: 'Email', type: 'email', placeholder: 'Your email' }, { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+971 50 000 0000' }].map(f => (
                  <div key={f.name} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.80)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required value={formData[f.name as keyof typeof formData]} onChange={e => setFormData(d => ({ ...d, [f.name]: e.target.value }))}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-btn)', border: '1px solid rgba(255,255,255,0.20)', background: 'rgba(255,255,255,0.08)', fontFamily: 'var(--font)', fontSize: '0.875rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <button type="submit" style={{ width: '100%', padding: '14px', background: 'var(--gold)', color: 'var(--heading)', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-btn)', cursor: 'pointer', marginTop: 8 }}>
                  Book Consultation
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .mlx-slider { -webkit-appearance: none; appearance: none; height: 4px; background: var(--border); border-radius: 2px; outline: none; cursor: pointer; }
        .mlx-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--gold); border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.15); cursor: pointer; }
        .mlx-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--gold); border: 2px solid #fff; cursor: pointer; }
      `}</style>
      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
        input[type=number]::placeholder { color: var(--muted); }
        input[type=text]::placeholder, input[type=email]::placeholder, input[type=tel]::placeholder { color: rgba(255,255,255,0.40); }
      `}</style>
    </>
  );
}
