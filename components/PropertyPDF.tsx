import {
  Document, Page, View, Text, Image as PDFImage,
} from '@react-pdf/renderer'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'
import type { AgentRecord } from '@/components/staff/AgentForm'

// react-pdf constraints: no gap shorthand, no borderRadius on Image (wrap View),
// no aspectRatio, Helvetica-Bold for bold, % widths ok in flex containers

// ── Colours ───────────────────────────────────────────────────────────────────
const NAVY   = '#152140'
const NAVY2  = '#1B3079'
const GOLD   = '#D5BA8C'
const WHITE  = '#FFFFFF'
const LIGHT  = '#F5F6F8'
const MUTED  = '#9BA3AF'
const BODY   = '#374151'
const BORDER = '#E8EAED'

// ── Dimensions ────────────────────────────────────────────────────────────────
const PW     = 841.89   // A4 landscape width  (pt)
const PH     = 595.28   // A4 landscape height (pt)
const HDR_H  = 34       // minimal text header
const FTR_H  = 24       // minimal footer
const BODY_H = PH - HDR_H - FTR_H  // 537.28

// Gallery 2×2 grid
const GAL_PAD   = 24
const GAL_GAP   = 8
const GAL_IMG_W = Math.floor((PW - GAL_PAD * 2 - GAL_GAP) / 2)    // 393
const GAL_IMG_H = Math.floor((BODY_H - GAL_PAD * 2 - GAL_GAP) / 2) // 240

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CompanyContact {
  phone?: string; email?: string; website?: string; orn?: string
}
export interface Props {
  listing: ListingRecord; agent: AgentRecord | null; logoSrc?: string; companyInfo?: CompanyContact
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function mkContact(ci?: CompanyContact) {
  const e = ci?.email   ?? 'info@macinsluxe.com'
  const p = ci?.phone   ?? '+971 4 454 2588'
  const w = ci?.website ?? 'www.macinsluxe.com'
  return { line: `${e}  ·  ${p}  ·  ${w}`, block: `${e}\n${p}\n${w}` }
}

function isPdfImg(url: string) {
  return /\.(jpe?g|png|gif)(\?|$)/i.test(url)
}

function todayFormatted() {
  const d  = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${d.getFullYear()}`
}

function totalPages(l: ListingRecord, a: AgentRecord | null) {
  const gallery  = (l.images ?? []).slice(1).filter(isPdfImg)
  const galPages = gallery.length >= 2 ? Math.ceil(gallery.length / 4) : 0
  const floorPDF = (l.floor_plans ?? []).filter(isPdfImg)
  let n = 2  // cover + overview
  if (l.description) n++
  n += galPages
  if ((l.amenities ?? []).length > 0) n++
  if (l.payment_plan) n++
  if (floorPDF.length > 0) n++
  if (a) n++
  return n
}

// ── Shared widgets ────────────────────────────────────────────────────────────

// Reelly-style minimal header: "PROPERTY NAME / SECTION"  |  "MACINS LUXE..."
function PageHdr({ name, section }: { name: string; section: string }) {
  return (
    <View style={{
      position: 'absolute', top: 0, left: 0, width: PW, height: HDR_H,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 32,
      borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: 'solid',
    }}>
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.4, textTransform: 'uppercase' }}>
        {name} / {section}
      </Text>
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.4, textTransform: 'uppercase' }}>
        Macins Luxe Properties LLC
      </Text>
    </View>
  )
}

function PageFtr({ pg, total, contact }: { pg: number; total: number; contact: string }) {
  return (
    <View style={{
      position: 'absolute', bottom: 0, left: 0, width: PW, height: FTR_H,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 32,
      borderTopWidth: 0.5, borderTopColor: BORDER, borderTopStyle: 'solid',
    }}>
      <Text style={{ fontSize: 6.5, color: MUTED }}>{contact}</Text>
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 6.5, color: MUTED }}>{pg} / {total}</Text>
    </View>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER  (Reelly style)
// ══════════════════════════════════════════════════════════════════════════════
function Cover({ listing: l, agent: a, logoSrc, companyInfo, total }: Props & { total: number }) {
  const img     = (l.images ?? [])[0]
  const contact = mkContact(companyInfo)

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: '#0D1824' }}>

      {img && (
        <PDFImage src={img} style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, objectFit: 'cover' }} />
      )}

      {/* Dark scrims */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, backgroundColor: 'rgba(5,12,24,0.48)' }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: PW, height: PH * 0.55, backgroundColor: 'rgba(5,12,24,0.38)' }} />

      {/* Logo top-left */}
      <View style={{ position: 'absolute', top: 24, left: 36 }}>
        {logoSrc
          ? <PDFImage src={logoSrc} style={{ height: 28, width: 120, objectFit: 'contain' }} />
          : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 12, letterSpacing: 2 }}>MACINS LUXE</Text>
        }
      </View>

      {/* Badge top-right */}
      {l.badge && (
        <View style={{ position: 'absolute', top: 24, right: 36, backgroundColor: GOLD, borderRadius: 3, paddingHorizontal: 12, paddingVertical: 5 }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 7, letterSpacing: 1.6, textTransform: 'uppercase' }}>{l.badge}</Text>
        </View>
      )}

      {/* Bottom-left — Reelly style: tagline + large property name + date */}
      <View style={{ position: 'absolute', bottom: 56, left: 44, width: PW * 0.52 }}>
        <Text style={{ color: 'rgba(255,255,255,0.60)', fontSize: 10.5, marginBottom: 8 }}>
          Look what we found for you
        </Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 46, lineHeight: 1.05, marginBottom: 14 }}>
          {l.name}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 8.5 }}>
          Date of creation {todayFormatted()}
        </Text>
      </View>

      {/* Agent card — bottom right */}
      <View style={{
        position: 'absolute', bottom: 44, right: 36, width: 222,
        backgroundColor: 'rgba(8,16,34,0.90)',
        borderRadius: 12, padding: 18,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', borderStyle: 'solid',
      }}>
        {a ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              {a.photo_url ? (
                <View style={{ width: 52, height: 52, borderRadius: 26, overflow: 'hidden', marginRight: 12 }}>
                  <PDFImage src={a.photo_url} style={{ width: 52, height: 52, objectFit: 'cover' }} />
                </View>
              ) : (
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: NAVY2, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 22 }}>{a.name.charAt(0)}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 11, marginBottom: 3 }}>{a.name}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 7.5 }}>Macins Luxe Properties LLC</Text>
              </View>
            </View>
            <View style={{ height: 0.5, backgroundColor: 'rgba(255,255,255,0.10)', marginBottom: 12 }} />
            {a.phone && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ color: MUTED, fontSize: 7.5, width: 60 }}>Phone</Text>
                <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 8.5 }}>{a.phone}</Text>
              </View>
            )}
            {a.email && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: MUTED, fontSize: 7.5, width: 60 }}>Email</Text>
                <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 8.5 }}>{a.email}</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {logoSrc
              ? <PDFImage src={logoSrc} style={{ height: 24, width: 110, objectFit: 'contain', marginBottom: 12 }} />
              : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 10, letterSpacing: 1, marginBottom: 12 }}>MACINS LUXE</Text>
            }
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 8.5, lineHeight: 1.7 }}>
              {contact.block}
            </Text>
          </>
        )}
      </View>

      <View style={{ position: 'absolute', bottom: 8, right: 32 }}>
        <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.28)' }}>1 / {total}</Text>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — OVERVIEW  (Reelly: left text + right image)
// ══════════════════════════════════════════════════════════════════════════════
function Overview({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const img     = (l.images ?? [])[0]
  const LEFT_W  = Math.round(PW * 0.50)
  const RIGHT_W = PW - LEFT_W
  const IMG_W   = RIGHT_W - 28
  const IMG_H   = BODY_H - 32
  const contact = mkContact(companyInfo)

  const rows = [
    l.price      && { label: 'Starting Price', value: l.price },
    l.beds       && { label: 'Unit Types',      value: l.beds },
    l.size_range && { label: 'Size Range',      value: l.size_range },
    l.badge      && { label: 'Handover',        value: l.badge.replace(/handover:\s*/i, '') },
    l.developer  && { label: 'Developer',       value: l.developer },
    l.location   && { label: 'District',        value: l.location },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <PageHdr name={l.name} section="About the Project" />

      {/* Left panel */}
      <View style={{ position: 'absolute', top: HDR_H, left: 0, width: LEFT_W, height: BODY_H, paddingHorizontal: 36, paddingTop: 30, paddingBottom: 22 }}>

        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 6.5, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          About the Project
        </Text>

        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 28, color: NAVY, lineHeight: 1.15, marginBottom: 16 }}>
          {l.name}
        </Text>

        {/* Developer row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text style={{ fontSize: 7.5, color: MUTED, width: 62 }}>Developer</Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: BODY }}>{l.developer}</Text>
        </View>
        {/* District row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 7.5, color: MUTED, width: 62 }}>District</Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: BODY }}>{l.location}</Text>
        </View>

        {/* Divider */}
        <View style={{ height: 0.75, backgroundColor: BORDER, marginBottom: 20 }} />

        {/* Key stats table */}
        {rows.filter(r => r.label !== 'Developer' && r.label !== 'District').map((row, i) => (
          <View key={i} style={{
            flexDirection: 'row', paddingVertical: 8,
            borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: 'solid',
          }}>
            <Text style={{ fontSize: 7.5, color: MUTED, flex: 1 }}>{row.label}</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: NAVY, flex: 1 }}>{row.value}</Text>
          </View>
        ))}

        {/* Short description */}
        {l.description && (
          <View style={{ marginTop: 18 }}>
            <Text style={{ fontSize: 8.5, color: BODY, lineHeight: 1.72 }}>
              {l.description.length > 280 ? l.description.slice(0, 280) + '…' : l.description}
            </Text>
          </View>
        )}
      </View>

      {/* Right image — rounded corners */}
      <View style={{ position: 'absolute', top: HDR_H + 18, left: LEFT_W, width: IMG_W, height: IMG_H, borderRadius: 12, overflow: 'hidden' }}>
        {img
          ? <PDFImage src={img} style={{ width: IMG_W, height: IMG_H, objectFit: 'cover' }} />
          : <View style={{ width: IMG_W, height: IMG_H, backgroundColor: LIGHT }} />
        }
      </View>

      <PageFtr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — DESCRIPTION  (full text + project facts grid)
// ══════════════════════════════════════════════════════════════════════════════
function Description({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const contact = mkContact(companyInfo)

  const facts = [
    l.developer  && { label: 'Developer',       value: l.developer },
    l.location   && { label: 'Location',        value: l.location },
    l.price      && { label: 'Starting Price',  value: l.price },
    l.beds       && { label: 'Unit Types',      value: l.beds },
    l.size_range && { label: 'Size Range',      value: l.size_range },
    l.badge      && { label: 'Handover',        value: l.badge.replace(/handover:\s*/i, '') },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <PageHdr name={l.name} section="About the Project" />

      <View style={{ position: 'absolute', top: HDR_H, left: 0, width: PW, height: BODY_H, paddingHorizontal: 44, paddingTop: 28, paddingBottom: 22 }}>

        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 6.5, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          About the Project
        </Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 22, color: NAVY, lineHeight: 1.15, marginBottom: 6 }}>
          {l.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Text style={{ fontSize: 7.5, color: MUTED, marginRight: 6 }}>Developer</Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: BODY }}>{l.developer}</Text>
        </View>

        <View style={{ height: 0.75, backgroundColor: BORDER, marginBottom: 18 }} />

        {/* 2-column: description left, facts right */}
        <View style={{ flexDirection: 'row' }}>
          {/* Description */}
          <View style={{ flex: 3, marginRight: 32 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, color: GOLD, letterSpacing: 0.3, marginBottom: 10 }}>
              Description
            </Text>
            <Text style={{ fontSize: 8.5, color: BODY, lineHeight: 1.75 }}>
              {l.description ?? ''}
            </Text>
          </View>

          {/* Project facts */}
          <View style={{ flex: 2, backgroundColor: LIGHT, borderRadius: 10, padding: 18 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: NAVY, letterSpacing: 0.3, marginBottom: 14 }}>
              Project Info
            </Text>
            {facts.map((f, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 6.5, color: MUTED, letterSpacing: 0.3, marginBottom: 3 }}>{f.label}</Text>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: NAVY }}>{f.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <PageFtr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// GALLERY PAGE  (Reelly: 2×2 grid, rounded corners, white bg)
// ══════════════════════════════════════════════════════════════════════════════
function GalleryPage({
  listing: l, images, section, companyInfo, pg, total,
}: Props & { images: string[]; section: string; pg: number; total: number }) {
  const contact = mkContact(companyInfo)
  const [a, b, c, d] = images

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <PageHdr name={l.name} section={section} />

      <View style={{ position: 'absolute', top: HDR_H, left: 0, width: PW, height: BODY_H, padding: GAL_PAD }}>
        {/* Top row */}
        <View style={{ flexDirection: 'row', marginBottom: GAL_GAP }}>
          {a ? (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, overflow: 'hidden' }}>
              <PDFImage src={a} style={{ width: GAL_IMG_W, height: GAL_IMG_H, objectFit: 'cover' }} />
            </View>
          ) : (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, backgroundColor: LIGHT }} />
          )}
          {b ? (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, overflow: 'hidden', marginLeft: GAL_GAP }}>
              <PDFImage src={b} style={{ width: GAL_IMG_W, height: GAL_IMG_H, objectFit: 'cover' }} />
            </View>
          ) : (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, backgroundColor: LIGHT, marginLeft: GAL_GAP }} />
          )}
        </View>
        {/* Bottom row */}
        <View style={{ flexDirection: 'row' }}>
          {c ? (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, overflow: 'hidden' }}>
              <PDFImage src={c} style={{ width: GAL_IMG_W, height: GAL_IMG_H, objectFit: 'cover' }} />
            </View>
          ) : (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, backgroundColor: LIGHT }} />
          )}
          {d ? (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, overflow: 'hidden', marginLeft: GAL_GAP }}>
              <PDFImage src={d} style={{ width: GAL_IMG_W, height: GAL_IMG_H, objectFit: 'cover' }} />
            </View>
          ) : (
            <View style={{ width: GAL_IMG_W, height: GAL_IMG_H, borderRadius: 10, backgroundColor: LIGHT, marginLeft: GAL_GAP }} />
          )}
        </View>
      </View>

      <PageFtr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// AMENITIES  (Reelly: left title panel + right 3-col grid)
// ══════════════════════════════════════════════════════════════════════════════
function Amenities({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const contact   = mkContact(companyInfo)
  const amenities = l.amenities ?? []
  const LEFT_W    = Math.round(PW * 0.28)
  const RIGHT_W   = PW - LEFT_W
  const R_PAD     = 24
  const INNER_W   = RIGHT_W - R_PAD * 2
  const COL_GAP   = 10
  const COL_W     = Math.floor((INNER_W - COL_GAP * 2) / 3)
  const CARD_H    = 100

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <PageHdr name={l.name} section="Features & Amenities" />

      {/* Left title panel */}
      <View style={{ position: 'absolute', top: HDR_H, left: 0, width: LEFT_W, height: BODY_H, backgroundColor: LIGHT, paddingHorizontal: 26, paddingTop: 32 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 6.5, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
          World-Class Living
        </Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 26, color: NAVY, lineHeight: 1.2, marginBottom: 12 }}>
          {`Features &\nAmenities`}
        </Text>
        <View style={{ height: 2, backgroundColor: GOLD, width: 28, marginBottom: 22 }} />
        {l.price && (
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 6.5, color: MUTED, marginBottom: 4 }}>Starting From</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11, color: NAVY2 }}>{l.price}</Text>
          </View>
        )}
        {l.beds && (
          <View>
            <Text style={{ fontSize: 6.5, color: MUTED, marginBottom: 4 }}>Unit Types</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11, color: NAVY2 }}>{l.beds}</Text>
          </View>
        )}
      </View>

      {/* Right amenity grid */}
      <View style={{ position: 'absolute', top: HDR_H, left: LEFT_W, width: RIGHT_W, height: BODY_H, paddingHorizontal: R_PAD, paddingTop: 24, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {amenities.map((name, i) => {
            const col = i % 3
            return (
              <View key={i} style={{ width: COL_W, marginRight: col < 2 ? COL_GAP : 0, marginBottom: 14 }}>
                {/* Placeholder photo card */}
                <View style={{ width: COL_W, height: CARD_H, borderRadius: 10, backgroundColor: LIGHT, alignItems: 'center', justifyContent: 'center', marginBottom: 7 }}>
                  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: GOLD }} />
                </View>
                <Text style={{ fontSize: 8, color: BODY, textAlign: 'center' }}>{name}</Text>
              </View>
            )
          })}
        </View>
      </View>

      <PageFtr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT PLAN
// ══════════════════════════════════════════════════════════════════════════════
function PaymentPlan({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const lines    = (l.payment_plan ?? '').split('\n').filter(ln => ln.trim())
  const LEFT_W   = Math.round(PW * 0.35)
  const SCHED_W  = PW - LEFT_W
  const contact  = mkContact(companyInfo)

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <PageHdr name={l.name} section="Payment Plan" />

      {/* Left navy panel */}
      <View style={{ position: 'absolute', top: HDR_H, left: 0, width: LEFT_W, height: BODY_H, backgroundColor: NAVY, paddingHorizontal: 30, paddingTop: 32, paddingBottom: 24, justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Investment Details
          </Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 30, lineHeight: 1.18, marginBottom: 16 }}>
            {'Payment\nPlan'}
          </Text>
          <View style={{ height: 2, backgroundColor: GOLD, width: 30, marginBottom: 24 }} />
          {l.price && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.38)', fontSize: 7, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>Starting Price</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 15 }}>{l.price}</Text>
            </View>
          )}
          {l.beds && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.38)', fontSize: 7, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>Unit Types</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10 }}>{l.beds}</Text>
            </View>
          )}
          {l.size_range && (
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.38)', fontSize: 7, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>Size Range</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10 }}>{l.size_range}</Text>
            </View>
          )}
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.20)', fontSize: 6.5, lineHeight: 1.55 }}>
          {'T&C apply. Subject to developer approval.\nPrices subject to change.'}
        </Text>
      </View>

      {/* Right schedule */}
      <View style={{ position: 'absolute', top: HDR_H, left: LEFT_W, width: SCHED_W, height: BODY_H, paddingHorizontal: 38, paddingTop: 28, paddingBottom: 22 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 22 }}>
          Payment Schedule
        </Text>
        {lines.map((line, i) => {
          const pctMatch = line.match(/(\d+)\s*%/)
          const pct      = pctMatch ? parseInt(pctMatch[1]) : 0
          const isFirst  = i === 0
          return (
            <View key={i} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: pct > 0 ? 5 : 0 }}>
                <View style={{
                  width: 22, height: 22, borderRadius: 11,
                  backgroundColor: isFirst ? GOLD : LIGHT,
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 12, flexShrink: 0,
                }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, color: isFirst ? NAVY : MUTED }}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1, paddingTop: 3 }}>
                  <Text style={{ fontSize: 9, color: BODY, lineHeight: 1.5 }}>{line}</Text>
                </View>
                {pct > 0 && (
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: isFirst ? GOLD : NAVY2, marginLeft: 8, paddingTop: 2 }}>
                    {pct}%
                  </Text>
                )}
              </View>
              {pct > 0 && (
                <View style={{ marginLeft: 34, height: 3, backgroundColor: BORDER, borderRadius: 2 }}>
                  <View style={{ width: `${Math.min(pct, 100)}%`, height: 3, backgroundColor: isFirst ? GOLD : NAVY2, borderRadius: 2 }} />
                </View>
              )}
            </View>
          )
        })}
      </View>

      <PageFtr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// FLOOR PLANS
// ══════════════════════════════════════════════════════════════════════════════
function FloorPlans({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const plans    = (l.floor_plans ?? []).filter(isPdfImg)
  const SB_W     = 148
  const GRID_W   = PW - SB_W
  const PAD      = 18
  const cols     = plans.length <= 2 ? 2 : 3
  const gap      = 10
  const imgW     = (GRID_W - PAD * 2 - gap * (cols - 1)) / cols
  const imgH     = imgW * 0.72
  const contact  = mkContact(companyInfo)

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <PageHdr name={l.name} section="Floor Plans" />

      {/* Sidebar */}
      <View style={{ position: 'absolute', top: HDR_H, left: 0, width: SB_W, height: BODY_H, backgroundColor: NAVY, paddingHorizontal: 22, paddingTop: 28 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 6.5, letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 14 }}>
          Floor Plans
        </Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 22, lineHeight: 1.25, marginBottom: 14 }}>
          {'Unit\nLayouts'}
        </Text>
        <View style={{ height: 2, backgroundColor: GOLD, width: 24, marginBottom: 18 }} />
        {l.beds && <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 8.5, lineHeight: 1.6, marginBottom: 12 }}>{l.beds}</Text>}
        {l.size_range && (
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 6.5, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Size Range</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 9 }}>{l.size_range}</Text>
          </View>
        )}
      </View>

      {/* Image grid */}
      <View style={{ position: 'absolute', top: HDR_H, left: SB_W, width: GRID_W, height: BODY_H, padding: PAD, backgroundColor: LIGHT }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {plans.map((src, i) => (
            <View key={i} style={{
              width: imgW, height: imgH, backgroundColor: WHITE,
              borderRadius: 10, overflow: 'hidden',
              borderWidth: 1, borderColor: BORDER, borderStyle: 'solid',
              marginRight: (i + 1) % cols !== 0 ? gap : 0,
              marginBottom: gap,
            }}>
              <PDFImage src={src} style={{ width: imgW, height: imgH, objectFit: 'contain' }} />
            </View>
          ))}
        </View>
      </View>

      <PageFtr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// AGENT PAGE
// ══════════════════════════════════════════════════════════════════════════════
function AgentPage({ listing: _l, agent: a, logoSrc, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  if (!a) return null
  const LEFT_W  = Math.round(PW * 0.36)
  const RIGHT_W = PW - LEFT_W
  const contact = mkContact(companyInfo)
  const TOP     = 58

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', backgroundColor: NAVY }}>
      <View style={{ position: 'absolute', top: 0, left: 0, width: PW, height: 3, backgroundColor: GOLD }} />

      {/* Logo */}
      <View style={{ position: 'absolute', top: 18, left: 36 }}>
        {logoSrc
          ? <PDFImage src={logoSrc} style={{ height: 26, width: 114, objectFit: 'contain' }} />
          : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 12, letterSpacing: 1.5 }}>MACINS LUXE</Text>
        }
      </View>
      <View style={{ position: 'absolute', top: 22, right: 36 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(213,186,140,0.55)', fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Your Property Expert
        </Text>
      </View>

      {/* Left — photo + name */}
      <View style={{ position: 'absolute', top: TOP, left: 0, width: LEFT_W, height: PH - TOP - FTR_H, paddingHorizontal: 40, paddingTop: 20, alignItems: 'center' }}>
        {a.photo_url ? (
          <View style={{ width: 148, height: 148, borderRadius: 74, overflow: 'hidden', borderWidth: 3, borderColor: GOLD, borderStyle: 'solid', marginBottom: 16 }}>
            <PDFImage src={a.photo_url} style={{ width: 148, height: 148, objectFit: 'cover' }} />
          </View>
        ) : (
          <View style={{ width: 148, height: 148, borderRadius: 74, backgroundColor: NAVY2, borderWidth: 3, borderColor: GOLD, borderStyle: 'solid', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 58 }}>{a.name.charAt(0)}</Text>
          </View>
        )}
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 18, textAlign: 'center', marginBottom: 5 }}>{a.name}</Text>
        {a.title && <Text style={{ color: GOLD, fontSize: 9, textAlign: 'center', marginBottom: 14 }}>{a.title}</Text>}
        <View style={{ height: 1, backgroundColor: 'rgba(213,186,140,0.20)', width: 72, marginBottom: 12 }} />
        <Text style={{ color: 'rgba(255,255,255,0.32)', fontSize: 7.5, textAlign: 'center', lineHeight: 1.6 }}>
          {'Macins Luxe Properties LLC\nDubai, UAE'}
        </Text>
      </View>

      {/* Divider */}
      <View style={{ position: 'absolute', top: TOP + 12, left: LEFT_W, width: 1, height: PH - TOP - FTR_H - 24, backgroundColor: 'rgba(213,186,140,0.14)' }} />

      {/* Right — contact + bio + company */}
      <View style={{ position: 'absolute', top: TOP, left: LEFT_W + 1, width: RIGHT_W - 1, height: PH - TOP - FTR_H, paddingHorizontal: 38, paddingTop: 22 }}>
        {([
          { label: 'Phone',    value: a.phone },
          { label: 'WhatsApp', value: a.whatsapp },
          { label: 'Email',    value: a.email },
        ] as { label: string; value: string | null | undefined }[])
          .filter(c => c.value)
          .map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', borderBottomStyle: 'solid' }}>
              <Text style={{ color: MUTED, fontSize: 8, width: 60 }}>{c.label}</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10, flex: 1 }}>{c.value}</Text>
            </View>
          ))}

        {a.bio && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.38)', fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>About</Text>
            <Text style={{ color: 'rgba(255,255,255,0.58)', fontSize: 8.5, lineHeight: 1.7 }}>
              {a.bio.length > 280 ? a.bio.slice(0, 280) + '…' : a.bio}
            </Text>
          </View>
        )}

        <View style={{ marginTop: 18, padding: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 7, borderLeftWidth: 3, borderLeftColor: GOLD, borderLeftStyle: 'solid' }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>
            Macins Luxe Properties LLC
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.50)', fontSize: 8.5, lineHeight: 1.75 }}>
            {contact.block}
          </Text>
        </View>
      </View>

      <View style={{ position: 'absolute', bottom: 0, left: 0, width: PW, height: 3, backgroundColor: GOLD }} />
      <PageFtr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT DOCUMENT
// ══════════════════════════════════════════════════════════════════════════════
export default function PropertyPDF({ listing, agent, logoSrc, companyInfo }: Props) {
  const floorPDF   = (listing.floor_plans ?? []).filter(isPdfImg)
  const allGallery = (listing.images ?? []).slice(1).filter(isPdfImg)

  // Split gallery into groups of 4 (one page each)
  const galGroups: string[][] = []
  for (let i = 0; i < allGallery.length; i += 4) {
    galGroups.push(allGallery.slice(i, i + 4))
  }
  const showGallery = allGallery.length >= 2

  const total = totalPages(listing, agent)
  let pg = 1

  return (
    <Document title={`${listing.name} — Macins Luxe`} author="Macins Luxe Properties LLC">

      <Cover
        listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
        total={total}
      />

      <Overview
        listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
        pg={++pg} total={total}
      />

      {listing.description && (
        <Description
          listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
          pg={++pg} total={total}
        />
      )}

      {showGallery && galGroups.map((imgs, gi) => (
        <GalleryPage
          key={gi}
          listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
          images={imgs}
          section={galGroups.length > 1 ? `Gallery ${gi + 1}` : 'Gallery'}
          pg={++pg} total={total}
        />
      ))}

      {(listing.amenities ?? []).length > 0 && (
        <Amenities
          listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
          pg={++pg} total={total}
        />
      )}

      {listing.payment_plan && (
        <PaymentPlan
          listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
          pg={++pg} total={total}
        />
      )}

      {floorPDF.length > 0 && (
        <FloorPlans
          listing={{ ...listing, floor_plans: floorPDF }} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
          pg={++pg} total={total}
        />
      )}

      {agent && (
        <AgentPage
          listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo}
          pg={++pg} total={total}
        />
      )}

    </Document>
  )
}
