'use client'

import { useEffect, useState, useRef } from 'react'
import { PlusCircle, Edit2, Trash2, FileText, Search, Upload } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { slugify } from '@/lib/slugify'

type BlogPost = {
  id: string
  slug: string
  title: string
  category: string
  published_date: string
  read_time: string
  excerpt: string
  image: string
  featured: boolean
  body: string
  tags: string[]
  author: string
  created_at: string
}

type Mode = 'list' | 'form'

const CATEGORIES = ['Market Reports', 'Investment', 'Guides', 'Lifestyle', 'Legal']

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontFamily: 'var(--font)',
  fontSize: '0.875rem',
  color: 'var(--body)',
}

function BlogForm({ initial, onSave, onCancel }: {
  initial?: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void
}) {
  const supabase = createClient()
  const [slug, setSlug]         = useState(initial?.slug ?? '')
  const [title, setTitle]       = useState(initial?.title ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'Investment')
  const [date, setDate]         = useState(initial?.published_date ?? '')
  const [readTime, setReadTime] = useState(initial?.read_time ?? '')
  const [excerpt, setExcerpt]   = useState(initial?.excerpt ?? '')
  const [image, setImage]       = useState(initial?.image ?? '')
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [body, setBody]         = useState(initial?.body ?? '')
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '))
  const [author, setAuthor]     = useState(initial?.author ?? 'Macins Luxe Advisory')
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const imgRef = useRef<HTMLInputElement>(null)

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initial) setSlug(slugify(v))
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `blog/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    setImage(data.publicUrl)
    setUploading(false)
  }

  async function handleSave() {
    if (!slug || !title || !image) { setError('Slug, title and image are required.'); return }
    setSaving(true); setError('')
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { slug, title, category, published_date: date, read_time: readTime, excerpt, image, featured, body, tags, author }
    let result
    if (initial) {
      result = await supabase.from('blog_posts').update(payload).eq('id', initial.id).select().single()
    } else {
      result = await supabase.from('blog_posts').insert(payload).select().single()
    }
    setSaving(false)
    if (result.error) { setError(result.error.message); return }
    onSave(result.data as BlogPost)
  }

  const field: React.CSSProperties = {
    fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)',
    background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
    padding: '10px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 780, fontFamily: 'var(--font)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)' }}>
          {initial ? 'Edit Blog Post' : 'New Blog Post'}
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ ...field, width: 'auto', padding: '9px 20px', cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={handleSave} disabled={saving || uploading}
            style={{
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              padding: '9px 24px', borderRadius: 8, border: 'none',
              background: saving ? 'var(--muted)' : 'var(--navy)', color: '#fff',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : 'Save Post'}
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
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Title *</label>
          <input style={field} value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Slug *</label>
          <input style={field} value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-friendly-slug" />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Category</label>
          <select style={field} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Author</label>
          <input style={field} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Macins Luxe Advisory" />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Published Date</label>
          <input style={field} value={date} onChange={e => setDate(e.target.value)} placeholder="April 3, 2026" />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Read Time</label>
          <input style={field} value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="8 min read" />
        </div>
      </div>

      {/* Image */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Cover Image *</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <input style={{ ...field, flex: 1 }} value={image} onChange={e => setImage(e.target.value)} placeholder="Supabase Storage URL or paste URL" />
          <button
            onClick={() => imgRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)',
              background: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <Upload size={14} strokeWidth={1.6} />
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
        </div>
        {image && (
          <img src={image} alt="preview" style={{ marginTop: 10, height: 100, width: 160, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
        )}
      </div>

      {/* Excerpt */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Excerpt</label>
        <textarea rows={2} style={{ ...field, resize: 'vertical' }} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary for cards and SEO…" />
      </div>

      {/* Body */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
          Body HTML
        </label>
        <textarea
          rows={14}
          style={{ ...field, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8125rem' }}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder={'<h2>Section heading</h2>\n<p>Content...</p>'}
        />
      </div>

      {/* Tags + Featured */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Tags (comma-separated)</label>
          <input style={field} value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Investment, Dubai, 2026" />
        </div>
        <div style={{ paddingTop: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)' }}>Featured</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default function BlogsTab() {
  const supabase = createClient()
  const [posts, setPosts]   = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode]     = useState<Mode>('list')
  const [editing, setEditing] = useState<BlogPost | undefined>()
  const [query, setQuery]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data ?? []) as BlogPost[])
        setLoading(false)
      })
  }, [])

  const filtered = posts.filter(p => !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    setDeleting(id)
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  function handleSaved(post: BlogPost) {
    setPosts(prev => {
      const exists = prev.find(p => p.id === post.id)
      return exists ? prev.map(p => p.id === post.id ? post : p) : [post, ...prev]
    })
    setMode('list')
    setEditing(undefined)
  }

  if (mode === 'form') {
    return (
      <BlogForm
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
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>Blog Posts</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            {loading ? 'Loading…' : `${posts.length} post${posts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} strokeWidth={1.6} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search posts…" value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ fontFamily: 'var(--font)', fontSize: '0.875rem', color: 'var(--heading)', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px 9px 32px', outline: 'none', width: 220 }}
              onFocus={e => (e.currentTarget.style.borderColor = '#333')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>
          <button
            onClick={() => { setEditing(undefined); setMode('form') }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--navy)', color: '#fff', cursor: 'pointer' }}
          >
            <PlusCircle size={15} strokeWidth={1.8} /> New Post
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)', padding: '32px 0' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '64px 48px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--muted)' }}>
            <FileText size={40} strokeWidth={1.2} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>
            {query ? 'No posts match your search.' : 'No blog posts yet. Click "New Post" to get started.'}
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--white-section)', borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Category', 'Date', 'Featured', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, i) => (
                  <tr key={post.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--heading)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: 'var(--white-section)', color: 'var(--heading)' }}>
                        {post.category}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{post.published_date || '—'}</td>
                    <td style={tdStyle}>
                      {post.featured ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#f0fdf4', color: '#15803d' }}>Featured</span>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setEditing(post); setMode('form') }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--heading)' }}
                        >
                          <Edit2 size={12} strokeWidth={1.8} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff8f8', cursor: 'pointer', color: '#dc2626' }}
                        >
                          <Trash2 size={12} strokeWidth={1.8} /> {deleting === post.id ? '…' : 'Delete'}
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
