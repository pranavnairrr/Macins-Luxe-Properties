/**
 * One-time seed script: pushes static blog/area/report data into Supabase.
 * Run with:  npx tsx scripts/seed-db.ts
 *
 * Before running, add your service role key to .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY=<your key>
 * Find it in: Supabase Dashboard → Project Settings → API → service_role (secret)
 * NEVER commit this key to git.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { blogPosts } from '../lib/archived/blog-data';
import { areas } from '../lib/archived/areas-data';
import { reports } from '../lib/archived/reports-data';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  console.log('Seeding blog_posts…');
  const blogRows = blogPosts.map(p => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    published_date: p.date,
    read_time: p.readTime,
    excerpt: p.excerpt,
    image: p.image,
    featured: p.featured,
    body: p.body,
    tags: p.tags,
    author: p.author,
  }));
  const { error: blogErr } = await supabase
    .from('blog_posts')
    .upsert(blogRows, { onConflict: 'slug' });
  if (blogErr) throw blogErr;
  console.log(`  ✓ ${blogRows.length} blog posts`);

  console.log('Seeding areas…');
  const areaRows = areas.map((a, i) => ({
    slug: a.slug,
    name: a.name,
    emirate: a.emirate,
    tagline: a.tagline,
    image: a.image,
    hero_image: a.heroImage,
    description: a.description,
    highlights: a.highlights,
    avg_price_per_sqft: a.avgPricePerSqft,
    rental_yield: a.rentalYield,
    property_types: a.propertyTypes,
    nearby_areas: a.nearbyAreas,
    lat: a.lat,
    lng: a.lng,
    map_zoom: a.mapZoom,
    sort_order: i,
  }));
  const { error: areaErr } = await supabase
    .from('areas')
    .upsert(areaRows, { onConflict: 'slug' });
  if (areaErr) throw areaErr;
  console.log(`  ✓ ${areaRows.length} areas`);

  console.log('Seeding reports…');
  const reportRows = reports.map(r => ({
    slug: r.slug,
    title: r.title,
    year: r.year,
    quarter: r.quarter ?? null,
    category: r.category,
    description: r.description,
    image: r.image,
    pdf_url: r.pdf_url,
    featured: r.featured,
    highlights: r.highlights,
  }));
  const { error: reportErr } = await supabase
    .from('reports')
    .upsert(reportRows, { onConflict: 'slug' });
  if (reportErr) throw reportErr;
  console.log(`  ✓ ${reportRows.length} reports`);

  console.log('\nDone. All static data is now in Supabase.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
