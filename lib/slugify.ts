// SEO-optimised slug generator.
// Removes stop words from the middle of the string so slugs contain
// only meaningful keywords — better for Google ranking and click-through.
const STOP_WORDS = new Set([
  'a', 'an', 'the',
  'and', 'or', 'but', 'nor',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'into', 'onto', 'about', 'through', 'between',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'as', 'it', 'its', 'this', 'that', 'these', 'those',
  'do', 'does', 'did', 'has', 'have', 'had',
  'not', 'vs', 'vs.',
])

export function slugify(str: string): string {
  const words = str
    .toLowerCase()
    .normalize('NFD')                    // decompose accents e.g. é → e + ´
    .replace(/[̀-ͯ]/g, '')     // strip accent marks
    .replace(/[''`]/g, '')               // remove apostrophes (don't → dont)
    .replace(/[^a-z0-9\s]/g, ' ')       // everything else → space
    .split(/\s+/)
    .filter(Boolean)

  const filtered = words.filter((word, i) => {
    // Always keep the first and last words — removing them looks broken
    if (i === 0 || i === words.length - 1) return true
    return !STOP_WORDS.has(word)
  })

  return filtered
    .join('-')
    .replace(/-{2,}/g, '-')             // collapse consecutive hyphens
    .replace(/^-|-$/g, '')              // trim edges
    .slice(0, 75)                       // Google recommends ≤75 chars
}
