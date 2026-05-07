'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import {
  LayoutDashboard,
  List,
  Users,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',            Icon: LayoutDashboard },
  { id: 'listings',  label: 'Property Listings',    Icon: List },
  { id: 'agents',    label: 'Team & Agents',        Icon: Users },
  { id: 'leads',     label: 'Leads & Enquiries',    Icon: Inbox },
  { id: 'settings',  label: 'Site Settings',        Icon: Settings },
] as const

function SidebarNav({ onNav }: { onNav?: () => void }) {
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
            onClick={() => {
              router.push(`/staff/dashboard?tab=${item.id}`)
              onNav?.()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '12px 24px',
              background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none',
              borderLeft: isActive ? '3px solid rgba(255,255,255,0.75)' : '3px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              textAlign: 'left',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
              }
            }}
          >
            <Icon size={16} strokeWidth={1.6} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.65 }} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger — floats in top-left, visible only on small screens */}
      <button
        className="dash-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          position: 'fixed', top: 14, left: 16, zIndex: 300,
          width: 40, height: 40, borderRadius: 8,
          background: '#1a1815', border: '1px solid rgba(255,255,255,0.14)',
          display: 'none',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer',
        }}
      >
        <Menu size={18} strokeWidth={1.6} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 250,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`dash-sidebar${open ? ' dash-sidebar--open' : ''}`}
        style={{
          width: 240,
          flexShrink: 0,
          background: 'var(--footer-bg)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: '0.6875rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.40)', letterSpacing: '0.10em',
            textTransform: 'uppercase', fontFamily: 'var(--font)',
          }}>
            Staff Portal
          </div>
          <button
            className="dash-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              display: 'none',
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.50)', cursor: 'pointer', padding: 4,
            }}
          >
            <X size={16} strokeWidth={1.6} />
          </button>
        </div>

        <Suspense fallback={null}>
          <SidebarNav onNav={() => setOpen(false)} />
        </Suspense>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <a
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none', fontFamily: 'var(--font)', transition: 'color 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
          >
            <LogOut size={14} strokeWidth={1.6} />
            Back to site
          </a>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 768px) {
          .dash-hamburger { display: flex !important; }
          .dash-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            z-index: 260 !important;
            transform: translateX(-100%);
            transition: transform 0.26s ease;
          }
          .dash-sidebar--open {
            transform: translateX(0) !important;
          }
          .dash-close-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
