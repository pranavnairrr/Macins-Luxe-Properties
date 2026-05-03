'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import {
  LayoutDashboard,
  List,
  Users,
  Inbox,
  Settings,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',            Icon: LayoutDashboard },
  { id: 'listings',  label: 'Property Listings',    Icon: List },
  { id: 'agents',    label: 'Team & Agents',        Icon: Users },
  { id: 'leads',     label: 'Leads & Enquiries',    Icon: Inbox },
  { id: 'settings',  label: 'Site Settings',        Icon: Settings },
] as const

function SidebarNav() {
  const router = useRouter()
  const params = useSearchParams()
  const activeTab = params.get('tab') ?? 'overview'

  return (
    <nav style={{ flex: 1, padding: '16px 0' }}>
      {NAV_ITEMS.map(item => {
        const isActive = item.id === activeTab
        const { Icon } = item
        return (
          <button
            key={item.id}
            onClick={() => router.push(`/staff/dashboard?tab=${item.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '12px 24px',
              background: isActive ? 'rgba(213,186,140,0.10)' : 'transparent',
              border: 'none',
              borderLeft: isActive ? '3px solid #D5BA8C' : '3px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#D5BA8C' : 'rgba(255,255,255,0.65)',
              textAlign: 'left',
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.90)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
              }
            }}
          >
            <Icon
              size={16}
              strokeWidth={1.6}
              style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}
            />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export default function DashboardSidebar() {
  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      background: '#152140',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(213,186,140,0.12)',
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(213,186,140,0.12)',
      }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'rgba(213,186,140,0.60)',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font)',
        }}>
          Staff Portal
        </div>
      </div>

      <Suspense fallback={null}>
        <SidebarNav />
      </Suspense>

      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.35)',
            textDecoration: 'none',
            fontFamily: 'var(--font)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
        >
          <LogOut size={14} strokeWidth={1.6} />
          Back to site
        </a>
      </div>
    </aside>
  )
}
