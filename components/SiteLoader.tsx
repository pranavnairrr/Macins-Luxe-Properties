'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.getElementById('site-loader');
    if (!el) return;

    if (pathname.startsWith('/staff')) {
      el.style.display = 'none';
      return;
    }

    const t = setTimeout(() => { el.style.display = 'none'; }, 400);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
