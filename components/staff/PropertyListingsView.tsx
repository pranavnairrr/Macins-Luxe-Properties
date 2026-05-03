'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import PropertyListingForm, { type ListingRecord } from './PropertyListingForm'

type Filter = 'all' | 'published' | 'draft'

export default function PropertyListingsView() {
  const [listings, setListings]   = useState<ListingRecord[]>([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editing, setEditing]     = useState<ListingRecord | undefined>()
  const [filter, setFilter]       = useState<Filter>('all')

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
    setListings((data as ListingRecord[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchListings() }, [fetchListings])

  const handleSave = (listing: ListingRecord) => {
    setListings(prev => {
      const idx = prev.findIndex(l => l.id === listing.id)
      return idx >= 0
        ? prev.map((l, i) => (i === idx ? listing : l))
        : [listing, ...prev]
    })
    setShowForm(false)
    setEditing(undefined)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    const supabase = createClient()
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  const handleToggleStatus = async (listing: ListingRecord) => {
    const newStatus = listing.status === 'published' ? 'draft' : 'published'
    const supabase = createClient()
    const { data } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', listing.id)
      .select()
      .single()
    if (data) {
      setListings(prev => prev.map(l => l.id === listing.id ? (data as ListingRecord) : l))
    }
  }

  if (showForm) {
    return (
      <PropertyListingForm
        initial={editing}
        onSave={handleSave}
        onCancel={() => { setShowForm(false); setEditing(undefined) }}
      />
    )
  }

  const filtered = listings.filter(l => filter === 'all' || l.status === filter)
  const publishedCount = listings.filter(l => l.status === 'published').length
  const draftCount     = listings.filter(l => l.status === 'draft').length

  return (
    <div>
      {/* Header row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24, gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4, fontFamily: 'var(--font)' }}>
            Property Listings
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
            {listings.length} total · {publishedCount} published · {draftCount} drafts
          </p>
        </div>
        <button
          onClick={() => { setEditing(undefined); setShowForm(true) }}
          style={{
            fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
            color: '#fff', background: '#1B3079',
            border: 'none', borderRadius: 8,
            padding: '10px 20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap',
          }}
        >
          + New Listing
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'var(--white-section)',
        border: '1px solid var(--border)',
        borderRadius: 8, padding: 4,
        width: 'fit-content', marginBottom: 24,
      }}>
        {(['all', 'published', 'draft'] as Filter[]).map(f => {
          const count = f === 'all' ? listings.length : f === 'published' ? publishedCount : draftCount
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600,
              color: filter === f ? '#fff' : 'var(--muted)',
              background: filter === f ? '#1B3079' : 'transparent',
              border: 'none', borderRadius: 6,
              padding: '6px 14px', cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'background 0.2s, color 0.2s',
            }}>
              {f} ({count})
            </button>
          )
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
          Loading listings…
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 12, padding: '56px 48px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏠</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 6, fontFamily: 'var(--font)' }}>
            No listings yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
            Click &quot;New Listing&quot; to add your first property.
          </p>
        </div>
      )}

      {/* Listings grid */}
      {!loading && filtered.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onEdit={() => { setEditing(listing); setShowForm(true) }}
              onDelete={() => handleDelete(listing.id)}
              onToggleStatus={() => handleToggleStatus(listing)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ListingCard({
  listing, onEdit, onDelete, onToggleStatus,
}: {
  listing: ListingRecord
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
}) {
  const isPublished = listing.status === 'published'

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)')}
    >
      {/* Thumbnail */}
      <div style={{ aspectRatio: '16/9', background: 'var(--white-section)', position: 'relative', overflow: 'hidden' }}>
        {listing.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.images[0]} alt={listing.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)', fontSize: '2.5rem',
          }}>🏠</div>
        )}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: isPublished ? 'rgba(22,163,74,0.90)' : 'rgba(0,0,0,0.55)',
          color: '#fff', fontSize: '0.6875rem', fontWeight: 700,
          padding: '3px 8px', borderRadius: 4,
          letterSpacing: '0.04em', textTransform: 'uppercase',
          backdropFilter: 'blur(4px)', fontFamily: 'var(--font)',
        }}>
          {isPublished ? 'Published' : 'Draft'}
        </span>
        {listing.images.length > 1 && (
          <span style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff', fontSize: '0.6875rem', fontWeight: 600,
            padding: '2px 7px', borderRadius: 4,
            backdropFilter: 'blur(4px)', fontFamily: 'var(--font)',
          }}>
            +{listing.images.length - 1}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 3, fontFamily: 'var(--font)' }}>
          {listing.name || 'Untitled'}
        </h3>
        {listing.developer && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 8, fontFamily: 'var(--font)' }}>
            by {listing.developer}
          </p>
        )}
        <div style={{ display: 'flex', gap: 10, fontSize: '0.8125rem', color: 'var(--muted)', flexWrap: 'wrap', fontFamily: 'var(--font)' }}>
          {listing.price && <span style={{ fontWeight: 600, color: 'var(--body)' }}>{listing.price}</span>}
          {listing.location && <span>· {listing.location}</span>}
          {listing.beds && <span>· {listing.beds}</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
        <ActionBtn onClick={onEdit}         label="Edit"                           color="var(--heading)" />
        <ActionBtn onClick={onToggleStatus} label={isPublished ? 'Unpublish' : 'Publish'} color={isPublished ? '#B45309' : '#15803D'} />
        <ActionBtn onClick={onDelete}       label="Delete"                         color="var(--red)" />
      </div>
    </div>
  )
}

function ActionBtn({ onClick, label, color }: { onClick: () => void; label: string; color: string }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600,
      color, background: 'transparent', border: 'none',
      padding: '10px 0', cursor: 'pointer', transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--white-section)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </button>
  )
}
