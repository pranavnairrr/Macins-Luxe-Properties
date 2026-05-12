import type { Metadata } from 'next';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import './globals.css';
import SiteLoader from '@/components/SiteLoader';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BackToTop from '@/components/BackToTop';

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

export const metadata: Metadata = {
  title: 'Macins Luxe — Premium Real Estate',
  description: "Discover exceptional luxury living across the UAE's most sought-after addresses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Server-rendered loader — visible on first paint before JS hydrates */}
        <div id="site-loader" aria-hidden="true">
          <div className="pl-logo">
            <Image
              src="/images/logo-luxe-loader.png"
              alt="Macins Luxe"
              width={220}
              height={76}
              priority
              style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxWidth: 220 }}
            />
          </div>
          <div className="pl-track"><div className="pl-bar" /></div>
        </div>

        <SiteLoader />
        {children}
        <WhatsAppFloat />
        <BackToTop />
        <ChatWidget />
      </body>
    </html>
  );
}
