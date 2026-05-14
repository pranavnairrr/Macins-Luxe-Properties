export interface Report {
  slug: string;
  title: string;
  year: number;
  quarter?: string;
  category: 'Annual Report' | 'Quarterly Report' | 'Area Report' | 'Market Snapshot';
  description: string;
  image: string;
  pdf_url: string;
  featured: boolean;
  highlights: string[];
}

export const reports: Report[] = [
  {
    slug: 'dubai-market-2025-annual',
    title: 'Dubai Real Estate Market Annual Report 2025',
    year: 2025,
    category: 'Annual Report',
    description: 'A comprehensive review of Dubai\'s real estate market in 2025, covering transaction volumes, price movements, off-plan vs ready splits, developer performance, and our 2026 outlook. AED 390B in total transactions — the strongest year on record.',
    image: '/images/hero/img227.jpg',
    pdf_url: '#',
    featured: true,
    highlights: [
      'AED 390B total transaction value (+28% vs 2024)',
      '128,000+ residential transactions recorded',
      'Off-plan share reached 61% of all deals',
      'Average price appreciation of 22% city-wide',
      'Ultra-luxury segment (AED 30M+) grew 52% YoY',
    ],
  },
  {
    slug: 'dubai-q1-2026-market-snapshot',
    title: 'Dubai Market Snapshot — Q1 2026',
    year: 2026,
    quarter: 'Q1 2026',
    category: 'Quarterly Report',
    description: 'Macins Luxe\'s quarterly market snapshot for Q1 2026, covering transaction volumes, top-performing areas, emerging investment hotspots, and developer activity. Includes exclusive data on Business Bay, Downtown, and Palm Jebel Ali.',
    image: '/images/hero/img201.jpg',
    pdf_url: '#',
    featured: false,
    highlights: [
      'AED 112.4B total transactions (+31% YoY)',
      '35,800 residential deals — record Q1',
      'Business Bay leads off-plan by volume',
      'Palm Jebel Ali Phase 2 drives luxury demand',
    ],
  },
  {
    slug: 'downtown-dubai-area-report-2025',
    title: 'Downtown Dubai Investment Report 2025',
    year: 2025,
    category: 'Area Report',
    description: 'An in-depth analysis of Downtown Dubai\'s property market in 2025, including pricing trends, rental performance, key transactions, upcoming launches, and our 5-year capital growth forecast for Burj Khalifa-view assets.',
    image: '/images/hero/img306.jpg',
    pdf_url: '#',
    featured: false,
    highlights: [
      '+35% price appreciation since 2023',
      'Average price: AED 3,100/sqft',
      'Rental yield: 5.8% gross',
      'Luxury deals above AED 10M: 420 in 2025',
    ],
  },
  {
    slug: 'business-bay-area-report-2025',
    title: 'Business Bay Investment Report 2025',
    year: 2025,
    category: 'Area Report',
    description: 'Business Bay delivered the highest off-plan transaction volumes of any Dubai community in 2025. This report analyses the developer landscape, canal-front price premiums, rental yield performance, and the investment case for the area through 2027.',
    image: '/images/hero/img302.jpg',
    pdf_url: '#',
    featured: false,
    highlights: [
      'Highest off-plan volume in Dubai for 3rd year running',
      'Canal-front premium: 25–35% above inland units',
      'Average rental yield: 7.4%',
      '18 new launches in 2025',
    ],
  },
  {
    slug: 'dubai-hills-report-2025',
    title: 'Dubai Hills Estate Community Report 2025',
    year: 2025,
    category: 'Area Report',
    description: 'Dubai Hills Estate continues to set the standard for family community living in the UAE. This report covers villa and apartment performance, school catchment areas, rental demand, and the long-term outlook for this Emaar flagship development.',
    image: '/images/hero/img508.jpg',
    pdf_url: '#',
    featured: false,
    highlights: [
      'Villa appreciation: +28% in 2025',
      'Apartment yield: 5.5–7.5% gross',
      'Consistently top-ranked family community',
      'Sub-AED 5M villa supply near exhaustion',
    ],
  },
  {
    slug: 'dubai-offplan-market-2025',
    title: 'Dubai Off-Plan Market Snapshot 2025',
    year: 2025,
    category: 'Market Snapshot',
    description: 'Dubai\'s off-plan sector accounted for 61% of all 2025 transactions — a record share. This snapshot analyses the top developers, highest-performing projects, payment plan structures, and identifies the best off-plan investment opportunities entering 2026.',
    image: '/images/hero/img512.jpg',
    pdf_url: '#',
    featured: false,
    highlights: [
      '61% of all transactions were off-plan (record high)',
      'Average sell-out time for premium launches: 4.2 days',
      'Post-handover payment plans now available on 68% of launches',
      'Top developer by volume: Binghatti (14,200 units)',
    ],
  },
  {
    slug: 'uae-luxury-market-forecast-2026',
    title: 'UAE Luxury Real Estate Forecast 2026',
    year: 2026,
    category: 'Market Snapshot',
    description: 'A forward-looking analysis of the UAE\'s ultra-luxury property segment (AED 10M+), including global wealth migration trends, supply pipeline constraints, branded residence expansion, and our price appreciation forecasts for Dubai and Abu Dhabi through 2028.',
    image: '/images/hero/img333.jpg',
    pdf_url: '#',
    featured: false,
    highlights: [
      'Ultra-luxury (AED 30M+) transactions grew 52% in 2025',
      'Supply of Burj-view units: structurally constrained',
      'Branded residences command 35–45% premium over standard',
      'Dubai to surpass London as #3 luxury market by 2027 (JLL forecast)',
    ],
  },
  {
    slug: 'abu-dhabi-real-estate-2025',
    title: 'Abu Dhabi Real Estate Annual Report 2025',
    year: 2025,
    category: 'Annual Report',
    description: 'Abu Dhabi\'s real estate market delivered its strongest year since 2014, driven by cultural investments, free zone expansion, and Aldar\'s transformative master-plan developments on Yas Island and Saadiyat. This report covers all major developments, pricing trends, and investment outlook across Reem Island, Yas Island, Al Raha, and Saadiyat.',
    image: '/images/hero/img767.jpg',
    pdf_url: '#',
    featured: false,
    highlights: [
      'AED 71B total transactions (+19% YoY)',
      'Saadiyat Island luxury villas: +41% price growth',
      'Reem Island rental yield: 7.8% average',
      'Yas Island: fastest-growing community in Abu Dhabi',
    ],
  },
];
