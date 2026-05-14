# Macins Luxe — Claude Code Standards

## Git & Commit Rules
- Commit author is always **Pranav Nair** — never add `Co-Authored-By` lines
- After every meaningful commit, update this CLAUDE.md if anything architectural changed:
  new tables, new components, new patterns, new env vars, new routes, new standards
- Keep commits focused — one logical change per commit, clear imperative message

## Image Standards
- NEVER use a bare `<img>` tag for content images
- ALWAYS use `<CinemaImage>` from `@/components/CinemaImage` for all remote/uploaded images
- Use the `cinema` prop for hero, full-bleed, and above-the-fold images (sets quality=90)
- Standard content images default to quality=85
- Hero images MUST have the `priority` prop
- Logos must be SVG where possible
- All images are served from Supabase Storage — never commit content images to git

## Icon Standards
- NEVER use emoji as UI icons
- ALWAYS use Lucide React: `import { IconName } from 'lucide-react'`
- Render at 16px (`size={16}`) for inline/list icons, 20px for buttons, 24px for headings
- Use `strokeWidth={1.5}` for a refined look consistent with the luxury brand

## Styling Standards
- This project uses inline React styles + CSS custom properties — NOT Tailwind
- All colours via CSS vars: `var(--heading)`, `var(--navy)`, `var(--gold)` etc.
- Never add Tailwind utility classes — they do nothing in this project

## Supabase
- Project URL: https://dqnrbbfiebnsjheznriy.supabase.co
- Browser client: `import { createClient } from '@/utils/supabase/client'`
- Server client: `import { createClient } from '@/utils/supabase/server'`
- Site-wide CMS content (hero slides, stats, company info): `site_settings` table
- Property listings: `listings` table
- Agent profiles: `agents` table
- Lead capture: `leads` table

## Staff Portal
- Auth guard is in `middleware.ts` + `app/staff/dashboard/layout.tsx`
- Tabs are driven by `?tab=` query param, routed in `app/staff/dashboard/page.tsx`
- Sidebar nav defined in `components/staff/DashboardSidebar.tsx`
