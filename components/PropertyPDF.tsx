import {
  Document, Page, View, Text, Image as PDFImage,
} from '@react-pdf/renderer'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'
import type { AgentRecord } from '@/components/staff/AgentForm'

// ── Colors (handoff spec — no gold) ──────────────────────────────────────────
const NAVY     = '#1a1f2e'
const RED      = '#c0392b'
const GRAY     = '#f4f4f4'
const GRAY2    = '#e8e8e8'
const MUTED    = '#8a8f9e'
const WHITE    = '#ffffff'
const TEXT2    = '#444b5a'
const MAP_BG   = '#dde4ee'
const PHOTO_PH = '#c8cdd8'

// ── Dimensions — A4 Portrait ──────────────────────────────────────────────────
const PW      = 595.28
const PH      = 841.89
const CRUMB_H = 36
const BODY_H  = PH - CRUMB_H  // 805.89
const HALF_W  = PW / 2        // 297.64
const GRID_H  = BODY_H / 2    // 402.94
const SL_W    = PW * 5 / 12   // 248.03
const SR_W    = PW * 7 / 12   // 347.25
const AMN_W   = SR_W / 2      // 173.62
const AMN_H   = BODY_H / 2    // 402.94
const PAD     = 27
const PAD_L   = 30

// ── Exported types ────────────────────────────────────────────────────────────
export interface CompanyContact {
  phone?: string; email?: string; website?: string; orn?: string
}
export interface Props {
  listing: ListingRecord
  agent: AgentRecord | null
  logoSrc?: string
  companyInfo?: CompanyContact
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isPdfImg(url: string) {
  return /\.(jpe?g|png|gif)(\?|$)/i.test(url)
}

function mkContact(ci?: CompanyContact) {
  const e = ci?.email   ?? 'info@macinsluxe.com'
  const p = ci?.phone   ?? '+971 4 454 2588'
  const w = ci?.website ?? 'www.macinsluxe.com'
  return { line: `${e}  ·  ${p}  ·  ${w}`, block: `${e}\n${p}\n${w}` }
}

function splitDesc(desc?: string | null): [string, string, string] {
  const raw = (desc ?? '').trim()
  const parts = raw.split(/\n+/).filter(Boolean)
  if (parts.length >= 3) return [parts[0], parts[1], parts.slice(2).join('\n\n')]
  if (parts.length === 2) return [parts[0], parts[1], '']
  if (parts.length === 1) {
    const t = parts[0]
    const mid = Math.floor(t.length / 2)
    const bp = t.lastIndexOf(' ', mid + 80)
    const sp = bp > mid - 50 ? bp : mid
    return [t.slice(0, sp), t.slice(sp).trim(), '']
  }
  return ['', '', '']
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function Crumb({ name, section }: { name: string; section: string }) {
  return (
    <View style={{
      height: CRUMB_H, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: PAD_L,
      borderBottomWidth: 0.75, borderBottomColor: GRAY2, borderBottomStyle: 'solid',
    }}>
      <Text style={{
        fontFamily: 'Helvetica-Bold', fontSize: 7.5,
        letterSpacing: 1.6, textTransform: 'uppercase', color: NAVY,
      }}>
        {name} / {section}
      </Text>
    </View>
  )
}

// ── Mini-helpers ──────────────────────────────────────────────────────────────
function ImgCol({ src, w, h }: { src?: string; w: number; h: number }) {
  return src
    ? <PDFImage src={src} style={{ width: w, height: h, objectFit: 'cover' }} />
    : (
      <View style={{ width: w, height: h, backgroundColor: GRAY, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 8, color: MUTED }}>Photo</Text>
      </View>
    )
}

function MetaItem({ label, value, notLast }: { label: string; value: string; notLast?: boolean }) {
  return (
    <View style={{
      paddingRight: notLast ? 18 : 0, marginRight: notLast ? 18 : 0,
      borderRightWidth: notLast ? 0.75 : 0,
      borderRightColor: 'rgba(255,255,255,0.2)', borderRightStyle: 'solid',
    }}>
      <Text style={{
        fontSize: 7.5, letterSpacing: 1.05, textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.55)', marginBottom: 3,
      }}>{label}</Text>
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10.5, color: WHITE }}>{value}</Text>
    </View>
  )
}

