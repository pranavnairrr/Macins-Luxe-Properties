import BlogListingPage from '@/components/BlogListingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Insights — Macins Luxe',
  description: 'Expert insights on Dubai real estate: market reports, investment guides, area spotlights, and property law updates from Macins Luxe.',
};

export default function BlogRoute() {
  return <BlogListingPage />;
}
