import {
  Document, Page, View, Text, Image as PDFImage,
  StyleSheet,
} from '@react-pdf/renderer'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'
import type { AgentRecord } from '@/components/staff/AgentForm'

// react-pdf built-in fonts — use fontFamily directly, never Font.register for built-ins
// 'Helvetica'      = regular
// 'Helvetica-Bold' = bold (fontWeight: 700 does NOT work with built-ins)

const NAVY   = '#152140'
const NAVY2  = '#1B3079'
const GOLD   = '#D5BA8C'
const WHITE  = '#FFFFFF'
const LIGHT  = '#F4F5F7'
const MUTED  = '#8A93A2'
const BODY   = '#374151'
const BORDER = '#E5E7EB'

const PW    = 841.89   // A4 landscape width  (pt)
const PH    = 595.28   // A4 landscape height (pt)
const HDR   = 44       // header height
const FTR   = 28       // footer height
const BH    = PH - HDR - FTR  // 523.28 — body height

const st = StyleSheet.create({
  pageLight: { fontFamily: 'Helvetica', backgroundColor: WHITE },
  pageDark:  { fontFamily: 'Helvetica', backgroundColor: NAVY },

  hdr: {
    position: 'absolute', top: 0, left: 0, width: PW, height: HDR,
    backgroundColor: NAVY,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  hdrLogoImg: { height: 20, width: 90, objectFit: 'contain' },
  hdrLogoTxt: { fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 11, letterSpacing: 1 },
  hdrName:    { color: 'rgba(255,255,255,0.50)', fontSize: 8 },

  ftr: {
    position: 'absolute', bottom: 0, left: 0, width: PW, height: FTR,
    backgroundColor: LIGHT,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 36,
    borderTopWidth: 1, borderTopColor: BORDER, borderTopStyle: 'solid',
  },
  ftrTxt:  { fontSize: 6.5, color: MUTED },
  ftrPage: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: GOLD },

  label:   { fontFamily: 'Helvetica-Bold', fontSize: 7, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  bodyTxt: { fontSize: 9, color: BODY, lineHeight: 1.7 },

  statRow:    { flexDirection: 'row', marginBottom: 22 },
  statBox:    { flex: 1, backgroundColor: NAVY, borderRadius: 6, paddingVertical: 10, paddingHorizontal: 10, alignItems: 'center', marginRight: 6 },
  statLabel:  { fontSize: 6, color: 'rgba(255,255,255,0.50)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  statVal:    { fontFamily: 'Helvetica-Bold', fontSize: 10, color: WHITE, textAlign: 'center' },
  statGold:   { fontFamily: 'Helvetica-Bold', fontSize: 10, color: GOLD,  textAlign: 'center' },

  hlRow:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 7 },
  hlBullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD, marginTop: 3.5, marginRight: 8, flexShrink: 0 },
  hlText:   { fontSize: 8.5, color: BODY, lineHeight: 1.55, flex: 1 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    fontFamily: 'Helvetica-Bold',
    backgroundColor: LIGHT, borderRadius: 4,
    paddingHorizontal: 9, paddingVertical: 5,
    fontSize: 8, color: NAVY2,
    borderWidth: 1, borderColor: BORDER, borderStyle: 'solid',
    marginRight: 6, marginBottom: 6,
  },
})

// ── Shared widgets ────────────────────────────────────────────────────────────

function Hdr({ name, logo }: { name: string; logo?: string }) {
  return (
    <View style={st.hdr}>
      {logo
        ? <PDFImage src={logo} style={st.hdrLogoImg} />
        : <Text style={st.hdrLogoTxt}>MACINS LUXE</Text>}
      <Text style={st.hdrName}>{name.toUpperCase()}</Text>
    </View>
  )
}

function mkContact(ci?: CompanyContact) {
  const e = ci?.email   ?? 'info@macinsluxe.com'
  const p = ci?.phone   ?? '+971 4 454 2588'
  const w = ci?.website ?? 'www.macinsluxe.com'
  return { line: `${e}  ·  ${p}  ·  ${w}`, block: `${e}\n${p}\n${w}` }
}

function Ftr({ pg, total, contact }: { pg: number; total: number; contact?: string }) {
  return (
    <View style={st.ftr}>
      <Text style={st.ftrTxt}>Macins Luxe Properties  ·  {contact ?? 'info@macinsluxe.com  ·  +971 4 454 2588  ·  www.macinsluxe.com'}</Text>
      <Text style={st.ftrPage}>{pg} / {total}</Text>
    </View>
  )
}

