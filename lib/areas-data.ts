// Type definitions only — data now lives in Supabase `areas` table.
// See lib/archived/areas-data.ts for the seeded static snapshot.
export interface AreaData {
  slug:             string;
  name:             string;
  emirate:          'Dubai' | 'Abu Dhabi';
  tagline:          string;
  image:            string;
  heroImage:        string;
  description:      string;
  highlights:       string[];
  avgPricePerSqft:  string;
  rentalYield:      string;
  propertyTypes:    string[];
  nearbyAreas:      string[];
  lat:              number;
  lng:              number;
  mapZoom:          number;
}
