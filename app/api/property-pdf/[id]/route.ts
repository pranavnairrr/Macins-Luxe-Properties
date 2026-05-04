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

// Read a local /public file as base64 data URI
function localToDataUri(url: string): string | null {
  if (!url || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return null
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

// Fetch any image URL (remote or local) and return a base64 data URI.
// Checks actual content-type so WebP/AVIF stored with any extension are handled correctly.
// react-pdf requires JPEG, PNG, or GIF — WebP/AVIF are skipped.
async function imageToDataUri(url: string): Promise<string | null> {
  if (!url) return null
  if (url.startsWith('data:')) return url

  // Local /public file
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return localToDataUri(url)
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!res.ok) return null

    const ct = (res.headers.get('content-type') ?? '').toLowerCase()
    const mime = ct.includes('jpeg') || ct.includes('jpg') ? 'image/jpeg'
               : ct.includes('png')  ? 'image/png'
               : ct.includes('gif')  ? 'image/gif'
               : null

    if (!mime) return null   // WebP, AVIF, HEIC etc. skipped — react-pdf can't render them

    const buf = await res.arrayBuffer()
    return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
  } catch {
    return null
  }
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

  // Fetch all images in parallel as base64 data URIs.
  // Checks actual content-type so format is detected correctly regardless of file extension.
  const [resolvedImages, resolvedFloorPlans] = await Promise.all([
    Promise.all((record.images ?? []).map(imageToDataUri)),
    Promise.all((record.floor_plans ?? []).map(imageToDataUri)),
  ])

  const resolvedListing: ListingRecord = {
    ...record,
    images:      resolvedImages.filter(Boolean) as string[],
    floor_plans: resolvedFloorPlans.filter(Boolean) as string[],
  }

  const resolvedAgent: AgentRecord | null = agent
    ? {
        ...agent,
        photo_url: agent.photo_url ? await imageToDataUri(agent.photo_url) : null,
      }
    : null

  // White logo PNG on navy backgrounds
  const logoSrc = localToDataUri('/images/logo-white-luxe.png') ?? undefined

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
