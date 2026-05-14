'use client'

import { useEffect, useState, useRef } from 'react'
import { PlusCircle, Edit2, Trash2, BarChart2, Search, Upload } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { slugify } from '@/lib/slugify'

type Report = {
  id: string
  slug: string
  title: string
  year: number
  quarter: string | null
  category: string
  description: string
  image: string
  pdf_url: string
  featured: boolean
  highlights: string[]
  created_at: string
}

type Mode = 'list' | 'form'

const CATEGORIES = ['Annual Report', 'Quarterly Report', 'Area Report', 'Market Snapshot']

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontFamily: 'var(--font)',
  fontSize: '0.875rem',
  color: 'var(--body)',
}

function ReportForm({ initial, onSave, onCancel }: {
  initial?: Report
  onSave: (report: Report) => void
  onCancel: () => void
}) {
  const supabase = createClient()
  const [slug, setSlug]           = useState(initial?.slug ?? '')
  const [title, setTitle]         = useState(initial?.title ?? '')
  const [year, setYear]           = useState(initial?.year?.toString() ?? new Date().getFullYear().toString())
  const [quarter, setQuarter]     = useState(initial?.quarter ?? '')
  const [category, setCategory]   = useState(initial?.category ?? 'Market Snapshot')
  const [description, setDesc]    = useState(initial?.description ?? '')
  const [image, setImage]         = useState(initial?.image ?? '')
  const [pdfUrl, setPdfUrl]       = useState(initial?.pdf_url ?? '#')
  const [featured, setFeatured]   = useState(initial?.featured ?? false)
  const [highlights, setHighlights] = useState((initial?.highlights ?? []).join('\n'))
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState<'image' | 'pdf' | null>(null)
  const [error, setError]         = useState('')
  const imgRef = useRef<HTMLInputElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initial) setSlug(slugify(v))
  }

  async function uploadFile(file: File, type: 'image' | 'pdf') {
    setUploading(type)
    const ext = file.name.split('.').pop()
    const bucket = type === 'pdf' ? 'brochures' : 'images'
    const path = `reports/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploading(null); return }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    if (type === 'image') setImage(data.publicUrl)
    else setPdfUrl(data.publicUrl)
    setUploading(null)
  }

  async function handleSave() {
    if (!slug || !title || !image) { setError('Slug, title and image are required.'); return }
    setSaving(true); setError('')
    const payload = {
      slug, title, year: parseInt(year) || new Date().getFullYear(),
      quarter: quarter || null, category, description, image,
      pdf_url: pdfUrl, featured,
      highlights: highlights.split('\n').map(h => h.trim()).filter(Boolean),
    }
    let result
    if (initial) {
      result = await supabase.from('reports').update(payload).eq('id', initial.id).select().single()
    } else {
      result = await supabase.from('reports').insert(payload).select().single()
    }
    setSaving(false)
    if (result.error) { setError(result.error.message); return }
    onSave(result.data as Report)
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
          {initial ? 'Edit Report' : 'New Report'}
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ ...field, width: 'auto', padding: '9px 20px', cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={handleSave} disabled={saving || uploading !== null}
            style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, padding: '9px 24px', borderRadius: 8, border: 'none', background: saving ? 'var(--muted)' : 'var(--navy)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : 'Save Report'}
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
          <label style={label}>Title *</label>
          <input style={field} value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Dubai Market Annual Report 2025" />
        </div>
        <div>
          <label style={label}>Slug *</label>
          <input style={field} value={slug} onChange={e => setSlug(e.target.value)} placeholder="dubai-market-annual-2025" />
        </div>
        <div>
          <label style={label}>Category</label>
          <select style={field} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Year</label>
          <input style={field} value={year} onChange={e => setYear(e.target.value)} placeholder="2025" />
        </div>
        <div>
          <label style={label}>Quarter (optional)</label>
          <input style={field} value={quarter} onChange={e => setQuarter(e.target.value)} placeholder="Q1 2026" />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)' }}>Featured</span>
          </label>
        </div>
      </div>

      {/* Cover Image */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Cover Image *</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <input style={{ ...field, flex: 1 }} value={image} onChange={e => setImage(e.target.value)} placeholder="Supabase Storage URL or paste URL" />
          <button
            onClick={() => imgRef.current?.click()} disabled={uploading !== null}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
          >
            <Upload size={14} strokeWidth={1.6} /> {uploading === 'image' ? 'Uploading…' : 'Upload'}
          </button>
          <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'image')} />
        </div>
        {image && <img src={image} alt="preview" style={{ marginTop: 10, height: 80, width: 130, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />}
      </div>

      {/* PDF */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>PDF URL</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <input style={{ ...field, flex: 1 }} value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="# or Supabase Storage URL" />
          <button
            onClick={() => pdfRef.current?.click()} disabled={uploading !== null}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
          >
            <Upload size={14} strokeWidth={1.6} /> {uploading === 'pdf' ? 'Uploading…' : 'Upload PDF'}
          </button>
          <input ref={pdfRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'pdf')} />
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Description</label>
        <textarea rows={3} style={{ ...field, resize: 'vertical' }} value={description} onChange={e => setDesc(e.target.value)} placeholder="Summary of this report…" />
      </div>

      {/* Highlights */}
      <div>
        <label style={label}>Highlights (one per line)</label>
        <textarea rows={4} style={{ ...field, resize: 'vertical' }} value={highlights} onChange={e => setHighlights(e.target.value)} placeholder={'AED 390B total transactions\n128,000+ residential deals'} />
      </div>
    </div>
  )
}

export default function ReportsTab() {
  const supabase = createClient()
  const [reports, setReports]   = useState<Report[]>([])
  const [loading, setLoading]   = useState(true)
  const [mode, setMode]         = useState<Mode>('list')
  const [editing, setEditing]   = useState<Report | undefined>()
  const [query, setQuery]       = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('reports')
      .select('*')
      .order('year', { ascending: false })
      .then(({ data }) => {
        setReports((data ?? []) as Report[])
        setLoading(false)
      })
  }, [])

  const filtered = reports.filter(r => !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase()))

  async function handleDelete(id: string) {
    if (!confirm('Delete this report?')) return
    setDeleting(id)
    await supabase.from('reports').delete().eq('id', id)
    setReports(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  function handleSaved(report: Report) {
    setReports(prev => {
      const exists = prev.find(r => r.id === report.id)
      return exists ? prev.map(r => r.id === report.id ? report : r) : [report, ...prev]
    })
    setMode('list')
    setEditing(undefined)
  }

  if (mode === 'form') {
    return (
      <ReportForm
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
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>Market Reports</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            {loading ? 'Loading…' : `${reports.length} report${reports.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} strokeWidth={1.6} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search reports…" value={query}
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
            <PlusCircle size={15} strokeWidth={1.8} /> New Report
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)', padding: '32px 0' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '64px 48px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--muted)' }}>
            <BarChart2 size={40} strokeWidth={1.2} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>
            {query ? 'No reports match your search.' : 'No reports yet. Click "New Report" to add one.'}
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--white-section)', borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Category', 'Year', 'Featured', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((report, i) => (
                  <tr key={report.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--heading)', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {report.title}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: 'var(--white-section)', color: 'var(--heading)' }}>
                        {report.category}
                      </span>
                    </td>
                    <td style={tdStyle}>{report.year}{report.quarter ? ` · ${report.quarter}` : ''}</td>
                    <td style={tdStyle}>
                      {report.featured ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#f0fdf4', color: '#15803d' }}>Featured</span>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setEditing(report); setMode('form') }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--heading)' }}
                        >
                          <Edit2 size={12} strokeWidth={1.8} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          disabled={deleting === report.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff8f8', cursor: 'pointer', color: '#dc2626' }}
                        >
                          <Trash2 size={12} strokeWidth={1.8} /> {deleting === report.id ? '…' : 'Delete'}
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
