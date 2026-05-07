import { blogPosts } from '@/lib/blog-data';
import BlogPostPage from '@/components/BlogPostPage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Macins Luxe`,
    description: post.excerpt,
  };
}

export default function BlogPostRoute({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) notFound();
  const related = blogPosts.filter(p => p.slug !== params.slug && p.category === post.category).slice(0, 3);
  return <BlogPostPage post={post} related={related} />;
}
