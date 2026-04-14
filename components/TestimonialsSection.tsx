'use client';

import { useRef } from 'react';

const reviews = [
  {
    name: 'Uruba Abbasi',
    ago: '2 months ago',
    stars: 5,
    text: 'Amr Nabel, Highly trusted & having a vast knowledge of the UAE market.',
  },
  {
    name: 'Zaid Azeem Khan',
    ago: '2 months ago',
    stars: 5,
    text: 'Had a very pleasant experience dealing with Faisal. Very friendly and polite.',
  },
  {
    name: 'sarit kapur',
    ago: '2 months ago',
    stars: 5,
    text: 'We have been working with Pavan Dhawan, and he is the one you want to work with. He is professional, knowledgeable...',
  },
  {
    name: 'MAB Properties',
    ago: '2 months ago',
    stars: 5,
    text: 'Great working with Hassan Bin Khalid he\'s very honest, very knowledgeable in the market whether buying, selling or...',
  },
  {
    name: 'Ahmed Al Mansoori',
    ago: '3 months ago',
    stars: 5,
    text: 'Exceptional service from start to finish. The team really understood what we were looking for and delivered beyond expectations.',
  },
];

/* Google "G" icon */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Google Review" role="img">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

/* Blue verified tick */
function VerifiedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="7" fill="#1976D2"/>
      <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'prev' | 'next') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'next' ? 300 : -300, behavior: 'smooth' });
  };

  return (
    <section className="section section--grey">
      <div className="container">

        {/* Header */}
        <div className="section-header">
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--heading)',
          }}>
            The Trust We&rsquo;ve Earned
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['prev','next'] as const).map(dir => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={dir === 'prev' ? 'Previous' : 'Next'}
                style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  background: 'var(--white)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition)',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--heading)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                  <path d={dir === 'prev' ? 'M6 1L1 6l5 5' : 'M1 1l5 5-5 5'} stroke="var(--heading)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 'var(--gap)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: 4,
          }}
        >
          {reviews.map(r => (
            <article
              key={r.name}
              style={{
                flex: '0 0 calc(25% - 18px)',
                minWidth: 240,
                background: 'var(--white-card)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                scrollSnapAlign: 'start',
              }}
            >
              {/* Name + Google icon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font)',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    color: 'var(--heading)',
                  }}>
                    {r.name}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 2,
                    fontSize: '0.8125rem',
                    color: 'var(--muted)',
                  }}>
                    {r.ago} <VerifiedIcon />
                  </div>
                </div>
                <GoogleIcon />
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, marginTop: 10 }}>
                {Array.from({ length: r.stars }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F5A11E" aria-hidden="true">
                    <path d="M7 1l1.545 3.09L12 4.635l-2.5 2.41.59 3.38L7 8.77l-3.09 1.655.59-3.38L2 4.635l3.455-.545L7 1z"/>
                  </svg>
                ))}
              </div>

              {/* Review text */}
              <p style={{
                fontSize: '0.9375rem',
                color: 'var(--body)',
                lineHeight: 1.65,
                marginTop: 12,
              }}>
                {r.text}
              </p>
            </article>
          ))}
        </div>

      </div>

      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          article[style] { flex: 0 0 calc(80% - 12px) !important; }
        }
      `}</style>
    </section>
  );
}
