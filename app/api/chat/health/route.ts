import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'nodejs';
export const maxDuration = 15;

export async function GET() {
  const result: Record<string, unknown> = {
    env: {
      GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY
        ? 'set'
        : 'MISSING',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `set`
        : 'MISSING',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        ? `set`
        : 'MISSING',
    },
  };

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json({ ...result, gemini: 'skipped — key missing' }, { status: 503 });
  }

  try {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'Reply with exactly: ok',
    });

    return Response.json({ ...result, gemini: 'ok', response: text });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return Response.json({ ...result, gemini: 'error', error }, { status: 500 });
  }
}
