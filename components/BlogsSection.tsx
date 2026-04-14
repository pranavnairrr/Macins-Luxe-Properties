'use client';

import Image from 'next/image';

const blogs = [
  {
    image: '/images/properties/binghatti-hillcrest-hero-banner.avif',
    title: 'RERA Forms in Dubai for Property Buyers, Sellers, and Tenants: What You Need to Know',
    date: 'January 30, 2026',
    readTime: '58 min read',
  },
  {
    image: '/images/properties/binghatti-luxuria-hero-banner.avif',
    title: 'Dubai Real Estate Market Q1 2026 Report by Macins Luxe',
    date: 'April 3, 2026',
    readTime: '08 min read',
  },
  {
    image: '/images/properties/Binghatti-Hills-at-Dubai-HIlls.jpeg',
    title: 'The Citadel Tower, Business Bay: A Comprehensive Guide',
    date: 'April 1, 2026',
    readTime: '09 min read',
  },
];

export default function BlogsSection() {
  return (
    <section className="section">
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
            Latest Blogs
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a
              href="#"
              style={{
                fontFamily: 'var(--font)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--heading)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-btn)',
                padding: '8px 16px',
                whiteSpace: 'nowrap',
                transition: 'border-color var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--heading)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              View All Blogs
            </a>
            {(['prev','next'] as const).map(dir => (
              <button
                key={dir}
                aria-label={dir}
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

        {/* 3-column grid */}
        <div className="blogs-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--gap)',
        }}>
          {blogs.map(blog => (
            <article
              key={blog.title}
              className="blog-card"
              style={{ transition: 'transform 0.28s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 20,
              }}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
                />
              </div>

              {/* Body */}
              <h3 className="blog-title" style={{
                fontFamily: 'var(--font)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                lineHeight: 1.45,
                color: 'var(--heading)',
                marginBottom: 10,
                transition: 'color 0.22s ease',
              }}>
                {blog.title}
              </h3>

              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--muted)',
                marginBottom: 20,
              }}>
                {blog.date} &nbsp;—&nbsp; {blog.readTime}
              </div>

              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--heading)',
                  transition: 'gap var(--transition)',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = '10px')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = '6px')}
              >
                Read More <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 1024px) { .blogs-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .blogs-grid { grid-template-columns: 1fr !important; } }
        .blog-card:hover .blog-title { color: var(--navy) !important; }
      `}</style>
    </section>
  );
}
