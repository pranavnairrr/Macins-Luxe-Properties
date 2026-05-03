'use client'

import { usePathname } from 'next/navigation'
import PageLoader from './PageLoader'

export default function ConditionalPageLoader() {
  const pathname = usePathname()
  if (pathname.startsWith('/staff')) return null
  return <PageLoader />
}
