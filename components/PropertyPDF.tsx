import {
  Document, Page, View, Text, Image as PDFImage,
  StyleSheet,
} from '@react-pdf/renderer'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'
import type { AgentRecord } from '@/components/staff/AgentForm'

// react-pdf built-in fonts only — fontWeight:700 does NOT work, use 'Helvetica-Bold'
// Constraints: no gap shorthand, no borderRadius on Image (wrap View), no aspectRatio,
//              no wrap={false} on Page, no computed style keys

const NAVY   = '#152140'
const NAVY2  = '#1B3079'
const GOLD   = '#D5BA8C'
const GOLD2  = '#C4A47C'
const WHITE  = '#FFFFFF'
const LIGHT  = '#F4F5F7'
const MUTED  = '#8A93A2'
const BODY   = '#374151'
const BORDER = '#E5E7EB'

const PW  = 841.89   // A4 landscape width  (pt)
const PH  = 595.28   // A4 landscape height (pt)
const HDR = 40       // section header height
const FTR = 26       // footer height
const BH  = PH - HDR - FTR  // 529.28 — usable body height

// ── Shared styles ─────────────────────────────────────────────────────────────

const st = StyleSheet.create({
  pageLight: { fontFamily: 'Helvetica', backgroundColor: WHITE },
  pageDark:  { fontFamily: 'Helvetica', backgroundColor: NAVY },

  // Section header — every interior page
  sHdr: {
    position: 'absolute', top: 0, left: 0, width: PW, height: HDR,
    backgroundColor: NAVY,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  sHdrLeft:  { flexDirection: 'row', alignItems: 'center' },
  sHdrProp:  { fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 8, letterSpacing: 0.6 },
  sHdrDot:   { color: GOLD, fontSize: 8, marginHorizontal: 7 },
  sHdrSect:  { color: 'rgba(213,186,140,0.75)', fontSize: 7.5, letterSpacing: 0.4 },
  sHdrRight: { fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.30)', fontSize: 6.5, letterSpacing: 1.2, textTransform: 'uppercase' },

  // Footer
  ftr: {
    position: 'absolute', bottom: 0, left: 0, width: PW, height: FTR,
    backgroundColor: LIGHT,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 32,
    borderTopWidth: 1, borderTopColor: BORDER, borderTopStyle: 'solid',
  },
  ftrTxt:  { fontSize: 6, color: MUTED },
  ftrPage: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: GOLD },

  // Labels
  label: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: GOLD, letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 6 },
  bodyTxt: { fontSize: 9, color: BODY, lineHeight: 1.75 },

  // Stats row on Overview
  statBox:   { flex: 1, backgroundColor: NAVY, borderRadius: 5, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', marginRight: 6 },
  statLabel: { fontSize: 6, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  statVal:   { fontFamily: 'Helvetica-Bold', fontSize: 10, color: WHITE, textAlign: 'center' },
  statGold:  { fontFamily: 'Helvetica-Bold', fontSize: 10, color: GOLD,  textAlign: 'center' },

  // Highlights
  hlRow:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 7 },
  hlBullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD, marginTop: 3.5, marginRight: 8, flexShrink: 0 },
  hlText:   { fontSize: 8.5, color: BODY, lineHeight: 1.55, flex: 1 },
})

// ── Shared widgets ────────────────────────────────────────────────────────────

function SectionHdr({ name, section }: { name: string; section: string }) {
  return (
    <View style={st.sHdr}>
      <View style={st.sHdrLeft}>
        <Text style={st.sHdrProp}>{name.toUpperCase()}</Text>
        <Text style={st.sHdrDot}>·</Text>
        <Text style={st.sHdrSect}>{section}</Text>
      </View>
      <Text style={st.sHdrRight}>Macins Luxe Properties LLC</Text>
    </View>
  )
}

function Ftr({ pg, total, contact }: { pg: number; total: number; contact: string }) {
  return (
    <View style={st.ftr}>
      <Text style={st.ftrTxt}>{contact}</Text>
      <Text style={st.ftrPage}>{pg} / {total}</Text>
    </View>
  )
}

