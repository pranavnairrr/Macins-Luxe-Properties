import type { Metadata } from 'next';
import './globals.css';
import ConditionalPageLoader from '@/components/ConditionalPageLoader';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BackToTop from '@/components/BackToTop';

export const metadata: Metadata = {
  title: 'Macins Luxe — Premium Real Estate',
  description: 'Discover exceptional luxury living across the UAE\'s most sought-after addresses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollProgressBar />
        <ConditionalPageLoader />
        {children}
        <WhatsAppFloat />
        <BackToTop />
      </body>
    </html>
  );
}
