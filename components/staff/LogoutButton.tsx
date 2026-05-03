'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/staff/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        fontFamily: 'var(--font)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.70)',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 6,
        padding: '8px 16px',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(232,53,43,0.18)'
        e.currentTarget.style.color = '#FF7B72'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.70)'
      }}
    >
      Sign Out
    </button>
  )
}
