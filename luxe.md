# SPRINGFIELD PROPERTIES — Design DNA (`luxe.md`)
**Source:** 15 homepage screenshots from springfieldproperties.ae  
**Rule:** Zero external memory. Only what is visible in the screenshots.  
**Purpose:** Component rules and global CSS for replication/reference.

---

## 1. Color Tokens

```css
:root {
  /* Primary Navy — footer, hero overlay, nav CTA button */
  --navy:           #1B3079;
  --navy-dark:      #152567;

  /* Page surfaces */
  --white:          #FFFFFF;
  --white-section:  #F5F6F8;   /* stats row, testimonials section bg */
  --white-card:     #EDEEF1;   /* testimonial card fill */

  /* Text */
  --heading:        #1A2535;   /* all headings on white backgrounds */
  --body:           #3D4F63;   /* body paragraphs */
  --muted:          #8895A2;   /* dates, "08 min read", "Starting Price" label */
  --white-text:     #FFFFFF;   /* text on navy backgrounds */
  --white-muted:    rgba(255, 255, 255, 0.70); /* secondary text on navy footer */

  /* Accent — used ONLY for logo pin and YouTube badge */
  --red:            #E8352B;

  /* CTA button — Enquire Now, dark charcoal (NOT the same as --navy) */
  --cta-bg:         #2B3D52;
  --cta-text:       #FFFFFF;

  /* Borders */
  --border:         #DDE1E9;
  --border-on-dark: rgba(255, 255, 255, 0.15);

  /* Property card badge — "Handover: Q4 2027" chip */
  --badge-bg:       rgba(0, 0, 0, 0.48);

  /* Shadows */
  --shadow-card:       0 2px 12px rgba(27, 48, 121, 0.08);
  --shadow-card-hover: 0 8px 28px rgba(27, 48, 121, 0.16);
  --shadow-nav:        0 2px 12px rgba(27, 48, 121, 0.10);

  /* Radii */
  --radius-card:    8px;
  --radius-card-lg: 12px;
  --radius-btn:     6px;

  /* Transitions */
  --ease:           cubic-bezier(0.4, 0, 0.2, 1);
  --transition:     200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 380ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 2. Typography Rules

**Font:** Poppins (geometric sans-serif) — used at all weights, all sizes. Single typeface system.

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  color: var(--body);
  font-size: 1rem;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}
```

### Component Rules — Typography

**Rule: Hero Headline**
Source: "Binghatti Skyflame In Majan" (Image 14)
```css
.hero-headline {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 3.75vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}
```

**Rule: Hero Subtext**
Source: "Skyflame emerges as a striking new residential landmark..." (Image 14)
```css
.hero-subtext {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  max-width: 480px;
}
```

**Rule: Section Title (H1-level)**
Source: "Most Followed Real Estate Brand in the UAE" (Image 7), "Latest Offplan Launches" (Image 11)
```css
.section-title {
  font-size: clamp(1.75rem, 2.75vw, 2.375rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--heading);
}
```

**Rule: Sub-section Title**
Source: "Why Choose Springfield Properties?" (Image 6), "Our Recognitions & Achievements" (Image 4)
```css
.subsection-title {
  font-size: clamp(1.375rem, 2vw, 1.875rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: var(--heading);
}
```

**Rule: Numbered Feature Heading**
Source: "1. Market Expertise", "2. Comprehensive Services" (Image 6)
```css
.feature-heading {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--heading);
}
/* The number prefix uses same weight and size, same color */
```

**Rule: Property Card Title**
Source: "Golf Vale", "Greenz by Danube", "Binghatti Skyflame" (Images 11, 13)
```css
.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--heading);
}
```

**Rule: Price Display**
Source: "Starting Price AED 3.5M", "AED 585K" (Image 11)
The "Starting Price" label is `--muted` at small size. The price itself is bold heading color.
```css
.price-label {
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--muted);
}
.price-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--heading);
}
```

**Rule: Stat Number**
Source: "AED 3B+", "200+", "17+ YEARS", "5,000+" (Image 7)
```css
.stat-number {
  font-size: clamp(1.75rem, 2.5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--heading);
}
.stat-label {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--heading);
  margin-top: 4px;
}
.stat-description {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--body);
  margin-top: 8px;
}
```

**Rule: Button Text**
Source: "Enquire Now" (Images 10–13), "View Details" (Image 14), "Read More →" (Image 2)
```css
.btn-text {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}
```

**Rule: Meta / Labels**
Source: "April 3, 2026 — 08 min read" (Image 2), "2 months ago" (Image 3), "Handover: Q4 2027" (Image 11)
```css
.meta {
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--muted);
  line-height: 1.5;
}
```

**Rule: Footer Column Heading**
Source: "Quick Links", "Company", "Buy from", "Our Offices", "Follow Us" (Image 1)
```css
.footer-heading {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 20px;
}
```

