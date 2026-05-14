import AreaDetailPage from '@/components/AreaDetailPage';
import { createClient } from '@/utils/supabase/server';
import { createClient as createDirect } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { AreaData } from '@/lib/areas-data';

function buildClient() {
  return createDirect(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export const revalidate = 60;

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

export async function generateStaticParams() {
  const { data } = await buildClient().from('areas').select('slug');
  return (data ?? []).map(a => ({ name: a.slug }));
}

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const sb = createClient();
  const { data } = await sb.from('areas').select('name, tagline').eq('slug', params.name).single();
  if (!data) return {};
  return {
    title: `${data.name} Properties — Macins Luxe`,
    description: data.tagline,
  };
}

export default async function AreaRoute({ params }: { params: { name: string } }) {
  const sb = createClient();

  const { data: areaRow } = await sb
    .from('areas')
    .select('*')
    .eq('slug', params.name)
    .single();

  if (!areaRow) notFound();

  const area = mapArea(areaRow);

  const [{ data: listingsData }, { data: nearbyRows }] = await Promise.all([
    sb
      .from('listings')
      .select('*')
      .ilike('location', `%${area.name}%`)
      .eq('status', 'published')
      .limit(6),
    sb
      .from('areas')
      .select('*')
      .in('name', area.nearbyAreas),
  ]);

  const nearbyAreaData = (nearbyRows ?? []).map(mapArea);

  return (
    <AreaDetailPage
      area={area}
      listings={listingsData ?? []}
      nearbyAreaData={nearbyAreaData}
    />
  );
}
