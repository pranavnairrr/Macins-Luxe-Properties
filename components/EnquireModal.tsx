'use client';

import { useEffect, useRef, useState } from 'react';

const PROPERTY_TYPES = [
  'Off-Plan Apartment',
  'Villa / Townhouse',
  'Penthouse',
  'Ready Property',
  'Commercial',
  'Other',
];

export default function EnquireModal() {
  const [open, setOpen]         = useState(false);
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const overlayRef              = useRef<HTMLDivElement>(null);

  /* Expose global opener so Leaflet markers + any other plain HTML can call it */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__openEnquireModal = () => setOpen(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { delete (window as any).__openEnquireModal; };
  }, []);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  const handleClose = () => { setOpen(false); setSent(false); };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(12,20,45,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 16,
        padding: '40px 36px 36px',
        position: 'relative',
        boxShadow: '0 24px 64px rgba(0,0,0,0.50)',
      }}>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', fontSize: 16, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✓</div>
            <h3 style={{ fontFamily: 'var(--font)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
              Thank you!
            </h3>
            <p style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)' }}>
              Our team will be in touch with you shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.375rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              Enquire Now
            </h2>
            <p style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>
              Tell us what you&apos;re looking for and we&apos;ll be in touch.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(213,186,140,0.70)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)')}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+971 5X XXX XXXX"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(213,186,140,0.70)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)')}
                />
              </div>

              {/* Property Type */}
              <div>
                <label style={labelStyle}>Property Type</label>
                <select
                  required
                  defaultValue=""
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(213,186,140,0.70)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)')}
                >
                  <option value="" disabled>Select type</option>
                  {PROPERTY_TYPES.map(t => (
                    <option key={t} value={t} style={{ background: '#152140', color: '#fff' }}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                style={{
                  marginTop: 6,
                  fontFamily: 'var(--font)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1D3159',
                  background: '#D5BA8C',
                  border: 'none',
                  borderRadius: 6,
                  padding: '13px',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1,
                  transition: 'opacity 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#c8aa79'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#D5BA8C'; }}
              >
                {sending ? 'Sending…' : 'Submit Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>

      <style jsx global>{`
        .enq-input::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.70)',
  marginBottom: 6,
  letterSpacing: '0.02em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font)',
  fontSize: '0.9375rem',
  color: '#fff',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.20)',
  borderRadius: 6,
  padding: '11px 14px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  appearance: 'none',
  WebkitAppearance: 'none',
};
