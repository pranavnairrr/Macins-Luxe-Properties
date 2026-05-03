import type { Metadata } from 'next'
import LoginForm from '@/components/staff/LoginForm'

export const metadata: Metadata = {
  title: 'Staff Login — Macins Luxe',
  description: 'Staff portal login',
  robots: { index: false, follow: false },
}

export default function StaffLoginPage() {
  return <LoginForm />
}
