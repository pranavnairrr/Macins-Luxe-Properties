'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import type { HeroSlide, CompanyInfo, StatItem } from '@/utils/site-settings'

// ─── Helpers ───────────────────────────────────────────────────────────────

function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
        color: saved ? '#16a34a' : '#fff',
        background: saved ? 'rgba(22,163,74,0.10)' : saving ? 'rgba(27,48,121,0.55)' : '#1B3079',
        border: saved ? '1px solid rgba(22,163,74,0.35)' : 'none',
        borderRadius: 8, padding: '9px 18px',
        cursor: saving ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
      }}
    >
      {saved ? <><CheckCircle2 size={14} strokeWidth={2} /> Saved</> : saving ? 'Saving…' : <><Save size={14} strokeWidth={1.6} /> Save Changes</>}
    </button>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: 28 }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--white-section)',
        fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: 'var(--heading)',
      }}>{title}</div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  fontFamily: 'var(--font)', fontSize: '0.875rem',
  color: 'var(--heading)', background: '#fff',
  border: '1px solid var(--border)', borderRadius: 8,
  padding: '9px 12px', outline: 'none', transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font)',
  fontSize: '0.75rem', fontWeight: 600,
  color: 'var(--muted)', marginBottom: 5,
  letterSpacing: '0.03em',
}

// ─── Hero Slides Section ────────────────────────────────────────────────────

