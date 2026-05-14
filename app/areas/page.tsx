import AreasPage from '@/components/AreasPage';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';
import type { AreaData } from '@/lib/areas-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Explore Prime Areas — Macins Luxe',
  description: 'Discover the finest residential and commercial areas in Dubai and Abu Dhabi. Macins Luxe guides you to the perfect neighbourhood.',
};

function mapArea(row: Record<string, unknown>): AreaData {
  return {
    slug: row.slug as string,
    name: row.name as string,
    emirate: row.emirate as AreaData['emirate'],
    tagline: row.tagline as string,
    image: row.image as string,
    heroImage: row.hero_image as string,
    description: row.description as string,
    highlights: (row.highlights as string[]) ?? [],
    avgPricePerSqft: row.avg_price_per_sqft as string,
    rentalYield: row.rental_yield as string,
    propertyTypes: (row.property_types as string[]) ?? [],
    nearbyAreas: (row.nearby_areas as string[]) ?? [],
    lat: row.lat as number,
    lng: row.lng as number,
    mapZoom: row.map_zoom as number,
  };
}

export default async function AreasRoute() {
  const sb = createClient();
  const { data } = await sb
    .from('areas')
    .select('*')
    .order('sort_order', { ascending: true });
  const areas = (data ?? []).map(mapArea);
  return <AreasPage areas={areas} />;
}
