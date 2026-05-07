import CareersPage from '@/components/CareersPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers — Macins Luxe',
  description: 'Join the Macins Luxe team. We\'re hiring property consultants, off-plan specialists, and digital marketing professionals in Dubai and Abu Dhabi.',
};

export default function CareersRoute() {
  return <CareersPage />;
}
