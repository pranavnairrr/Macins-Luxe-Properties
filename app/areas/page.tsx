import AreasPage from '@/components/AreasPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Prime Areas — Macins Luxe',
  description: 'Discover the finest residential and commercial areas in Dubai and Abu Dhabi. Macins Luxe guides you to the perfect neighbourhood.',
};

export default function AreasRoute() {
  return <AreasPage />;
}
