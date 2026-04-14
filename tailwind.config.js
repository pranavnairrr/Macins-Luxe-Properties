/** @type {import('tailwindcss').Config} */

// ============================================================
// SPRINGFIELD PROPERTIES — Extracted Design System
// Source: springfieldproperties.ae — 15 homepage screenshots
// Rule: ZERO external memory. Only what is visible in screenshots.
// ============================================================

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      // ─────────────────────────────────────────────────────
      // COLORS — Strictly from screenshots
      // ─────────────────────────────────────────────────────
      colors: {

        // PRIMARY NAVY
        // Source: footer bg (Image 1), hero gradient (Image 14/15),
        //         "Springfield AI" nav button (Image 14/15)
        // Reads as a medium-depth royal blue-navy, not midnight, not cobalt
        navy: {
          DEFAULT: "#1B3079",   // primary brand navy
          dark:    "#152567",   // deepened — hero overlay depth, hover states
          light:   "#1F3A8F",   // lifted — subtle variation in footer blocks
        },

        // PAGE CANVAS
        // Source: all white-section screenshots — pure white, zero warmth
        white: {
          DEFAULT: "#FFFFFF",
          section: "#F5F6F8",   // light grey — stats row bg (Image 7), testimonials bg (Image 3)
          card:    "#EDEEF1",   // testimonial card background (Image 3)
        },

        // HEADING TEXT COLOR
        // Source: "Most Followed Real Estate Brand" (Image 7),
        //         "Latest Offplan Launches" (Image 11), "Why Choose" (Image 6)
        // Reads as dark blue-grey, distinctly not pure black
        heading: "#1A2535",

        // BODY TEXT
        // Source: description paragraphs in Image 6, Image 8
        body:  "#3D4F63",

        // MUTED / META TEXT
        // Source: "April 3, 2026 — 08 min read" (Image 2), "2 months ago" (Image 3),
        //         "Starting Price" label (Image 11, 13)
        muted: "#8895A2",

        // RED ACCENT
        // Source: logo location pin (Image 1, 14, 15), YouTube button badge (Image 8)
        // Used ONLY in these two places — not a general UI accent
        red: "#E8352B",

        // ENQUIRE NOW BUTTON
        // Source: Image 10, 11, 12, 13
        // This button reads as dark charcoal/slate — NOT the same navy as footer.
        // It is visibly darker and more desaturated than the navy.
        cta: {
          bg:   "#2B3D52",
          text: "#FFFFFF",
        },

        // DIVIDERS & BORDERS
        // Source: footer horizontal rule (Image 1), developer logo boxes (Image 10)
        border: {
          DEFAULT:  "#DDE1E9",
          on_dark:  "rgba(255, 255, 255, 0.15)",  // inside navy footer
        },

        // HANDOVER BADGE on property card images
        // Source: Image 11, 12, 13 — "Handover: Q4 2027" etc.
        badge: "rgba(0, 0, 0, 0.48)",

        // PROPERTY PRICE COLOR
        // Source: "AED 3.5M", "AED 585K" in Image 11
        // Reads as the same dark heading color, bolded
        price: "#1A2535",
      },

      // ─────────────────────────────────────────────────────
      // TYPOGRAPHY
      //
      // Visual analysis:
      // — All headings are a geometric sans-serif, heavy weight
      //   "Most Followed Real Estate Brand in the UAE" — bold, tight tracking
      //   "Latest Offplan Launches" — bold, large
      // — Body copy is the same family at lighter weights
      // — Nav links are medium weight, normal tracking
      // — The letterforms are rounded, not condensed — consistent with Poppins
      // ─────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["Poppins", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        body:    ["Poppins", "sans-serif"],
      },

      fontSize: {
        // Hero slide headline — "Binghatti Skyflame In Majan" (Image 14)
        // Bold, very large, white, tight line-height
        "hero":   ["clamp(2rem, 3.75vw, 3.25rem)", {
          lineHeight: "1.15",
          letterSpacing: "-0.02em",
          fontWeight: "700",
        }],

        // Section title — "Latest Offplan Launches", "Most Followed Real Estate Brand"
        "h1":     ["clamp(1.75rem, 2.75vw, 2.375rem)", {
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
          fontWeight: "700",
        }],

        // Sub-section titles — "Why Choose Springfield Properties?" (Image 6),
        //                       "Our Recognitions & Achievements" (Image 4, 5)
        "h2":     ["clamp(1.375rem, 2vw, 1.875rem)", {
          lineHeight: "1.3",
          letterSpacing: "-0.015em",
          fontWeight: "700",
        }],

        // Card / numbered titles — "1. Market Expertise", "2. Comprehensive Services" (Image 6)
        // Property card titles — "Golf Vale", "Greenz by Danube" (Image 11, 13)
        "h3":     ["1.125rem", {
          lineHeight: "1.4",
          letterSpacing: "-0.01em",
          fontWeight: "600",
        }],

        // Body copy — "With years of experience..." (Image 6)
        "body":   ["1rem", {
          lineHeight: "1.75",
          letterSpacing: "0em",
          fontWeight: "400",
        }],

        // Small body — card description text, stat card descriptions (Image 7)
        "sm":     ["0.9375rem", {
          lineHeight: "1.6",
          letterSpacing: "0em",
          fontWeight: "400",
        }],

        // Meta — dates, read-time (Image 2), "Starting Price" label (Image 11)
        "xs":     ["0.8125rem", {
          lineHeight: "1.5",
          letterSpacing: "0.01em",
          fontWeight: "400",
        }],

        // Stat number — "AED 3B+", "200+", "17+ YEARS", "5,000+" (Image 7)
        "stat":   ["clamp(1.75rem, 2.5vw, 2.25rem)", {
          lineHeight: "1.1",
          letterSpacing: "-0.02em",
          fontWeight: "700",
        }],

        // Stat label — "Properties Sold", "Professionals" (Image 7)
        "stat-label": ["0.9375rem", {
          lineHeight: "1.4",
          letterSpacing: "0em",
          fontWeight: "700",
        }],

        // Button — "Enquire Now", "View Details", "Read More →" (Images 2, 10, 11)
        "btn":    ["0.875rem", {
          lineHeight: "1",
          letterSpacing: "0.01em",
          fontWeight: "600",
        }],

        // Footer column headings — "Quick Links", "Company", "Buy from" (Image 1)
        "footer-h": ["0.9375rem", {
          lineHeight: "1.4",
          letterSpacing: "0em",
          fontWeight: "600",
        }],

        // Footer links, phone, email (Image 1)
        "footer-link": ["0.9375rem", {
          lineHeight: "1.8",
          letterSpacing: "0em",
          fontWeight: "400",
        }],
      },

      // ─────────────────────────────────────────────────────
      // SPACING — From visual rhythm in screenshots
      // ─────────────────────────────────────────────────────
      spacing: {
        // Section vertical padding
        // Estimated from consistent white-space between sections
        "section":    "80px",
        "section-sm": "56px",
        "section-lg": "108px",

        // Container edge gutters
        "gutter":     "24px",    // mobile
        "gutter-md":  "40px",    // tablet
        "gutter-lg":  "64px",    // desktop

        // Card internal padding — Image 7 stat cards, Image 3 testimonial cards
        "card":       "24px",
        "card-lg":    "32px",

        // Grid column gaps — the 3-col property grid (Images 11, 13)
        "gap":        "24px",
        "gap-lg":     "32px",
      },

      maxWidth: {
        "container": "1380px",
        "readable":  "720px",
      },

      // ─────────────────────────────────────────────────────
      // BORDER RADIUS
      // Property cards: visible soft rounding ~8px (Images 11, 13)
      // Testimonial cards: ~12px (Image 3)
      // Enquire Now buttons: ~4–6px (Images 10, 11)
      // Developer logo boxes: ~8px (Image 10)
      // ─────────────────────────────────────────────────────
      borderRadius: {
        "sm":   "4px",
        "md":   "8px",    // cards, logo boxes
        "lg":   "12px",   // testimonial cards, modal-type containers
        "pill": "9999px",
      },

      // ─────────────────────────────────────────────────────
      // BOX SHADOWS — Soft, navy-tinted
      // Cards lift very subtly — no heavy drop shadows visible
      // ─────────────────────────────────────────────────────
      boxShadow: {
        "card":       "0 2px 12px rgba(27, 48, 121, 0.08)",
        "card-hover": "0 8px 28px rgba(27, 48, 121, 0.16)",
        "nav":        "0 2px 12px rgba(27, 48, 121, 0.10)",
      },

      // ─────────────────────────────────────────────────────
      // ASPECT RATIOS — from property card images
      // Property cards (Images 11, 13): landscape, approx 16:9
      // Location grid hero image (Image 9, left): tall, approx 2:1.5
      // ─────────────────────────────────────────────────────
      aspectRatio: {
        "property": "16 / 9",
        "location": "4 / 3",
        "hero":     "21 / 9",
        "portrait": "3 / 4",
      },

      // ─────────────────────────────────────────────────────
      // GRID TEMPLATES — from layout in screenshots
      // ─────────────────────────────────────────────────────
      gridTemplateColumns: {
        "cards-3":    "repeat(3, 1fr)",
        "cards-4":    "repeat(4, 1fr)",
        "location":   "2fr 1fr 1fr",        // Image 9: big left + 2 smaller right
        "footer":     "auto 1fr 1fr 1fr 1fr auto",
        "hero-split": "1fr 1fr",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
