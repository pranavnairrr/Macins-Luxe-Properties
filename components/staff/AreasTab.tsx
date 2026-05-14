'use client'

import { useEffect, useState, useRef } from 'react'
import { PlusCircle, Edit2, Trash2, MapPin, Search, Upload } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type Area = {
  id: string
  slug: string
  name: string
  emirate: string
  tagline: string
  image: string
  hero_image: string
  description: string
  highlights: string[]
  avg_price_per_sqft: string
  rental_yield: string
  property_types: string[]
  nearby_areas: string[]
  lat: number
  lng: number
  map_zoom: number
  sort_order: number
  created_at: string
}

type Mode = 'list' | 'form'

const EMIRATES = ['Dubai', 'Abu Dhabi']

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontFamily: 'var(--font)',
  fontSize: '0.875rem',
  color: 'var(--body)',
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function AreaForm({ initial, onSave, onCancel }: {
  initial?: Area
  onSave: (area: Area) => void
  onCancel: () => void
}) {
  const supabase = createClient()
  const [slug, setSlug]               = useState(initial?.slug ?? '')
  const [name, setName]               = useState(initial?.name ?? '')
  const [emirate, setEmirate]         = useState(initial?.emirate ?? 'Dubai')
  const [tagline, setTagline]         = useState(initial?.tagline ?? '')
  const [image, setImage]             = useState(initial?.image ?? '')
  const [heroImage, setHeroImage]     = useState(initial?.hero_image ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [highlights, setHighlights]   = useState((initial?.highlights ?? []).join('\n'))
  const [avgPrice, setAvgPrice]       = useState(initial?.avg_price_per_sqft ?? '')
  const [yield_, setYield]            = useState(initial?.rental_yield ?? '')
  const [propTypes, setPropTypes]     = useState((initial?.property_types ?? []).join(', '))
  const [nearby, setNearby]           = useState((initial?.nearby_areas ?? []).join(', '))
  const [lat, setLat]                 = useState(initial?.lat?.toString() ?? '')
  const [lng, setLng]                 = useState(initial?.lng?.toString() ?? '')
  const [zoom, setZoom]               = useState(initial?.map_zoom?.toString() ?? '14')
  const [saving, setSaving]           = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [error, setError]             = useState('')
  const imgRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLInputElement>(null)

  function handleNameChange(v: string) {
    setName(v)
    if (!initial) setSlug(slugify(v))
  }

  async function uploadImage(file: File, target: 'image' | 'hero') {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `areas/${Date.now()}-${target}.${ext}`
    const { error: upErr } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    if (target === 'image') setImage(data.publicUrl)
    else setHeroImage(data.publicUrl)
    setUploading(false)
  }

  async function handleSave() {
    if (!slug || !name || !image) { setError('Slug, name and image are required.'); return }
    setSaving(true); setError('')
    const payload = {
      slug, name, emirate, tagline, image, hero_image: heroImage, description,
      highlights: highlights.split('\n').map(h => h.trim()).filter(Boolean),
      avg_price_per_sqft: avgPrice, rental_yield: yield_,
      property_types: propTypes.split(',').map(t => t.trim()).filter(Boolean),
      nearby_areas: nearby.split(',').map(t => t.trim()).filter(Boolean),
      lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0,
      map_zoom: parseInt(zoom) || 14,
    }
    let result
    if (initial) {
      result = await supabase.from('areas').update(payload).eq('id', initial.id).select().single()
    } else {
      result = await supabase.from('areas').insert(payload).select().single()
    }
    setSaving(false)
    if (result.error) { setError(result.error.message); return }
    onSave(result.data as Area)
  }

  const field: React.CSSProperties = {
    fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)',
    background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
    padding: '10px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
  }
  const label: React.CSSProperties = {
    fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)',
    letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ maxWidth: 780, fontFamily: 'var(--font)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)' }}>
          {initial ? 'Edit Area' : 'New Area'}
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ ...field, width: 'auto', padding: '9px 20px', cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={handleSave} disabled={saving || uploading}
            style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, padding: '9px 24px', borderRadius: 8, border: 'none', background: saving ? 'var(--muted)' : 'var(--navy)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : 'Save Area'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem', color: '#dc2626' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={label}>Name *</label>
          <input style={field} value={name} onChange={e => handleNameChange(e.target.value)} placeholder="Downtown Dubai" />
        </div>
        <div>
          <label style={label}>Slug *</label>
          <input style={field} value={slug} onChange={e => setSlug(e.target.value)} placeholder="downtown-dubai" />
        </div>
        <div>
          <label style={label}>Emirate</label>
          <select style={field} value={emirate} onChange={e => setEmirate(e.target.value)}>
            {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Tagline</label>
          <input style={field} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="The Heart of Modern Dubai" />
        </div>
        <div>
          <label style={label}>Avg Price / sqft</label>
          <input style={field} value={avgPrice} onChange={e => setAvgPrice(e.target.value)} placeholder="AED 3,100" />
        </div>
        <div>
          <label style={label}>Rental Yield</label>
          <input style={field} value={yield_} onChange={e => setYield(e.target.value)} placeholder="5.8%" />
        </div>
        <div>
          <label style={label}>Lat</label>
          <input style={field} value={lat} onChange={e => setLat(e.target.value)} placeholder="25.1972" />
        </div>
        <div>
          <label style={label}>Lng</label>
          <input style={field} value={lng} onChange={e => setLng(e.target.value)} placeholder="55.2744" />
        </div>
      </div>

      {/* Images */}
      {(['image', 'hero'] as const).map(type => {
        const val = type === 'image' ? image : heroImage
        const setter = type === 'image' ? setImage : setHeroImage
        const ref = type === 'image' ? imgRef : heroRef
        return (
          <div key={type} style={{ marginBottom: 16 }}>
            <label style={label}>{type === 'image' ? 'Card Image *' : 'Hero Image'}</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <input style={{ ...field, flex: 1 }} value={val} onChange={e => setter(e.target.value)} placeholder="Supabase Storage URL or paste URL" />
              <button
                onClick={() => ref.current?.click()} disabled={uploading}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
              >
                <Upload size={14} strokeWidth={1.6} /> {uploading ? '…' : 'Upload'}
              </button>
              <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], type)} />
            </div>
            {val && <img src={val} alt="preview" style={{ marginTop: 10, height: 80, width: 140, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />}
          </div>
        )
      })}

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Description</label>
        <textarea rows={5} style={{ ...field, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Area description…" />
      </div>

      {/* Highlights */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Highlights (one per line)</label>
        <textarea rows={4} style={{ ...field, resize: 'vertical' }} value={highlights} onChange={e => setHighlights(e.target.value)} placeholder={'Burj Khalifa\nDubai Mall\nAED 3,100/sqft'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={label}>Property Types (comma-separated)</label>
          <input style={field} value={propTypes} onChange={e => setPropTypes(e.target.value)} placeholder="Apartments, Penthouses" />
        </div>
        <div>
          <label style={label}>Nearby Areas (comma-separated)</label>
          <input style={field} value={nearby} onChange={e => setNearby(e.target.value)} placeholder="Business Bay, DIFC" />
        </div>
      </div>
    </div>
  )
}

export default function AreasTab() {
  const supabase = createClient()
  const [areas, setAreas]     = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode]       = useState<Mode>('list')
  const [editing, setEditing] = useState<Area | undefined>()
  const [query, setQuery]     = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('areas')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setAreas((data ?? []) as Area[])
        setLoading(false)
      })
  }, [])

  const filtered = areas.filter(a => !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.emirate.toLowerCase().includes(query.toLowerCase()))

  async function handleDelete(id: string) {
    if (!confirm('Delete this area?')) return
    setDeleting(id)
    await supabase.from('areas').delete().eq('id', id)
    setAreas(prev => prev.filter(a => a.id !== id))
    setDeleting(null)
  }

  function handleSaved(area: Area) {
    setAreas(prev => {
      const exists = prev.find(a => a.id === area.id)
      return exists ? prev.map(a => a.id === area.id ? area : a) : [...prev, area]
    })
    setMode('list')
    setEditing(undefined)
  }

  if (mode === 'form') {
    return (
      <AreaForm
        initial={editing}
        onSave={handleSaved}
        onCancel={() => { setMode('list'); setEditing(undefined) }}
      />
    )
  }

  return (
    <div style={{ fontFamily: 'var(--font)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>Areas</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            {loading ? 'Loading…' : `${areas.length} area${areas.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} strokeWidth={1.6} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search areas…" value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px 9px 32px', outline: 'none', width: 200 }}
              onFocus={e => (e.currentTarget.style.borderColor = '#333')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>
          <button
            onClick={() => { setEditing(undefined); setMode('form') }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--navy)', color: '#fff', cursor: 'pointer' }}
          >
            <PlusCircle size={15} strokeWidth={1.8} /> New Area
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)', padding: '32px 0' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '64px 48px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--muted)' }}>
            <MapPin size={40} strokeWidth={1.2} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>
            {query ? 'No areas match your search.' : 'No areas yet. Click "New Area" to add one.'}
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--white-section)', borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Emirate', 'Avg Price/sqft', 'Yield', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((area, i) => (
                  <tr key={area.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--heading)' }}>{area.name}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: area.emirate === 'Dubai' ? '#eff6ff' : '#f5f3ff', color: area.emirate === 'Dubai' ? '#1d4ed8' : '#6d28d9' }}>
                        {area.emirate}
                      </span>
                    </td>
                    <td style={tdStyle}>{area.avg_price_per_sqft || '—'}</td>
                    <td style={tdStyle}>{area.rental_yield || '—'}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setEditing(area); setMode('form') }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--heading)' }}
                        >
                          <Edit2 size={12} strokeWidth={1.8} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(area.id)}
                          disabled={deleting === area.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff8f8', cursor: 'pointer', color: '#dc2626' }}
                        >
                          <Trash2 size={12} strokeWidth={1.8} /> {deleting === area.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
