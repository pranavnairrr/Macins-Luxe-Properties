import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool, convertToCoreMessages } from 'ai';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createClient as createDirectClient } from '@supabase/supabase-js';

// Direct client (no cookies) — safe to use in onFinish + tool closures outside request context
const db = createDirectClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const SYSTEM_PROMPT = `You are the AI Concierge for Macins Luxe, a premium real estate agency in the UAE.

Your role: Help clients find properties, understand the UAE market, and make informed decisions. Be professional, concise, and luxury-brand appropriate in tone.

TOOL USE — always call searchListings before answering property queries:
- Any developer name mentioned → call searchListings with developer as query
- Any property type (villa, apartment, penthouse, studio) → call searchListings
- Any location (Business Bay, JVC, Palm Jumeirah, Marina) → call searchListings
- "Show me", "find me", "looking for" → call searchListings first
- Comparisons ("Emaar vs Damac") → call searchListings with the first developer, then answer

When the tool returns noExactMatch: true — say "We don't currently carry [X] listings, but here are top alternatives from our portfolio:" and show the cards. Never say you found nothing if the tool returned cards.

CONTACT CAPTURE & AGENT CALLBACKS:
- If user asks for a callback or to speak with an agent, and has NOT shared a phone number: ask "Of course! To connect you with a Macins Luxe agent, could I get your name and phone number?"
- If user shares their name ONLY (no phone): save the name via saveContactInfo, then ask "Thank you! Could I also get your phone number so our agent can reach you?"
- If user shares phone number (with or without name): call saveContactInfo immediately, then respond: "Perfect, I've noted your number — a Macins Luxe agent will call you shortly. In the meantime, shall I show you some properties?"
- If user shares name + phone together: call saveContactInfo, then respond: "Thank you, [name]! I've noted your details — a Macins Luxe agent will call you shortly. In the meantime, shall I show you some properties?"
- If user shares email: save via saveContactInfo and acknowledge warmly
- Never promise a callback without having a phone number first

Keep text responses to 2-3 sentences. The cards do the selling — don't describe properties in text.

Other rules:
- Greetings ("hi", "hello", "hey", etc.): respond warmly — "Hello! I'm your Macins Luxe AI Concierge. Looking to buy, invest, or explore UAE properties? Tell me what you have in mind." Do NOT call this off-topic.
- Only answer real estate / UAE market / Macins Luxe questions
- Off-topic (cooking, politics, sports, coding, etc.): "I'm here exclusively to help with UAE property — how can I assist with your real estate search?"
- Prices in AED unless specified

Macins Luxe specialises in premium ready and off-plan properties across Dubai and the UAE from top developers (Emaar, Damac, Sobha, Nakheel and more).`;

async function ensureSession(sessionId: string, pageUrl: string) {
  const now = new Date().toISOString();
  const { error } = await db.from('chat_sessions').upsert(
    { id: randomUUID(), session_id: sessionId, page_url: pageUrl, created_at: now, updated_at: now },
    { onConflict: 'session_id' }
  );
  if (error) console.error('[chat] session upsert:', error.message, error.code);
}

async function saveMessage(sessionId: string, role: string, content: string) {
  if (!content?.trim() || !sessionId) return;
  const now = new Date().toISOString();
  const { error: msgErr } = await db.from('chat_messages').insert({
    id: randomUUID(), session_id: sessionId, role, content, created_at: now,
  });
  if (msgErr) console.error('[chat] message insert:', msgErr.message, msgErr.code);
  const { error: sessErr } = await db.from('chat_sessions').update({
    last_message: content.slice(0, 120),
    updated_at: now,
  }).eq('session_id', sessionId);
  if (sessErr) console.error('[chat] session update:', sessErr.message, sessErr.code);
}

async function updateContact(sessionId: string, fields: { name?: string; phone?: string; email?: string }) {
  if (!sessionId) return;
  const update: Record<string, string> = { updated_at: new Date().toISOString() };
  if (fields.name)  update.contact_name  = fields.name;
  if (fields.phone) update.contact_phone = fields.phone;
  if (fields.email) update.contact_email = fields.email;
  const { error } = await db.from('chat_sessions').update(update).eq('session_id', sessionId);
  if (error) console.error('[chat] contact update:', error.message, error.code);
}

