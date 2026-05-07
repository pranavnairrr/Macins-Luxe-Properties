import AgentDetailPage from '@/components/AgentDetailPage';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sb = createClient();
  const { data: agents } = await sb.from('agents').select('name, title').eq('is_active', true);
  const agent = (agents ?? []).find(a => toSlug(a.name) === params.slug);
  if (!agent) return {};
  return {
    title: `${agent.name} — Macins Luxe`,
    description: `${agent.name} is a ${agent.title} at Macins Luxe Properties. Browse their listings and get in touch.`,
  };
}

export default async function AgentRoute({ params }: { params: { slug: string } }) {
  const sb = createClient();
  const { data: agents } = await sb.from('agents').select('*').eq('is_active', true);
  const agent = (agents ?? []).find(a => toSlug(a.name) === params.slug);
  if (!agent) notFound();

  const { data: listings } = await sb
    .from('listings')
    .select('*')
    .eq('agent_id', agent.id)
    .eq('status', 'published')
    .limit(6);

  return <AgentDetailPage agent={agent} listings={listings ?? []} />;
}
