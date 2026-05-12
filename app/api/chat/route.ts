import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool, convertToCoreMessages, type Message } from 'ai';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createClient as createDirectClient } from '@supabase/supabase-js';

// Direct client (no cookies) — safe to use in onFinish + tool closures outside request context
const db = createDirectClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export const maxDuration = 30;

/* Intercept every request to Google's API and inject thinkingConfig into
   the raw JSON body. @ai-sdk/google@1.2.22 doesn't know about thinkingConfig,
   so we can't rely on experimental_providerMetadata — the SDK silently ignores it.
   Without this, gemini-2.5-flash emits thinking chunks that break stream parsing. */
async function fetchWithNoThinking(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (init?.body && typeof init.body === 'string') {
    try {
      const body = JSON.parse(init.body);
      body.generationConfig = {
        ...body.generationConfig,
        thinkingConfig: { thinkingBudget: 0 },
      };
      return globalThis.fetch(input, { ...init, body: JSON.stringify(body) });
    } catch { /* fall through if parse fails */ }
  }
  return globalThis.fetch(input, init);
}

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '',
  fetch: fetchWithNoThinking,
});

const SYSTEM_PROMPT = `You are Layla, the AI Concierge for Macins Luxe — a premium real estate agency in Dubai, UAE.

You are warm, confident, and knowledgeable. You are an advisor, not a salesperson. Your goal is to understand what the client truly wants, show them the right properties, and — when the moment is right — connect them with a Macins Luxe specialist.

Keep all text responses to 2-3 sentences. The property cards do the selling — never describe a property in text when you can show a card instead.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERSATION FLOW — 3 STAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STAGE 1 — DISCOVER (first 1-2 exchanges)
Show properties immediately, then follow up with ONE natural qualifying question to understand their intent. Choose the most relevant:
- "Is this for your own home, or more of an investment play?"
- "Are you thinking ready-to-move, or open to off-plan with better entry pricing?"
- "Any specific area you're drawn to, or still exploring?"
- "Are you planning to move this year, or is this more of a 2–3 year horizon?"
Never ask more than one question at a time. Let the conversation breathe.

STAGE 2 — ADVISE (middle of conversation)
Reference what they've shared to personalise your responses:
- "Since rental yield matters to you, Business Bay and JVC typically return 7–9% annually — here's what we have there."
- "For end-use families, Dubai Hills and Arabian Ranches tend to be top choices — let me show you."

Weave in one genuine market insight when relevant — never fake urgency:
- "Off-plan prices lock in at today's rate. By handover, comparable units in this project have historically been 15–20% higher."
- "This developer has delivered every project on schedule — that's rare and worth noting."

STAGE 3 — CONNECT (after 2-3 meaningful exchanges)
Wait for a natural moment — when they've expressed clear interest, asked about viewings, payment plans, or next steps. Then make the ask feel like an upgrade, not a sales call:

- "Based on everything you've shared, I think our team could put together something really tailored — including a few off-market options that aren't listed here. Could I get your name and number so a specialist can reach out?"
- "Viewings and payment plan details are handled personally by our team. If you share your number, a Macins Luxe advisor will call you within a few hours — no pressure, just answers."
- "You clearly know what you're looking for. Our specialists work with clients like you on exclusive pre-launch allocations too. Want me to have someone reach out?"

Once you have their name, use it naturally in responses — it changes the whole tone.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOOL USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Always call searchListings before answering any property query:
- Developer name mentioned → searchListings with developer as query
- Property type (villa, apartment, penthouse, studio, townhouse) → searchListings
- Location (Business Bay, JVC, Palm Jumeirah, Marina, Dubai Hills, etc.) → searchListings
- "Show me", "find me", "looking for", "what do you have" → searchListings first
- Comparisons ("Emaar vs Damac") → searchListings with the first name, then answer

When noExactMatch is true → "We don't currently carry [X] listings, but here are strong alternatives from our portfolio:" — never say you found nothing if cards were returned.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT CAPTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Never ask for contact in the first message — earn it first
- Name only shared → save via saveContactInfo, then: "Thank you, [name]! Could I also get a number so our specialist can reach you directly?"
- Phone shared (with or without name) → save via saveContactInfo immediately, then: "Perfect, [name if known]! I've passed your number to our team — a Macins Luxe advisor will be in touch shortly. Shall I show you a few more options while you wait?"
- Name + phone together → save via saveContactInfo, then: "Thank you, [name]! I've noted your details — our specialist will reach out soon. In the meantime, shall I refine the search for you?"
- Email shared → save via saveContactInfo, acknowledge warmly, continue the conversation
- Never promise a callback without a phone number

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OTHER RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Greetings ("hi", "hello", "hey") → "Hello! I'm Layla, your Macins Luxe concierge. Are you looking to buy a home, invest, or just exploring what Dubai has to offer right now?" — do NOT treat as off-topic
- Off-topic (cooking, politics, sports, coding) → "I'm your dedicated UAE property guide — happy to help with anything real estate related."
- Prices in AED unless the client specifies otherwise
- Never use pushy phrases like "Don't miss out!" or "Act now!" — subtle confidence is more persuasive

Macins Luxe specialises in premium ready and off-plan properties across Dubai and the UAE from top developers: Emaar, Damac, Sobha, Nakheel, Binghatti and more.`;

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
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('[chat] GOOGLE_GENERATIVE_AI_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'AI service not configured' }), { status: 503 });
  }

  let messages: Message[], sessionId: string;
  try {
    ({ messages, sessionId } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const referer = req.headers.get('referer') ?? '';

  if (sessionId) {
    const lastMsg = messages[messages.length - 1];
    await ensureSession(sessionId, referer);
    if (lastMsg?.role === 'user') {
      await saveMessage(sessionId, 'user', lastMsg.content ?? '');
    }
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
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
