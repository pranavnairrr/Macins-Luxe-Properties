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
DIGITAL_DUBAI_API_KEY=...                  # Digital Dubai open data API (approved)
```

---

## Brand Guidelines
Every new page, section, and component must follow these exactly.
When in doubt, match what already exists — never introduce new visual patterns.

### Colour Palette
| Token | Value | Usage |
|---|---|---|
| `--navy` | `#03213d` | Primary brand — nav, footer, CTA backgrounds |
| `--navy-dark` | `#021a30` | Hover states on navy elements |
| `--gold` | `#D5BA8C` | Accent — badges, hover highlights, premium details |
| `--gold-subtle` | `rgba(213,186,140,0.12)` | Subtle gold tint on dark backgrounds |
| `--heading` | `#1A2535` | All headings and primary text |
| `--body` | `#3D4F63` | Body copy |
| `--muted` | `#8895A2` | Meta text, labels, secondary info |
| `--white` | `#FFFFFF` | Page backgrounds |
| `--white-section` | `#F5F6F8` | Alternating section backgrounds (grey sections) |
| `--border` | `#DDE1E9` | Card borders, dividers |
| `--red` | `#E8352B` | Errors, alerts only |

**Rule**: never introduce a new colour. Map everything to the palette above.

### Typography
- **Font**: Poppins (self-hosted) — 400 regular, 500 medium, 600 semibold, 700 bold
- **Base size**: 13px root (`html { font-size: 13px }`) — all `rem` values scale from this
- **Mobile**: 11px root at ≤640px — entire scale compresses automatically

| Class/usage | Size | Weight | Usage |
|---|---|---|---|
| `.text-hero` | clamp(2rem, 3.75vw, 3.25rem) | 700 | Hero headline |
| `.text-h1` | clamp(1.75rem, 2.75vw, 2.375rem) | 700 | Page titles |
| `.text-h2` | clamp(1.375rem, 2vw, 1.875rem) | 700 | Section headings |
| `.text-h3` | 1.125rem | 600 | Card/subsection headings |
| `.text-body` | 1rem | 400 | Body copy |
| `.text-sm` | 0.9375rem | 400 | Secondary text |
| `.text-meta` | 0.8125rem | 400 | Labels, timestamps, meta |

### Spacing & Layout
- **Max container width**: 1380px, centred, `padding-inline: 52px` (desktop) → 32px (tablet) → 16px (mobile)
- **Section padding**: 64px vertical standard, 44px small, 86px large
- **Card gap**: 20px standard, 26px large
- **Section rhythm**: alternate white (`--white`) and grey (`--white-section`) backgrounds

### Component Patterns
**Cards** — white bg, `1px solid var(--border)`, `var(--shadow-card)`, `border-radius: var(--radius-md)` (8px).
Hover: lift `translateY(-6px)` + `var(--shadow-card-hover)`. Transition 320ms ease.

**Buttons (primary)** — navy bg `var(--navy)`, white text, `border-radius: var(--radius-btn)` (6px), `padding: 12px 28px`, font-weight 600.
Hover: `var(--navy-dark)`.

**Buttons (outline)** — white bg, `1px solid var(--border)`, heading colour text.
Hover: border becomes `var(--heading)`.

**Badges** — `rgba(0,0,0,0.48)` bg, white text, `border-radius: 4px`, `padding: 4px 10px`, 0.75rem font, font-weight 600, `backdrop-filter: blur(4px)`.

**Section headers** — overline label in uppercase 0.6875rem 700 `#999`, then `text-h2` heading. Space-between layout with right-side CTA link + scroll arrows.

**Gold accent rule** — use gold sparingly: hover states on dark backgrounds, premium badge borders, decorative dividers. Never fill large areas with gold.