**Rule: Footer Links**
Source: "Home", "Projects", "Areas", "About Us" etc. (Image 1)
```css
.footer-link {
  font-size: 0.9375rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  line-height: 2;
  text-decoration: none;
  transition: color var(--transition);
}
.footer-link:hover {
  color: #FFFFFF;
}
```

**Rule: Navigation Links**
Source: "Projects Areas About Us Our Team Reports Careers Blog Contact Us" (Image 14, 15)
```css
.nav-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--heading);
  letter-spacing: 0em;
}
```

---

## 3. Layout & Spacing Rules

**Rule: Section Padding**
Every full-width section uses 80px top/bottom padding on desktop. Content-dense sections (developer logos, stats row) use 56px.

```css
.section { padding: 80px 0; }
.section-sm { padding: 56px 0; }
.section-lg { padding: 108px 0; }
```

**Rule: Container**
```css
.container {
  max-width: 1380px;
  margin: 0 auto;
  padding-left: 64px;
  padding-right: 64px;
}
@media (max-width: 1024px) {
  .container { padding-left: 40px; padding-right: 40px; }
}
@media (max-width: 640px) {
  .container { padding-left: 24px; padding-right: 24px; }
}
```

**Rule: Card Grid**
Source: Images 11, 12, 13 — three-column layout with even gaps
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .card-grid { grid-template-columns: 1fr; }
}
```

**Rule: Stats Row**
Source: Image 7 — four equal-width bordered boxes
```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
```

**Rule: Locations Grid**
Source: Image 9 — large left image spanning full height, two stacked on right
```css
.locations-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  height: 520px;
}
.locations-grid .location-primary {
  grid-row: 1 / 3;  /* spans both rows */
}
```

**Rule: "Why Choose" Split Layout**
Source: Image 6 — photography left, text right, equal columns
```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
```

**Rule: Footer Layout**
Source: Image 1 — logo + phone/email top bar, then 5-column link grid
```css
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-on-dark);
  margin-bottom: 40px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr 1fr;
  gap: 40px;
}
```

---

## 4. Component Rules

### 4.1 Navigation

```
Height: ~72px
Background: white (on scroll), transparent (over hero on load)
Logo: left-aligned
Nav links: centered, 500 weight, normal color
"Springfield AI" button: right-aligned, light grey bg (#F0F1F4), 
  navy text, radius 6px, padding 10px 20px — not a high-contrast CTA
Border-bottom: 1px solid var(--border) appears on scroll
```

### 4.2 Hero Slider

```
Height: 100vh
Overlay: left-heavy gradient — dark navy on left, fades to transparent right
  linear-gradient(to right, rgba(21, 37, 103, 0.80) 40%, rgba(21, 37, 103, 0.20) 100%)
Content: left-aligned, bottom 1/3 of viewport
Badge: small outlined pill — "New Launch" — border 1px white, white text, padding 6px 14px
H1: hero-headline rule
Subtext: hero-subtext rule
CTA: outlined white button — border 2px white, white text, transparent bg
Search bar: below hero fold, full-width, white bg, no overlay
Slide indicators: dots, centered bottom, ~8px diameter
```

### 4.3 Property Cards

```css
.property-card {
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--white);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-slow), transform var(--transition-slow);
}
.property-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-3px);
}
.property-card__image-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
.property-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms var(--ease);
}
.property-card:hover .property-card__image {
  transform: scale(1.04);
}
/* Handover badge — top left on image */
.property-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--badge-bg);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}
/* Developer logo — top right on image */
.property-card__developer {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  max-height: 28px;
}
.property-card__body {
  padding: 20px 20px 0;
}
/* Enquire Now button — full width, flush to card bottom */
.property-card__cta {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  background: var(--cta-bg);
  color: var(--cta-text);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 0 0 var(--radius-card) var(--radius-card);
  cursor: pointer;
  transition: background var(--transition);
}
.property-card__cta:hover {
  background: #1E2D3D;
}
```

### 4.4 Stat Cards

```css
.stat-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 28px;
  box-shadow: 0 1px 4px rgba(27, 48, 121, 0.06);
}
```

### 4.5 Developer Logo Strip

Source: Image 10 — Sobha, Wasl, Danube, Omniyat, Meraas
```css
.developer-logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-card);
  padding: 20px 32px;
  height: 80px;
}
.developer-logo-box img {
  max-height: 36px;
  object-fit: contain;
  filter: grayscale(0%);   /* Springfield shows logos in full color */
}
```

### 4.6 Testimonial Cards

Source: Image 3
```css
.review-card {
  background: var(--white-card);   /* #EDEEF1 */
  border-radius: var(--radius-card-lg);
  padding: 24px;
}
.review-card__name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--heading);
}
.review-card__date {
  font-size: 0.8125rem;
  color: var(--muted);
  margin-top: 2px;
}
.review-card__stars {
  color: #F5A11E;   /* star yellow — from screenshot Image 3 */
  font-size: 0.875rem;
  margin-top: 8px;
}
.review-card__body {
  font-size: 0.9375rem;
  color: var(--body);
  line-height: 1.65;
  margin-top: 12px;
}
```

### 4.7 Full-Width CTA Banner

Source: Image 12 — "Access the Latest Dubai Real Estate Insights"
```css
.cta-banner {
  position: relative;
  overflow: hidden;
  min-height: 280px;
  display: flex;
  align-items: center;
}
.cta-banner__bg {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.cta-banner__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right,
    rgba(10, 18, 50, 0.85) 50%,
    rgba(10, 18, 50, 0.55) 100%
  );
}
.cta-banner__content {
  position: relative;
  z-index: 1;
  padding: 60px 64px;
}
.cta-banner__title {
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  max-width: 560px;
}
.cta-banner__sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.80);
  margin-top: 12px;
}
.cta-banner__btn {
  display: inline-block;
  margin-top: 28px;
  padding: 12px 28px;
  background: #FFFFFF;
  color: var(--heading);
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: var(--radius-btn);
  text-decoration: none;
}
```

### 4.8 Blog Cards

Source: Image 2
```css
.blog-card__image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
}
.blog-card__body {
  padding: 20px 0 0;
}
.blog-card__title {
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--heading);
}
.blog-card__meta {
  font-size: 0.8125rem;
  color: var(--muted);
  margin-top: 8px;
}
/* "Read More →" link */
.blog-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--heading);
  margin-top: 20px;
  text-decoration: none;
  transition: gap var(--transition);
}
.blog-card__cta:hover {
  gap: 10px;
}
```

### 4.9 Awards / Recognitions List

Source: Images 4, 5 — typographic list with horizontal rules
```css
.award-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
}
.award-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--heading);
}
.award-year {
  font-size: 1rem;
  font-weight: 600;
  color: var(--heading);
}
/* Featured award (Image 4) — with centered trophy photo */
.award-featured {
  background: var(--white-section);
  border-radius: var(--radius-card);
  padding: 40px;
  text-align: center;
  margin-bottom: 16px;
}
```

### 4.10 Footer

Source: Image 1
```css
footer {
  background: var(--navy);
  color: #FFFFFF;
  padding-top: 56px;
  padding-bottom: 32px;
}
.footer-phone {
  font-size: 1.375rem;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: -0.01em;
}
.footer-email {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.70);
  margin-top: 4px;
}
.footer-copyright {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.50);
}
```

---

## 5. Global CSS — Animations & Scroll Reveals

```css
/* ── Entrance Animations ── */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}

