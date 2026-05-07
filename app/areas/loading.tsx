'use client';

export default function AreasLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <div style={{ height: 72, background: 'var(--white)', borderBottom: '1px solid var(--border)' }} />

      <div style={{ background: '#111', padding: '56px 0 48px' }}>
        <div className="container">
          <div style={{ width: 140, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.10)' }} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{
              borderRadius: 8, overflow: 'hidden', background: 'var(--white-card)',
              aspectRatio: '4/3',
              animation: 'pulse 1.6s ease-in-out infinite',
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
