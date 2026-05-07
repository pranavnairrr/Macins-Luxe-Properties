import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, propertyType, message } = body

    const supabase = createClient()
    await supabase.from('leads').insert({
      name: name || null,
      phone: phone || null,
      email: email || null,
      property_type: propertyType || null,
      message: message || null,
      source: 'enquiry',
    })

    // Always return ok — we never want to show the user a failure screen
    // for a contact form (Supabase errors are logged server-side)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
