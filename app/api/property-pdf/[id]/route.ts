import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import path from 'path'
import fs from 'fs'
import { createClient } from '@/utils/supabase/server'
import PropertyPDF from '@/components/PropertyPDF'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'
import type { AgentRecord } from '@/components/staff/AgentForm'
import { getCompanyInfo } from '@/utils/site-settings'

export const dynamic = 'force-dynamic'

// react-pdf only supports JPEG, PNG, GIF — no WebP/AVIF
function isPdfSafeImage(url: string): boolean {
  return /\.(jpe?g|png|gif)(\?|$)/i.test(url)
}

// Convert a local public path to a base64 data URI — works everywhere, no fetch needed
function toDataUri(url: string): string | null {
  if (!url) return null
  if (url.startsWith('data:')) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const rel = url.startsWith('/') ? url.slice(1) : url
  const filePath = path.join(process.cwd(), 'public', rel)
  if (!fs.existsSync(filePath)) return null
  const ext = path.extname(filePath).toLowerCase().replace('.', '')
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
             : ext === 'png'  ? 'image/png'
             : ext === 'gif'  ? 'image/gif'
             : null
  if (!mime) return null
  const data = fs.readFileSync(filePath)
  return `data:${mime};base64,${data.toString('base64')}`
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'published')
    .single()

  if (error || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  let agent: AgentRecord | null = null
  if ((listing as ListingRecord).agent_id) {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .eq('id', (listing as ListingRecord).agent_id)
      .single()
    agent = data as AgentRecord | null
  }

  const companyInfo = await getCompanyInfo().catch(() => null)

  const record = listing as ListingRecord

  // Convert all images to base64 data URIs (most reliable for react-pdf)
  const resolvedImages = (record.images ?? [])
    .filter(isPdfSafeImage)
    .map(toDataUri)
    .filter(Boolean) as string[]

  const resolvedFloorPlans = (record.floor_plans ?? [])
    .filter(isPdfSafeImage)
    .map(toDataUri)
    .filter(Boolean) as string[]

  const resolvedListing: ListingRecord = {
    ...record,
    images: resolvedImages,
    floor_plans: resolvedFloorPlans,
  }

  const resolvedAgent: AgentRecord | null = agent
    ? {
        ...agent,
        photo_url: agent.photo_url && isPdfSafeImage(agent.photo_url)
          ? toDataUri(agent.photo_url)
          : null,
      }
    : null

  // White logo PNG on navy backgrounds
  const logoSrc = toDataUri('/images/logo-white-luxe.png') ?? undefined

  const pdfBuffer = await renderToBuffer(
    createElement(PropertyPDF, {
      listing: resolvedListing,
      agent: resolvedAgent,
      logoSrc,
      companyInfo: companyInfo ?? undefined,
    }) as ReactElement<DocumentProps>
  )

  const fileName = `${record.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-macins-luxe.pdf`

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  })
}
