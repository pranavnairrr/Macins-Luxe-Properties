import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getCompanyInfo } from '@/utils/site-settings'
import { buildLuxeHtml } from '@/lib/pdf/luxe-html'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'
import type { AgentRecord } from '@/components/staff/AgentForm'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Fetch any image URL and return a base64 data URI.
// Puppeteer's setContent has no proper origin, so external images must be
// embedded as data URIs rather than relying on Puppeteer to fetch them.
async function imageToDataUri(url: string): Promise<string | null> {
  if (!url) return null
  if (url.startsWith('data:')) return url

  // Local /public file
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const rel = url.startsWith('/') ? url.slice(1) : url
    const filePath = path.join(process.cwd(), 'public', rel)
    if (!fs.existsSync(filePath)) return null
    const ext = path.extname(filePath).toLowerCase().replace('.', '')
    const mime = ext === 'svg' ? 'image/svg+xml'
               : ext === 'png' ? 'image/png'
               : ext === 'gif' ? 'image/gif'
               : 'image/jpeg'
    const data = fs.readFileSync(filePath)
    return `data:${mime};base64,${data.toString('base64')}`
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!res.ok) return null
    const ct = (res.headers.get('content-type') ?? '').toLowerCase()
    // Accept all common image types — Chrome handles WebP/AVIF natively
    const mime = ct.includes('jpeg') || ct.includes('jpg') ? 'image/jpeg'
               : ct.includes('png')  ? 'image/png'
               : ct.includes('gif')  ? 'image/gif'
               : ct.includes('webp') ? 'image/webp'
               : ct.includes('avif') ? 'image/avif'
               : ct.includes('svg')  ? 'image/svg+xml'
               : null
    if (!mime) return null
    const buf = await res.arrayBuffer()
    return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
  } catch {
    return null
  }
}

function logoDataUri(): string | null {
  const filePath = path.join(process.cwd(), 'public', 'images', 'logo-white-luxe.png')
  if (!fs.existsSync(filePath)) return null
  const data = fs.readFileSync(filePath)
  return `data:image/png;base64,${data.toString('base64')}`
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

  // Pre-fetch all images as base64 data URIs so Puppeteer's setContent
  // doesn't need to make any external network requests for images
  const [resolvedImages, resolvedFloorPlans] = await Promise.all([
    Promise.all((record.images ?? []).map(imageToDataUri)),
    Promise.all((record.floor_plans ?? []).map(imageToDataUri)),
  ])

  const resolvedAgent: AgentRecord | null = agent
    ? { ...agent, photo_url: agent.photo_url ? await imageToDataUri(agent.photo_url) : null }
    : null

  const resolvedListing: ListingRecord = {
    ...record,
    images:      resolvedImages.filter(Boolean)      as string[],
    floor_plans: resolvedFloorPlans.filter(Boolean)  as string[],
  }

  const logoSrc = logoDataUri() ?? undefined

  const html = buildLuxeHtml({
    listing: resolvedListing,
    agent: resolvedAgent,
    logoSrc,
    companyInfo: companyInfo ?? undefined,
  })

  // Launch headless Chrome
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chromium: any, puppeteer: any
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    puppeteer = (await import('puppeteer-core')).default
    chromium  = null
  } else {
    chromium  = (await import('@sparticuz/chromium-min')).default
    puppeteer = (await import('puppeteer-core')).default
  }

  const CHROMIUM_PACK = 'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'

  const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH
    ?? await chromium.executablePath(CHROMIUM_PACK)

  const browser = await puppeteer.launch({
    args: chromium?.args ?? ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 2 },
    executablePath,
    headless: chromium?.headless ?? true,
  })

  try {
    const page = await browser.newPage()
    // Images are all data URIs now; only Google Fonts need network — use networkidle0
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    const fileName = `${record.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-macins-luxe.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } finally {
    await browser.close()
  }
}
