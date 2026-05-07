'use client';

export default function PropertiesLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Nav placeholder */}
      <div style={{ height: 72, background: 'var(--white)', borderBottom: '1px solid var(--border)' }} />

      {/* Hero bar skeleton */}
      <div style={{ background: '#111', padding: '56px 0 48px' }}>
        <div className="container">
          <div style={{ width: 180, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />
          <div style={{ width: 320, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.10)' }} />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 12 }}>
          {[140, 120, 100, 80].map((w, i) => (
            <div key={i} style={{ width: w, height: 36, borderRadius: 6, background: 'var(--white-card)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>

      {/* Cards grid skeleton */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 8, overflow: 'hidden', background: 'var(--white)', boxShadow: 'var(--shadow-card)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.08}s` }}>
              <div style={{ aspectRatio: '16/9', background: 'var(--white-card)' }} />
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ height: 18, width: '80%', borderRadius: 4, background: 'var(--white-card)', marginBottom: 8 }} />
                <div style={{ height: 13, width: '50%', borderRadius: 4, background: 'var(--white-card)', marginBottom: 20 }} />
                <div style={{ height: 16, width: '40%', borderRadius: 4, background: 'var(--white-card)', marginBottom: 16 }} />
                <div style={{ height: 1, background: 'var(--border)', marginBottom: 12 }} />
                <div style={{ height: 13, width: '60%', borderRadius: 4, background: 'var(--white-card)', marginBottom: 16 }} />
              </div>
              <div style={{ height: 46, background: 'var(--white-card)' }} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 1024px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
