import ReportsPage from '@/components/ReportsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Reports — Macins Luxe',
  description: 'Download Macins Luxe\'s comprehensive Dubai real estate market reports, area guides, and investment forecasts.',
};

export default function ReportsRoute() {
  return <ReportsPage />;
}
