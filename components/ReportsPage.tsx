'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Nav from './Nav';
import Footer from './Footer';
import { reports, type Report } from '@/lib/reports-data';

const FILTER_TABS = ['All', 'Annual Report', 'Quarterly Report', 'Area Report', 'Market Snapshot'] as const;
type Filter = typeof FILTER_TABS[number];

const featured = reports.find(r => r.featured) ?? reports[0];

const STATS = [
  { value: 'AED 47.8B', label: 'Total Transactions', desc: '2025 annual market volume' },
  { value: '23,400+', label: 'Units Sold', desc: 'Residential properties sold' },
  { value: '+18%', label: 'YoY Growth', desc: 'Transaction value increase' },
  { value: '42%', label: 'Off-Plan Share', desc: 'Of all units sold in 2025' },
];

export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const filtered = activeFilter === 'All'
    ? reports.filter(r => r.slug !== featured.slug)
    : reports.filter(r => r.category === activeFilter && r.slug !== featured.slug);

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(72px, 10vw, 100px) var(--gutter-lg) clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 16 }}>
            Market Intelligence
          </span>
          <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', marginBottom: 16 }}>
            Dubai Real Estate Reports
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.70)' }}>
            Comprehensive market analysis, area guides, and investment forecasts to inform your property decisions.
          </p>
        </div>
      </section>

      {/* Featured Report */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div
            data-reveal
            className="featured-report"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 24px rgba(26,37,53,0.08)',
              marginBottom: 64,
            }}
          >
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 340 }}>
              <Image src={featured.image} alt={featured.title} fill sizes="50vw" style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(3,33,61,0.70) 0%, rgba(3,33,61,0.30) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(201,169,110,0.18)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', border: '1px solid rgba(201,169,110,0.30)' }}>
                  Featured Report
                </span>
              </div>
            </div>
            <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', display: 'block', marginBottom: 12 }}>
                {featured.category} — {featured.year}
              </span>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', color: 'var(--heading)', marginBottom: 16 }}>
                {featured.title}
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--body)', marginBottom: 24 }}>
                {featured.description}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {featured.highlights.map(h => (
                  <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.875rem', color: 'var(--body)' }}>
                    <CheckCircle2 size={16} strokeWidth={1.5} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                    {h}
                  </li>
                ))}
              </ul>
              <a
                href={featured.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: 'var(--navy)', borderRadius: 'var(--radius-btn)', padding: '12px 24px', width: 'fit-content', transition: 'background 0.2s ease' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1a3a5c')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--navy)')}
              >
                Download Report
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* Data Snapshot */}
          <div data-reveal className="stats-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 64 }}>
            {STATS.map(s => (
              <div key={s.value} style={{ textAlign: 'center', padding: '28px 16px', background: 'var(--white-section)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Filter + Archive grid */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {FILTER_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveFilter(tab)}
                style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600, padding: '8px 18px', borderRadius: 'var(--radius-pill)', border: activeFilter === tab ? 'none' : '1px solid var(--border)', background: activeFilter === tab ? 'var(--navy)' : 'transparent', color: activeFilter === tab ? '#fff' : 'var(--heading)', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >{tab}</button>
            ))}
          </div>

          <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap)' }}>
            {filtered.map(report => (
              <ReportCard key={report.slug} report={report} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>No reports in this category.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--white-section)', padding: 'clamp(48px, 6vw, 64px) var(--gutter-lg)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--heading)', marginBottom: 12 }}>
            Need Bespoke Research?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--body)', marginBottom: 28 }}>
            Our research team can prepare custom market analysis for your specific requirements.
          </p>
          <Link href="/contact" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: 'var(--navy)', borderRadius: 'var(--radius-btn)', padding: '12px 28px', display: 'inline-block', transition: 'background 0.2s ease' }}>
            Contact Our Research Team
          </Link>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 900px) {
          .featured-report { grid-template-columns: 1fr !important; }
          .stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .reports-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .reports-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function ReportCard({ report }: { report: Report }) {
  return (
    <article
      data-reveal
      style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', flexDirection: 'column', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(26,37,53,0.10)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <Image src={report.image} alt={report.title} fill sizes="33vw" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(3,33,61,0.65) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', background: 'rgba(0,0,0,0.40)', borderRadius: 4, padding: '3px 8px', backdropFilter: 'blur(4px)' }}>
            {report.year}{report.quarter ? ` · ${report.quarter}` : ''}
          </span>
        </div>
      </div>
      <div style={{ padding: '20px 20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 8 }}>
          {report.category}
        </span>
        <h3 style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.45, color: 'var(--heading)', marginBottom: 12, flex: 1 }}>
          {report.title}
        </h3>
        <a
          href={report.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy)', transition: 'color 0.2s ease' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--heading)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--navy)')}
        >
          Download PDF →
        </a>
      </div>
    </article>
  );
}
