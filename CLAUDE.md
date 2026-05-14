# Macins Luxe — Claude Code Standards & Architecture

## Product Goal
Macins Luxe is a **premium real estate brokerage website** for Dubai and Abu Dhabi.
The site serves three audiences simultaneously:
1. **Buyers & investors** — discover, filter, and enquire on luxury properties
2. **Staff** — manage all content (listings, agents, blog, areas, reports) without a code deploy
3. **AI concierge (Layla)** — qualify leads and surface relevant listings via chat

Every decision should reinforce the luxury brand: fast, refined, never cluttered.
The site must scale to hundreds of listings, dozens of blog posts, and full CMS control
without touching code. Adding a new property, blog post, or market report = staff portal only.

---

## Git & Commit Rules
- Commit author is always **Pranav Nair** — never add `Co-Authored-By` lines
- After every meaningful commit, update this CLAUDE.md if anything changed:
  new tables, new components, new patterns, new env vars, new routes, new standards
- Keep commits focused — one logical change per commit, clear imperative message
- Never commit `.env.local` or any file containing secrets

---

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Database | Supabase (Postgres + Storage + Auth) |
| AI Chat | Google Gemini 2.5 Flash via `@ai-sdk/google` + Vercel AI SDK |
| Animations | GSAP 3 (hero Ken Burns + text reveals) |
| Maps | Leaflet + react-leaflet |
| PDF generation | puppeteer-core + @sparticuz/chromium-min |
| Font | Poppins — self-hosted via `next/font/google` (weights 400/500/600/700) |
| Icons | Lucide React |
| Styling | Inline React styles + CSS custom properties (NOT Tailwind) |

