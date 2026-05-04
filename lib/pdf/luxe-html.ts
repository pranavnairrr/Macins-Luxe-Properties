import type { ListingRecord } from '@/components/staff/PropertyListingForm'
import type { AgentRecord } from '@/components/staff/AgentForm'

export interface CompanyContact {
  phone?: string
  email?: string
  website?: string
  orn?: string
}

export interface LuxeHtmlOptions {
  listing: ListingRecord
  agent: AgentRecord | null
  logoSrc?: string       // base64 or URL for the white logo
  companyInfo?: CompanyContact
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

// SVG icons (inline, no external dependency)
const ICON_PHONE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.01 4C0 2.98.41 2.04 1.08 1.37A2 2 0 013.07.01l3 .01a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0121.99 15l-.07 1.92z"/></svg>`
const ICON_EMAIL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
const ICON_WEB   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`
const ICON_IMG   = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`

function imgTag(src: string | undefined | null, cls: string, alt = ''): string {
  if (!src) return ''
  return `<img src="${esc(src)}" class="${cls}" alt="${esc(alt)}" loading="eager">`
}

function photoCellHtml(src: string | undefined): string {
  if (src) {
    return `<div class="photo-cell"><img src="${esc(src)}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="eager"></div>`
  }
  return `<div class="photo-cell"><div class="photo-cell-placeholder">${ICON_IMG}</div></div>`
}

function colImageHtml(src: string | undefined): string {
  if (src) {
    return `<div class="col-image"><img src="${esc(src)}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="eager"></div>`
  }
  return `<div class="col-image"><div class="col-image-placeholder">${ICON_IMG}<span>Photo</span></div></div>`
}

// ── Page generators ───────────────────────────────────────────────────────────

function coverPage(l: ListingRecord, a: AgentRecord | null, logoSrc?: string, ci?: CompanyContact): string {
  const img0 = (l.images ?? [])[0] ?? ''
  const eyebrow = [l.developer, l.location].filter(Boolean).join(' · ')

  const metas = [
    l.price ? `<div class="cover-meta-item"><span class="cover-meta-label">Starting From</span><span class="cover-meta-value">${esc(l.price)}</span></div>` : '',
    l.badge ? `<div class="cover-meta-item"><span class="cover-meta-label">Handover</span><span class="cover-meta-value">${esc(l.badge)}</span></div>` : '',
    l.beds  ? `<div class="cover-meta-item"><span class="cover-meta-label">Units</span><span class="cover-meta-value">${esc(l.beds)}</span></div>`  : '',
  ].join('')

  const logoHtml = logoSrc
    ? `<img src="${esc(logoSrc)}" style="height:44px;width:auto;object-fit:contain;filter:brightness(0) invert(1);" loading="eager">`
    : `<div class="cover-logo-placeholder"><div class="logo-mark">M</div><span class="logo-name">MACINS LUXE</span></div>`

  let agentCard = ''
  if (a) {
    const photoHtml = a.photo_url
      ? `<img src="${esc(a.photo_url)}" style="width:100%;height:100%;object-fit:cover;" loading="eager">`
      : '<span style="font-size:9px;color:rgba(255,255,255,0.35);">Photo</span>'

    agentCard = `
    <div class="cover-agent-card">
      <div class="cover-agent-top">
        <div class="cover-agent-photo">${photoHtml}</div>
        <div class="cover-agent-info">
          <div class="agent-label">Your Agent</div>
          <div class="agent-nm">${esc(a.name)}</div>
          ${a.title ? `<div class="agent-ttl">${esc(a.title)}</div>` : ''}
        </div>
      </div>
      <div class="cover-agent-contacts">
        ${a.phone ? `<div class="cover-agent-contact-row">${ICON_PHONE}<span>${esc(a.phone)}</span></div>` : ''}
        ${a.email ? `<div class="cover-agent-contact-row">${ICON_EMAIL}<span>${esc(a.email)}</span></div>` : ''}
      </div>
      <div class="cover-agent-company">
        <div class="cover-agent-company-mark">M</div>
        <span class="cover-agent-company-name">Macins Luxe</span>
      </div>
    </div>`
  } else {
    const phone = ci?.phone ?? ''
    const email = ci?.email ?? ''
    agentCard = `
    <div class="cover-agent-card">
      <div style="margin-bottom:12px;">${logoHtml}</div>
      ${phone ? `<div class="cover-agent-contact-row">${ICON_PHONE}<span>${esc(phone)}</span></div>` : ''}
      ${email ? `<div class="cover-agent-contact-row">${ICON_EMAIL}<span>${esc(email)}</span></div>` : ''}
    </div>`
  }

  return `
<div class="page cover-page">
  ${img0 ? `<img src="${esc(img0)}" class="cover-bg" alt="${esc(l.name)}" loading="eager">` : `<div style="position:absolute;inset:0;background:#1a1f2e;"></div>`}
  <div class="cover-overlay"></div>
  <div class="cover-logo-bar">
    ${logoHtml}
    <div style="font-size:10px;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;">Property Brochure</div>
  </div>
  <div class="cover-content">
    <div class="cover-content-left">
      ${eyebrow ? `<div class="cover-eyebrow">${esc(eyebrow)}</div>` : ''}
      <div class="cover-divider"></div>
      <div class="cover-title">${esc(l.name)}</div>
      ${metas ? `<div class="cover-meta">${metas}</div>` : ''}
    </div>
    ${agentCard}
  </div>
</div>`
}

function aboutPage(l: ListingRecord): string {
  const imgs = l.images ?? []
  const img1 = imgs[1]
  const [p1, p2] = splitDesc(l.description)

  return `
<div class="page">
  <div class="breadcrumb">${esc(l.name)} / About the Project</div>
  <div class="two-col">
    <div class="col-text">
      <div class="section-label">About the Project</div>
      <h1 class="property-title">${esc(l.name)}</h1>
      <div class="developer-row">
        <div class="developer-logo-placeholder">DEV</div>
        <div class="developer-info">
          <div class="label">Developer</div>
          <div class="name">${esc(l.developer || '—')}</div>
        </div>
      </div>
      <div class="accent-heading">Description</div>
      ${p1 ? `<p class="body-text">${esc(p1)}</p>` : ''}
      ${p2 ? `<p class="body-text">${esc(p2)}</p>` : ''}
    </div>
    ${colImageHtml(img1)}
  </div>
</div>`
}

function projectInfoPage(l: ListingRecord): string {
  const imgs = l.images ?? []
  const img2 = imgs[2]
  const [,,p3] = splitDesc(l.description)

  const rows = [
    ['Project Status', l.status === 'published' ? 'Ready' : 'Off-Plan', 'Sale Status', 'Open'],
    ['Size Range',  l.size_range || '—', 'Unit Types', l.beds || '—'],
    ['Min. Price',  l.price || '—', 'Max. Price', '—'],
    ['Developer',   l.developer || '—', 'Location', l.location || '—'],
    ['Handover',    l.badge || '—', 'District', l.location || '—'],
  ]

  const gridHtml = rows.map(([la, va, lb, vb]) => `
    <div class="info-cell"><div class="ic-label">${esc(la)}</div><div class="ic-value">${esc(va)}</div></div>
    <div class="info-cell"><div class="ic-label">${esc(lb)}</div><div class="ic-value">${esc(vb)}</div></div>`
  ).join('')

  return `
<div class="page">
  <div class="breadcrumb">${esc(l.name)} / Project Info</div>
  <div class="two-col">
    <div class="col-text" style="padding-top:36px;">
      ${p3 ? `<p class="body-text" style="margin-bottom:24px;">${esc(p3)}</p>` : ''}
      <h3 class="sub-heading" style="margin-bottom:16px;">Project Info</h3>
      <div class="info-grid">${gridHtml}</div>
    </div>
    ${colImageHtml(img2)}
  </div>
</div>`
}

function photoGridPage(l: ListingRecord, images: string[], section: string): string {
  const [a, b, c, d] = images
  return `
<div class="page">
  <div class="breadcrumb">${esc(l.name)} / ${esc(section)}</div>
  <div class="photo-grid">
    ${photoCellHtml(a)}
    ${photoCellHtml(b)}
    ${photoCellHtml(c)}
    ${photoCellHtml(d)}
  </div>
</div>`
}

function locationPage(l: ListingRecord): string {
  const highlights = (l.highlights ?? []) as string[]
  const poisHtml = highlights.map(h => {
    const parts = h.split('|')
    const name = (parts[0] ?? h).trim()
    const dist = parts[1]?.trim() ?? ''
    return `
    <div class="nearby-item">
      <div class="ni-left"><div class="nearby-dot"></div><span>${esc(name)}</span></div>
      ${dist ? `<span class="nearby-dist">${esc(dist)}</span>` : ''}
    </div>`
  }).join('')

  return `
<div class="page">
  <div class="breadcrumb">${esc(l.name)} / Point of Interest</div>
  <div class="location-split">
    <div class="location-text">
      <h2 class="page-heading">Location</h2>
      ${l.location ? `<p class="body-text">${esc(l.location)}</p>` : ''}
      ${poisHtml ? `<div class="nearby-list"><div style="font-size:12px;font-weight:600;color:#1a1f2e;margin-bottom:4px;margin-top:12px;">What is nearby</div>${poisHtml}</div>` : ''}
    </div>
    <div class="location-map">
      <div class="map-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Location Map</span>
      </div>
    </div>
  </div>
</div>`
}

function amenitiesPage(l: ListingRecord, imgs: string[]): string {
  const ams = (l.amenities ?? []) as string[]

  function amenCell(i: number): string {
    const src = imgs[i % Math.max(imgs.length, 1)]
    const caption = ams[i] ?? ''
    if (src) {
      return `
      <div class="amenity-photo">
        <img src="${esc(src)}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="eager">
        ${caption ? `<div class="caption">${esc(caption)}</div>` : ''}
      </div>`
    }
    return `
    <div class="amenity-photo">
      <div class="amenity-photo-placeholder">${caption ? esc(caption) : 'Amenity'}</div>
      ${caption ? `<div class="caption">${esc(caption)}</div>` : ''}
    </div>`
  }

  return `
<div class="page">
  <div class="breadcrumb">${esc(l.name)} / Features &amp; Amenities</div>
  <div class="amenities-grid">
    <div class="amenities-label-cell">
      <h2 class="page-heading">Features &amp;<br>Amenities</h2>
    </div>
    <div class="amenities-photos">
      ${amenCell(0)}${amenCell(1)}${amenCell(2)}${amenCell(3)}
    </div>
  </div>
</div>`
}

function paymentPlanPage(l: ListingRecord): string {
  const raw = (l.payment_plan ?? '').split('\n').map((s: string) => s.trim()).filter(Boolean)
  const planName = raw[0] || 'Payment Plan'
  const payLines = raw.slice(1)

  const rowsHtml = payLines.map((line: string) => {
    const m = line.match(/(\d+%)/)
    const pct = m ? m[1] : ''
    const lbl = pct ? line.replace(pct, '').replace(/[:\-–—]+$/, '').trim() : line
    return `
    <div class="payment-row">
      <span>${esc(lbl)}</span>
      ${pct ? `<span class="amount">${esc(pct)}</span>` : ''}
    </div>`
  }).join('')

  return `
<div class="page">
  <div class="breadcrumb">${esc(l.name)} / Payment Plan</div>
  <div class="payment-split">
    <div class="payment-text">
      <div class="payment-option-label">Payment Plan Option</div>
      <div class="payment-plan-name">${esc(planName)}</div>
      <div class="payment-all-label">All options</div>
    </div>
    <div class="payment-detail">
      <div class="payment-section-title">Payment Schedule</div>
      <div class="payment-section-sub">${payLines.length} Payments</div>
      ${rowsHtml}
    </div>
  </div>
</div>`
}

function floorPlansPage(l: ListingRecord, floorImgs: string[]): string {
  const unitTypes = (l.beds || '').split(',').filter(Boolean).slice(0, 5)
  const floorImg = floorImgs[0]

  const badgesHtml = unitTypes.map((u: string, i: number) =>
    `<span class="unit-badge" ${i > 0 ? 'style="background:#f4f4f4;color:#1a1f2e;"' : ''}>${esc(u.trim())}</span>`
  ).join('')

  const imgHtml = floorImg
    ? `<img src="${esc(floorImg)}" style="max-width:100%;max-height:85%;object-fit:contain;display:block;" loading="eager">
       <div class="floor-label">Floor Plan</div>`
    : `<div class="floor-placeholder">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
         <span>Floor Plan</span>
       </div>`

  return `
<div class="page">
  <div class="breadcrumb">${esc(l.name)} / Typical Units</div>
  <div class="units-split">
    <div class="units-text">
      <h2 class="page-heading">Typical Units</h2>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">${badgesHtml}</div>
    </div>
    <div class="units-floor-image">${imgHtml}</div>
  </div>
</div>`
}

function agentPage(l: ListingRecord, a: AgentRecord, logoSrc?: string, ci?: CompanyContact): string {
  const photoHtml = a.photo_url
    ? `<img src="${esc(a.photo_url)}" style="width:100%;height:100%;object-fit:cover;" loading="eager">`
    : '<span style="font-size:11px;color:rgba(255,255,255,0.3);">Agent Photo</span>'

  const logoHtml = logoSrc
    ? `<img src="${esc(logoSrc)}" class="agent-company-logo" loading="eager">`
    : `<div class="agent-company-logo-placeholder"><div class="mark">M</div><span class="name">MACINS LUXE</span></div>`

  return `
<div class="page" style="display:flex;flex-direction:column;">
  <div class="agent-red-bar"></div>
  <div class="agent-page">
    <div class="agent-inner">
      <div class="agent-left">${logoHtml}</div>
      <div class="agent-right">
        <div class="agent-photo-area">${photoHtml}</div>
        <div class="agent-eyebrow">Your Agent</div>
        <div class="agent-name">${esc(a.name)}</div>
        ${a.title ? `<div class="agent-title">${esc(a.title)}</div>` : ''}
        <div class="agent-contacts">
          ${a.phone ? `<div class="agent-contact-item"><div class="agent-contact-icon">${ICON_PHONE}</div><span>${esc(a.phone)}</span></div>` : ''}
          ${a.email ? `<div class="agent-contact-item"><div class="agent-contact-icon">${ICON_EMAIL}</div><span>${esc(a.email)}</span></div>` : ''}
          ${ci?.website ? `<div class="agent-contact-item"><div class="agent-contact-icon">${ICON_WEB}</div><span>${esc(ci.website)}</span></div>` : ''}
        </div>
      </div>
    </div>
  </div>
</div>`
}

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #1a1f2e; --navy2: #232a3b; --red: #c0392b;
    --gray: #f4f4f4; --gray2: #e8e8e8; --muted: #8a8f9e;
    --white: #ffffff; --text: #1a1f2e; --text2: #444b5a;
    --page-w: 794px; --page-h: 1123px;
  }

  body { font-family: 'DM Sans', sans-serif; background: #d0d0d0; color: var(--text); -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .page { width: var(--page-w); height: var(--page-h); background: var(--white); margin: 32px auto; position: relative; overflow: hidden; page-break-after: always; break-after: page; display: flex; flex-direction: column; }

  .breadcrumb { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--navy); padding: 18px 40px; border-bottom: 1px solid var(--gray2); flex-shrink: 0; }

  .section-label { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }

  h1.property-title { font-family: 'DM Serif Display', serif; font-size: 48px; line-height: 1.1; color: var(--navy); margin-bottom: 28px; }
  h2.page-heading { font-family: 'DM Sans', sans-serif; font-size: 32px; font-weight: 700; color: var(--navy); line-height: 1.2; margin-bottom: 16px; }
  h3.sub-heading { font-size: 16px; font-weight: 600; color: var(--navy); margin-bottom: 6px; }
  .accent-heading { font-size: 15px; font-weight: 600; color: var(--red); margin-bottom: 10px; }
  p.body-text { font-size: 13px; line-height: 1.75; color: var(--text2); margin-bottom: 14px; }

  /* Cover */
  .cover-page { height: var(--page-h); position: relative; overflow: hidden; display: block; }
  .cover-bg { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cover-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,14,26,0.18) 0%, rgba(10,14,26,0.72) 100%); }
  .cover-logo-bar { position: absolute; top: 36px; left: 40px; right: 40px; display: flex; align-items: center; justify-content: space-between; }
  .cover-logo-placeholder { height: 44px; display: flex; align-items: center; gap: 10px; }
  .cover-logo-placeholder .logo-mark { width: 44px; height: 44px; background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: var(--navy); }
  .cover-logo-placeholder .logo-name { font-size: 16px; font-weight: 700; color: white; letter-spacing: 0.04em; }
  .cover-content { position: absolute; bottom: 44px; left: 40px; right: 40px; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; }
  .cover-content-left { flex: 1; min-width: 0; max-width: calc(100% - 264px); }
  .cover-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
  .cover-divider { width: 48px; height: 3px; background: var(--red); margin-bottom: 20px; }
  .cover-title { font-family: 'DM Serif Display', serif; font-size: 48px; font-weight: 400; color: white; line-height: 1.1; margin-bottom: 18px; word-break: break-word; }
  .cover-meta { display: flex; gap: 0; }
  .cover-meta-item { display: flex; flex-direction: column; gap: 4px; padding-right: 24px; margin-right: 24px; border-right: 1px solid rgba(255,255,255,0.2); }
  .cover-meta-item:last-child { border-right: none; padding-right: 0; margin-right: 0; }
  .cover-meta-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
  .cover-meta-value { font-size: 14px; font-weight: 600; color: white; }
  .cover-agent-card { background: rgba(15,20,36,0.55); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.14); border-radius: 12px; padding: 20px 22px; display: flex; flex-direction: column; gap: 0; width: 232px; flex-shrink: 0; }
  .cover-agent-top { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.13); }
  .cover-agent-photo { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.12); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .cover-agent-info { min-width: 0; }
  .cover-agent-info .agent-label { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 3px; }
  .cover-agent-info .agent-nm { font-size: 13px; font-weight: 700; color: white; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cover-agent-info .agent-ttl { font-size: 10px; color: rgba(255,255,255,0.55); margin-top: 2px; }
  .cover-agent-contacts { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
  .cover-agent-contact-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: rgba(255,255,255,0.8); }
  .cover-agent-company { display: flex; align-items: center; gap: 9px; border-top: 1px solid rgba(255,255,255,0.13); padding-top: 14px; }
  .cover-agent-company-mark { width: 26px; height: 26px; background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: var(--navy); flex-shrink: 0; }
  .cover-agent-company-name { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.8); }

  /* Two-col */
  .two-col { flex: 1; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
  .col-text { padding: 48px 40px; display: flex; flex-direction: column; overflow: hidden; }
  .col-image { position: relative; overflow: hidden; }
  .col-image-placeholder { width: 100%; height: 100%; background: var(--gray); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; color: var(--muted); font-size: 12px; }

  /* Developer row */
  .developer-row { display: flex; align-items: center; gap: 14px; padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid var(--gray2); }
  .developer-logo-placeholder { width: 52px; height: 52px; border: 1px solid var(--gray2); border-radius: 6px; background: var(--gray); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--muted); flex-shrink: 0; }
  .developer-info .label { font-size: 10px; color: var(--muted); margin-bottom: 3px; }
  .developer-info .name { font-size: 15px; font-weight: 600; color: var(--navy); }

  /* Info grid */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--gray2); margin-top: 8px; }
  .info-cell { padding: 16px 0; border-bottom: 1px solid var(--gray2); }
  .info-cell:nth-child(odd) { padding-right: 20px; }
  .info-cell:nth-child(even) { padding-left: 20px; border-left: 1px solid var(--gray2); }
  .info-cell .ic-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
  .info-cell .ic-value { font-size: 16px; font-weight: 700; color: var(--navy); }

  /* Photo grid */
  .photo-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0; overflow: hidden; }
  .photo-cell { position: relative; overflow: hidden; }
  .photo-cell-placeholder { width: 100%; height: 100%; background: #c8cdd8; display: flex; align-items: center; justify-content: center; color: #8a8f9e; font-size: 11px; flex-direction: column; gap: 8px; }

  /* Location */
  .location-split { flex: 1; display: grid; grid-template-columns: 5fr 7fr; overflow: hidden; }
  .location-text { padding: 44px 36px; background: var(--gray); display: flex; flex-direction: column; }
  .nearby-list { margin-top: 24px; }
  .nearby-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--gray2); font-size: 13px; color: var(--text2); gap: 12px; }
  .ni-left { display: flex; align-items: center; gap: 10px; }
  .nearby-dot { width: 18px; height: 18px; border: 1.5px solid var(--muted); border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .nearby-dot::after { content: ''; width: 5px; height: 5px; background: var(--muted); border-radius: 50%; }
  .nearby-dist { font-weight: 600; color: var(--navy); white-space: nowrap; font-size: 12px; }
  .location-map { position: relative; overflow: hidden; background: #dde4ee; }
  .map-placeholder { width: 100%; height: 100%; background: #dde4ee; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; color: #8a9ab5; font-size: 13px; }

  /* Amenities */
  .amenities-grid { flex: 1; display: grid; grid-template-columns: 5fr 7fr; overflow: hidden; }
  .amenities-label-cell { background: var(--gray); padding: 44px 36px; display: flex; align-items: flex-start; }
  .amenities-photos { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; overflow: hidden; }
  .amenity-photo { position: relative; overflow: hidden; }
  .amenity-photo .caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 12px; background: linear-gradient(transparent, rgba(0,0,0,0.6)); color: white; font-size: 11px; font-weight: 500; }
  .amenity-photo-placeholder { width: 100%; height: 100%; background: #c8cdd8; display: flex; align-items: center; justify-content: center; color: #8a8f9e; font-size: 10px; }

  /* Payment */
  .payment-split { flex: 1; display: grid; grid-template-columns: 5fr 7fr; overflow: hidden; }
  .payment-text { background: var(--gray); padding: 36px 32px; display: flex; flex-direction: column; }
  .payment-option-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .payment-plan-name { font-size: 24px; font-weight: 700; color: var(--navy); margin-bottom: 24px; line-height: 1.2; }
  .payment-all-label { font-size: 12px; font-weight: 600; color: var(--text2); margin-top: auto; padding-top: 20px; }
  .payment-detail { padding: 28px 32px; display: flex; flex-direction: column; background: white; }
  .payment-section-title { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .payment-section-sub { font-size: 11px; color: var(--muted); margin-bottom: 16px; }
  .payment-row { padding: 10px 0; font-size: 13px; color: var(--text2); border-bottom: 1px solid var(--gray2); display: flex; align-items: center; justify-content: space-between; }
  .payment-row .amount { font-weight: 700; color: var(--navy); }

  /* Floor plans */
  .units-split { flex: 1; display: grid; grid-template-columns: 5fr 7fr; overflow: hidden; }
  .units-text { background: var(--gray); padding: 44px 36px; display: flex; flex-direction: column; gap: 16px; }
  .unit-badge { display: inline-flex; align-items: center; background: var(--navy); color: white; font-size: 11px; font-weight: 600; padding: 6px 14px; border-radius: 20px; letter-spacing: 0.04em; width: fit-content; }
  .units-floor-image { position: relative; overflow: hidden; background: #1c3a4a; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
  .floor-label { margin-top: 16px; color: rgba(255,255,255,0.85); font-size: 13px; font-weight: 500; text-align: center; }
  .floor-placeholder { width: 65%; aspect-ratio: 1/1.4; background: rgba(255,255,255,0.08); border: 1.5px dashed rgba(255,255,255,0.25); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.35); font-size: 11px; flex-direction: column; gap: 8px; }

  /* Agent page */
  .agent-red-bar { height: 4px; background: var(--red); width: 100%; flex-shrink: 0; }
  .agent-page { flex: 1; display: flex; flex-direction: column; background: var(--navy); overflow: hidden; }
  .agent-inner { flex: 1; display: grid; grid-template-columns: 5fr 7fr; overflow: hidden; }
  .agent-left { display: flex; flex-direction: column; justify-content: flex-end; padding: 48px 40px; }
  .agent-right { display: flex; flex-direction: column; justify-content: center; padding: 48px 40px; border-left: 1px solid rgba(255,255,255,0.12); }
  .agent-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 12px; }
  .agent-name { font-family: 'DM Serif Display', serif; font-size: 36px; color: white; line-height: 1.15; margin-bottom: 10px; }
  .agent-title { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 32px; }
  .agent-contacts { display: flex; flex-direction: column; gap: 12px; }
  .agent-contact-item { display: flex; align-items: center; gap: 12px; font-size: 13px; color: rgba(255,255,255,0.85); }
  .agent-contact-icon { width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .agent-photo-area { width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); margin-bottom: 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .agent-company-logo { height: 36px; width: auto; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.8; }
  .agent-company-logo-placeholder { display: flex; align-items: center; gap: 10px; }
  .agent-company-logo-placeholder .mark { width: 36px; height: 36px; background: rgba(255,255,255,0.15); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: white; }
  .agent-company-logo-placeholder .name { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.75); letter-spacing: 0.03em; }

  @media print {
    body { background: white; }
    .page { margin: 0; width: 210mm; height: 297mm; }
  }
`

// ── Main export ───────────────────────────────────────────────────────────────

export function buildLuxeHtml({ listing: l, agent: a, logoSrc, companyInfo }: LuxeHtmlOptions): string {
  const imgs = (l.images ?? []) as string[]
  const galleryImgs = imgs.slice(3)
  const galPageCount = galleryImgs.length > 0 ? Math.ceil(galleryImgs.length / 4) : 0
  const floorImgs = (l.floor_plans ?? []) as string[]
  const amenities = (l.amenities ?? []) as string[]

  const galleryPages = Array.from({ length: galPageCount }, (_, i) => {
    const section = i === 0 ? 'Architecture' : 'Gallery'
    return photoGridPage(l, galleryImgs.slice(i * 4, i * 4 + 4), section)
  }).join('')

  const pages = [
    coverPage(l, a, logoSrc, companyInfo),
    aboutPage(l),
    projectInfoPage(l),
    galleryPages,
    locationPage(l),
    amenities.length > 0 ? amenitiesPage(l, galleryImgs) : '',
    l.payment_plan ? paymentPlanPage(l) : '',
    floorImgs.length > 0 ? floorPlansPage(l, floorImgs) : '',
    a ? agentPage(l, a, logoSrc, companyInfo) : '',
  ].join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(l.name)} — Property Brochure</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&display=block" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${pages}
</body>
</html>`
}
