'use client';

import Link from 'next/link';
import CinemaImage from '@/components/CinemaImage';

const blogs = [
  {
    slug: 'rera-forms-dubai-guide',
    image: '/images/properties/binghatti-hillcrest-hero-banner.avif',
    category: 'Legal Guide',
    title: 'RERA Forms in Dubai for Property Buyers, Sellers, and Tenants: What You Need to Know',
    date: 'January 30, 2026',
    readTime: '58 min read',
  },
  {
    slug: 'dubai-real-estate-market-q1-2026',
    image: '/images/properties/binghatti-luxuria-hero-banner.avif',
    category: 'Market Report',
    title: 'Dubai Real Estate Market Q1 2026 Report by Macins Luxe',
    date: 'April 3, 2026',
    readTime: '08 min read',
  },
  {
    slug: 'citadel-tower-business-bay-guide',
    image: '/images/properties/Binghatti-Hills-at-Dubai-HIlls.jpeg',
    category: 'Property Guide',
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
          <div>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#999',
              display: 'block', marginBottom: 8,
            }}>
              Insights &amp; Analysis
            </span>
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(1.75rem, 2.75vw, 2.375rem)',
              fontWeight: 700, lineHeight: 1.2,
              letterSpacing: '-0.02em', color: 'var(--heading)',
            }}>
              Latest Blogs
            </h2>
          </div>
          <Link
            href="/blog"
            style={{
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--heading)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-btn)', padding: '8px 16px',
              whiteSpace: 'nowrap', transition: 'border-color var(--transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--heading)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            View All Blogs
          </Link>
        </div>

        {/* 3-column grid */}
        <div className="blogs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap)' }}>
          {blogs.map(blog => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="blog-card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', transition: 'transform 0.28s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 20 }}>
                <CinemaImage
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
                />
              </div>

              {/* Category chip */}
              <span style={{
                display: 'inline-block', fontSize: '0.6875rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#777', background: '#f0ede8',
                borderRadius: 'var(--radius-pill)', padding: '4px 12px',
                marginBottom: 12, alignSelf: 'flex-start',
              }}>
                {blog.category}
              </span>

              {/* Title */}
              <h3 className="blog-title" style={{
                fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 600,
                lineHeight: 1.45, color: 'var(--heading)', marginBottom: 10,
                transition: 'color 0.22s ease',
              }}>
                {blog.title}
              </h3>

              {/* Meta */}
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 20, marginTop: 'auto' }}>
                {blog.date} &nbsp;—&nbsp; {blog.readTime}
              </div>

              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                color: 'var(--heading)', transition: 'gap var(--transition)',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = '10px')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = '6px')}
              >
                Read More <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 1024px) { .blogs-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .blogs-grid { grid-template-columns: 1fr !important; } }
        .blog-card:hover .blog-title { color: #111 !important; }
      `}</style>
    </section>
  );
}
