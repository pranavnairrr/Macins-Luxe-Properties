import MortgagePage from '@/components/MortgagePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Macins Luxe',
  description: 'Calculate your monthly mortgage payments, check eligibility, and connect with our mortgage specialists for Dubai property financing.',
};

export default function MortgageRoute() {
  return <MortgagePage />;
}
