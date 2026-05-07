'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from './Nav';
import Footer from './Footer';
import CinemaImage from './CinemaImage';
import type { BlogPost } from '@/lib/blog-data';

export default function BlogPostPage({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const [activeSection, setActiveSection] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  const tocItems = post.body
    .match(/<h2[^>]*>(.*?)<\/h2>/gi)
    ?.map(h => ({ id: h.replace(/<[^>]+>/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), text: h.replace(/<[^>]+>/g, '') })) ?? [];

  const bodyWithIds = post.body.replace(/<h2>/gi, (_, offset) => {
    const idx = (post.body.substring(0, offset).match(/<h2>/gi) || []).length;
    const item = tocItems[idx];
    return item ? `<h2 id="${item.id}">` : '<h2>';
  });

  useEffect(() => {
    if (!tocItems.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection((e.target as HTMLElement).id); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    tocItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Nav />

      {/* Article header */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(72px, 10vw, 100px) var(--gutter-lg) clamp(48px, 6vw, 64px)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.50)', marginBottom: 24 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.50)', transition: 'color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.50)')}>Home</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.50)', transition: 'color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.50)')}>Blog</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{post.category}</span>
          </nav>
          <span style={{ display: 'inline-block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(201,169,110,0.15)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', marginBottom: 20 }}>
            {post.category}
          </span>
          <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 700, lineHeight: 1.18, letterSpacing: '-0.025em', color: '#fff', marginBottom: 24 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.875rem', color: 'rgba(255,255,255,0.60)' }}>
            <span>By {post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <div style={{ position: 'relative', aspectRatio: '21/9', maxHeight: 520, overflow: 'hidden' }}>
        <CinemaImage cinema priority src={post.image} alt={post.title} fill sizes="100vw" style={{ objectFit: 'cover' }} />
      </div>

      {/* Body + TOC */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="post-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 64, alignItems: 'start' }}>
            {/* Article body */}
            <div
              ref={bodyRef}
              className="article-body"
              dangerouslySetInnerHTML={{ __html: bodyWithIds }}
            />
            {/* Sticky TOC */}
            {tocItems.length > 0 && (
              <aside style={{ position: 'sticky', top: 88 }}>
                <div style={{ background: 'var(--white-section)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px 20px' }}>
                  <div style={{ fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
                    Contents
                  </div>
                  {tocItems.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        lineHeight: 1.55,
                        color: activeSection === item.id ? 'var(--navy)' : 'var(--body)',
                        fontWeight: activeSection === item.id ? 600 : 400,
                        paddingLeft: activeSection === item.id ? 12 : 0,
                        borderLeft: activeSection === item.id ? '2px solid var(--navy)' : '2px solid transparent',
                        marginBottom: 10,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>

                {/* Share */}
                <div style={{ marginTop: 24, background: 'var(--white-section)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <div style={{ fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Share</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://macinsluxe.com/blog/' + post.slug)}` },
                      { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(post.title + ' https://macinsluxe.com/blog/' + post.slug)}` },
                    ].map(s => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)', color: 'var(--heading)', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--heading)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                      >{s.label}</a>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(40px, 6vw, 64px) var(--gutter-lg)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Interested in Dubai Real Estate?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.70)', marginBottom: 28 }}>Our specialists are ready to help you find the right property.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/properties" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', background: '#fff', borderRadius: 'var(--radius-btn)', padding: '12px 28px' }}>
              Browse Properties
            </Link>
            <Link href="/contact" style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', border: '1px solid rgba(255,255,255,0.40)', borderRadius: 'var(--radius-btn)', padding: '12px 28px' }}>
              Speak to an Agent
            </Link>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--white-section)' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 32 }}>Related Articles</h2>
            <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap)' }}>
              {related.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--white)', transition: 'transform 0.25s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                      <Image src={p.image} alt={p.title} fill sizes="33vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '16px 20px 20px' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 8 }}>{p.category}</span>
                      <h3 style={{ fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.45, color: 'var(--heading)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <style jsx>{`
        .article-body { font-size: 0.9375rem; line-height: 1.85; color: var(--body); }
        .article-body h2 { font-family: var(--font); font-size: clamp(1.25rem, 2vw, 1.625rem); font-weight: 700; letter-spacing: -0.02em; color: var(--heading); margin: 40px 0 16px; line-height: 1.3; }
        .article-body h3 { font-family: var(--font); font-size: 1.0625rem; font-weight: 700; color: var(--heading); margin: 28px 0 12px; }
        .article-body p { margin-bottom: 20px; }
        .article-body ul, .article-body ol { padding-left: 24px; margin-bottom: 20px; }
        .article-body li { margin-bottom: 8px; }
        .article-body strong { color: var(--heading); font-weight: 600; }
        .article-body a { color: var(--navy); text-decoration: underline; }
        @media (max-width: 900px) {
          .post-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
