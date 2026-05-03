'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/utils/supabase/client'
import type { AgentRecord } from './AgentForm'

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false })

export interface ListingRecord {
  id: string
  name: string
  price: string
  location: string
  beds: string
  badge: string
  developer: string
  description: string
  images: string[]
  amenities: string[]
  brochure_url: string | null
  latitude: number | null
  longitude: number | null
  status: 'draft' | 'published'
  category: 'premium' | 'offplan'
  agent_id: string | null
  size_range: string | null
  payment_plan: string | null
  highlights: string[]
  floor_plans: string[]
  created_at: string
  updated_at: string
}

const AMENITY_OPTIONS = [
  'Swimming Pool', 'Infinity Pool', 'Gym & Fitness', 'Covered Parking', 'Valet Parking',
  '24/7 Security', 'Concierge', 'Kids Play Area', 'BBQ Area', 'Sauna & Steam',
  'Spa', 'Yoga Studio', 'Tennis Court', 'Basketball Court', 'Running Track',
  'Rooftop Terrace', 'Smart Home', 'EV Charging', 'Retail Outlets',
  'Business Centre', 'Cinema Room', 'Private Beach', 'Pet-Friendly', 'Co-Working Space',
]

interface Props {
  onSave: (listing: ListingRecord) => void
  onCancel: () => void
  initial?: ListingRecord
}

