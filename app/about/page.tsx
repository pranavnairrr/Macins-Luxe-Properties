import AboutPage from '@/components/AboutPage';
import { getStats, getCompanyInfo } from '@/utils/site-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Macins Luxe',
  description: 'Learn about Macins Luxe Properties, Dubai\'s trusted luxury real estate agency with 17+ years of experience and AED 3B+ in annual sales.',
};

export default async function AboutRoute() {
  const [stats, companyInfo] = await Promise.all([
    getStats().catch(() => []),
    getCompanyInfo().catch(() => null),
  ]);
  return <AboutPage stats={stats} companyInfo={companyInfo} />;
}
