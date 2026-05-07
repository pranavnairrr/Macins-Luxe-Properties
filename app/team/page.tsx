import TeamPage from '@/components/TeamPage';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team — Macins Luxe',
  description: 'Meet the Macins Luxe team — 200+ property professionals across Dubai and Abu Dhabi dedicated to finding your perfect home.',
};

export default async function TeamRoute() {
  const sb = createClient();
  const { data: agents } = await sb
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  return <TeamPage agents={agents ?? []} />;
}
