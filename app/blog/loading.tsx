'use client';

export default function BlogLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Nav placeholder */}
      <div style={{ height: 72, background: 'var(--white)', borderBottom: '1px solid var(--border)' }} />

      {/* Hero skeleton */}
      <div style={{ background: '#111', padding: '56px 0 48px' }}>
        <div className="container">
          <div style={{ width: 100, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />
          <div style={{ width: 280, height: 40, borderRadius: 6, background: 'rgba(255,255,255,0.10)', marginBottom: 12 }} />
          <div style={{ width: 400, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      {/* Cards grid skeleton */}
      <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} style={{ animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}>
              <div style={{ aspectRatio: '16/9', borderRadius: 8, background: 'var(--white-card)', marginBottom: 20 }} />
              <div style={{ height: 11, width: 80, borderRadius: 12, background: 'var(--white-card)', marginBottom: 12 }} />
              <div style={{ height: 18, width: '90%', borderRadius: 4, background: 'var(--white-card)', marginBottom: 6 }} />
              <div style={{ height: 18, width: '70%', borderRadius: 4, background: 'var(--white-card)', marginBottom: 16 }} />
              <div style={{ height: 13, width: '50%', borderRadius: 4, background: 'var(--white-card)', marginBottom: 20 }} />
              <div style={{ height: 14, width: 80, borderRadius: 4, background: 'var(--white-card)' }} />
            </article>
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
