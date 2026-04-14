import type { Metadata } from 'next';
import './globals.css';
import PageLoader from '@/components/PageLoader';

export const metadata: Metadata = {
  title: 'Macins Luxe — Premium Real Estate',
  description: 'Discover exceptional luxury living across the UAE\'s most sought-after addresses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
