import ContactPage from '@/components/ContactPage';
import { getCompanyInfo } from '@/utils/site-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Macins Luxe',
  description: 'Get in touch with the Macins Luxe team. We\'re here to help you find your perfect property in Dubai and Abu Dhabi.',
};

export default async function ContactRoute() {
  const companyInfo = await getCompanyInfo().catch(() => null);
  return <ContactPage companyInfo={companyInfo} />;
}