function GoldBarTop() {
  return <View style={{ position: 'absolute', top: 0, left: 0, width: PW, height: 4, backgroundColor: GOLD }} />
}
function GoldBarBot() {
  return <View style={{ position: 'absolute', bottom: 0, left: 0, width: PW, height: 4, backgroundColor: GOLD }} />
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CompanyContact {
  phone?: string
  email?: string
  website?: string
}

export interface Props {
  listing:     ListingRecord
  agent:       AgentRecord | null
  logoSrc?:    string
  companyInfo?: CompanyContact
}

function totalPages(l: ListingRecord, a: AgentRecord | null) {
  let n = 2
  if ((l.amenities  ?? []).length) n++
  if (l.payment_plan)              n++
  if ((l.floor_plans ?? []).length) n++
  if (a) n++
  return n
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ══════════════════════════════════════════════════════════════════════════════

function Cover({ listing: l, agent: a, logoSrc, companyInfo, total }: Props & { total: number }) {
  const img = (l.images ?? [])[0]
  return (
    <Page size="A4" orientation="landscape" style={st.pageDark}>

      {/* Full-bleed background image */}
      {img && (
        <PDFImage
          src={img}
          style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, objectFit: 'cover' }}
        />
      )}

      {/* Dark scrim */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, backgroundColor: 'rgba(10,18,36,0.62)' }} />

      <GoldBarTop />

      {/* Logo — top left */}
      <View style={{ position: 'absolute', top: 18, left: 36 }}>
        {logoSrc
          ? <PDFImage src={logoSrc} style={{ height: 28, width: 120, objectFit: 'contain' }} />
          : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 14, letterSpacing: 1.5 }}>MACINS LUXE</Text>
        }
      </View>

      {/* Badge — top right */}
      {l.badge && (
        <View style={{ position: 'absolute', top: 18, right: 36, backgroundColor: GOLD, borderRadius: 3, paddingHorizontal: 12, paddingVertical: 5 }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>{l.badge}</Text>
        </View>
      )}

      {/* Main headline — bottom left */}
      <View style={{ position: 'absolute', bottom: 52, left: 40, width: PW * 0.50 }}>
        {l.location && (
          <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(213,186,140,0.80)', fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>
            {l.location}
          </Text>
        )}
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 36, lineHeight: 1.1, marginBottom: 10 }}>
          {l.name}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.60)', fontSize: 11, marginBottom: 14 }}>
          by {l.developer}
        </Text>
        {l.price && (
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 20 }}>
            Starting from {l.price}
          </Text>
        )}
      </View>

      {/* Agent / contact card — bottom right */}
      <View style={{
        position: 'absolute', bottom: 44, right: 36, width: 232,
        backgroundColor: 'rgba(21,33,64,0.90)',
        borderRadius: 8, padding: 18,
        borderWidth: 1, borderColor: 'rgba(213,186,140,0.25)', borderStyle: 'solid',
      }}>
        {a ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              {a.photo_url ? (
                <View style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', marginRight: 12 }}>
                  <PDFImage src={a.photo_url} style={{ width: 48, height: 48, objectFit: 'cover' }} />
                </View>
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: NAVY2, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 20 }}>{a.name.charAt(0)}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10, marginBottom: 2 }}>{a.name}</Text>
                {a.title && <Text style={{ color: GOLD, fontSize: 7.5 }}>{a.title}</Text>}
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(213,186,140,0.20)', marginBottom: 10 }} />
            {a.phone && <Text style={{ color: WHITE, fontSize: 8, marginBottom: 4 }}>{a.phone}</Text>}
            {a.email && <Text style={{ color: WHITE, fontSize: 8 }}>{a.email}</Text>}
          </>
        ) : (
          <>
            {logoSrc
              ? <PDFImage src={logoSrc} style={{ height: 22, width: 100, objectFit: 'contain', marginBottom: 10 }} />
              : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 11, marginBottom: 10 }}>MACINS LUXE</Text>
            }
            <Text style={{ color: 'rgba(255,255,255,0.60)', fontSize: 8.5, lineHeight: 1.65 }}>
              {mkContact(companyInfo).block}
            </Text>
          </>
        )}
      </View>

      <GoldBarBot />
      <Ftr pg={1} total={total} contact={mkContact(companyInfo).line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════

function Overview({ listing: l, logoSrc, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const img    = (l.images ?? [])[0]
  const IMG_W  = PW * 0.40
  const CONT_W = PW - IMG_W

  const stats = [
    l.price      && { label: 'Starting Price', value: l.price,    gold: true  },
    l.beds       && { label: 'Bedrooms',        value: l.beds              },
    l.size_range && { label: 'Size Range',       value: l.size_range        },
    l.badge      && { label: 'Handover',         value: l.badge.replace('Handover: ', '') },
    l.location   && { label: 'Location',         value: l.location          },
  ].filter(Boolean) as { label: string; value: string; gold?: boolean }[]

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <Hdr name={l.name} logo={logoSrc} />

      {/* Left image strip */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: IMG_W, height: BH, overflow: 'hidden' }}>
        {img
          ? <PDFImage src={img} style={{ width: IMG_W, height: BH, objectFit: 'cover' }} />
          : <View style={{ width: IMG_W, height: BH, backgroundColor: NAVY }} />
        }
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: IMG_W, height: 3, backgroundColor: GOLD }} />
      </View>

      {/* Right content */}
      <View style={{ position: 'absolute', top: HDR, left: IMG_W, width: CONT_W, height: BH, paddingHorizontal: 32, paddingTop: 26, paddingBottom: 14 }}>
        <Text style={st.label}>Property Overview</Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 22, color: NAVY, lineHeight: 1.2, marginBottom: 3 }}>{l.name}</Text>
        <Text style={{ fontSize: 9, color: MUTED, marginBottom: 18 }}>by {l.developer}  ·  {l.location}</Text>

        {stats.length > 0 && (
          <View style={st.statRow}>
            {stats.slice(0, 4).map(s => (
              <View key={s.label} style={st.statBox}>
                <Text style={st.statLabel}>{s.label}</Text>
                <Text style={s.gold ? st.statGold : st.statVal}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {l.description ? (
          <>
            <View style={{ height: 1.5, backgroundColor: GOLD, width: 32, marginBottom: 8 }} />
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>About This Property</Text>
            <Text style={[st.bodyTxt, { marginBottom: 14 }]}>{l.description}</Text>
          </>
        ) : null}

        {(l.highlights ?? []).length > 0 ? (
          <>
            <View style={{ height: 1.5, backgroundColor: GOLD, width: 32, marginBottom: 8 }} />
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Key Highlights</Text>
            {(l.highlights ?? []).slice(0, 5).map((h, i) => (
              <View key={i} style={st.hlRow}>
                <View style={st.hlBullet} />
                <Text style={st.hlText}>{h}</Text>
              </View>
            ))}
          </>
        ) : null}
      </View>

      <Ftr pg={pg} total={total} contact={mkContact(companyInfo).line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — AMENITIES
// ══════════════════════════════════════════════════════════════════════════════

function Amenities({ listing: l, logoSrc, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const img    = (l.images ?? [])[1] ?? (l.images ?? [])[0]
  const LEFT_W = PW * 0.55
  const IMG_W  = PW - LEFT_W

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <Hdr name={l.name} logo={logoSrc} />

      {/* Left — amenity chips */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: LEFT_W, height: BH, paddingHorizontal: 36, paddingTop: 26, paddingBottom: 16 }}>
        <Text style={st.label}>World-Class Living</Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 18, color: NAVY, lineHeight: 1.2, marginBottom: 6 }}>
          Amenities &amp; Features
        </Text>
        <View style={{ height: 2, backgroundColor: GOLD, width: 36, marginBottom: 18 }} />
        <View style={st.chipWrap}>
          {(l.amenities ?? []).map((a, i) => (
            <View key={i} style={st.chip}><Text>{a}</Text></View>
          ))}
        </View>
      </View>

      {/* Right — image with caption */}
      <View style={{ position: 'absolute', top: HDR, left: LEFT_W, width: IMG_W, height: BH, overflow: 'hidden' }}>
        {img
          ? <PDFImage src={img} style={{ width: IMG_W, height: BH, objectFit: 'cover' }} />
          : <View style={{ width: IMG_W, height: BH, backgroundColor: NAVY }} />
        }
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: IMG_W, backgroundColor: 'rgba(21,33,64,0.82)', padding: 18 }}>
          {l.price && (
            <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>
              Starting from {l.price}
            </Text>
          )}
          {l.beds && (
            <Text style={{ color: 'rgba(255,255,255,0.70)', fontSize: 8.5 }}>
              {l.beds}  ·  {l.location}
            </Text>
          )}
        </View>
      </View>

      <Ftr pg={pg} total={total} contact={mkContact(companyInfo).line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — PAYMENT PLAN
// ══════════════════════════════════════════════════════════════════════════════

function PaymentPlan({ listing: l, logoSrc, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const lines  = (l.payment_plan ?? '').split('\n').filter(ln => ln.trim())
  const LEFT_W = PW * 0.38
  const SCHED_W = PW - LEFT_W

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <Hdr name={l.name} logo={logoSrc} />

      {/* Left navy panel */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: LEFT_W, height: BH, backgroundColor: NAVY, paddingHorizontal: 36, paddingTop: 32, paddingBottom: 24, justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Investment Details
          </Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 26, lineHeight: 1.2, marginBottom: 18 }}>
            {'Payment\nPlan'}
          </Text>
          <View style={{ height: 2, backgroundColor: GOLD, width: 32, marginBottom: 20 }} />
          {l.price ? (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Starting Price</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 16 }}>{l.price}</Text>
            </View>
          ) : null}
          {l.size_range ? (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Size Range</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10 }}>{l.size_range}</Text>
            </View>
          ) : null}
          {l.badge ? (
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Handover</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10 }}>{l.badge.replace('Handover: ', '')}</Text>
            </View>
          ) : null}
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 6.5 }}>T&amp;C apply. Subject to developer approval.</Text>
      </View>

      {/* Right schedule */}
      <View style={{ position: 'absolute', top: HDR, left: LEFT_W, width: SCHED_W, height: BH, paddingHorizontal: 40, paddingTop: 32, paddingBottom: 24 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 22 }}>
          Payment Schedule
        </Text>
        {lines.map((line, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 13 }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: i === 0 ? GOLD : LIGHT, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, color: i === 0 ? NAVY : MUTED }}>{i + 1}</Text>
            </View>
            <Text style={{ fontSize: 9, color: BODY, lineHeight: 1.55, flex: 1, paddingTop: 4 }}>{line}</Text>
          </View>
        ))}
      </View>

      <Ftr pg={pg} total={total} contact={mkContact(companyInfo).line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 5 — FLOOR PLANS
// ══════════════════════════════════════════════════════════════════════════════

function FloorPlans({ listing: l, logoSrc, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  const plans     = l.floor_plans ?? []
  const SIDEBAR_W = 156
  const GRID_W    = PW - SIDEBAR_W
  const PADDING   = 20
  const cols      = plans.length <= 2 ? 2 : 3
  const gap       = 10
  const imgW      = (GRID_W - PADDING * 2 - gap * (cols - 1)) / cols
  const imgH      = imgW / 1.5  // 3:2 ratio

  return (
    <Page size="A4" orientation="landscape" style={st.pageLight}>
      <Hdr name={l.name} logo={logoSrc} />

      {/* Sidebar */}
      <View style={{ position: 'absolute', top: HDR, left: 0, width: SIDEBAR_W, height: BH, backgroundColor: NAVY, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Unit Layouts</Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 22, lineHeight: 1.25, marginBottom: 16 }}>{'Floor\nPlans'}</Text>
        <View style={{ height: 2, backgroundColor: GOLD, width: 28, marginBottom: 20 }} />
        {l.beds ? <Text style={{ color: 'rgba(255,255,255,0.60)', fontSize: 8.5, lineHeight: 1.6 }}>{l.beds}</Text> : null}
      </View>

      {/* Image grid */}
      <View style={{ position: 'absolute', top: HDR, left: SIDEBAR_W, width: GRID_W, height: BH, padding: PADDING, backgroundColor: LIGHT }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {plans.map((src, i) => (
            <View key={i} style={{ width: imgW, height: imgH, backgroundColor: WHITE, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, borderStyle: 'solid', marginRight: (i + 1) % cols !== 0 ? gap : 0, marginBottom: gap }}>
              <PDFImage src={src} style={{ width: imgW, height: imgH, objectFit: 'contain' }} />
            </View>
          ))}
        </View>
      </View>

      <Ftr pg={pg} total={total} contact={mkContact(companyInfo).line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE — AGENT CONTACT
// ══════════════════════════════════════════════════════════════════════════════

function AgentPage({ listing: l, agent: a, logoSrc, companyInfo, pg, total }: Props & { pg: number; total: number }) {
  if (!a) return null

  const LEFT_W  = PW * 0.37
  const RIGHT_W = PW - LEFT_W
  const CONTENT_TOP = 62

  return (
    <Page size="A4" orientation="landscape" style={st.pageDark}>
      <GoldBarTop />

      {/* Logo */}
      <View style={{ position: 'absolute', top: 18, left: 36 }}>
        {logoSrc
          ? <PDFImage src={logoSrc} style={{ height: 26, width: 114, objectFit: 'contain' }} />
          : <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 13, letterSpacing: 1.5 }}>MACINS LUXE</Text>
        }
      </View>

      {/* Left — photo + name */}
      <View style={{ position: 'absolute', top: CONTENT_TOP, left: 0, width: LEFT_W, height: PH - CONTENT_TOP - FTR, paddingHorizontal: 44, paddingTop: 24, alignItems: 'center' }}>
        {a.photo_url ? (
          <View style={{ width: 150, height: 150, borderRadius: 75, overflow: 'hidden', borderWidth: 3, borderColor: GOLD, borderStyle: 'solid', marginBottom: 18 }}>
            <PDFImage src={a.photo_url} style={{ width: 150, height: 150, objectFit: 'cover' }} />
          </View>
        ) : (
          <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: NAVY2, borderWidth: 3, borderColor: GOLD, borderStyle: 'solid', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 60 }}>{a.name.charAt(0)}</Text>
          </View>
        )}
        <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 19, textAlign: 'center', marginBottom: 6 }}>{a.name}</Text>
        {a.title ? <Text style={{ color: GOLD, fontSize: 9, textAlign: 'center', marginBottom: 16 }}>{a.title}</Text> : null}
        <View style={{ height: 1, backgroundColor: 'rgba(213,186,140,0.25)', width: 80, marginBottom: 14 }} />
        <Text style={{ color: 'rgba(255,255,255,0.38)', fontSize: 7.5, textAlign: 'center', lineHeight: 1.6 }}>
          {'Macins Luxe Properties\nDubai, UAE'}
        </Text>
      </View>

      {/* Divider */}
      <View style={{ position: 'absolute', top: CONTENT_TOP + 16, left: LEFT_W, width: 1, height: PH - CONTENT_TOP - FTR - 32, backgroundColor: 'rgba(213,186,140,0.18)' }} />

      {/* Right — contact + bio */}
      <View style={{ position: 'absolute', top: CONTENT_TOP, left: LEFT_W + 1, width: RIGHT_W - 1, height: PH - CONTENT_TOP - FTR, paddingHorizontal: 40, paddingTop: 24 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
          Your Property Expert
        </Text>

        {([
          { label: 'Phone',    value: a.phone },
          { label: 'WhatsApp', value: a.whatsapp },
          { label: 'Email',    value: a.email },
        ] as { label: string; value: string | null | undefined }[])
          .filter(c => c.value)
          .map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)', borderBottomStyle: 'solid' }}>
              <Text style={{ color: MUTED, fontSize: 8, width: 58 }}>{c.label}</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10, flex: 1 }}>{c.value}</Text>
            </View>
          ))
        }

        {a.bio ? (
          <View style={{ marginTop: 18 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.42)', fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>About</Text>
            <Text style={{ color: 'rgba(255,255,255,0.60)', fontSize: 8.5, lineHeight: 1.7 }}>{a.bio}</Text>
          </View>
        ) : null}

        <View style={{ marginTop: 22, padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: GOLD, borderLeftStyle: 'solid' }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', color: GOLD, fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Macins Luxe Properties
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 8.5, lineHeight: 1.7 }}>
            {'info@macinsluxe.com\n+971 4 454 2588\nwww.macinsluxe.com'}
          </Text>
        </View>
      </View>

      <GoldBarBot />
      <Ftr pg={pg} total={total} contact={mkContact(companyInfo).line} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT DOCUMENT
