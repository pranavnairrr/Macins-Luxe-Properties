'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyListingsView from '@/components/staff/PropertyListingsView'
import AgentsView from '@/components/staff/AgentsView'

function OverviewPanel() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 6, fontFamily: 'var(--font)' }}>
        Welcome back, Admin
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 36, fontFamily: 'var(--font)', fontSize: '0.9375rem' }}>
        Use the sidebar to manage listings, quotations, and PDF exports.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 36,
      }}>
        {[
          { label: 'Property Listings', desc: 'Add, edit, and publish properties', icon: '🏠', tab: 'listings' },
          { label: 'Team & Agents',     desc: 'Manage agents assigned to PDFs',     icon: '👥', tab: 'agents' },
          { label: 'Quotation Tools',   desc: 'Generate client quotations',         icon: '📋', tab: 'quotation', soon: true },
          { label: 'PDF Tools',         desc: 'Export brochures and reports',       icon: '📄', tab: 'pdf',       soon: true },
        ].map(card => (
          <a
            key={card.tab}
            href={`/staff/dashboard?tab=${card.tab}`}
            style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '24px',
              textDecoration: 'none',
              display: 'block',
              boxShadow: 'var(--shadow-card)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            {card.soon && (
              <span style={{
                position: 'absolute', top: 12, right: 12,
                fontSize: '0.6875rem', fontWeight: 700,
                color: 'var(--muted)', background: 'var(--white-section)',
                border: '1px solid var(--border)', borderRadius: 4,
                padding: '2px 6px', fontFamily: 'var(--font)',
              }}>Soon</span>
            )}
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{card.icon}</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 4, fontFamily: 'var(--font)' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
              {card.desc}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function StubPanel({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 12, padding: '64px 48px', textAlign: 'center',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>{icon}</div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 8, fontFamily: 'var(--font)' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--muted)', fontFamily: 'var(--font)', fontSize: '0.9375rem' }}>{description}</p>
      <span style={{
        display: 'inline-block', marginTop: 20,
        fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)',
        background: 'var(--white-section)', border: '1px solid var(--border)',
        borderRadius: 4, padding: '4px 10px', fontFamily: 'var(--font)',
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>Coming Soon</span>
    </div>
  )
}

function DashboardContent() {
  const params = useSearchParams()
  const tab = params.get('tab') ?? 'overview'

  switch (tab) {
    case 'listings':
      return <PropertyListingsView />
    case 'quotation':
      return <StubPanel icon="📋" title="Quotation Tools" description="Generate and manage client quotations with a few clicks." />
    case 'agents':
      return <AgentsView />
    case 'pdf':
      return <StubPanel icon="📄" title="PDF Tools" description="Export property brochures, reports, and presentations." />
    default:
      return <OverviewPanel />
  }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ color: 'var(--muted)', fontFamily: 'var(--font)', padding: '16px' }}>Loading…</div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
