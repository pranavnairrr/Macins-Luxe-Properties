'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LayoutDashboard, List, Users, Inbox, Settings } from 'lucide-react'
import PropertyListingsView from '@/components/staff/PropertyListingsView'
import AgentsView from '@/components/staff/AgentsView'
import LeadsView from '@/components/staff/LeadsView'
import SiteSettingsView from '@/components/staff/SiteSettingsView'

const OVERVIEW_CARDS = [
  { label: 'Property Listings', desc: 'Add, edit, and publish properties',      Icon: List,            tab: 'listings'  },
  { label: 'Team & Agents',     desc: 'Manage agents assigned to brochures',    Icon: Users,           tab: 'agents'    },
  { label: 'Leads & Enquiries', desc: 'View enquiries and brochure downloads',  Icon: Inbox,           tab: 'leads'     },
  { label: 'Site Settings',     desc: 'Update hero images, stats, and content', Icon: Settings,        tab: 'settings'  },
]

function OverviewPanel() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 6, fontFamily: 'var(--font)' }}>
        Welcome back
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 36, fontFamily: 'var(--font)', fontSize: '0.9375rem' }}>
        Use the sidebar to manage listings, leads, and site content.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 36,
      }}>
        {OVERVIEW_CARDS.map(card => {
          const { Icon } = card
          return (
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
              <div style={{ marginBottom: 12, color: '#03213d' }}>
                <Icon size={28} strokeWidth={1.4} />
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 4, fontFamily: 'var(--font)' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
                {card.desc}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function DashboardContent() {
  const params = useSearchParams()
  const tab = params.get('tab') ?? 'overview'

  switch (tab) {
    case 'listings':  return <PropertyListingsView />
    case 'agents':    return <AgentsView />
    case 'leads':     return <LeadsView />
    case 'settings':  return <SiteSettingsView />
    default:          return <OverviewPanel />
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