function GoldBarTop() {
  return <View style={{ position: 'absolute', top: 0, left: 0, width: PW, height: 3, backgroundColor: GOLD }} />
}
function GoldBarBot() {
  return <View style={{ position: 'absolute', bottom: 0, left: 0, width: PW, height: 3, backgroundColor: GOLD }} />
}

function mkContact(ci?: CompanyContact) {
  const e = ci?.email   ?? 'info@macinsluxe.com'
  const p = ci?.phone   ?? '+971 4 454 2588'
  const w = ci?.website ?? 'www.macinsluxe.com'
  return { line: `${e}  ·  ${p}  ·  ${w}`, block: `${e}\n${p}\n${w}` }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CompanyContact {
  phone?: string
  email?: string
  website?: string
  orn?: string
}

export interface Props {
  listing:      ListingRecord
  agent:        AgentRecord | null
  logoSrc?:     string
  companyInfo?: CompanyContact
}

function totalPages(l: ListingRecord, a: AgentRecord | null) {
  const gallery = (l.images ?? []).slice(1)
  let n = 2                                         // cover + overview always
  if (gallery.length >= 2) n++                      // gallery
  if ((l.amenities ?? []).length) n++               // amenities
  if (l.payment_plan) n++                           // payment plan
  if ((l.floor_plans ?? []).filter(isPdfImg).length) n++ // floor plans
  if (a) n++                                        // agent
  return n
}

function isPdfImg(url: string) {
  return /\.(jpe?g|png|gif)(\?|$)/i.test(url)
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER  (full-bleed cinematic)
// ══════════════════════════════════════════════════════════════════════════════

function Cover({ listing: l, agent: a, logoSrc, companyInfo, total }: Props & { total: number }) {
  const img     = (l.images ?? [])[0]
  const contact = mkContact(companyInfo)

  return (
    <Page size="A4" orientation="landscape" style={st.pageDark}>

      {/* Full-bleed hero image */}
      {img && (
        <PDFImage src={img} style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, objectFit: 'cover' }} />
      )}

      {/* Cinematic gradient scrim — stronger at bottom */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, backgroundColor: 'rgba(8,15,30,0.58)' }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: PW, height: PH * 0.55, backgroundColor: 'rgba(8,15,30,0.45)' }} />

      <GoldBarTop />

      {/* Logo — top left */}
      <View style={{ position: 'absolute', top: 20, left: 36 }}>
        {logoSrc
          ? <PDFImage src={logoSrc} style={{ height: 30, width: 130, objectFit: 'contain' }} />
          : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 14, letterSpacing: 2 }}>MACINS LUXE</Text>
        }
      </View>

      {/* Badge — top right */}
      {l.badge && (
        <View style={{ position: 'absolute', top: 20, right: 36, backgroundColor: GOLD, borderRadius: 3, paddingHorizontal: 14, paddingVertical: 6 }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 7, letterSpacing: 1.8, textTransform: 'uppercase' }}>{l.badge}</Text>
        </View>
      )}

      {/* Main headline — bottom left */}
      <View style={{ position: 'absolute', bottom: 56, left: 44, width: PW * 0.52 }}>
        {l.location && (
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
            {l.location}
          </Text>
        )}
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 40, lineHeight: 1.08, marginBottom: 10 }}>
          {l.name}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11.5, marginBottom: 16 }}>
          A {l.developer} Development
        </Text>
        {l.price && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 24, height: 2, backgroundColor: GOLD, marginRight: 10 }} />
            <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 18 }}>
              Starting from {l.price}
            </Text>
          </View>
        )}
      </View>

      {/* Agent / company card — bottom right */}
      <View style={{
        position: 'absolute', bottom: 48, right: 36, width: 224,
        backgroundColor: 'rgba(15,25,52,0.92)',
        borderRadius: 8, padding: 18,
        borderWidth: 1, borderColor: 'rgba(213,186,140,0.22)', borderStyle: 'solid',
        borderTopWidth: 2, borderTopColor: GOLD, borderTopStyle: 'solid',
      }}>
        {a ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              {a.photo_url ? (
                <View style={{ width: 46, height: 46, borderRadius: 23, overflow: 'hidden', marginRight: 12 }}>
                  <PDFImage src={a.photo_url} style={{ width: 46, height: 46, objectFit: 'cover' }} />
                </View>
              ) : (
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: NAVY2, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 20 }}>{a.name.charAt(0)}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10, marginBottom: 2 }}>{a.name}</Text>
                {a.title && <Text style={{ color: GOLD, fontSize: 7.5 }}>{a.title}</Text>}
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(213,186,140,0.18)', marginBottom: 10 }} />
            {a.phone && <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 8, marginBottom: 3 }}>{a.phone}</Text>}
            {a.email && <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 8 }}>{a.email}</Text>}
          </>
        ) : (
          <>
            {logoSrc
              ? <PDFImage src={logoSrc} style={{ height: 22, width: 100, objectFit: 'contain', marginBottom: 10 }} />
              : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 10, marginBottom: 10, letterSpacing: 1 }}>MACINS LUXE</Text>
            }
            <Text style={{ color: 'rgba(255,255,255,0.60)', fontSize: 8.5, lineHeight: 1.65 }}>
              {contact.block}
            </Text>
          </>
        )}
      </View>

      <GoldBarBot />

      {/* Page number on cover */}
      <View style={{ position: 'absolute', bottom: 7, right: 32 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: 'rgba(213,186,140,0.55)' }}>1 / {total}</Text>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════

