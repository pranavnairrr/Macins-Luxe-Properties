'use client';

export default function TeamLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <div style={{ height: 72, background: 'var(--white)', borderBottom: '1px solid var(--border)' }} />

      <div style={{ background: '#111', padding: '56px 0 48px' }}>
        <div className="container">
          <div style={{ width: 100, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />
          <div style={{ width: 220, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.10)' }} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ textAlign: 'center', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.08}s` }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--white-card)', margin: '0 auto 16px' }} />
              <div style={{ height: 16, width: '70%', borderRadius: 4, background: 'var(--white-card)', margin: '0 auto 8px' }} />
              <div style={{ height: 13, width: '50%', borderRadius: 4, background: 'var(--white-card)', margin: '0 auto' }} />
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
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
