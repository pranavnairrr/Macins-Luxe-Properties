import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import PropertyDetailPage from '@/components/PropertyDetailPage'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('listings')
    .select('name, location, description')
    .eq('id', params.id)
    .single()

  if (!data) return { title: 'Property — Macins Luxe' }

  return {
    title: `${data.name} — Macins Luxe`,
    description: data.description
      || `${data.name} in ${data.location} — luxury property by Macins Luxe.`,
  }
}

export default async function PropertyPage({ params }: Props) {
  const supabase = createClient()
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'published')
    .single()

  if (!data) notFound()

  return <PropertyDetailPage listing={data as ListingRecord} />
}