// ══════════════════════════════════════════════════════════════════════════════

export default function PropertyPDF({ listing, agent, logoSrc, companyInfo }: Props) {
  const contactEmail   = companyInfo?.email   ?? 'info@macinsluxe.com'
  const contactPhone   = companyInfo?.phone   ?? '+971 4 454 2588'
  const contactWebsite = companyInfo?.website ?? 'www.macinsluxe.com'
  const contactLine    = `${contactEmail}  ·  ${contactPhone}  ·  ${contactWebsite}`
  const contactBlock   = `${contactEmail}\n${contactPhone}\n${contactWebsite}`
  const total    = totalPages(listing, agent)
  const floorPDF = (listing.floor_plans ?? []).filter(u => /\.(jpe?g|png|gif)(\?|$)/i.test(u))
  let pg = 1

  return (
    <Document title={`${listing.name} — Macins Luxe`} author="Macins Luxe Properties">
      <Cover    listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} total={total} />
      <Overview listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />

      {(listing.amenities ?? []).length > 0 ? (
        <Amenities listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      ) : null}

      {listing.payment_plan ? (
        <PaymentPlan listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      ) : null}

      {floorPDF.length > 0 ? (
        <FloorPlans listing={{ ...listing, floor_plans: floorPDF }} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      ) : null}

      {agent ? (
        <AgentPage listing={listing} agent={agent} logoSrc={logoSrc} companyInfo={companyInfo} pg={++pg} total={total} />
      ) : null}
    </Document>
  )
}