function InfoCell({ label, value, leftBorder }: { label: string; value: string; leftBorder?: boolean }) {
  return (
    <View style={{
      flex: 1, paddingTop: 12, paddingBottom: 12,
      paddingLeft: leftBorder ? 15 : 0, paddingRight: leftBorder ? 0 : 15,
      borderBottomWidth: 0.75, borderBottomColor: GRAY2, borderBottomStyle: 'solid',
      borderLeftWidth: leftBorder ? 0.75 : 0,
      borderLeftColor: GRAY2, borderLeftStyle: 'solid',
    }}>
      <Text style={{
        fontSize: 7.5, color: MUTED, textTransform: 'uppercase',
        letterSpacing: 0.6, marginBottom: 5,
      }}>{label}</Text>
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12, color: NAVY }}>{value}</Text>
    </View>
  )
}

function PhotoCell({ img }: { img?: string }) {
  return (
    <View style={{ width: HALF_W, height: GRID_H, backgroundColor: PHOTO_PH }}>
      {img && <PDFImage src={img} style={{ width: HALF_W, height: GRID_H, objectFit: 'cover' }} />}
    </View>
  )
}

function PoiRow({ poi }: { poi: string }) {
  const parts = poi.split('|')
  const name  = (parts[0] ?? poi).trim()
  const dist  = parts[1]?.trim() ?? ''
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 9,
      borderBottomWidth: 0.75, borderBottomColor: GRAY2, borderBottomStyle: 'solid',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{
          width: 13, height: 13, borderRadius: 7,
          borderWidth: 1.5, borderColor: MUTED, borderStyle: 'solid',
          alignItems: 'center', justifyContent: 'center', marginRight: 7,
        }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: MUTED }} />
        </View>
        <Text style={{ fontSize: 10, color: TEXT2 }}>{name}</Text>
      </View>
      {dist
        ? <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: NAVY }}>{dist}</Text>
        : null
      }
    </View>
  )
}

function AmenityCell({ img, caption }: { img?: string; caption?: string }) {
  return (
    <View style={{ width: AMN_W, height: AMN_H, backgroundColor: PHOTO_PH }}>
      {img && <PDFImage src={img} style={{ width: AMN_W, height: AMN_H, objectFit: 'cover' }} />}
      {caption && (
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 6, backgroundColor: 'rgba(0,0,0,0.55)',
        }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: WHITE }}>{caption}</Text>
        </View>
      )}
    </View>
  )
}

function PayRow({ line }: { line: string }) {
  const m   = line.match(/(\d+%)/)
  const pct = m ? m[1] : null
  const lbl = pct ? line.replace(pct, '').replace(/[:\-–—]+$/, '').trim() : line
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 7.5,
      borderBottomWidth: 0.75, borderBottomColor: GRAY2, borderBottomStyle: 'solid',
    }}>
      <Text style={{ fontSize: 10, color: TEXT2, flex: 1 }}>{lbl}</Text>
      {pct && <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: NAVY }}>{pct}</Text>}
    </View>
  )
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  const letters: Record<string, string> = { phone: 'P', email: 'E', web: 'W', address: 'A' }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 9 }}>
      <View style={{
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center', marginRight: 10,
      }}>
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: WHITE }}>
          {letters[icon] ?? icon[0].toUpperCase()}
        </Text>
      </View>
      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', flex: 1 }}>{text}</Text>
    </View>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ══════════════════════════════════════════════════════════════════════════════
