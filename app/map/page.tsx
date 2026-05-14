import Nav from '@/components/Nav';
import MapPage from '@/components/MapPage';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Map — Macins Luxe',
  description: 'Browse luxury properties across Dubai and Abu Dhabi on an interactive map.',
};

export const revalidate = 60;

function buildClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export default async function MapRoute() {
  const sb = buildClient();

  const [{ data: listingsData }, { data: areasData }] = await Promise.all([
    sb.from('listings').select('*').eq('status', 'published'),
    sb.from('areas').select('slug, name, avg_price_per_sqft, rental_yield, lat, lng, property_types'),
  ]);

  return (
    <>
      <Nav />
      <MapPage listings={listingsData ?? []} areas={areasData ?? []} />
    </>
  );
}
