import AreaDetailPage from '@/components/AreaDetailPage';
import { areas } from '@/lib/areas-data';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return areas.map(a => ({ name: a.slug }));
}

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const area = areas.find(a => a.slug === params.name);
  if (!area) return {};
  return {
    title: `${area.name} Properties — Macins Luxe`,
    description: area.tagline,
  };
}

export default async function AreaRoute({ params }: { params: { name: string } }) {
  const area = areas.find(a => a.slug === params.name);
  if (!area) notFound();

  const sb = createClient();
  const { data: listings } = await sb
    .from('listings')
    .select('*')
    .ilike('location', `%${area.name}%`)
    .eq('status', 'published')
    .limit(6);

  return <AreaDetailPage area={area} listings={listings ?? []} />;
}
