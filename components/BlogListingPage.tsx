'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from './Nav';
import Footer from './Footer';
import { blogPosts, type BlogPost } from '@/lib/blog-data';

const CATEGORIES = ['All', 'Market Reports', 'Investment', 'Guides', 'Lifestyle', 'Legal'] as const;
type Category = typeof CATEGORIES[number];

const featured = blogPosts.find(p => p.featured) ?? blogPosts[0];

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('revealed'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'All'
    ? blogPosts.filter(p => p.slug !== featured.slug)
    : blogPosts.filter(p => p.category === activeCategory && p.slug !== featured.slug);

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ background: '#111', padding: 'clamp(72px, 10vw, 100px) var(--gutter-lg) clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 16 }}>
            Macins Luxe Insights
          </span>
          <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', marginBottom: 16 }}>
            Insights &amp; Guides
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.70)' }}>
            Expert analysis, investment guides, and area spotlights from Dubai&apos;s luxury property specialists.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article
              data-reveal
              className="featured-post"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 24px rgba(26,37,53,0.08)',
                transition: 'box-shadow 0.3s ease',
                marginBottom: 56,
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,37,53,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(26,37,53,0.08)')}
            >
              <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                <Image src={featured.image} alt={featured.title} fill sizes="50vw" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--white)' }}>
                <span style={{
                  display: 'inline-block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#777', background: '#f0ede8',
                  borderRadius: 'var(--radius-pill)', padding: '4px 12px', marginBottom: 16, width: 'fit-content',
                }}>
                  {featured.category}
                </span>
                <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', color: 'var(--heading)', marginBottom: 16 }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--body)', marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--heading)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Read Article →
                  </span>
                </div>
              </div>
            </article>
          </Link>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600,
                  padding: '8px 18px', borderRadius: 'var(--radius-pill)',
                  border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                  background: activeCategory === cat ? '#111' : 'transparent',
                  color: activeCategory === cat ? '#fff' : 'var(--heading)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >{cat}</button>
            ))}
          </div>

          {/* Posts grid */}
          <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap)' }}>
            {filtered.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              No articles in this category yet.
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style jsx>{`
        [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          .featured-post { grid-template-columns: 1fr !important; }
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article
        data-reveal
        style={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--white)',
          transition: 'transform 0.28s ease, box-shadow 0.28s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(26,37,53,0.10)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
      >
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <Image src={post.image} alt={post.title} fill sizes="33vw" style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
          />
        </div>
        <div style={{ padding: '20px 20px 24px' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: 10 }}>
            {post.category}
          </span>
          <h3 style={{ fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 600, lineHeight: 1.45, color: 'var(--heading)', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </h3>
          <p style={{ fontSize: '0.8125rem', lineHeight: 1.65, color: 'var(--body)', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
