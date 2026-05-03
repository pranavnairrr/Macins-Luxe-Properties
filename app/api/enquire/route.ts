import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { name, phone, email, propertyType } = await req.json()
  const supabase = createClient()
  const { error } = await supabase.from('leads').insert({
    name: name || null,
    phone: phone || null,
    email: email || null,
    property_type: propertyType || null,
    source: 'enquiry',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
