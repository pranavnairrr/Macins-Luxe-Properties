'use client'

import { useEffect, useState } from 'react'
import { Download, Search, Inbox } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type Lead = {
  id: string
  created_at: string
  name: string | null
  email: string | null
  phone: string | null
  source: string | null
  listing_name: string | null
  property_type: string | null
  message: string | null
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtSource(source: string | null) {
  if (source === 'brochure_download') return 'Brochure'
  if (source === 'enquiry') return 'Enquiry'
  return source ?? '—'
}

export default function LeadsView() {
  const [leads, setLeads]     = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]     = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setLeads((data ?? []) as Lead[])
        setLoading(false)
      })
  }, [])

  const filtered = leads.filter(l => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.listing_name?.toLowerCase().includes(q)
    )
  })

  const exportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Source', 'Property', 'Type / Message']
    const rows = filtered.map(l => [
      fmtDate(l.created_at),
      l.name ?? '',
      l.email ?? '',
      l.phone ?? '',
      fmtSource(l.source),
      l.listing_name ?? '',
      l.property_type ?? l.message ?? '',
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ fontFamily: 'var(--font)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4 }}>
            Leads &amp; Enquiries
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            {loading ? 'Loading…' : `${leads.length} total lead${leads.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} strokeWidth={1.6} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search name, email, property…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                fontFamily: 'var(--font)', fontSize: '0.875rem',
                color: 'var(--heading)', background: '#fff',
                border: '1px solid var(--border)', borderRadius: 8,
                padding: '9px 12px 9px 32px',
                outline: 'none', width: 240,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#333')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
              color: filtered.length === 0 ? 'var(--muted)' : 'var(--heading)',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 8, padding: '9px 16px',
              cursor: filtered.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <Download size={14} strokeWidth={1.6} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: 'var(--muted)', padding: '32px 0', fontSize: '0.9375rem' }}>Loading leads…</div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
          padding: '64px 48px', textAlign: 'center', boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--muted)' }}>
            <Inbox size={40} strokeWidth={1.2} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>
            {query ? 'No leads match your search.' : 'No leads yet. They\'ll appear here when visitors enquire or download brochures.'}
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--white-section)', borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Name', 'Email', 'Phone', 'Source', 'Property', 'Type / Note'].map(h => (
                    <th key={h} style={{
                      padding: '11px 16px', textAlign: 'left',
                      fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={l.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={tdStyle}>{fmtDate(l.created_at)}</td>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--heading)' }}>{l.name || '—'}</td>
                    <td style={tdStyle}>{l.email || '—'}</td>
                    <td style={tdStyle}>{l.phone || '—'}</td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600,
                        padding: '3px 8px', borderRadius: 4,
                        background: l.source === 'brochure_download' ? '#f0f0f0' : '#f5f5f5',
                        color: l.source === 'brochure_download' ? '#333' : '#666',
                      }}>
                        {fmtSource(l.source)}
                      </span>
                    </td>
                    <td style={tdStyle}>{l.listing_name || '—'}</td>
                    <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.property_type || l.message || '—'}
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

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontFamily: 'var(--font)',
  fontSize: '0.875rem',
  color: 'var(--body)',
  whiteSpace: 'nowrap',
}