function HeroSlidesSection() {
  const [slides, setSlides]   = useState<HeroSlide[]>([])
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_settings').select('value').eq('key', 'hero_slides').single()
      .then(({ data }) => setSlides((data?.value?.slides ?? []) as HeroSlide[]))
  }, [])

  const update = (idx: number, field: keyof HeroSlide, val: string | boolean) =>
    setSlides(s => s.map((sl, i) => i === idx ? { ...sl, [field]: val } : sl))

  const addSlide = () => setSlides(s => [...s, {
    id: Date.now(), image_url: '', badge: '', title: '', sub: '', cta: 'Explore Properties', cta_href: '/properties', active: true,
  }])

  const remove = (idx: number) => setSlides(s => s.filter((_, i) => i !== idx))

  const handleUpload = async (idx: number, file: File) => {
    const supabase = createClient()
    setUploading(idx)
    const ext = file.name.split('.').pop()
    const path = `hero/${Date.now()}_${file.name.replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from('site-assets').upload(path, file, { upsert: true, contentType: file.type })
    if (!error) {
      const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(path)
      update(idx, 'image_url', urlData.publicUrl)
    }
    setUploading(null)
  }

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('site_settings').upsert({ key: 'hero_slides', value: { slides } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <SectionCard title="Hero Slides">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 20 }}>
        {slides.map((sl, i) => (
          <div key={sl.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--muted)' }}>Slide {i + 1}</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label style={{ ...labelStyle, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={sl.active} onChange={e => update(i, 'active', e.target.checked)} />
                  Active
                </label>
                <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
                  <Trash2 size={15} strokeWidth={1.6} />
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Image</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={sl.image_url}
                    onChange={e => update(i, 'image_url', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                  <label style={{
                    fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600,
                    color: '#1B3079', border: '1px solid #1B3079', borderRadius: 8,
                    padding: '8px 14px', cursor: 'pointer', whiteSpace: 'nowrap',
                    opacity: uploading === i ? 0.55 : 1,
                  }}>
                    {uploading === i ? 'Uploading…' : 'Upload'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
                      onChange={e => { if (e.target.files?.[0]) handleUpload(i, e.target.files[0]) }} />
                  </label>
                </div>
                {sl.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sl.image_url} alt="" style={{ marginTop: 8, height: 60, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)' }} />
                )}
              </div>
              <div>
                <label style={labelStyle}>Badge</label>
                <input type="text" placeholder="e.g. New Launch" value={sl.badge}
                  onChange={e => update(i, 'badge', e.target.value)} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label style={labelStyle}>CTA Label</label>
                <input type="text" placeholder="e.g. Explore Properties" value={sl.cta}
                  onChange={e => update(i, 'cta', e.target.value)} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Title</label>
                <textarea rows={2} placeholder="Slide title" value={sl.title}
                  onChange={e => update(i, 'title', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Subtitle</label>
                <input type="text" placeholder="Slide subtitle" value={sl.sub}
                  onChange={e => update(i, 'sub', e.target.value)} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label style={labelStyle}>CTA Link</label>
                <input type="text" placeholder="/properties" value={sl.cta_href}
                  onChange={e => update(i, 'cta_href', e.target.value)} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={addSlide}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
            color: '#1B3079', background: 'rgba(27,48,121,0.06)',
            border: '1px solid rgba(27,48,121,0.20)', borderRadius: 8, padding: '9px 16px', cursor: 'pointer',
          }}
        >
          <Plus size={14} strokeWidth={2} /> Add Slide
        </button>
        <SaveButton onClick={save} saving={saving} saved={saved} />
      </div>
    </SectionCard>
  )
}

// ─── Company Info Section ───────────────────────────────────────────────────

function CompanyInfoSection() {
  const [info, setInfo]     = useState<CompanyInfo>({ phone: '', whatsapp: '', email: '', website: '', address_dubai: '', address_abudhabi: '', orn: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_settings').select('value').eq('key', 'company_info').single()
      .then(({ data }) => { if (data?.value) setInfo(data.value as CompanyInfo) })
  }, [])

  const update = (field: keyof CompanyInfo, val: string) => setInfo(s => ({ ...s, [field]: val }))

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('site_settings').upsert({ key: 'company_info', value: info })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const fields: { key: keyof CompanyInfo; label: string; placeholder: string }[] = [
    { key: 'phone',          label: 'Phone',          placeholder: '+971 4 454 2588' },
    { key: 'whatsapp',       label: 'WhatsApp',        placeholder: '+97144542588' },
    { key: 'email',          label: 'Email',           placeholder: 'info@macinsluxe.com' },
    { key: 'website',        label: 'Website',         placeholder: 'www.macinsluxe.com' },
    { key: 'orn',            label: 'ORN',             placeholder: '11929' },
    { key: 'address_dubai',  label: 'Dubai Address',   placeholder: 'Office 102-106, Building 02, Business Bay' },
    { key: 'address_abudhabi', label: 'Abu Dhabi Address', placeholder: 'Office 149 & 150, Wafra Square' },
  ]

  return (
    <SectionCard title="Company Information">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {fields.map(f => (
          <div key={f.key} style={{ gridColumn: f.key.startsWith('address') ? '1/-1' : 'auto' }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type="text"
              placeholder={f.placeholder}
              value={info[f.key]}
              onChange={e => update(f.key, e.target.value)}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SaveButton onClick={save} saving={saving} saved={saved} />
      </div>
    </SectionCard>
  )
}

// ─── Stats Section ──────────────────────────────────────────────────────────

function StatsSection() {
  const [items, setItems]   = useState<StatItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_settings').select('value').eq('key', 'stats').single()
      .then(({ data }) => { if (data?.value?.items) setItems(data.value.items as StatItem[]) })
  }, [])

  const update = (idx: number, field: keyof StatItem, val: string) =>
    setItems(s => s.map((item, i) => i === idx ? { ...item, [field]: val } : item))

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('site_settings').upsert({ key: 'stats', value: { items } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <SectionCard title="Homepage Stats">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 2fr', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Value</label>
              <input type="text" placeholder="AED 3B+" value={item.value} onChange={e => update(i, 'value', e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={labelStyle}>Label</label>
              <input type="text" placeholder="Properties Sold" value={item.label} onChange={e => update(i, 'label', e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input type="text" placeholder="Short description" value={item.desc} onChange={e => update(i, 'desc', e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#1B3079')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SaveButton onClick={save} saving={saving} saved={saved} />
      </div>
    </SectionCard>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────

export default function SiteSettingsView() {
  return (
    <div style={{ fontFamily: 'var(--font)' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>Site Settings</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Manage hero slides, company details, and homepage stats.</p>
      </div>
      <HeroSlidesSection />
      <CompanyInfoSection />
      <StatsSection />
    </div>
  )
}
