import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #152140 0%, #1B3079 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font)',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: '5rem', fontWeight: 700, color: '#D5BA8C', lineHeight: 1, marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#fff', marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: '0.9375rem', marginBottom: 32 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font)',
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: '#1B3079',
            background: '#D5BA8C',
            borderRadius: 8,
            padding: '12px 28px',
            textDecoration: 'none',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
