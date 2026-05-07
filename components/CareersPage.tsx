'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Star, BarChart2, Globe, ChevronDown } from 'lucide-react';
import CinemaImage from './CinemaImage';
import Nav from './Nav';
import Footer from './Footer';

const WHY_WORK = [
  { icon: <TrendingUp size={24} strokeWidth={1.5} />, title: 'Uncapped Earnings', desc: 'Our top agents earn AED 1M+ annually. Your income grows exactly as fast as your ambition.' },
  { icon: <Star size={24} strokeWidth={1.5} />, title: 'Luxury Brand', desc: 'Represent one of the UAE\'s most recognised luxury property brands and access the finest properties.' },
  { icon: <BarChart2 size={24} strokeWidth={1.5} />, title: 'Career Growth', desc: 'Clear promotion paths from consultant to team lead to branch director with dedicated training at every stage.' },
  { icon: <Globe size={24} strokeWidth={1.5} />, title: 'International Team', desc: 'Work alongside colleagues from 40+ nationalities in a vibrant, collaborative, and multicultural environment.' },
];

const POSITIONS = [
  {
    id: 'senior-consultant-dubai',
    title: 'Senior Property Consultant',
    location: 'Dubai',
    type: 'Full-time',
    desc: 'Drive high-value transactions across Dubai\'s luxury residential market. You\'ll manage a portfolio of developer relationships and client accounts, with direct support from our marketing and operations teams.',
    requirements: ['3+ years Dubai property experience', 'Valid RERA certification', 'Proven track record of AED 20M+ in annual sales', 'Fluency in English; Arabic or Russian a plus'],
  },
  {
    id: 'offplan-specialist-dubai',
    title: 'Off-Plan Specialist',
    location: 'Dubai',
    type: 'Full-time',
    desc: 'Specialise in off-plan projects from Emaar, Binghatti, Damac and other top developers. You\'ll develop deep project knowledge, host launch events, and guide investors from initial inquiry to SPA signing.',
    requirements: ['2+ years off-plan sales experience', 'Existing investor network preferred', 'Strong presentation and negotiation skills', 'RERA certified or willing to obtain'],
  },
  {
    id: 'consultant-abudhabi',
    title: 'Property Consultant',
    location: 'Abu Dhabi',
    type: 'Full-time',
    desc: 'Join our growing Abu Dhabi office on Reem Island to serve the emirate\'s expanding luxury property market. Handle residential sales and leasing across the city\'s premier developments.',
    requirements: ['1+ years UAE property experience', 'Knowledge of Abu Dhabi market preferred', 'Strong interpersonal skills', 'UAE driving licence required'],
  },
  {
    id: 'digital-marketing-manager',
    title: 'Digital Marketing Manager',
    location: 'Dubai',
    type: 'Full-time',
    desc: 'Lead Macins Luxe\'s digital marketing strategy — from SEO and paid media to property portal optimisation and email campaigns. Drive qualified leads that support our growing consultant team.',
    requirements: ['4+ years digital marketing experience', 'Property or luxury brand background preferred', 'Proficiency in Google Ads, Meta Ads, and analytics platforms', 'Experience with Bayut, Dubizzle, and Property Finder'],
  },
  {
    id: 'social-media-specialist',
    title: 'Social Media Specialist',
    location: 'Dubai',
    type: 'Full-time',
    desc: 'Create compelling content that showcases our portfolio and brand across Instagram, TikTok, YouTube, and LinkedIn. You\'ll coordinate with agents to produce property videos, market insight reels, and branded campaigns.',
    requirements: ['2+ years social media content creation', 'Videography and editing skills (Adobe Premiere / CapCut)', 'Passion for luxury real estate and lifestyle', 'Strong eye for visual storytelling'],
  },
];

