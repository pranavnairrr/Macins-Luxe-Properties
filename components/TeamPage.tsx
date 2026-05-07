'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CinemaImage from './CinemaImage';
import Nav from './Nav';
import Footer from './Footer';

type Agent = {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  linkedin?: string;
  image?: string;
  is_active?: boolean;
};

const FILTERS = ['All', 'Dubai', 'Abu Dhabi', 'Management'] as const;
type Filter = typeof FILTERS[number];

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function TeamPage({ agents }: { agents: Agent[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const filtered = agents.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Dubai') return a.title?.toLowerCase().includes('dubai') || (!a.title?.toLowerCase().includes('abu dhabi') && !a.title?.toLowerCase().includes('management') && !a.title?.toLowerCase().includes('director') && !a.title?.toLowerCase().includes('head'));
    if (activeFilter === 'Abu Dhabi') return a.title?.toLowerCase().includes('abu dhabi') || a.title?.toLowerCase().includes('reem');
    if (activeFilter === 'Management') return a.title?.toLowerCase().includes('director') || a.title?.toLowerCase().includes('head') || a.title?.toLowerCase().includes('manager') || a.title?.toLowerCase().includes('ceo');
    return true;
  });

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(72px, 10vw, 100px) var(--gutter-lg) clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 16 }}>
            Macins Luxe Team
          </span>
          <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', marginBottom: 16 }}>
            Meet Our Team
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.70)' }}>
            200+ property professionals across Dubai and Abu Dhabi, united by a passion for exceptional real estate.
          </p>
        </div>
      </section>

      {/* Filter tabs + Grid */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600, padding: '8px 18px', borderRadius: 'var(--radius-pill)', border: activeFilter === f ? 'none' : '1px solid var(--border)', background: activeFilter === f ? 'var(--navy)' : 'transparent', color: activeFilter === f ? '#fff' : 'var(--heading)', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >{f}</button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
              {filtered.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>No team members found in this category.</div>
          )}
        </div>
      </section>

      {/* Join us CTA */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(48px, 6vw, 64px) var(--gutter-lg)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Join Our Team
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.70)', marginBottom: 28 }}>
            We&apos;re always looking for talented property professionals to join our growing team.
          </p>
          <Link href="/careers" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: '#fff', borderRadius: 'var(--radius-btn)', padding: '12px 28px', display: 'inline-block' }}>
            View Open Positions
          </Link>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 1024px) { .team-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px) { .team-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .team-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <article
      data-reveal
      style={{
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(26,37,53,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'; }}
    >
      {/* Photo */}
      <Link href={`/team/${toSlug(agent.name)}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          {agent.image ? (
            <CinemaImage src={agent.image} alt={agent.name} fill sizes="25vw" style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{getInitials(agent.name)}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '16px 16px 20px' }}>
        <Link href={`/team/${toSlug(agent.name)}`} style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 2 }}>{agent.name}</div>
          {agent.title && <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 12 }}>{agent.title}</div>}
        </Link>

        {/* Contact icons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {agent.whatsapp && (
            <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              title="WhatsApp"
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.099.546 4.07 1.502 5.773L0 24l6.43-1.486A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.006-1.373l-.36-.213-3.72.86.884-3.608-.234-.372A9.768 9.768 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            </a>
          )}
          {agent.email && (
            <a href={`mailto:${agent.email}`} title="Email"
              style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--white-section)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="10" viewBox="0 0 20 14" fill="none" aria-hidden="true"><rect x="1" y="1" width="18" height="12" rx="2" stroke="var(--muted)" strokeWidth="1.4"/><path d="M1 3l9 6 9-6" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </a>
          )}
          {agent.linkedin && (
            <a href={agent.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#fff" aria-hidden="true"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zM4.943 13.25V6.169H2.542v7.081h2.401zm-1.2-8.05a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8zM13.25 13.25V9.4c0-2.307-1.24-3.382-2.894-3.382-1.333 0-1.928.733-2.263 1.248V6.169H5.692v7.081h2.401V9.9c0-.215.016-.43.079-.584.173-.43.567-.874 1.229-.874.867 0 1.213.66 1.213 1.628v3.18h2.636z"/></svg>
            </a>
          )}
          <Link href={`/team/${toSlug(agent.name)}`}
            style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
            Profile →
          </Link>
        </div>
      </div>
    </article>
  );
}