function Overview({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const img    = (l.images ?? [])[0]
  const IMG_W  = PW * 0.38
  const CONT_W = PW - IMG_W
  const contact = mkContact(companyInfo)

  const stats = [
    l.price      && { label: 'Starting Price', value: l.price,    gold: true },
    l.beds       && { label: 'Bedrooms',        value: l.beds              },
    l.size_range && { label: 'Size Range',      value: l.size_range        },
    l.badge      && { label: 'Handover',        value: l.badge.replace(/handover:\s*/i, '') },
    l.developer  && { label: 'Developer',       value: l.developer         },
  ].filter(Boolean) as { label: string; value: string; gold?: boolean }[]

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <SectionHdr name={l.name} section="Property Overview" />

      {/* Left image strip with gold bottom bar */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: IMG_W, height: BH, overflow: 'hidden' }}>
        {img
          ? <PDFImage src={img} style={{ width: IMG_W, height: BH, objectFit: 'cover' }} />
          : <View style={{ width: IMG_W, height: BH, backgroundColor: NAVY }} />
        }
        {/* Gold accent bar at bottom of image */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: IMG_W, height: 4, backgroundColor: GOLD }} />
      </View>

      {/* Right content panel */}
      <View style={{ position: 'absolute', top: HDR, left: IMG_W, width: CONT_W, height: BH, paddingHorizontal: 34, paddingTop: 28, paddingBottom: 16 }}>

        {/* Gold accent bar + section label */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: 3, height: 20, backgroundColor: GOLD, marginRight: 10 }} />
          <Text style={st.label}>Property Overview</Text>
        </View>

        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 22, color: NAVY, lineHeight: 1.2, marginBottom: 2 }}>{l.name}</Text>
        <Text style={{ fontSize: 9, color: MUTED, marginBottom: 20 }}>by {l.developer}  ·  {l.location}</Text>

        {/* Stats row */}
        {stats.length > 0 && (
          <View style={{ flexDirection: 'row', marginBottom: 22 }}>
            {stats.slice(0, 4).map((s, i) => (
              <View key={i} style={[st.statBox, i === stats.slice(0,4).length - 1 ? { marginRight: 0 } : {}]}>
                <Text style={st.statLabel}>{s.label}</Text>
                <Text style={s.gold ? st.statGold : st.statVal}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Gold divider */}
        <View style={{ height: 1.5, backgroundColor: GOLD, width: 40, marginBottom: 10 }} />

        {l.description ? (
          <>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>
              About This Property
            </Text>
            <Text style={[st.bodyTxt, { marginBottom: 14 }]}>
              {l.description.length > 320 ? l.description.slice(0, 320) + '…' : l.description}
            </Text>
          </>
        ) : null}

        {(l.highlights ?? []).length > 0 ? (
          <>
            <View style={{ height: 1.5, backgroundColor: GOLD, width: 40, marginBottom: 10 }} />
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
              Key Highlights
            </Text>
            {(l.highlights ?? []).slice(0, 5).map((h, i) => (
              <View key={i} style={st.hlRow}>
                <View style={st.hlBullet} />
                <Text style={st.hlText}>{h}</Text>
              </View>
            ))}
          </>
        ) : null}
      </View>

      <Ftr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — IMAGE GALLERY  (new — shows images[1..5] in masonry layout)
// ══════════════════════════════════════════════════════════════════════════════

function Gallery({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const gallery = (l.images ?? []).slice(1, 6)
  const contact = mkContact(companyInfo)

  // Masonry: 1 large left + up to 4 small right (2×2 grid)
  const BIG_W   = Math.round(PW * 0.46)
  const SMALL_W = Math.round((PW - BIG_W - 3) / 2)  // 2 columns on the right
  const HALF_H  = Math.round((BH - 2) / 2)
  const GAP     = 2

  const big    = gallery[0]
  const smalls = gallery.slice(1, 5)  // up to 4

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <SectionHdr name={l.name} section="Image Gallery" />

      {/* Full-bleed image grid — no padding, images flush edge to edge */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: PW, height: BH, backgroundColor: '#0a0f1e' }}>

        {/* Large left image */}
        {big && (
          <View style={{ position: 'absolute', top: 0, left: 0, width: BIG_W, height: BH, overflow: 'hidden' }}>
            <PDFImage src={big} style={{ width: BIG_W, height: BH, objectFit: 'cover' }} />
            {/* Gold accent bottom-left */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, width: 48, height: 3, backgroundColor: GOLD }} />
          </View>
        )}

        {/* Right 2×2 grid */}
        {smalls.length > 0 && (
          <View style={{ position: 'absolute', top: 0, left: BIG_W + GAP, width: PW - BIG_W - GAP, height: BH }}>
            {/* Top row */}
            <View style={{ flexDirection: 'row', height: HALF_H }}>
              {smalls[0] && (
                <View style={{ width: SMALL_W, height: HALF_H, overflow: 'hidden' }}>
                  <PDFImage src={smalls[0]} style={{ width: SMALL_W, height: HALF_H, objectFit: 'cover' }} />
                </View>
              )}
              {smalls[1] && (
                <View style={{ width: SMALL_W, height: HALF_H, overflow: 'hidden', marginLeft: GAP }}>
                  <PDFImage src={smalls[1]} style={{ width: SMALL_W, height: HALF_H, objectFit: 'cover' }} />
                </View>
              )}
            </View>
            {/* Bottom row */}
            <View style={{ flexDirection: 'row', height: HALF_H, marginTop: GAP }}>
              {smalls[2] && (
                <View style={{ width: SMALL_W, height: HALF_H, overflow: 'hidden' }}>
                  <PDFImage src={smalls[2]} style={{ width: SMALL_W, height: HALF_H, objectFit: 'cover' }} />
                </View>
              )}
              {smalls[3] && (
                <View style={{ width: SMALL_W, height: HALF_H, overflow: 'hidden', marginLeft: GAP }}>
                  <PDFImage src={smalls[3]} style={{ width: SMALL_W, height: HALF_H, objectFit: 'cover' }} />
                </View>
              )}
              {/* If only 3 small images, fill last cell with navy */}
              {smalls.length === 3 && (
                <View style={{ width: SMALL_W, height: HALF_H, backgroundColor: NAVY2, marginLeft: GAP, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    {l.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Property name overlay on large image — bottom */}
        {big && (
          <View style={{ position: 'absolute', bottom: FTR, left: 0, width: BIG_W, backgroundColor: 'rgba(10,15,30,0.72)', padding: 14 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>
              {l.location}
            </Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 13 }}>{l.name}</Text>
          </View>
        )}
      </View>

      <Ftr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE — AMENITIES  (2-column list with gold bullets)
// ══════════════════════════════════════════════════════════════════════════════

function Amenities({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const img     = (l.images ?? [])[2] ?? (l.images ?? [])[1] ?? (l.images ?? [])[0]
  const LEFT_W  = PW * 0.58
  const IMG_W   = PW - LEFT_W
  const contact = mkContact(companyInfo)
  const amenities = l.amenities ?? []

  // Split amenities into 2 columns
  const col1 = amenities.filter((_, i) => i % 2 === 0)
  const col2 = amenities.filter((_, i) => i % 2 !== 0)

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <SectionHdr name={l.name} section="Amenities & Features" />

      {/* Left — amenity list */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: LEFT_W, height: BH, paddingHorizontal: 36, paddingTop: 28, paddingBottom: 18 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: 3, height: 20, backgroundColor: GOLD, marginRight: 10 }} />
          <Text style={st.label}>World-Class Living</Text>
        </View>

        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 20, color: NAVY, lineHeight: 1.2, marginBottom: 6 }}>
          Amenities &amp; Features
        </Text>
        <View style={{ height: 2, backgroundColor: GOLD, width: 38, marginBottom: 22 }} />

        {/* 2-column amenity list */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 16 }}>
            {col1.map((a, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 11 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: GOLD, marginRight: 9, flexShrink: 0 }} />
                <Text style={{ fontSize: 8.5, color: BODY, flex: 1 }}>{a}</Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {col2.map((a, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 11 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: GOLD, marginRight: 9, flexShrink: 0 }} />
                <Text style={{ fontSize: 8.5, color: BODY, flex: 1 }}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom info row */}
        {(l.price || l.beds) && (
          <View style={{ marginTop: 'auto', borderTopWidth: 1, borderTopColor: BORDER, borderTopStyle: 'solid', paddingTop: 14, flexDirection: 'row' }}>
            {l.price && (
              <View style={{ marginRight: 32 }}>
                <Text style={{ fontSize: 6.5, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Starting From</Text>
                <Text style={{ fontFamily: 'Helvetica-Bold', color: NAVY2, fontSize: 11 }}>{l.price}</Text>
              </View>
            )}
            {l.beds && (
              <View>
                <Text style={{ fontSize: 6.5, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Unit Types</Text>
                <Text style={{ fontFamily: 'Helvetica-Bold', color: NAVY2, fontSize: 11 }}>{l.beds}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Right — full-height accent image */}
      <View style={{ position: 'absolute', top: HDR, left: LEFT_W, width: IMG_W, height: BH, overflow: 'hidden' }}>
        {img
          ? <PDFImage src={img} style={{ width: IMG_W, height: BH, objectFit: 'cover' }} />
          : <View style={{ width: IMG_W, height: BH, backgroundColor: NAVY2 }} />
        }
        {/* Gold vertical accent bar on left edge */}
        <View style={{ position: 'absolute', top: 0, left: 0, width: 3, height: BH, backgroundColor: GOLD }} />
      </View>

      <Ftr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE — PAYMENT PLAN  (with percentage bars)
// ══════════════════════════════════════════════════════════════════════════════

function PaymentPlan({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const lines   = (l.payment_plan ?? '').split('\n').filter(ln => ln.trim())
  const LEFT_W  = PW * 0.36
  const SCHED_W = PW - LEFT_W
  const contact = mkContact(companyInfo)

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <SectionHdr name={l.name} section="Payment Plan" />

      {/* Left navy panel */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: LEFT_W, height: BH, backgroundColor: NAVY, paddingHorizontal: 32, paddingTop: 30, paddingBottom: 22, justifyContent: 'space-between' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ width: 3, height: 18, backgroundColor: GOLD, marginRight: 10 }} />
            <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 2, textTransform: 'uppercase' }}>
              Investment Details
            </Text>
          </View>

          <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 28, lineHeight: 1.18, marginBottom: 16 }}>
            {'Payment\nPlan'}
          </Text>
          <View style={{ height: 2, backgroundColor: GOLD, width: 32, marginBottom: 22 }} />

          {l.price && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Starting Price</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 17 }}>{l.price}</Text>
            </View>
          )}
          {l.size_range && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Size Range</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10 }}>{l.size_range}</Text>
            </View>
          )}
          {l.beds && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Unit Types</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10 }}>{l.beds}</Text>
            </View>
          )}
          {l.badge && (
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Handover</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10 }}>{l.badge.replace(/handover:\s*/i, '')}</Text>
            </View>
          )}
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.22)', fontSize: 6.5, lineHeight: 1.55 }}>
          {'T&C apply.\nSubject to developer approval.\nPrices subject to change.'}
        </Text>
      </View>

      {/* Right — payment schedule */}
      <View style={{ position: 'absolute', top: HDR, left: LEFT_W, width: SCHED_W, height: BH, paddingHorizontal: 38, paddingTop: 28, paddingBottom: 22 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>
          Payment Schedule
        </Text>

        {lines.map((line, i) => {
          const pctMatch = line.match(/(\d+)\s*%/)
          const pct      = pctMatch ? parseInt(pctMatch[1]) : 0
          const isFirst  = i === 0

          return (
            <View key={i} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: pct > 0 ? 5 : 0 }}>
                {/* Numbered circle */}
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
                {/* Percentage badge */}
                {pct > 0 && (
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: isFirst ? GOLD2 : NAVY2, marginLeft: 8, paddingTop: 2 }}>
                    {pct}%
                  </Text>
                )}
              </View>

              {/* Progress bar */}
              {pct > 0 && (
                <View style={{ marginLeft: 34, height: 3, backgroundColor: BORDER, borderRadius: 2 }}>
                  <View style={{ width: `${Math.min(pct, 100)}%`, height: 3, backgroundColor: isFirst ? GOLD : NAVY2, borderRadius: 2 }} />
                </View>
              )}
            </View>
          )
        })}
      </View>

      <Ftr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE — FLOOR PLANS
