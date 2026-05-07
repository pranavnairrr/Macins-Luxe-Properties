'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Linkedin, Youtube, Facebook, CheckCircle2 } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import type { CompanyInfo } from '@/utils/site-settings';

interface Props {
  companyInfo: CompanyInfo | null;
}

const DEFAULT: CompanyInfo = {
  phone: '+971 4 454 2588',
  whatsapp: '97144542588',
  email: 'info@macinsluxe.com',
  website: 'www.macinsluxe.com',
  address_dubai: 'Office 1502, 15th Floor, Churchill Tower, Business Bay, Dubai, UAE',
  address_abudhabi: 'Office 302, 3rd Floor, Reem Tower, Reem Island, Abu Dhabi, UAE',
  orn: 'ORN: 12345',
};

const INTEREST_OPTIONS = ['Buy a Property', 'Sell a Property', 'Rent / Lease', 'Off-Plan Investment', 'General Enquiry'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-btn)',
  fontFamily: 'var(--font)',
  fontSize: '0.9375rem',
  color: 'var(--heading)',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function ContactPage({ companyInfo }: Props) {
  const info = companyInfo ?? DEFAULT;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(INTEREST_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, propertyType: interest, message }),
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Nav />

      {/* Page Hero */}
      <section style={{ background: 'var(--navy)', paddingTop: 72 + 56, paddingBottom: 56 }}>
        <div className="container">
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link> &nbsp;/&nbsp; Contact Us
          </p>
          <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Let&apos;s Talk
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 480 }}>
            We&apos;re here to help you find your perfect property. Reach out and one of our advisors will be in touch within the hour.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ paddingBlock: 'var(--section)', background: 'var(--white-section)' }}>
        <div className="container">
          <div className="contact-grid">

            {/* Left — Form */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 40, boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 6 }}>
                Send Us a Message
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', marginBottom: 28 }}>
                Fill in the form and our team will respond within 1 working hour.
              </p>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CheckCircle2 size={48} strokeWidth={1.5} color="#25a244" style={{ marginBottom: 16 }} />
                  <h3 style={{ fontFamily: 'var(--font)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 8 }}>Message Received!</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>Thank you for reaching out. One of our advisors will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>Full Name *</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" required style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'var(--navy)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>Email Address *</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="john@email.com" required style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'var(--navy)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>Phone / WhatsApp *</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+971 50 000 0000" required style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'var(--navy)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>I&apos;m Interested In</label>
                      <select value={interest} onChange={e => setInterest(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--navy)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                        {INTEREST_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>Message</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                      placeholder="Tell us about your property requirements, budget, preferred locations, or any questions…"
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                      onFocus={e => (e.target.style.borderColor = 'var(--navy)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                  {error && <p style={{ fontSize: '0.875rem', color: '#E8352B' }}>{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      padding: '14px 32px',
                      background: '#C9A96E',
                      color: '#fff',
                      fontFamily: 'var(--font)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: 'var(--radius-btn)',
                      cursor: sending ? 'not-allowed' : 'pointer',
                      opacity: sending ? 0.75 : 1,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Right — Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Contact details card */}
              <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-card)' }}>
                <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 20 }}>
                  Get in Touch
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <a href={`tel:${info.phone}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, textDecoration: 'none', color: 'var(--body)', fontSize: '0.9375rem' }}>
                    <Phone size={18} strokeWidth={1.5} color="var(--navy)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{info.phone}</span>
                  </a>
                  <a href={`mailto:${info.email}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, textDecoration: 'none', color: 'var(--body)', fontSize: '0.9375rem' }}>
                    <Mail size={18} strokeWidth={1.5} color="var(--navy)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{info.email}</span>
                  </a>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <MapPin size={18} strokeWidth={1.5} color="var(--navy)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--heading)', marginBottom: 2, fontSize: '0.875rem' }}>Dubai Office</p>
                      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.55 }}>{info.address_dubai}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <MapPin size={18} strokeWidth={1.5} color="var(--navy)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--heading)', marginBottom: 2, fontSize: '0.875rem' }}>Abu Dhabi Office</p>
                      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.55 }}>{info.address_abudhabi}</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                  {[
                    { label: 'Instagram', href: 'https://instagram.com/macinsluxe', Icon: Instagram },
                    { label: 'LinkedIn', href: 'https://linkedin.com/company/macinsluxe', Icon: Linkedin },
                    { label: 'YouTube', href: 'https://youtube.com/@macinsluxe', Icon: Youtube },
                    { label: 'Facebook', href: 'https://facebook.com/macinsluxe', Icon: Facebook },
                  ].map(({ label, href, Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      style={{
                        width: 40, height: 40,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-btn)',
                        color: 'var(--heading)',
                        transition: 'background 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.borderColor = 'var(--navy)'; (e.currentTarget.querySelector('svg') as SVGElement).style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; (e.currentTarget.querySelector('svg') as SVGElement).style.color = 'var(--heading)'; }}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Dubai office map */}
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', padding: '12px 16px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
                  Dubai Office — Business Bay
                </p>
                <iframe
                  title="Macins Luxe Dubai Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178527326299!2d55.26502!3d25.18724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69d13e8fd0d7%3A0x9de0ffa7a1d7a!2sChurchill+Tower%2C+Business+Bay%2C+Dubai!5e0!3m2!1sen!2sae!4v1621234567890"
                  style={{ width: '100%', height: 240, border: 'none', display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Abu Dhabi office map */}
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--heading)', padding: '12px 16px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
                  Abu Dhabi Office — Reem Island
                </p>
                <iframe
                  title="Macins Luxe Abu Dhabi Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.7!2d54.407!3d24.503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e66000000001%3A0x0!2sReem+Island%2C+Abu+Dhabi!5e0!3m2!1sen!2sae!4v1621234567891"
                  style={{ width: '100%', height: 240, border: 'none', display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 40px;
          align-items: start;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 1100px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
