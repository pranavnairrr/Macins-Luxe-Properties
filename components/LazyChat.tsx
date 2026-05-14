'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

export default function LazyChat() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const activate = () => setReady(true);
    window.addEventListener('pointerdown', activate, { once: true });
    window.addEventListener('scroll', activate, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', activate);
      window.removeEventListener('scroll', activate);
    };
  }, []);

  return ready ? <ChatWidget /> : null;
}
