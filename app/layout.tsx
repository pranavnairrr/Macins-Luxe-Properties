import type { Metadata } from 'next';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { preconnect } from 'react-dom';
import './globals.css';
import SiteLoader from '@/components/SiteLoader';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BackToTop from '@/components/BackToTop';
import LazyChat from '@/components/LazyChat';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Macins Luxe — Premium Real Estate',
  description: "Discover exceptional luxury living across the UAE's most sought-after addresses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  preconnect('https://dqnrbbfiebnsjheznriy.supabase.co', { crossOrigin: 'anonymous' });
  return (
    <html lang="en" className={poppins.variable}>
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
        <LazyChat />
      </body>
    </html>
  );
}
