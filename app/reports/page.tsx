import ReportsPage from '@/components/ReportsPage';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';
import type { Report } from '@/lib/reports-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Market Reports — Macins Luxe',
  description: "Download Macins Luxe's comprehensive Dubai real estate market reports, area guides, and investment forecasts.",
};

function mapReport(row: Record<string, unknown>): Report {
  return {
    slug: row.slug as string,
    title: row.title as string,
    year: row.year as number,
    quarter: (row.quarter as string) ?? undefined,
    category: row.category as Report['category'],
    description: row.description as string,
    image: row.image as string,
    pdf_url: row.pdf_url as string,
    featured: row.featured as boolean,
    highlights: (row.highlights as string[]) ?? [],
  };
}

export default async function ReportsRoute() {
  const sb = createClient();
  const { data } = await sb
    .from('reports')
    .select('*')
    .order('year', { ascending: false });
  const reports = (data ?? []).map(mapReport);
  return <ReportsPage reports={reports} />;
}