---

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://dqnrbbfiebnsjheznriy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...   # anon/public key
GOOGLE_GENERATIVE_AI_API_KEY=...           # Gemini — powers Layla chat
```

---

## Database Schema (Supabase)

### `site_settings`
Key-value store for site-wide CMS content. Each row is `{ key: string, value: jsonb }`.
| key | value shape |
|---|---|
| `hero_slides` | `{ slides: HeroSlide[] }` |
| `stats` | `{ items: StatItem[] }` |
| `company_info` | `{ phone, whatsapp, email, website, address_dubai, address_abudhabi, orn }` |

### `listings`
Property listings — fully managed via Staff Portal.
Key columns: `id, name, price, location, beds, badge, developer, images (text[]),
category ('premium'|'offplan'), status ('published'|'draft'), created_at`

### `agents`
Agent profiles. Key columns: `id, name, role, phone, email, image_url, languages,
specialisation, created_at`

### `leads`
Lead capture from enquiry forms and chat. Key columns: `id, name, email, phone,
message, source, created_at`

### `chat_sessions`
One row per AI concierge conversation session.
Key columns: `id, session_id (unique), page_url, contact_name, contact_phone,
contact_email, last_message, created_at, updated_at`

### `chat_messages`
Individual messages within a session.
Key columns: `id, session_id (fk), role ('user'|'assistant'), content, created_at`

### `blog_posts` *(to be created)*
CMS-managed blog and market intelligence articles.
Key columns: `id, slug (unique), title, category, date_str, read_time, excerpt,
image_url, featured (bool), body (text/HTML), tags (jsonb), author,
published (bool), created_at, updated_at`

### `areas` *(to be created)*
Area guides for Dubai and Abu Dhabi communities.
Key columns: `id, slug (unique), name, emirate, tagline, image_url, hero_image_url,
description, highlights (jsonb), avg_price_per_sqft, rental_yield,
property_types (jsonb), nearby_areas (jsonb), lat, lng, map_zoom,
published (bool), created_at, updated_at`

### `reports` *(to be created)*
Market reports with downloadable PDFs.
Key columns: `id, slug (unique), title, year, quarter, category, description,
image_url, pdf_url, featured (bool), highlights (jsonb),
published (bool), created_at, updated_at`

---

## Supabase Storage Buckets
| Bucket | Purpose |
|---|---|
| `site-assets` | Hero slide images, company logos — managed via Site Settings tab |
| `property-images` | Listing photos — managed via Property Listings tab |
| `agent-avatars` | Agent profile photos — managed via Team & Agents tab |
| `blog-images` | Blog post cover images — managed via Blog Posts tab *(planned)* |
| `area-images` | Area guide images — managed via Areas tab *(planned)* |
| `reports-pdfs` | Downloadable market report PDFs — managed via Reports tab *(planned)* |

---

## AI Concierge — Layla
- **Model**: Gemini 2.5 Flash (`gemini-2.5-flash`) via `@ai-sdk/google`
- **Key**: `GOOGLE_GENERATIVE_AI_API_KEY`
- **API route**: `app/api/chat/route.ts`
- **Tools**: `searchListings` (queries `listings` table), `saveContactInfo` (writes to `chat_sessions`)
- **Persona**: Layla — warm, advisor tone, 3-stage conversion flow (Discover → Advise → Connect)
- **Session storage**: every message saved to `chat_sessions` + `chat_messages` tables
- **Chat widget**: `components/ChatWidget.tsx` — loaded lazily via `components/LazyChat.tsx`
  (deferred until first user scroll or pointer event, never on page load)

---

## Staff Portal
- **Login**: `/staff/login` — Supabase Auth email/password
- **Auth guard**: `middleware.ts` + `app/staff/dashboard/layout.tsx`
- **Dashboard**: `/staff/dashboard?tab=<tabId>`
- **Sidebar**: `components/staff/DashboardSidebar.tsx`
- **Tab router**: `app/staff/dashboard/page.tsx`

| Tab ID | Component | Manages |
|---|---|---|
| `overview` | inline in page.tsx | Dashboard home |
| `listings` | `PropertyListingsView` | Property listings |
| `agents` | `AgentsView` | Agent profiles |
| `leads` | `LeadsView` | Enquiry leads |
| `chats` | `ChatsTab` | AI chat sessions |
| `settings` | `SiteSettingsView` | Hero slides, stats, company info |
| `blog` | `BlogsTab` *(planned)* | Blog posts |
| `areas` | `AreasTab` *(planned)* | Area guides |
| `reports` | `ReportsTab` *(planned)* | Market reports |

---

## Content Management Philosophy
**Rule**: if staff need to update it, it lives in Supabase. Never in code.

| Content | Where | Staff can edit? |
|---|---|---|
| Hero slides | `site_settings` | Yes |
| Stats | `site_settings` | Yes |
| Company info | `site_settings` | Yes |
| Property listings | `listings` table | Yes |
| Agent profiles | `agents` table | Yes |
| Blog posts | `blog_posts` table *(planned)* | Yes |
| Area guides | `areas` table *(planned)* | Yes |
| Market reports | `reports` table *(planned)* | Yes |
| Nav links | code | No — intentional |
| Footer structure | code | No — intentional |

Static fallback data in `lib/blog-data.ts`, `lib/areas-data.ts`, `lib/reports-data.ts`
exists only until the Supabase tables are created and seeded. These files will be
archived once migration is complete.

---

## Image Standards
- NEVER use a bare `<img>` tag for content images
- ALWAYS use `<CinemaImage>` from `@/components/CinemaImage` for all remote/uploaded images
- Use the `cinema` prop for hero, full-bleed, and above-the-fold images (sets quality=90)
- Standard content images default to quality=85
- Hero images MUST have the `priority` prop
- First image in a horizontally-scrolling card row: add `fetchPriority="high"`
- Logos must be SVG where possible
- All content images are served from Supabase Storage — never commit content images to git
- Next.js image optimizer is configured for AVIF → WebP with 30-day CDN cache TTL

---

## Icon Standards
- NEVER use emoji as UI icons
- ALWAYS use Lucide React: `import { IconName } from 'lucide-react'`
- Render at 16px (`size={16}`) for inline/list icons, 20px for buttons, 24px for headings
- Use `strokeWidth={1.5}` for a refined look consistent with the luxury brand

---

## Styling Standards
- This project uses inline React styles + CSS custom properties — NOT Tailwind
- All colours via CSS vars: `var(--heading)`, `var(--navy)`, `var(--gold)` etc.
- Never add Tailwind utility classes — they do nothing in this project
- `@tailwind base` is kept in `globals.css` for Preflight/reset only
- Global design tokens live in `:root` in `app/globals.css`
- Component-scoped styles use `<style jsx>` blocks

---

## Performance Standards
These are non-negotiable. Every new feature must respect them.

- **Fonts**: always via `next/font/google` — never `@import` in CSS (render-blocking)
- **Hero images**: virtual windowing — never render more than 4 slide Images in DOM at once
- **Heavy components**: lazy-load via `dynamic()` with `ssr: false`, deferred to first interaction
- **Image caching**: `minimumCacheTTL: 2592000` (30 days) — set in `next.config.js`
- **Image formats**: AVIF first, WebP fallback — set in `next.config.js`
- **Static assets**: `Cache-Control: immutable` on `_next/static`, 30-day SWR on `/images`
- **Supabase preconnect**: declared via `preconnect()` from `react-dom` in root layout
- **No artificial delays**: SiteLoader max 400ms — never increase this
- **Data pages** (blog, areas, reports): use `revalidate` for ISR once migrated to Supabase

---

## PDF Generation
- Used for property brochure downloads
- Stack: `puppeteer-core` + `@sparticuz/chromium-min`
- Declared in `serverComponentsExternalPackages` in `next.config.js` (not bundled)
- HTML template: `lib/pdf/luxe-html.ts`
- API route: `app/api/property-pdf/[id]/route.ts`

---

## Supabase Clients
- Browser (client components): `import { createClient } from '@/utils/supabase/client'`
- Server (server components / API routes): `import { createClient } from '@/utils/supabase/server'`
- Direct (no cookies — safe in callbacks/onFinish): `createClient` from `@supabase/supabase-js`
  with `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