export default function CareersPage() {
  const [openPosition, setOpenPosition] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', linkedin: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: 480, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <CinemaImage cinema priority src="/images/hero/img106.jpg" alt="Careers at Macins Luxe" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 60%, rgba(0,0,0,0.18) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', padding: 'clamp(72px, 10vw, 100px) var(--gutter-lg)' }}>
          <div className="container" style={{ maxWidth: 620 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 16 }}>
              Join Our Team
            </span>
            <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: '#fff', marginBottom: 20 }}>
              Build Your Career at<br />Macins Luxe
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', marginBottom: 32 }}>
              Join 200+ professionals shaping Dubai&apos;s luxury real estate market. We offer uncapped earnings, a world-class brand, and genuine career progression.
            </p>
            <a href="#open-positions" style={{ display: 'inline-block', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: '#fff', borderRadius: 'var(--radius-btn)', padding: '14px 28px', textDecoration: 'none', transition: 'background 0.2s ease' }}>
              View Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="culture-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div data-reveal>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: 16 }}>
                Our Culture
              </span>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--heading)', marginBottom: 20 }}>
                Where Excellence Is the Standard
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.85, color: 'var(--body)', marginBottom: 16 }}>
                At Macins Luxe, we believe that great people deserve great environments. Our culture is built on mutual respect, ambitious goals, and the belief that every team member has the potential to be exceptional.
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.85, color: 'var(--body)' }}>
                We invest heavily in training, technology, and support so that our consultants can focus on what they do best — building relationships and closing deals. You bring the drive; we bring the infrastructure.
              </p>
            </div>
            <div data-reveal className="culture-photos" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {['/images/hero/img143.jpg', '/images/hero/img146.jpg', '/images/hero/img185.jpg', '/images/hero/img201.jpg'].map((src, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <CinemaImage src={src} alt="" fill sizes="25vw" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="section" style={{ background: 'var(--white-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }} data-reveal>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--heading)' }}>
              Why Join Macins Luxe?
            </h2>
          </div>
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {WHY_WORK.map(item => (
              <div key={item.title} data-reveal style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(26,37,53,0.05)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(26,37,53,0.10)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(26,37,53,0.05)'; }}
              >
                <div style={{ color: '#555', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--body)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }} data-reveal>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, color: 'var(--heading)', marginBottom: 8 }}>
              Open Positions
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--body)' }}>{POSITIONS.length} roles available across Dubai and Abu Dhabi</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {POSITIONS.map(pos => (
              <div key={pos.id} style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)' }}>
                {/* Header row */}
                <button
                  onClick={() => setOpenPosition(openPosition === pos.id ? null : pos.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: 'var(--heading)' }}>{pos.title}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.8125rem', color: 'var(--muted)' }}>
                      <span>{pos.location}</span>
                      <span>·</span>
                      <span>{pos.type}</span>
                    </div>
                  </div>
                  <ChevronDown size={20} strokeWidth={1.5} style={{ color: 'var(--muted)', flexShrink: 0, transform: openPosition === pos.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }} />
                </button>

                {/* Expanded body */}
                {openPosition === pos.id && (
                  <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--body)', marginBottom: 20 }}>{pos.desc}</p>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 10 }}>Requirements</div>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {pos.requirements.map(r => (
                          <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.875rem', color: 'var(--body)' }}>
                            <span style={{ color: '#aaa', fontWeight: 700, flexShrink: 0 }}>·</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => { setSelectedRole(pos.title); document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }); }}
                      style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#111', borderRadius: 'var(--radius-btn)', padding: '12px 24px', border: 'none', cursor: 'pointer' }}
                    >
                      Apply for this Role
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Form */}
      <section id="apply" className="section" style={{ background: '#f5f3f0' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: '2rem', fontWeight: 700, color: '#111', marginBottom: 16 }}>Application Received</div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)' }}>Thank you for applying. Our HR team will review your application and be in touch within 5 business days.</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--heading)', marginBottom: 12 }}>Apply Now</h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--muted)' }}>Take the first step toward your next career move.</p>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 20px rgba(0,0,0,0.07)', padding: '32px 28px' }}>
                <form onSubmit={async e => {
                  e.preventDefault();
                  await fetch('/api/enquire', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, type: 'career', role: selectedRole }) }).catch(() => null);
                  setSubmitted(true);
                }}>
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                    { name: 'email', label: 'Email', type: 'email', placeholder: 'Your email' },
                    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+971 50 000 0000' },
                    { name: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/your-profile' },
                  ].map(f => (
                    <div key={f.name} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={formData[f.name as keyof typeof formData]} onChange={e => setFormData(d => ({ ...d, [f.name]: e.target.value }))}
                        required={f.name !== 'linkedin'}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)', background: '#fff', fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#333')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', display: 'block', marginBottom: 8 }}>Role of Interest</label>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} required
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)', background: '#fff', fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)', outline: 'none', boxSizing: 'border-box' }}>
                      <option value="">Select a role</option>
                      {POSITIONS.map(p => <option key={p.id} value={p.title}>{p.title} — {p.location}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', display: 'block', marginBottom: 8 }}>Cover Message</label>
                    <textarea rows={4} placeholder="Tell us why you'd be a great fit..." value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)', background: '#fff', fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#333')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '14px', background: '#111', color: '#fff', fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-btn)', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                    Submit Application
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 1024px) { .why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .culture-grid { grid-template-columns: 1fr !important; } .why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .culture-photos { grid-template-columns: 1fr 1fr !important; } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.35) !important; }
      `}</style>
    </>
  );
}
