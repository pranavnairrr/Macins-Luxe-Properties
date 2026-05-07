'use client';

import { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 51,
        height: 3,
        width: `${pct}%`,
        background: '#C9A96E',
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
