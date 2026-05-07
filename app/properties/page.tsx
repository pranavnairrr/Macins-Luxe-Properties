import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import PropertiesListingPage from '@/components/PropertiesListingPage';
import type { ListingRecord } from '@/components/staff/PropertyListingForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Properties — Macins Luxe',
  description: 'Browse all luxury properties in Dubai and Abu Dhabi. Filter by area, price, bedrooms and more.',
};

export default async function PropertiesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const listings = (data as ListingRecord[]) ?? [];

  return (
    <Suspense>
      <PropertiesListingPage listings={listings} />
    </Suspense>
  );
}
