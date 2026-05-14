import { createClient } from '@/utils/supabase/server';
import { createClient as createDirect } from '@supabase/supabase-js';
import BlogPostPage from '@/components/BlogPostPage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { BlogPost } from '@/lib/blog-data';

// Build-time client — no cookies, no request context required
function buildClient() {
  return createDirect(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export const revalidate = 60;

function mapPost(row: Record<string, unknown>): BlogPost {
  return {
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as BlogPost['category'],
    date: row.published_date as string,
    readTime: row.read_time as string,
    excerpt: row.excerpt as string,
    image: row.image as string,
    featured: row.featured as boolean,
    body: row.body as string,
    tags: (row.tags as string[]) ?? [],
    author: row.author as string,
  };
}

export async function generateStaticParams() {
  const { data } = await buildClient().from('blog_posts').select('slug');
  return (data ?? []).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sb = createClient();
  const { data } = await sb.from('blog_posts').select('title, excerpt').eq('slug', params.slug).single();
  if (!data) return {};
  return {
    title: `${data.title} — Macins Luxe`,
    description: data.excerpt,
  };
}

export default async function BlogPostRoute({ params }: { params: { slug: string } }) {
  const sb = createClient();
  const [{ data: postRow }, { data: relatedRows }] = await Promise.all([
    sb.from('blog_posts').select('*').eq('slug', params.slug).single(),
    sb.from('blog_posts').select('*').neq('slug', params.slug).limit(20),
  ]);

  if (!postRow) notFound();

  const post = mapPost(postRow);
  const related = (relatedRows ?? [])
    .filter(r => r.category === postRow.category)
    .slice(0, 3)
    .map(mapPost);

  return <BlogPostPage post={post} related={related} />;
}