// ══════════════════════════════════════════════════════════════════════════════

function FloorPlans({ listing: l, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const plans     = (l.floor_plans ?? []).filter(isPdfImg)
  const SIDEBAR_W = 148
  const GRID_W    = PW - SIDEBAR_W
  const PADDING   = 18
  const cols      = plans.length <= 2 ? 2 : 3
  const gap       = 10
  const imgW      = (GRID_W - PADDING * 2 - gap * (cols - 1)) / cols
  const imgH      = imgW * 0.72
  const contact   = mkContact(companyInfo)

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <SectionHdr name={l.name} section="Floor Plans" />

      {/* Sidebar */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: SIDEBAR_W, height: BH, backgroundColor: NAVY, paddingHorizontal: 22, paddingTop: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <View style={{ width: 3, height: 16, backgroundColor: GOLD, marginRight: 8 }} />
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 6.5, letterSpacing: 1.8, textTransform: 'uppercase' }}>Unit Layouts</Text>
        </View>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 22, lineHeight: 1.25, marginBottom: 14 }}>{'Floor\nPlans'}</Text>
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
      <View style={{ position: 'absolute', top: HDR, left: SIDEBAR_W, width: GRID_W, height: BH, padding: PADDING, backgroundColor: LIGHT }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {plans.map((src, i) => (
            <View key={i} style={{
              width: imgW, height: imgH,
              backgroundColor: WHITE, borderRadius: 8, overflow: 'hidden',
              borderWidth: 1, borderColor: BORDER, borderStyle: 'solid',
              marginRight: (i + 1) % cols !== 0 ? gap : 0,
              marginBottom: gap,
            }}>
              <PDFImage src={src} style={{ width: imgW, height: imgH, objectFit: 'contain' }} />
            </View>
          ))}
        </View>
      </View>

      <Ftr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE — AGENT CONTACT
// ══════════════════════════════════════════════════════════════════════════════

function AgentPage({ listing: l, agent: a, logoSrc, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  if (!a) return null

  const LEFT_W   = PW * 0.36
  const RIGHT_W  = PW - LEFT_W
  const TOP      = 58
  const contact  = mkContact(companyInfo)

  return (
    <Page size="A4" orientation="landscape" style={st.pageDark}>
      <GoldBarTop />

      {/* Logo top-left */}
      <View style={{ position: 'absolute', top: 16, left: 36 }}>
        {logoSrc
          ? <PDFImage src={logoSrc} style={{ height: 26, width: 114, objectFit: 'contain' }} />
          : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 13, letterSpacing: 1.5 }}>MACINS LUXE</Text>
        }
      </View>

      {/* Top-right label */}
      <View style={{ position: 'absolute', top: 20, right: 36 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(213,186,140,0.55)', fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Your Property Expert
        </Text>
      </View>

      {/* Left — photo + name block */}
      <View style={{ position: 'absolute', top: TOP, left: 0, width: LEFT_W, height: PH - TOP - FTR, paddingHorizontal: 40, paddingTop: 20, alignItems: 'center' }}>
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

      {/* Vertical divider */}
      <View style={{ position: 'absolute', top: TOP + 12, left: LEFT_W, width: 1, height: PH - TOP - FTR - 24, backgroundColor: 'rgba(213,186,140,0.14)' }} />

      {/* Right — contact + bio + company */}
      <View style={{ position: 'absolute', top: TOP, left: LEFT_W + 1, width: RIGHT_W - 1, height: PH - TOP - FTR, paddingHorizontal: 38, paddingTop: 22 }}>

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
          ))
        }

        {a.bio ? (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.38)', fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>About</Text>
            <Text style={{ color: 'rgba(255,255,255,0.58)', fontSize: 8.5, lineHeight: 1.7 }}>
              {a.bio.length > 280 ? a.bio.slice(0, 280) + '…' : a.bio}
            </Text>
          </View>
        ) : null}

        {/* Company info box */}
        <View style={{ marginTop: 18, padding: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 7, borderLeftWidth: 3, borderLeftColor: GOLD, borderLeftStyle: 'solid' }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>
            Macins Luxe Properties LLC
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.50)', fontSize: 8.5, lineHeight: 1.75 }}>
            {contact.block}
          </Text>
        </View>
      </View>

      <GoldBarBot />
      <Ftr pg={pg} total={total} contact={contact.line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT DOCUMENT
// ══════════════════════════════════════════════════════════════════════════════

export default function PropertyPDF({ listing, agent, logoSrc, companyInfo }: Props) {
  const floorPDF = (listing.floor_plans ?? []).filter(isPdfImg)
  const gallery  = (listing.images ?? []).slice(1)
  const total    = totalPages(listing, agent)
  let pg = 1

  return (
    <Document title={`${listing.name} — Macins Luxe`} author="Macins Luxe Properties LLC">

      <Cover listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} total={total} />

      <Overview listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />

      {gallery.length >= 2 && (
        <Gallery listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      )}

      {(listing.amenities ?? []).length > 0 && (
        <Amenities listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      )}

      {listing.payment_plan && (
        <PaymentPlan listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      )}

      {floorPDF.length > 0 && (
        <FloorPlans listing={{ ...listing, floor_plans: floorPDF }} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      )}

      {agent && (
        <AgentPage listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      )}

    </Document>
  )
}
