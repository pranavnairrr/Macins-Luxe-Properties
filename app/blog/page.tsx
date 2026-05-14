import BlogListingPage from '@/components/BlogListingPage';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';
import type { BlogPost } from '@/lib/blog-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog & Insights — Macins Luxe',
  description: 'Expert insights on Dubai real estate: market reports, investment guides, area spotlights, and property law updates from Macins Luxe.',
};

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

export default async function BlogRoute() {
  const sb = createClient();
  const { data } = await sb
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  const posts = (data ?? []).map(mapPost);
  return <BlogListingPage posts={posts} />;
}
