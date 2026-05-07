'use client'

import { useState } from 'react'
import { User, Mail, Phone, Building2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Props {
  listingId: string
  listingName: string
  brochureUrl?: string | null
}

export default function PropertyBrochureDownload({ listingId, listingName, brochureUrl }: Props) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      await supabase.from('leads').insert({
        listing_id: listingId,
        listing_name: listingName,
        email: email.trim(),
        name: name.trim() || null,
        phone: phone.trim() || null,
        source: 'brochure_download',
      })

      // Generate dynamic PDF from API
      const res = await fetch(`/api/property-pdf/${listingId}`)
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${listingName.replace(/\s+/g, '-')}-Macins-Luxe.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1815 0%, #2d2a26 100%)',
        padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 2h8l4 4v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M11 2v4h4" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"/>
            <line x1="5" y1="9" x2="13" y2="9" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="10" y2="12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>
            Download Brochure
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.60)', margin: 0 }}>
          Get the full property proposal with pricing, floor plans &amp; agent details.
        </p>
      </div>

      {/* Agent info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--white-section)',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a1815, #2d2a26)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}><Building2 size={20} strokeWidth={1.5} color="#fff" /></div>
        <div>
          <div style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)' }}>
            Macins Luxe Team
          </div>
          <div style={{ fontFamily: 'var(--font)', fontSize: '0.75rem', color: 'var(--muted)' }}>
            Luxury Property Specialists · Dubai &amp; Abu Dhabi
          </div>
          <div style={{ fontFamily: 'var(--font)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={11} strokeWidth={1.6} style={{ flexShrink: 0 }} /> +971 4 454 2588
            <span style={{ opacity: 0.4 }}>·</span>
            <Mail size={11} strokeWidth={1.6} style={{ flexShrink: 0 }} /> info@macinsluxe.com
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 24px' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <CheckCircle2 size={40} strokeWidth={1.4} color="#16a34a" />
          </div>
            <div style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 4 }}>
              Download started!
            </div>
            <p style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 16 }}>
              If it didn&apos;t start, click below.
            </p>
            <a
              href={`/api/property-pdf/${listingId}`}
              download
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                color: '#fff', background: '#111',
                borderRadius: 8, padding: '10px 20px',
                textDecoration: 'none',
              }}
            >
              Download Again
            </a>
          </div>
        ) : (
          <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BrochureInput
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={setName}
              Icon={User}
            />
            <BrochureInput
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={setEmail}
              Icon={Mail}
              required
            />
            <BrochureInput
              type="tel"
              placeholder="Phone / WhatsApp (optional)"
              value={phone}
              onChange={setPhone}
              Icon={Phone}
            />

            {error && (
              <p style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'var(--red)', margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600,
                color: '#fff',
                background: loading || !email.trim() ? 'rgba(0,0,0,0.25)' : '#111',
                border: 'none', borderRadius: 8,
                padding: '13px',
                cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                width: '100%',
              }}
              onMouseEnter={e => { if (!loading && email.trim()) (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v9M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              {loading ? 'Processing…' : 'Download Free Brochure'}
            </button>

            <p style={{ fontFamily: 'var(--font)', fontSize: '0.6875rem', color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
              Your details are kept private and only used to send you relevant property information.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function BrochureInput({
  type, placeholder, value, onChange, Icon, required,
}: {
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  Icon: React.ElementType
  required?: boolean
}) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', alignItems: 'center', pointerEvents: 'none',
        color: 'var(--muted)',
      }}>
        <Icon size={14} strokeWidth={1.6} />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: 'var(--font)', fontSize: '0.875rem',
          color: 'var(--heading)',
          background: 'var(--white-section)',
          border: '1px solid var(--border)',
          borderRadius: 8, padding: '11px 12px 11px 34px',
          outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#333')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}
