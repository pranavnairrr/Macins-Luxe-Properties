'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/staff/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111 0%, #1a1815 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '48px 40px 40px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Image
            src="/images/logo-gold-luxe.svg"
            alt="Macins Luxe"
            width={160}
            height={52}
            style={{ height: 48, width: 'auto', objectFit: 'contain' }}
            unoptimized
          />
        </div>

        <h1 style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: 6,
          textAlign: 'center',
        }}>
          Staff Portal
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255,255,255,0.50)',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Sign in to manage listings and tools
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.60)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.60)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.6} /> : <Eye size={16} strokeWidth={1.6} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(232,53,43,0.15)',
              border: '1px solid rgba(232,53,43,0.40)',
              borderRadius: 6,
              padding: '10px 14px',
              fontSize: '0.875rem',
              color: '#FF7B72',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              fontFamily: 'var(--font)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#111',
              background: loading ? 'rgba(255,255,255,0.45)' : '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
              letterSpacing: '0.01em',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a
            href="/"
            style={{
              fontSize: '0.8125rem',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.80)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.70)',
  marginBottom: 6,
  letterSpacing: '0.02em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font)',
  fontSize: '0.9375rem',
  color: '#ffffff',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 6,
  padding: '12px 14px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
}