export async function POST(req: Request) {
  let messages: unknown[], sessionId: string;
  try {
    ({ messages, sessionId } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const referer = req.headers.get('referer') ?? '';

  // Ensure session exists and save user's latest message
  if (sessionId) {
    const lastMsg = (messages as { role: string; content: string }[])[messages.length - 1];
    await ensureSession(sessionId, referer);
    if (lastMsg?.role === 'user') {
      await saveMessage(sessionId, 'user', lastMsg.content ?? '');
    }
  }

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: SYSTEM_PROMPT,
    messages: convertToCoreMessages(messages),
    maxSteps: 5,
    experimental_telemetry: { isEnabled: false },
    onError: (err) => {
      console.error('[chat] streamText error:', err);
    },
    onFinish: async ({ text }) => {
      if (sessionId && text?.trim()) {
        await saveMessage(sessionId, 'assistant', text);
      }
    },
    tools: {
      searchListings: tool({
        description: 'Search Macins Luxe property listings from the database. Always call this before answering any property search query.',
        parameters: z.object({
          query: z.string().describe('Search keywords: location, property name, or developer'),
          maxPrice: z.string().optional().describe('Maximum price in AED, e.g. "5000000"'),
          propertyType: z.string().optional().describe('Type: apartment, villa, penthouse, townhouse, office'),
          beds: z.string().optional().describe('Number of bedrooms, e.g. "3", "Studio", "4+"'),
          category: z.enum(['premium', 'offplan']).optional().describe('premium = ready properties, offplan = under construction'),
        }),
        execute: async ({ query, maxPrice, propertyType, beds, category }) => {
          try {
            let q = db
              .from('listings')
              .select('id, name, price, location, beds, badge, developer, images, category, status')
              .eq('status', 'published')
              .limit(6);

            if (query && query.trim()) {
              q = q.or(`name.ilike.%${query}%,location.ilike.%${query}%,developer.ilike.%${query}%`);
            }
            if (category) q = q.eq('category', category);
            if (beds?.trim()) q = q.ilike('beds', `%${beds}%`);
            if (propertyType?.trim()) q = q.or(`name.ilike.%${propertyType}%,beds.ilike.%${propertyType}%`);

            const { data, error } = await q;
            if (error) console.error('[searchListings] query error:', error.message, error.code);

            if (error || !data || data.length === 0) {
              const { data: fallback, error: fbErr } = await db
                .from('listings')
                .select('id, name, price, location, beds, badge, developer, images, category, status')
                .eq('status', 'published')
                .limit(6);
              if (fbErr) console.error('[searchListings] fallback error:', fbErr.message, fbErr.code);

              return {
                listings: (fallback ?? []).map(l => ({
                  id: l.id, name: l.name, price: l.price, location: l.location,
                  beds: l.beds, badge: l.badge, developer: l.developer,
                  imageUrl: Array.isArray(l.images) ? l.images[0] : null,
                  category: l.category,
                })),
                noExactMatch: true,
              };
            }

            const parseStoredPrice = (s: string): number => {
              if (!s) return NaN;
              const num = parseFloat(s.replace(/[^0-9.]/g, ''));
              if (isNaN(num)) return NaN;
              const u = s.toUpperCase();
              if (u.includes('M')) return num * 1_000_000;
              if (u.includes('K')) return num * 1_000;
              return num;
            };

            let listings = data;
            if (maxPrice) {
              const max = parseFloat(maxPrice.replace(/[^0-9.]/g, ''));
              if (!isNaN(max)) {
                listings = listings.filter(l => {
                  const p = parseStoredPrice(l.price ?? '');
                  return isNaN(p) || p <= max;
                });
              }
            }

            return {
              listings: listings.map(l => ({
                id: l.id, name: l.name, price: l.price, location: l.location,
                beds: l.beds, badge: l.badge, developer: l.developer,
                imageUrl: Array.isArray(l.images) ? l.images[0] : null,
                category: l.category,
              })),
              noExactMatch: false,
            };
          } catch (err) {
            console.error('[searchListings] unexpected error:', err instanceof Error ? err.message : err);
            return { listings: [], noExactMatch: true };
          }
        },
      }),

      saveContactInfo: tool({
        description: 'Save contact information when a user shares their name, phone number, or email address.',
        parameters: z.object({
          name:  z.string().optional().describe('Full name of the user'),
          phone: z.string().optional().describe('Phone number'),
          email: z.string().optional().describe('Email address'),
        }),
        execute: async ({ name, phone, email }) => {
          await updateContact(sessionId, { name, phone, email });
          return { saved: true };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