function Cover({ listing: l, agent: a, logoSrc, companyInfo }: Props) {
  const img0    = (l.images ?? []).filter(isPdfImg)[0]
  const contact = mkContact(companyInfo)

  const metas = [
    l.price ? { label: 'Starting From', value: l.price } : null,
    l.badge ? { label: 'Handover',      value: l.badge } : null,
    l.beds  ? { label: 'Units',         value: l.beds  } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: NAVY }}>
      {img0 && (
        <PDFImage src={img0} style={{
          position: 'absolute', top: 0, left: 0, width: PW, height: PH, objectFit: 'cover',
        }} />
      )}

      {/* Gradient scrims */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, backgroundColor: 'rgba(10,14,26,0.18)' }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: PW, height: PH * 0.65, backgroundColor: 'rgba(10,14,26,0.55)' }} />

      {/* Logo bar */}
      <View style={{
        position: 'absolute', top: 27, left: PAD_L, right: PAD_L,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {logoSrc
          ? <PDFImage src={logoSrc} style={{ height: 33, width: 110, objectFit: 'contain' }} />
          : <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 12, letterSpacing: 2 }}>MACINS LUXE</Text>
        }
        <Text style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>
          Property Brochure
        </Text>
      </View>

      {/* Bottom row */}
      <View style={{
        position: 'absolute', bottom: 33, left: PAD_L, right: PAD_L,
        flexDirection: 'row', alignItems: 'flex-end',
      }}>
        {/* Left: property info */}
        <View style={{ flex: 1, marginRight: 18 }}>
          <Text style={{
            fontSize: 7.5, color: 'rgba(255,255,255,0.6)',
            letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8,
          }}>
            {[l.developer, l.location].filter(Boolean).join(' · ')}
          </Text>
          <View style={{ width: 36, height: 2.25, backgroundColor: RED, marginBottom: 15 }} />
          <Text style={{
            fontFamily: 'Helvetica-Bold', fontSize: 36, color: WHITE,
            lineHeight: 1.1, marginBottom: 14,
          }}>
            {l.name}
          </Text>
          {metas.length > 0 && (
            <View style={{ flexDirection: 'row' }}>
              {metas.map((m, i) => (
                <MetaItem key={i} label={m.label} value={m.value} notLast={i < metas.length - 1} />
              ))}
            </View>
          )}
        </View>

        {/* Right: agent card */}
        <View style={{
          width: 174, backgroundColor: 'rgba(15,20,36,0.55)',
          borderRadius: 9, padding: 15,
          borderWidth: 0.75, borderColor: 'rgba(255,255,255,0.14)', borderStyle: 'solid',
        }}>
          {a ? (
            <>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingBottom: 10, marginBottom: 10,
                borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.13)', borderBottomStyle: 'solid',
              }}>
                {a.photo_url ? (
                  <View style={{ width: 33, height: 33, borderRadius: 16, overflow: 'hidden', marginRight: 9 }}>
                    <PDFImage src={a.photo_url} style={{ width: 33, height: 33, objectFit: 'cover' }} />
                  </View>
                ) : (
                  <View style={{
                    width: 33, height: 33, borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    alignItems: 'center', justifyContent: 'center', marginRight: 9,
                  }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 13, color: WHITE }}>
                      {a.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 7, color: 'rgba(255,255,255,0.45)',
                    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2,
                  }}>Your Agent</Text>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: WHITE, lineHeight: 1.2 }}>
                    {a.name}
                  </Text>
                  {a.title && (
                    <Text style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
                      {a.title}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{ marginBottom: 10 }}>
                {a.phone && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)', width: 9, marginRight: 6 }}>P</Text>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)' }}>{a.phone}</Text>
                  </View>
                )}
                {a.email && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)', width: 9, marginRight: 6 }}>E</Text>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)' }}>{a.email}</Text>
                  </View>
                )}
              </View>

              <View style={{
                flexDirection: 'row', alignItems: 'center',
                borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.13)', borderTopStyle: 'solid',
                paddingTop: 10,
              }}>
                <View style={{
                  width: 20, height: 20, backgroundColor: WHITE, borderRadius: 3,
                  alignItems: 'center', justifyContent: 'center', marginRight: 7,
                }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, color: NAVY }}>M</Text>
                </View>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>
                  Macins Luxe Properties
                </Text>
              </View>
            </>
          ) : (
            <>
              {logoSrc
                ? <PDFImage src={logoSrc} style={{ height: 22, width: 110, objectFit: 'contain', marginBottom: 9 }} />
                : <Text style={{ fontFamily: 'Helvetica-Bold', color: WHITE, fontSize: 10, letterSpacing: 1.5, marginBottom: 9 }}>
                    MACINS LUXE
                  </Text>
              }
              <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                {contact.block}
              </Text>
            </>
          )}
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — ABOUT THE PROJECT
// ══════════════════════════════════════════════════════════════════════════════
function About({ listing: l }: { listing: ListingRecord }) {
  const imgs         = (l.images ?? []).filter(isPdfImg)
  const img1         = imgs[1]
  const [p1, p2]     = splitDesc(l.description)

  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <Crumb name={l.name} section="About the Project" />
      <View style={{ height: BODY_H, flexDirection: 'row' }}>
        {/* Left text col */}
        <View style={{ width: HALF_W, height: BODY_H, padding: PAD, paddingTop: 33 }}>
          <Text style={{
            fontSize: 8, color: MUTED, letterSpacing: 1,
            textTransform: 'uppercase', marginBottom: 8,
          }}>About the Project</Text>

          <Text style={{
            fontFamily: 'Helvetica-Bold', fontSize: 27, color: NAVY,
            lineHeight: 1.1, marginBottom: 21,
          }}>{l.name}</Text>

          {/* Developer row */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            paddingBottom: 18, marginBottom: 18,
            borderBottomWidth: 0.75, borderBottomColor: GRAY2, borderBottomStyle: 'solid',
          }}>
            <View style={{
              width: 39, height: 39,
              borderWidth: 0.75, borderColor: GRAY2, borderStyle: 'solid',
              borderRadius: 5, backgroundColor: GRAY,
              alignItems: 'center', justifyContent: 'center', marginRight: 10,
            }}>
              <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: MUTED }}>DEV</Text>
            </View>
            <View>
              <Text style={{ fontSize: 7.5, color: MUTED, marginBottom: 2 }}>Developer</Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11, color: NAVY }}>
                {l.developer || '—'}
              </Text>
            </View>
          </View>

          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11, color: RED, marginBottom: 8 }}>
            Description
          </Text>
          {p1 && <Text style={{ fontSize: 10, color: TEXT2, lineHeight: 1.75 }}>{p1}</Text>}
          {p2 && <Text style={{ fontSize: 10, color: TEXT2, lineHeight: 1.75, marginTop: 10 }}>{p2}</Text>}
        </View>

        {/* Right image col */}
        <View style={{ width: HALF_W, height: BODY_H, overflow: 'hidden' }}>
          <ImgCol src={img1} w={HALF_W} h={BODY_H} />
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — PROJECT INFO
// ══════════════════════════════════════════════════════════════════════════════
function ProjectInfo({ listing: l }: { listing: ListingRecord }) {
  const imgs      = (l.images ?? []).filter(isPdfImg)
  const img2      = imgs[2]
  const [,, p3]   = splitDesc(l.description)

  const infoRows: [string, string, string, string][] = [
    ['Project Status', l.status === 'published' ? 'Ready' : 'Off-Plan', 'Sale Status', 'Open'],
    ['Size Range',     l.size_range || '—',   'Unit Types',  l.beds || '—'],
    ['Min. Price',     l.price || '—',        'Max. Price',  '—'],
    ['Developer',      l.developer || '—',    'Location',    l.location || '—'],
    ['Handover',       l.badge || '—',        'District',    l.location || '—'],
  ]

  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <Crumb name={l.name} section="Project Info" />
      <View style={{ height: BODY_H, flexDirection: 'row' }}>
        {/* Left: info */}
        <View style={{ width: HALF_W, height: BODY_H, padding: PAD, paddingTop: 21 }}>
          {p3
            ? <Text style={{ fontSize: 10, color: TEXT2, lineHeight: 1.75, marginBottom: 18 }}>{p3}</Text>
            : null
          }
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12, color: NAVY, marginBottom: 12 }}>
            Project Info
          </Text>
          <View style={{ borderTopWidth: 0.75, borderTopColor: GRAY2, borderTopStyle: 'solid' }}>
            {infoRows.map(([l1, v1, l2, v2], i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                <InfoCell label={l1} value={v1} />
                <InfoCell label={l2} value={v2} leftBorder />
              </View>
            ))}
          </View>
        </View>

        {/* Right: image */}
        <View style={{ width: HALF_W, height: BODY_H, overflow: 'hidden' }}>
          <ImgCol src={img2} w={HALF_W} h={BODY_H} />
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGES 4+ — PHOTO GRID (2×2 flush)
// ══════════════════════════════════════════════════════════════════════════════
function PhotoGridPage({ listing: l, images, section }: {
  listing: ListingRecord; images: string[]; section: string
}) {
  const [tl, tr, bl, br] = images
  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: PHOTO_PH }}>
      <Crumb name={l.name} section={section} />
      <View style={{ height: BODY_H }}>
        <View style={{ height: GRID_H, flexDirection: 'row' }}>
          <PhotoCell img={tl} />
          <PhotoCell img={tr} />
        </View>
        <View style={{ height: GRID_H, flexDirection: 'row' }}>
          <PhotoCell img={bl} />
          <PhotoCell img={br} />
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// LOCATION PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LocationPage({ listing: l, highlights }: { listing: ListingRecord; highlights: string[] }) {
  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <Crumb name={l.name} section="Point of Interest" />
      <View style={{ height: BODY_H, flexDirection: 'row' }}>
        {/* Left — gray */}
        <View style={{ width: SL_W, height: BODY_H, backgroundColor: GRAY, padding: PAD, paddingTop: 33 }}>
          <Text style={{
            fontFamily: 'Helvetica-Bold', fontSize: 24, color: NAVY,
            lineHeight: 1.2, marginBottom: 8,
          }}>Location</Text>

          {l.location && (
            <Text style={{ fontSize: 10, color: TEXT2, lineHeight: 1.75, marginBottom: 4 }}>
              {l.location}
            </Text>
          )}

          {highlights.length > 0 && (
            <>
              <Text style={{
                fontFamily: 'Helvetica-Bold', fontSize: 9, color: NAVY,
                marginTop: 18, marginBottom: 3,
              }}>What is nearby</Text>
              {highlights.slice(0, 7).map((poi, i) => (
                <PoiRow key={i} poi={poi} />
              ))}
            </>
          )}
        </View>

        {/* Right — map placeholder */}
        <View style={{
          width: SR_W, height: BODY_H, backgroundColor: MAP_BG,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 10, color: '#8a9ab5' }}>Map</Text>
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// AMENITIES PAGE
// ══════════════════════════════════════════════════════════════════════════════
function AmenitiesPage({ listing: l, amenities, galleryImgs }: {
  listing: ListingRecord; amenities: string[]; galleryImgs: string[]
}) {
  const ai = (i: number) => galleryImgs.length > 0 ? galleryImgs[i % galleryImgs.length] : undefined

  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <Crumb name={l.name} section="Features & Amenities" />
      <View style={{ height: BODY_H, flexDirection: 'row' }}>
        {/* Left — gray heading */}
        <View style={{ width: SL_W, height: BODY_H, backgroundColor: GRAY, padding: PAD, paddingTop: 33 }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 24, color: NAVY, lineHeight: 1.2 }}>
            {'Features &\nAmenities'}
          </Text>
        </View>

        {/* Right — 2×2 photo grid */}
        <View style={{ width: SR_W, height: BODY_H }}>
          <View style={{ flexDirection: 'row', height: AMN_H }}>
            <AmenityCell img={ai(0)} caption={amenities[0]} />
            <AmenityCell img={ai(1)} caption={amenities[1]} />
          </View>
          <View style={{ flexDirection: 'row', height: AMN_H }}>
            <AmenityCell img={ai(2)} caption={amenities[2]} />
            <AmenityCell img={ai(3)} caption={amenities[3]} />
          </View>
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT PLAN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function PaymentPlanPage({ listing: l }: { listing: ListingRecord }) {
  const lines      = (l.payment_plan ?? '').split(/\n/).map(s => s.trim()).filter(Boolean)
  const planName   = lines[0] || 'Payment Plan'
  const payRows    = lines.slice(1)

  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <Crumb name={l.name} section="Payment Plan" />
      <View style={{ height: BODY_H, flexDirection: 'row' }}>
        {/* Left — gray */}
        <View style={{ width: SL_W, height: BODY_H, backgroundColor: GRAY, padding: 24, paddingTop: 27 }}>
          <Text style={{
            fontSize: 7.5, color: MUTED, textTransform: 'uppercase',
            letterSpacing: 0.75, marginBottom: 6,
          }}>Payment Plan Option</Text>
          <Text style={{
            fontFamily: 'Helvetica-Bold', fontSize: 18, color: NAVY, lineHeight: 1.2,
          }}>{planName}</Text>
          {/* Push "All options" to bottom */}
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: TEXT2 }}>All options</Text>
        </View>

        {/* Right — white */}
        <View style={{ width: SR_W, height: BODY_H, backgroundColor: WHITE, padding: 24, paddingTop: 21 }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12, color: NAVY, marginBottom: 3 }}>
            Payment Schedule
          </Text>
          <Text style={{ fontSize: 8, color: MUTED, marginBottom: 12 }}>
            {payRows.length} Payments
          </Text>
          {payRows.map((line, i) => (
            <PayRow key={i} line={line} />
          ))}
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// FLOOR PLANS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function FloorPlansPage({ listing: l, floorImgs }: { listing: ListingRecord; floorImgs: string[] }) {
  const floorImg  = floorImgs[0]
  const unitTypes = (l.beds ?? '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 5)
  const FP_W      = SR_W - 36
  const FP_H      = BODY_H * 0.75

  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: WHITE }}>
      <Crumb name={l.name} section="Typical Units" />
      <View style={{ height: BODY_H, flexDirection: 'row' }}>
        {/* Left — gray */}
        <View style={{ width: SL_W, height: BODY_H, backgroundColor: GRAY, padding: PAD, paddingTop: 33 }}>
          <Text style={{
            fontFamily: 'Helvetica-Bold', fontSize: 24, color: NAVY,
            lineHeight: 1.2, marginBottom: 18,
          }}>Typical Units</Text>

          {unitTypes.map((u, i) => (
            <View key={i} style={{
              backgroundColor: i === 0 ? NAVY : GRAY2,
              borderRadius: 15, paddingVertical: 4.5, paddingHorizontal: 10.5,
              marginBottom: 9, alignSelf: 'flex-start',
            }}>
              <Text style={{
                fontFamily: 'Helvetica-Bold', fontSize: 8.25,
                color: i === 0 ? WHITE : NAVY, letterSpacing: 0.3,
              }}>{u}</Text>
            </View>
          ))}

          {l.size_range && (
            <Text style={{ fontSize: 9, color: MUTED, marginTop: 12 }}>{l.size_range}</Text>
          )}
        </View>

        {/* Right — dark blue */}
        <View style={{
          width: SR_W, height: BODY_H, backgroundColor: '#1c3a4a',
          alignItems: 'center', justifyContent: 'center', padding: 18,
        }}>
          {floorImg ? (
            <>
              <PDFImage src={floorImg} style={{ width: FP_W, height: FP_H, objectFit: 'contain' }} />
              <Text style={{
                color: 'rgba(255,255,255,0.85)', fontSize: 10,
                fontFamily: 'Helvetica-Bold', marginTop: 12,
              }}>Floor Plan</Text>
            </>
          ) : (
            <View style={{
              width: '65%', height: BODY_H * 0.55,
              borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', borderStyle: 'dashed',
              borderRadius: 3, alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8 }}>Floor Plan</Text>
            </View>
          )}
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// AGENT PAGE (final)
// ══════════════════════════════════════════════════════════════════════════════
function AgentPage({ listing: l, agent: a, logoSrc, companyInfo }: {
  listing: ListingRecord; agent: AgentRecord; logoSrc?: string; companyInfo?: CompanyContact
}) {
  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', backgroundColor: NAVY }}>
      {/* Red bar */}
      <View style={{ height: 3, backgroundColor: RED }} />

      <View style={{ height: PH - 3, flexDirection: 'row' }}>
        {/* Left — agency logo at bottom */}
        <View style={{ width: SL_W, height: PH - 3, padding: PAD, paddingBottom: 36, justifyContent: 'flex-end' }}>
          {logoSrc ? (
            <PDFImage src={logoSrc} style={{ height: 27, width: 100, objectFit: 'contain' }} />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 27, height: 27,
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 3, alignItems: 'center', justifyContent: 'center', marginRight: 7,
              }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10.5, color: WHITE }}>M</Text>
              </View>
              <Text style={{
                fontFamily: 'Helvetica-Bold', fontSize: 12,
                color: 'rgba(255,255,255,0.75)', letterSpacing: 0.25,
              }}>MACINS LUXE</Text>
            </View>
          )}
        </View>

        {/* Right — agent details */}
        <View style={{
          width: SR_W, height: PH - 3, padding: PAD, paddingTop: 36,
          justifyContent: 'center',
          borderLeftWidth: 0.75, borderLeftColor: 'rgba(255,255,255,0.12)', borderLeftStyle: 'solid',
        }}>
          {/* Agent photo */}
          <View style={{
            width: 90, height: 90, borderRadius: 45, overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'solid',
            marginBottom: 15,
          }}>
            {a.photo_url
              ? <PDFImage src={a.photo_url} style={{ width: 90, height: 90, objectFit: 'cover' }} />
              : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 28, color: 'rgba(255,255,255,0.3)' }}>
                    {a.name.charAt(0)}
                  </Text>
                </View>
              )
            }
          </View>

          <Text style={{
            fontFamily: 'Helvetica-Bold', fontSize: 7.5, letterSpacing: 1.5,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 9,
          }}>Your Agent</Text>
          <Text style={{
            fontFamily: 'Helvetica-Bold', fontSize: 27, color: WHITE,
            lineHeight: 1.15, marginBottom: 7,
          }}>{a.name}</Text>
          {a.title && (
            <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
              {a.title}
            </Text>
          )}

          <View>
            {a.phone   && <ContactRow icon="phone"   text={a.phone} />}
            {a.email   && <ContactRow icon="email"   text={a.email} />}
            {companyInfo?.website && <ContactRow icon="web" text={companyInfo.website} />}
            {!a.phone && companyInfo?.phone && <ContactRow icon="phone" text={companyInfo.phone} />}
          </View>
        </View>
      </View>
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function PropertyPDF({ listing: l, agent: a, logoSrc, companyInfo }: Props) {
  const allImgs    = (l.images ?? []).filter(isPdfImg)
  const galImgs    = allImgs.slice(3)
  const galPages   = galImgs.length > 0 ? Math.ceil(galImgs.length / 4) : 0
  const floorImgs  = (l.floor_plans ?? []).filter(isPdfImg)
  const amenities  = l.amenities ?? []
  const highlights = l.highlights ?? []

  return (
    <Document>
      <Cover listing={l} agent={a} logoSrc={logoSrc} companyInfo={companyInfo} />
      <About listing={l} />
      <ProjectInfo listing={l} />

      {Array.from({ length: galPages }, (_, i) => (
        <PhotoGridPage
          key={i}
          listing={l}
          images={galImgs.slice(i * 4, i * 4 + 4)}
          section={i === 0 ? 'Architecture' : 'Gallery'}
        />
      ))}

      <LocationPage listing={l} highlights={highlights} />

      {amenities.length > 0 && (
        <AmenitiesPage listing={l} amenities={amenities} galleryImgs={galImgs} />
      )}

      {l.payment_plan && <PaymentPlanPage listing={l} />}

      {floorImgs.length > 0 && <FloorPlansPage listing={l} floorImgs={floorImgs} />}

      {a && (
        <AgentPage listing={l} agent={a} logoSrc={logoSrc} companyInfo={companyInfo} />
      )}
    </Document>
  )
}
