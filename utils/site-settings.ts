import { createClient } from '@/utils/supabase/server'

export type HeroSlide = {
  id: number
  image_url: string
  badge: string
  title: string
  sub: string
  cta: string
  cta_href: string
  active: boolean
}

export type CompanyInfo = {
  phone: string
  whatsapp: string
  email: string
  website: string
  address_dubai: string
  address_abudhabi: string
  orn: string
}

export type StatItem = { value: string; label: string; desc: string }

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const sb = createClient()
  const { data } = await sb.from('site_settings').select('value').eq('key', 'hero_slides').single()
  return ((data?.value?.slides ?? []) as HeroSlide[]).filter(s => s.active)
}

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const sb = createClient()
  const { data } = await sb.from('site_settings').select('value').eq('key', 'company_info').single()
  return (data?.value ?? null) as CompanyInfo | null
}

export async function getStats(): Promise<StatItem[]> {
  const sb = createClient()
  const { data } = await sb.from('site_settings').select('value').eq('key', 'stats').single()
  return (data?.value?.items ?? []) as StatItem[]
}
