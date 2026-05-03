import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import DashboardSidebar from '@/components/staff/DashboardSidebar'
import LogoutButton from '@/components/staff/LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/staff/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#F5F6F8',
      fontFamily: 'var(--font)',
    }}>
      <DashboardSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 64,
          background: '#152140',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          borderBottom: '1px solid rgba(213,186,140,0.15)',
          flexShrink: 0,
        }}>
          <Image
            src="/images/logo-gold-luxe.svg"
            alt="Macins Luxe"
            width={130}
            height={40}
            style={{ height: 34, width: 'auto', objectFit: 'contain' }}
            unoptimized
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#D5BA8C', fontFamily: 'var(--font)' }}>
                Admin
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.40)', fontFamily: 'var(--font)' }}>
                {user.email}
              </div>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