.animate-fade-up   { animation: fadeUp  0.55s var(--ease) both; }
.animate-fade-in   { animation: fadeIn  0.45s var(--ease) both; }
.animate-slide-left { animation: slideLeft 0.60s var(--ease) both; }

/* Stagger for card grids */
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 80ms; }
.stagger-3 { animation-delay: 160ms; }
.stagger-4 { animation-delay: 240ms; }

/* ── Scroll Reveal — data-reveal pattern ── */
[data-reveal] {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
}
[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── Glassmorphism — Hero search bar ── */
.glass {
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* ── Nav scroll state ── */
.nav-scrolled {
  background: #FFFFFF !important;
  box-shadow: var(--shadow-nav);
  border-bottom: 1px solid var(--border);
}

/* ── Intersection Observer script ──
<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
</script>
*/
```

---

## 6. Page Section Order

Taken directly from the Springfield homepage scroll sequence:

```
1.  NAV — sticky, white bg
2.  HERO SLIDER — full viewport, project feature, search bar at bottom
3.  CEO VIDEO SECTION — split layout: text left, video carousel right (Image 8)
4.  STATS ROW — "Most Followed Real Estate Brand" + 4 stat cards (Image 7)
5.  WHY CHOOSE — photo grid left + numbered value props right (Image 6)
6.  PREMIUM LUXURY DEVELOPMENTS — labeled card carousel (Image 13)
7.  CTA BANNER — full-width image banner "Access the Latest Insights" (Image 12)
8.  LATEST OFFPLAN LAUNCHES — card carousel (Image 11)
9.  DEVELOPER LOGOS STRIP — 5 logos, bordered boxes (Image 10)
10. EXPLORE PRIME LOCATIONS — asymmetric photo grid (Image 9)
11. RECOGNITIONS & ACHIEVEMENTS — trophy feature + award list (Images 4, 5)
12. TESTIMONIALS — "The Trust We've Earned" Google review cards (Image 3)
13. LATEST BLOGS — 3-column editorial grid (Image 2)
14. FOOTER — navy, 5-column (Image 1)
```
