// Type definitions only — data now lives in Supabase `blog_posts` table.
// See lib/archived/blog-data.ts for the seeded static snapshot.
export interface BlogPost {
  slug:      string;
  title:     string;
  category:  'Market Reports' | 'Investment' | 'Guides' | 'Lifestyle' | 'Legal';
  date:      string;
  readTime:  string;
  excerpt:   string;
  image:     string;
  featured:  boolean;
  body:      string;
  tags:      string[];
  author:    string;
}