export default function PropertyListingForm({ onSave, onCancel, initial }: Props) {
  const [name, setName]             = useState(initial?.name ?? '')
  const [price, setPrice]           = useState(initial?.price ?? '')
  const [location, setLocation]     = useState(initial?.location ?? '')
  const [beds, setBeds]             = useState(initial?.beds ?? '')
  const [badge, setBadge]           = useState(initial?.badge ?? '')
  const [developer, setDeveloper]   = useState(initial?.developer ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory]     = useState<'premium' | 'offplan'>(initial?.category ?? 'offplan')
  const [amenities, setAmenities]   = useState<string[]>(initial?.amenities ?? [])
  const [latitude, setLatitude]     = useState(initial?.latitude?.toString() ?? '')
  const [longitude, setLongitude]   = useState(initial?.longitude?.toString() ?? '')
  const [images, setImages]         = useState<string[]>(initial?.images ?? [])
  const [brochureFile, setBrochureFile] = useState<File | null>(null)
  const [brochureUrl, setBrochureUrl] = useState<string | null>(initial?.brochure_url ?? null)
  const brochureInputRef            = useRef<HTMLInputElement>(null)
  const [uploading, setUploading]   = useState(false)
  const [saving, setSaving]         = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef                = useRef<HTMLInputElement>(null)
  const floorPlanInputRef           = useRef<HTMLInputElement>(null)

  // New fields
  const [agentId, setAgentId]           = useState<string>(initial?.agent_id ?? '')
  const [sizeRange, setSizeRange]       = useState(initial?.size_range ?? '')
  const [paymentPlan, setPaymentPlan]   = useState(initial?.payment_plan ?? '')
  const [highlights, setHighlights]     = useState<string[]>(initial?.highlights ?? [])
  const [newHighlight, setNewHighlight] = useState('')
  const [floorPlans, setFloorPlans]     = useState<string[]>(initial?.floor_plans ?? [])
  const [agents, setAgents]             = useState<AgentRecord[]>([])

  useEffect(() => {
    createClient().from('agents').select('id,name,title,photo_url').eq('is_active', true).order('name').then(({ data }) => {
      setAgents((data ?? []) as AgentRecord[])
    })
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = 6 - images.length
    const toUpload = files.slice(0, remaining)

    setUploading(true)
    setUploadError('')

    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of toUpload) {
      const ext = file.name.split('.').pop()
      const path = `listings/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(path, file, { upsert: false })

      if (error) {
        setUploadError(`Upload failed: ${error.message}`)
        setUploading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(data.path)

      uploaded.push(urlData.publicUrl)
    }

    setImages(prev => [...prev, ...uploaded])
    setUploading(false)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = async (idx: number) => {
    const url = images[idx]
    // Extract storage path from public URL and delete from bucket
    const supabase = createClient()
    const pathMatch = url.match(/property-images\/(.+)$/)
    if (pathMatch) {
      await supabase.storage.from('property-images').remove([pathMatch[1]])
    }
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBrochureFile(file)
  }

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const remaining = 8 - floorPlans.length
    const toUpload = files.slice(0, remaining)
    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []
    for (const file of toUpload) {
      const ext = file.name.split('.').pop()
      const path = `floorplans/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('property-images').upload(path, file, { upsert: false })
      if (error) { setUploadError(`Upload failed: ${error.message}`); setUploading(false); return }
      const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path)
      uploaded.push(urlData.publicUrl)
    }
    setFloorPlans(prev => [...prev, ...uploaded])
    setUploading(false)
    if (floorPlanInputRef.current) floorPlanInputRef.current.value = ''
  }

  const removeFloorPlan = async (idx: number) => {
    const url = floorPlans[idx]
    const supabase = createClient()
    const pathMatch = url.match(/property-images\/(.+)$/)
    if (pathMatch) await supabase.storage.from('property-images').remove([pathMatch[1]])
    setFloorPlans(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!name.trim()) return
    setSaving(true)

    const supabase = createClient()

    // Upload brochure PDF if a new file was selected
    let finalBrochureUrl = brochureUrl
    if (brochureFile) {
      const ext = brochureFile.name.split('.').pop()
      const path = `brochures/${Date.now()}_${name.replace(/\s+/g, '-')}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(path, brochureFile, { upsert: true })
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(uploadData.path)
        finalBrochureUrl = urlData.publicUrl
      }
    }

    const payload = {
      name, price, location, beds, badge, developer, description,
      images, status, category, amenities,
      brochure_url: finalBrochureUrl,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      agent_id: agentId || null,
      size_range: sizeRange.trim() || null,
      payment_plan: paymentPlan.trim() || null,
      highlights,
      floor_plans: floorPlans,
    }

    let result
    if (initial) {
      result = await supabase
        .from('listings')
        .update(payload)
        .eq('id', initial.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('listings')
        .insert(payload)
        .select()
        .single()
    }

    setSaving(false)

    if (result.error) {
      setUploadError(`Save failed: ${result.error.message}`)
      return
    }

    onSave(result.data as ListingRecord)
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-card-hover)',
      padding: '32px',
      maxWidth: 760,
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 28, fontFamily: 'var(--font)' }}>
        {initial ? 'Edit Listing' : 'New Property Listing'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Field label="Property Name *" span={2}>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Binghatti Hills" style={fieldStyle} required />
        </Field>

        <Field label="Starting Price">
          <input value={price} onChange={e => setPrice(e.target.value)}
            placeholder="e.g. AED 1.10M" style={fieldStyle} />
        </Field>

        <Field label="Location">
          <input value={location} onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Dubai Hills" style={fieldStyle} />
        </Field>

        <Field label="Bed Types">
          <input value={beds} onChange={e => setBeds(e.target.value)}
            placeholder="e.g. 1, 2, 3 BR" style={fieldStyle} />
        </Field>

        <Field label="Badge Text">
          <input value={badge} onChange={e => setBadge(e.target.value)}
            placeholder="e.g. Handover: Q4 2027" style={fieldStyle} />
        </Field>

        <Field label="Developer Name">
          <input value={developer} onChange={e => setDeveloper(e.target.value)}
            placeholder="e.g. Binghatti Properties" style={fieldStyle} />
        </Field>

        <Field label="Section">
          <select value={category} onChange={e => setCategory(e.target.value as 'premium' | 'offplan')}
            style={fieldStyle}>
            <option value="offplan">Latest Offplan Launches</option>
            <option value="premium">Premium Luxury Developments</option>
          </select>
        </Field>

        <Field label="Size Range">
          <input value={sizeRange} onChange={e => setSizeRange(e.target.value)}
            placeholder="e.g. 650 – 2,400 sq ft" style={fieldStyle} />
        </Field>

        <Field label="Assigned Agent">
          <select value={agentId} onChange={e => setAgentId(e.target.value)} style={fieldStyle}>
            <option value="">— No agent assigned —</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name}{a.title ? ` — ${a.title}` : ''}</option>
            ))}
          </select>
        </Field>

        <Field label="Description" span={2}>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Property description…" rows={4}
            style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }} />
        </Field>

        <Field label="Payment Plan" span={2}>
          <textarea value={paymentPlan} onChange={e => setPaymentPlan(e.target.value)}
            placeholder="e.g. 20% down, 60% during construction, 20% on handover" rows={3}
            style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }} />
        </Field>

        {/* Highlights */}
        <Field label="Key Highlights" span={2}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={newHighlight} onChange={e => setNewHighlight(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newHighlight.trim()) {
                  e.preventDefault()
                  setHighlights(prev => [...prev, newHighlight.trim()])
                  setNewHighlight('')
                }
              }}
              placeholder="Type a highlight and press Enter" style={{ ...fieldStyle, flex: 1 }} />
            <button type="button" onClick={() => {
              if (newHighlight.trim()) {
                setHighlights(prev => [...prev, newHighlight.trim()])
                setNewHighlight('')
              }
            }} style={{
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--heading)', background: 'var(--white-section)',
              border: '1px solid var(--border)', borderRadius: 6, padding: '10px 16px', cursor: 'pointer',
            }}>Add</button>
          </div>
          {highlights.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {highlights.map((h, i) => (
                <span key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#EEF1FB', color: '#1B3079',
                  fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'var(--font)',
                  padding: '5px 10px', borderRadius: 20,
                }}>
                  {h}
                  <button type="button" onClick={() => setHighlights(prev => prev.filter((_, j) => j !== i))} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: '#1B3079',
                    fontSize: 11, fontWeight: 700, padding: 0, lineHeight: 1,
                  }}>✕</button>
                </span>
              ))}
            </div>
          )}
        </Field>

        {/* Amenities */}
        <Field label="Amenities" span={2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AMENITY_OPTIONS.map(a => {
              const selected = amenities.includes(a)
              return (
                <button key={a} type="button" onClick={() =>
                  setAmenities(prev => selected ? prev.filter(x => x !== a) : [...prev, a])
                } style={{
                  fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500,
                  padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
                  background: selected ? '#1B3079' : 'var(--white-section)',
                  color: selected ? '#fff' : 'var(--body)',
                  border: selected ? '1px solid #1B3079' : '1px solid var(--border)',
                  transition: 'all 0.15s',
                }}>
                  {a}
                </button>
              )
            })}
          </div>
        </Field>

        {/* Location picker */}
        <Field label="Pin Location on Map" span={2}>
          <LocationPickerMap
            lat={latitude}
            lng={longitude}
            onChange={(lat, lng) => { setLatitude(lat); setLongitude(lng) }}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 4, fontFamily: 'var(--font)' }}>
                Latitude
              </label>
              <input value={latitude} onChange={e => setLatitude(e.target.value)}
                placeholder="e.g. 25.1124" style={fieldStyle} type="number" step="any" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 4, fontFamily: 'var(--font)' }}>
                Longitude
              </label>
              <input value={longitude} onChange={e => setLongitude(e.target.value)}
                placeholder="e.g. 55.2394" style={fieldStyle} type="number" step="any" />
            </div>
          </div>
        </Field>

        {/* Brochure PDF */}
        <Field label="Property Brochure (PDF)" span={2}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => brochureInputRef.current?.click()} style={{
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--heading)', background: 'var(--white-section)',
              border: '1px solid var(--border)', borderRadius: 6,
              padding: '9px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              📄 {brochureFile ? brochureFile.name : 'Upload PDF'}
            </button>
            {(brochureUrl || brochureFile) && !brochureFile && (
              <a href={brochureUrl!} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', color: '#1B3079', fontFamily: 'var(--font)' }}>
                View current brochure ↗
              </a>
            )}
            {brochureFile && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
                Will upload on save
              </span>
            )}
          </div>
          <input ref={brochureInputRef} type="file" accept=".pdf"
            style={{ display: 'none' }} onChange={handleBrochureUpload} />
        </Field>

        <Field label={`Images (${images.length}/6)`} span={2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            {images.map((src, i) => (
              <div key={i} style={{ position: 'relative', width: 90, height: 68 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Image ${i + 1}`} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  borderRadius: 6, border: '1px solid var(--border)',
                }} />
                <button type="button" onClick={() => removeImage(i)} style={{
                  position: 'absolute', top: -7, right: -7,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#E8352B', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, lineHeight: '20px', textAlign: 'center',
                  fontFamily: 'var(--font)',
                }}>✕</button>
              </div>
            ))}
            {images.length < 6 && (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: 90, height: 68,
                  border: '2px dashed var(--border)',
                  borderRadius: 6, background: 'var(--white-section)',
                  cursor: uploading ? 'wait' : 'pointer',
                  color: 'var(--muted)', fontSize: '1.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#1B3079')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {uploading ? '…' : '+'}
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple
            style={{ display: 'none' }} onChange={handleImageUpload} />
          {uploading && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
              Uploading…
            </p>
          )}
          {uploadError && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--red)', fontFamily: 'var(--font)' }}>
              {uploadError}
            </p>
          )}
        </Field>

        {/* Floor Plans */}
        <Field label={`Floor Plans (${floorPlans.length}/8)`} span={2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            {floorPlans.map((src, i) => (
              <div key={i} style={{ position: 'relative', width: 90, height: 68 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Floor plan ${i + 1}`} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  borderRadius: 6, border: '1px solid var(--border)',
                }} />
                <button type="button" onClick={() => removeFloorPlan(i)} style={{
                  position: 'absolute', top: -7, right: -7,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#E8352B', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, lineHeight: '20px', textAlign: 'center',
                  fontFamily: 'var(--font)',
                }}>✕</button>
              </div>
            ))}
            {floorPlans.length < 8 && (
              <button type="button" onClick={() => floorPlanInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: 90, height: 68,
                  border: '2px dashed var(--border)',
                  borderRadius: 6, background: 'var(--white-section)',
                  cursor: uploading ? 'wait' : 'pointer',
                  color: 'var(--muted)', fontSize: '1.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {uploading ? '…' : '+'}
              </button>
            )}
          </div>
          <input ref={floorPlanInputRef} type="file" accept="image/*" multiple
            style={{ display: 'none' }} onChange={handleFloorPlanUpload} />
        </Field>
      </div>

      <div style={{
        display: 'flex', gap: 12, justifyContent: 'flex-end',
        marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}>
        <button type="button" onClick={onCancel} style={{
          fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 500,
          color: 'var(--body)', background: 'transparent',
          border: '1px solid var(--border)', borderRadius: 6,
          padding: '10px 20px', cursor: 'pointer',
        }}>
          Cancel
        </button>
        <button type="button" disabled={saving || !name.trim()} onClick={() => handleSave('draft')} style={{
          fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--heading)', background: 'var(--white-section)',
          border: '1px solid var(--border)', borderRadius: 6,
          padding: '10px 20px', cursor: saving || !name.trim() ? 'not-allowed' : 'pointer',
          opacity: saving || !name.trim() ? 0.6 : 1,
        }}>
          Save as Draft
        </button>
        <button type="button" disabled={saving || !name.trim()} onClick={() => handleSave('published')} style={{
          fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
          color: '#fff', background: '#1B3079',
          border: '1px solid #1B3079', borderRadius: 6,
          padding: '10px 20px', cursor: saving || !name.trim() ? 'not-allowed' : 'pointer',
          opacity: saving || !name.trim() ? 0.6 : 1,
        }}>
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ gridColumn: span === 2 ? '1 / -1' : undefined }}>
      <label style={{
        display: 'block', fontSize: '0.8125rem', fontWeight: 600,
        color: 'var(--body)', marginBottom: 6, fontFamily: 'var(--font)',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font)',
  fontSize: '0.9375rem',
  color: 'var(--heading)',
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '10px 12px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}
