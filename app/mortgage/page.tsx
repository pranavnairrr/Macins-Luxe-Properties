import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import MortgageCalculator from '@/components/MortgageCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Macins Luxe',
  description:
    'Estimate monthly payments for Dubai property and check your CBUAE eligibility. Real UAE bank logic, stress-tested at market rate +2%.',
};

export default function MortgageRoute() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{
        background: 'var(--white-section)',
        paddingTop: 110, paddingBottom: 52,
        paddingInline: 'var(--gutter-lg)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 18, padding: '4px 14px', borderRadius: 999,
            background: 'var(--gold-subtle)', border: '1px solid rgba(213,186,140,0.28)',
          }}>
            <span style={{
              fontSize: '0.625rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              CBUAE 2026 · Stress-Tested · Dubai
            </span>
          </div>
          <h1 className="text-h1" style={{ color: 'var(--heading)', marginBottom: 14, lineHeight: 1.2 }}>
            Mortgage Calculator
          </h1>
          <p className="text-body" style={{ color: 'var(--body)', lineHeight: 1.75, maxWidth: 440, margin: '0 auto' }}>
            Enter your property details to estimate monthly payments and check your eligibility in seconds.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section style={{
        background: 'var(--white)',
        paddingBlock: 60,
        paddingInline: 'var(--gutter)',
      }}>
        <div className="container">
          <MortgageCalculator />
        </div>
      </section>

      <Footer />
    </>
  );
}