### Brand Voice
- **Advisor, not salesperson** — informative, confident, never pushy
- **Precise** — use real numbers, real yields, real data. No vague superlatives.
- **Refined** — short sentences. No exclamation marks in UI copy.
- CTA copy examples: "Explore Properties", "View Details", "Book a Consultation" — never "Buy Now!" or "Don't miss out!"

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
category ('premium'|'offplan'|'commercial'), status ('published'|'draft'),
lat, lng, area_sqft, handover_date, payment_plan, amenities (jsonb), created_at`

### `agents`
Agent profiles. Key columns: `id, name, role, phone, email, image_url, languages,
specialisation, bio, slug (unique), social_instagram, social_linkedin,
published (bool), created_at`

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

### `blog_posts` *(to be created — Phase 2)*
CMS-managed blog and market intelligence articles.
Key columns: `id, slug (unique), title, category, date_str, read_time, excerpt,
image_url, featured (bool), body (text/HTML), tags (jsonb), author,
author_agent_id (fk to agents, nullable — for agent-authored posts),
published (bool), created_at, updated_at`

### `areas` *(to be created — Phase 2)*
Area guides for Dubai and Abu Dhabi communities.
Key columns: `id, slug (unique), name, emirate, tagline, image_url, hero_image_url,
description, highlights (jsonb), avg_price_per_sqft, rental_yield,
property_types (jsonb), nearby_areas (jsonb), lat, lng, map_zoom,
published (bool), created_at, updated_at`

### `reports` *(to be created — Phase 2)*
Market reports with downloadable PDFs.
Key columns: `id, slug (unique), title, year, quarter, category, description,
image_url, pdf_url, featured (bool), highlights (jsonb),
published (bool), created_at, updated_at`

### `broker_registrations` *(to be created — Roadmap R8)*
Broker/partner registration form submissions.
Key columns: `id, full_name, email, phone, company, orn_number, experience_years,
specialisation, message, status ('pending'|'approved'|'rejected'), created_at`

### `agent_posts` *(to be created — Roadmap R9)*
Agent profile posts — videos, status updates, short blogs shown on agent portfolio pages.
Key columns: `id, agent_id (fk), type ('video'|'status'|'blog'), title, body,
media_url, thumbnail_url, published (bool), created_at`

### `property_comparisons` *(to be created — Roadmap R5)*
Saved comparison sessions (optional persistence).
Key columns: `id, session_id, listing_ids (jsonb array of 2), created_at`

---

## Supabase Storage Buckets
| Bucket | Purpose |
|---|---|
| `site-assets` | Hero slide images, company logos |
| `property-images` | Listing photos |
| `agent-avatars` | Agent profile photos |
| `agent-media` | Agent post videos and thumbnails *(planned — R9)* |
| `blog-images` | Blog post cover images *(planned — Phase 2)* |
| `area-images` | Area guide images *(planned — Phase 2)* |
| `reports-pdfs` | Downloadable market report PDFs *(planned — Phase 2)* |
| `pdf-templates` | Staff-designed PDF template assets *(planned — R13)* |

---

## AI Concierge — Layla
- **Model**: Gemini 2.5 Flash (`gemini-2.5-flash`) via `@ai-sdk/google`
- **Key**: `GOOGLE_GENERATIVE_AI_API_KEY`
- **API route**: `app/api/chat/route.ts`
- **Current tools**: `searchListings`, `saveContactInfo`
- **Persona**: Layla — warm, advisor tone, 3-stage conversion (Discover → Advise → Connect)
- **Session storage**: every message saved to `chat_sessions` + `chat_messages`
- **Widget**: `components/ChatWidget.tsx` — lazy-loaded via `components/LazyChat.tsx`

**Planned tool expansions (Roadmap R3, R5, R6):**
- `compareProperties` — fetch two listings by ID, return structured comparison data
- `getAreaInsights` — query `areas` table + Digital Dubai API for community data
- `getMortgageEstimate` — calculate repayment schedule from price + deposit + rate
- `searchByMapArea` — filter listings by lat/lng bounding box drawn on map
- `getPriceHistory` — query Digital Dubai API for transaction history on an area/building

---

## Staff Portal
- **Login**: `/staff/login` — Supabase Auth email/password
- **Auth guard**: `middleware.ts` + `app/staff/dashboard/layout.tsx`
- **Dashboard**: `/staff/dashboard?tab=<tabId>`
- **Sidebar**: `components/staff/DashboardSidebar.tsx`
- **Tab router**: `app/staff/dashboard/page.tsx`

| Tab ID | Component | Status | Manages |
|---|---|---|---|
| `overview` | inline | Live | Dashboard home |
| `listings` | `PropertyListingsView` | Live | Property listings |
| `agents` | `AgentsView` | Live | Agent profiles |
| `leads` | `LeadsView` | Live | Enquiry leads |
| `chats` | `ChatsTab` | Live | AI chat sessions |
| `settings` | `SiteSettingsView` | Live | Hero slides, stats, company info |
| `blog` | `BlogsTab` | Phase 2 | Blog posts |
| `areas` | `AreasTab` | Phase 2 | Area guides |
| `reports` | `ReportsTab` | Phase 2 | Market reports + PDF uploads |
| `brokers` | `BrokersTab` | R8 | Broker registration submissions |
| `pdf-studio` | `PdfStudioTab` | R13 | PDF template designer + generator |

---

## Content Management Philosophy
**Rule**: if staff need to update it, it lives in Supabase. Never in code.

| Content | Where | Editable by staff? |
|---|---|---|
| Hero slides | `site_settings` | Yes |
| Stats | `site_settings` | Yes |
| Company info | `site_settings` | Yes |
| Property listings | `listings` | Yes |
| Agent profiles | `agents` | Yes |
| Blog posts | `blog_posts` *(Phase 2)* | Yes |
| Area guides | `areas` *(Phase 2)* | Yes |
| Market reports | `reports` *(Phase 2)* | Yes |
| Broker registrations | `broker_registrations` *(R8)* | View + status only |
| Agent posts/portfolio | `agent_posts` *(R9)* | Yes (by agent) |
| Nav links | code | No — intentional |
| Footer structure | code | No — intentional |

Static fallback data (`lib/blog-data.ts`, `lib/areas-data.ts`, `lib/reports-data.ts`)
exists only until Phase 2 tables are seeded. Archive these files after migration.

---

## Image Standards
- NEVER use a bare `<img>` tag for content images
- ALWAYS use `<CinemaImage>` from `@/components/CinemaImage` for all remote/uploaded images
- Use the `cinema` prop for hero, full-bleed, and above-the-fold images (quality 90)
- Standard content images default to quality 85
- Hero images MUST have the `priority` prop
- First image in a horizontally-scrolling card row: add `fetchPriority="high"`
- Logos must be SVG where possible
- All content images served from Supabase Storage — never commit content images to git
- Next.js image optimizer: AVIF → WebP, 30-day CDN cache TTL

---

## Icon Standards
- NEVER use emoji as UI icons
- ALWAYS use Lucide React: `import { IconName } from 'lucide-react'`
- 16px inline/list, 20px buttons, 24px headings
- `strokeWidth={1.5}` — refined, consistent with luxury brand

---

## Styling Standards
- Inline React styles + CSS custom properties — NOT Tailwind
- All colours via CSS vars: `var(--heading)`, `var(--navy)`, `var(--gold)` etc.
- Never add Tailwind utility classes — they do nothing in this project
- `@tailwind base` kept in `globals.css` for Preflight only
- Global design tokens in `:root` in `app/globals.css`
- Component-scoped styles in `<style jsx>` blocks

---

## Performance Standards
Non-negotiable. Every new feature must comply.

- **Fonts**: always via `next/font/google` — never `@import` in CSS
- **Hero images**: virtual windowing — max 4 slides in DOM at once
- **Heavy components**: `dynamic()` with `ssr: false`, deferred to first interaction
- **Image caching**: `minimumCacheTTL: 2592000` (30 days)
- **Image formats**: AVIF first, WebP fallback
- **Static assets**: `Cache-Control: immutable` on `_next/static`, 30d SWR on `/images`
- **Supabase preconnect**: `preconnect()` from `react-dom` in root layout
- **No artificial delays**: SiteLoader max 400ms
- **Data pages**: ISR `revalidate` on listing/blog/area/report pages once Supabase-driven
- **Charts/graphs**: use lightweight SVG-based libraries (Recharts or native SVG) — no heavy chart.js bundles

---

## PDF Generation
- **Property brochures**: puppeteer-core + @sparticuz/chromium-min
- Template: `lib/pdf/luxe-html.ts`
- API route: `app/api/property-pdf/[id]/route.ts`
- Declared in `serverComponentsExternalPackages` in `next.config.js`
- **Staff PDF studio** *(R13)*: server-side Puppeteer renders a predefined HTML template
  with staff-inserted images/text, downloads as branded PDF

---

## Supabase Clients
- Browser: `import { createClient } from '@/utils/supabase/client'`
- Server: `import { createClient } from '@/utils/supabase/server'`
- Direct (no cookies — callbacks/onFinish): `@supabase/supabase-js` with URL + publishable key

---

## Digital Dubai API
- **Approval**: API access approved — key in `DIGITAL_DUBAI_API_KEY` env var
- **Use cases**: property transaction history, area price trends, DLD data overlays on maps
- **Integration points**: Map page area insights, price history graphs (R10), area reports (R4)
- All Digital Dubai API calls must be server-side only (API route or server component)
  to protect the key — never call from client-side code

---

## Feature Roadmap
Implement in order. Each item is self-contained unless noted.
Reference this section when starting any new feature — match the brand and architecture above.

---

### Phase 2 — CMS Migration (next up)
Move blog, areas, reports from static TypeScript files to Supabase.
- Create `blog_posts`, `areas`, `reports` tables (SQL provided separately)
- Add `BlogsTab`, `AreasTab`, `ReportsTab` to staff portal
- Update public pages to fetch from Supabase with ISR (`revalidate: 60`)
- Seed existing static data into new tables
- Archive `lib/blog-data.ts`, `lib/areas-data.ts`, `lib/reports-data.ts`

---

### R1 — Dynamic Mortgage Calculator with Analytics Graph
**What**: Replace the current mortgage page with an interactive calculator that shows
a repayment schedule as a time-series area/line chart — similar in aesthetic to
Google Search Console's performance graph (clean axes, smooth curves, tooltip on hover,
area fill under the line in gold/navy tones, no chart.js bloat).

**Implementation approach**:
- Chart: native SVG path generation or Recharts (lightweight, React-native)
  — specifically the `AreaChart` or `ComposedChart` component
- Graph should show: monthly payment over loan term, cumulative interest paid vs principal
- Interactive: sliders for property price, deposit %, interest rate, loan term
- Output: monthly repayment, total interest, total cost, LTV ratio
- AI tool `getMortgageEstimate` pipes calculator output into Layla's chat responses
- Graph style: `--navy` line, `--gold` area fill at 12% opacity, `--border` grid lines,
  `--muted` axis labels — matches site palette exactly, no default chart colours

**Files**: `components/MortgagePage.tsx` (refactor), `app/api/mortgage/route.ts` (optional)

---

### R2 — Brand Guidelines Living Document
**What**: A `/brand` route (staff-only or public) that renders the design system as a
living style guide — colours, typography scale, button variants, card patterns, spacing.
Useful for onboarding new developers or designers without reading this CLAUDE.md.

**Implementation**: Static page, no DB needed. Auto-generates from CSS vars and
component examples. Also serves as visual regression reference.

---

### R3 — Dynamic Property Listings with Advanced Search + AI Tool Calling
**What**: Listings page (`/properties`) upgraded with:
- Client-side instant filter: area, price range, beds, property type, category, handover year
- Full-text search across name, developer, location
- Map/list toggle view
- URL-serialised filters (shareable filtered URLs)
- AI tool `searchListings` expanded: currently searches name/location/developer.
  Add: beds filter, price range filter, category ('premium'|'offplan'|'commercial'),
  sort by price/date, return pagination cursor
- Data-driven PDF/report: "Export these results as PDF" generates a branded property
  shortlist report using puppeteer — pulls live listing data, not static

**DB change**: add `lat`, `lng`, `area_sqft`, `handover_date`, `payment_plan`,
`amenities` columns to `listings` if not present

---

### R4 — Interactive Map + Area Intelligence Page
**What**:
- `/map` page — full-screen Leaflet map showing all published listings as pins
- Area overlay polygons (colour-coded by avg price/sqft)
- Click a pin → property card popup with enquire CTA
- Click an area polygon → side panel with area stats (avg price, yield, transaction count)
  pulled from `areas` table + Digital Dubai API
- Area-wise report page: `/areas/[slug]/report` — auto-generated from Digital Dubai API
  transaction data + our `areas` table, showing price trend graph (R1 chart style),
  recent transactions, supply pipeline
- Layla tool `searchByMapArea`: user draws a box on map → filters listings by lat/lng bounds

**Dependencies**: Digital Dubai API key, Leaflet already installed

---

### R5 — Property Comparison Page
**What**: `/compare?a=<id>&b=<id>` — side-by-side comparison of two listings.
- All key fields compared: price, beds, sqft, location, developer, handover, yield
- Difference highlighting (green = better, neutral = equal)
- Share URL (comparison is URL-encoded, no DB needed unless saving)
- AI integration: Layla tool `compareProperties(idA, idB)` — fetches both listings,
  returns structured diff that Layla presents as a comparison summary in chat
- "Compare" button added to property cards and detail pages

---

### R6 — AI Concierge Enhancements (Layla v2)
**What**: Expand Layla's capabilities beyond property search:
- `getMortgageEstimate` tool — calculator in chat (R1 dependency)
- `compareProperties` tool — (R5 dependency)
- `getAreaInsights` tool — area stats from `areas` table + Digital Dubai API
- `getPriceHistory` tool — Digital Dubai API transaction history for an area/building
- `searchByBudget` tool — "what can I afford for AED 2M?" with full filtering
- Voice input option (Web Speech API, progressive enhancement)
- Conversation memory within session — Layla references earlier stated preferences
- Proactive suggestions: after 3 messages, Layla offers to book a consultation
- WhatsApp handoff: "Send this conversation to WhatsApp" button

---

### R7 — Staff Portal Enhancements
**What**: Make every content type fully self-serviceable:
- Rich text editor for blog post body (TipTap — lightweight, React-native)
  replacing the raw HTML textarea
- Bulk image upload for listings (drag-drop, reorder)
- Agent profile: add slug, bio, social links fields
- Leads: export to CSV, mark as contacted/converted, add notes
- Overview dashboard: live stats cards — total listings, leads this week,
  chat sessions today, top-performing listing by enquiries
- Role-based access *(future)*: admin vs agent permissions

---

### R8 — Broker Registration Form
**What**: `/brokers/register` — public form for external brokers/partners to apply.
- Fields: name, company, ORN number, email, phone, experience years,
  specialisation, message
- Saves to `broker_registrations` table
- Staff portal `brokers` tab: view submissions, change status (pending/approved/rejected),
  send approval email
- Approved brokers optionally get a staff portal login

---

### R9 — Agent Portfolio Pages (Instagram-style)
**What**: `/team/[slug]` upgraded from a static profile to a full portfolio page:
- Profile header: photo, name, role, stats (listings, deals closed, languages)
- Post feed: videos, status updates, short blogs — grid layout like Instagram
- Posts sourced from `agent_posts` table, managed by agent or admin via staff portal
- Agent can publish blog posts — saved to both `blog_posts` (with `author_agent_id`)
  and shown on their portfolio page
- Public shareable URL — agents share `/team/[slug]` for credibility building
- Media uploads to `agent-media` Supabase Storage bucket
- Video posts: autoplay muted on hover, tap to unmute

---

### R10 — Price History Graphs (Digital Dubai API)
**What**: Property detail pages and area pages show a price trend graph:
- Time-series chart (R1 chart style — SVG/Recharts, navy+gold palette)
- Data: DLD transaction history from Digital Dubai API filtered by area or building
- Shows: avg price/sqft over time, transaction volume bars
- Layla tool `getPriceHistory` surfaces this data conversationally:
  "Business Bay apartments have appreciated 35% since 2023 — here's the trend."
- Cached server-side with 24h revalidation (Digital Dubai data updates daily)

**Env**: `DIGITAL_DUBAI_API_KEY`

---

### R11 — Client Testimonials + Trustpilot Integration
**What**:
- Testimonials CMS tab in staff portal — add/edit/publish client reviews with photo,
  name, property bought, star rating (replaces any hardcoded testimonials)
- Trustpilot widget embed on homepage and contact page (official Trustpilot embed script)
- Testimonials also queryable by Layla: "What do clients say about Macins Luxe?"

**DB**: `testimonials` table — `id, name, role, image_url, quote, rating, property,
published, created_at`

---

### R12 — Instagram Reels Auto-Embed
**What**: A section on homepage or a dedicated `/social` page that auto-fetches
and displays the latest Instagram Reels from the Macins Luxe account.
- Uses Instagram Basic Display API or oEmbed (no login required for public posts)
- Staff portal setting: toggle section on/off, set Instagram handle
- Lazy-loaded — never blocks page load
- Falls back gracefully if API is unavailable

---

### R13 — Staff PDF Studio (Template Designer + Generator)
**What**: A portal tool where developers pre-design PDF templates and staff
fill in content + images to generate branded PDFs on demand.

**Use cases**:
- Property brochure (already partially built via puppeteer)
- Area investment report
- Client portfolio summary
- Market snapshot one-pager

**Implementation**:
- Templates defined as HTML/CSS files in `lib/pdf/templates/`
- `PdfStudioTab` in staff portal: select template → fill fields + upload images
  → click Download → server calls puppeteer with populated template → returns PDF
- Dynamic data fields: can pull from `listings`, `areas`, `reports` tables automatically
- No external PDF SaaS — all server-side puppeteer (already installed)

---
