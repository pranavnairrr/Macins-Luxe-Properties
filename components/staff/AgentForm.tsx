'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface AgentRecord {
  id: string
  name: string
  title: string | null
  photo_url: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  bio: string | null
  is_active: boolean
  is_default: boolean
  created_at: string
}

interface Props {
  onSave: (agent: AgentRecord) => void
  onCancel: () => void
  initial?: AgentRecord
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

export default function AgentForm({ onSave, onCancel, initial }: Props) {
  const [name, setName]         = useState(initial?.name ?? '')
  const [title, setTitle]       = useState(initial?.title ?? '')
  const [phone, setPhone]       = useState(initial?.phone ?? '')
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? '')
  const [email, setEmail]       = useState(initial?.email ?? '')
  const [bio, setBio]           = useState(initial?.bio ?? '')
  const [photoUrl, setPhotoUrl] = useState(initial?.photo_url ?? '')
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `agents/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error: uploadErr } = await supabase.storage
      .from('property-images')
      .upload(path, file, { upsert: false })

    if (uploadErr) { setError(`Upload failed: ${uploadErr.message}`); setUploading(false); return }

    const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path)
    setPhotoUrl(urlData.publicUrl)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload = {
      name: name.trim(),
      title: title.trim() || null,
      photo_url: photoUrl || null,
      phone: phone.trim() || null,
      whatsapp: whatsapp.trim() || null,
      email: email.trim() || null,
      bio: bio.trim() || null,
      is_active: true,
    }

    let result
    if (initial) {
      result = await supabase.from('agents').update(payload).eq('id', initial.id).select().single()
    } else {
      result = await supabase.from('agents').insert(payload).select().single()
    }

    setSaving(false)
    if (result.error) { setError(`Save failed: ${result.error.message}`); return }
    onSave(result.data as AgentRecord)
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-card-hover)', padding: '32px', maxWidth: 640,
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 28, fontFamily: 'var(--font)' }}>
        {initial ? 'Edit Agent' : 'Add New Agent'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Photo */}
        <Field label="Profile Photo" span={2}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={photoUrl} alt="Agent" style={{
                width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid var(--border)',
              }} />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--white-section)', border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', color: 'var(--muted)',
              }}>👤</div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--heading)', background: 'var(--white-section)',
              border: '1px solid var(--border)', borderRadius: 6,
              padding: '9px 16px', cursor: uploading ? 'wait' : 'pointer',
            }}>
              {uploading ? 'Uploading…' : photoUrl ? 'Change Photo' : 'Upload Photo'}
            </button>
            {photoUrl && (
              <button type="button" onClick={() => setPhotoUrl('')} style={{
                fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'var(--muted)',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              }}>Remove</button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
        </Field>

        <Field label="Full Name *">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kavya Jogi" style={fieldStyle} />
        </Field>

        <Field label="Title / Role">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Property Consultant" style={fieldStyle} />
        </Field>

        <Field label="Phone">
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +971 50 175 6677" style={fieldStyle} />
        </Field>

        <Field label="WhatsApp">
          <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="e.g. +971 50 175 6677" style={fieldStyle} />
        </Field>

        <Field label="Email" span={2}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. agent@macins.ae" style={fieldStyle} type="email" />
        </Field>

        <Field label="Short Bio" span={2}>
          <textarea value={bio} onChange={e => setBio(e.target.value)}
            placeholder="Brief introduction for the property PDF…" rows={3}
            style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }} />
        </Field>
      </div>

      {error && (
        <p style={{ marginTop: 12, fontSize: '0.8125rem', color: 'var(--red)', fontFamily: 'var(--font)' }}>{error}</p>
      )}

      <div style={{
        display: 'flex', gap: 12, justifyContent: 'flex-end',
        marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)',
      }}>
        <button type="button" onClick={onCancel} style={{
          fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 500,
          color: 'var(--body)', background: 'transparent',
          border: '1px solid var(--border)', borderRadius: 6, padding: '10px 20px', cursor: 'pointer',
        }}>Cancel</button>
        <button type="button" disabled={saving || !name.trim()} onClick={handleSave} style={{
          fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
          color: '#fff', background: '#111',
          border: '1px solid #111', borderRadius: 6, padding: '10px 20px',
          cursor: saving || !name.trim() ? 'not-allowed' : 'pointer',
          opacity: saving || !name.trim() ? 0.6 : 1,
        }}>
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Agent'}
        </button>
      </div>
    </div>
  )
}
