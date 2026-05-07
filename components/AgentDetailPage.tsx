'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
};

type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: string;
  images?: string[];
};

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AgentDetailPage({ agent, listings }: { agent: Agent; listings: Listing[] }) {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Nav />

      {/* Nav breadcrumb */}
      <div style={{ background: 'var(--white-section)', padding: '14px var(--gutter-lg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--muted)' }}>Home</Link>
            <span>/</span>
            <Link href="/team" style={{ color: 'var(--muted)' }}>Team</Link>
            <span>/</span>
            <span style={{ color: 'var(--heading)' }}>{agent.name}</span>
          </nav>
        </div>
      </div>

      {/* Agent split layout */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="agent-layout" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 56, alignItems: 'start' }}>
            {/* Photo */}
            <div data-reveal>
              <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(26,37,53,0.14)' }}>
                {agent.image ? (
                  <CinemaImage src={agent.image} alt={agent.name} fill sizes="360px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font)', fontSize: '4rem', fontWeight: 700, color: '#fff' }}>{getInitials(agent.name)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div data-reveal>
              {agent.title && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: 12 }}>
                  {agent.title}
                </span>
              )}
              <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', color: 'var(--heading)', marginBottom: 20 }}>
                {agent.name}
              </h1>

              {agent.bio && (
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.85, color: 'var(--body)', marginBottom: 32, maxWidth: 560 }}>
                  {agent.bio}
                </p>
              )}

              {/* Contact buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                {agent.whatsapp && (
                  <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#25D366', borderRadius: 'var(--radius-btn)', padding: '12px 20px', textDecoration: 'none', transition: 'opacity 0.2s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.099.546 4.07 1.502 5.773L0 24l6.43-1.486A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.006-1.373l-.36-.213-3.72.86.884-3.608-.234-.372A9.768 9.768 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                    WhatsApp
                  </a>
                )}
                {agent.email && (
                  <a href={`mailto:${agent.email}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: 'var(--white-section)', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '12px 20px', textDecoration: 'none', transition: 'border-color 0.2s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--heading)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                  >
                    Email
                  </a>
                )}
                {agent.phone && (
                  <a href={`tel:${agent.phone}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: 'var(--white-section)', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '12px 20px', textDecoration: 'none', transition: 'border-color 0.2s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--heading)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                  >
                    {agent.phone}
                  </a>
                )}
                {agent.linkedin && (
                  <a href={agent.linkedin} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#0A66C2', borderRadius: 'var(--radius-btn)', padding: '12px 20px', textDecoration: 'none' }}>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent's Listings */}
      <section className="section" style={{ background: 'var(--white-section)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 32 }}>
            {listings.length > 0 ? `${agent.name.split(' ')[0]}'s Listings` : 'Properties'}
          </h2>
          {listings.length > 0 ? (
            <div className="listings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap)' }}>
              {listings.map(listing => (
                <Link key={listing.id} href={`/properties/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article
                    data-reveal
                    style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--white)', boxShadow: 'var(--shadow-card)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(26,37,53,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'; }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                      {listing.images?.[0] ? (
                        <Image src={listing.images[0]} alt={listing.title} fill sizes="33vw" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--white-section)' }} />
                      )}
                    </div>
                    <div style={{ padding: '16px 20px 20px' }}>
                      <h3 style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 4 }}>{listing.title}</h3>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 12 }}>{listing.location}</div>
                      <div style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: 'var(--heading)' }}>{listing.price}</div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '40px 32px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--body)', marginBottom: 20 }}>
                Contact {agent.name.split(' ')[0]} directly to learn about their current listings and exclusive off-market opportunities.
              </p>
              <button
                onClick={() => { (window as Window & { __openEnquireModal?: () => void }).__openEnquireModal?.(); }}
                style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#111', borderRadius: 'var(--radius-btn)', padding: '12px 24px', border: 'none', cursor: 'pointer' }}
              >
                Enquire Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ background: '#111', padding: 'clamp(40px, 6vw, 56px) var(--gutter-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        {agent.whatsapp && (
          <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#25D366', borderRadius: 'var(--radius-btn)', padding: '14px 28px', textDecoration: 'none' }}>
            WhatsApp {agent.name.split(' ')[0]}
          </a>
        )}
        <button
          onClick={() => { (window as Window & { __openEnquireModal?: () => void }).__openEnquireModal?.(); }}
          style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: '#fff', borderRadius: 'var(--radius-btn)', padding: '14px 28px', border: 'none', cursor: 'pointer' }}>
          Send an Enquiry
        </button>
      </section>

      <Footer />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 900px) {
          .agent-layout { grid-template-columns: 1fr !important; }
          .listings-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .listings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
