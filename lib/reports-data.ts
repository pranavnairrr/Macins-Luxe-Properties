// Type definitions only — data now lives in Supabase `reports` table.
// See lib/archived/reports-data.ts for the seeded static snapshot.
export interface Report {
  slug:        string;
  title:       string;
  year:        number;
  quarter?:    string;
  category:    'Annual Report' | 'Quarterly Report' | 'Area Report' | 'Market Snapshot';
  description: string;
  image:       string;
  pdf_url:     string;
  featured:    boolean;
  highlights:  string[];
}
