// lib/supabase.ts
// Supabase client setup for the Daily Notes App
// Uses @supabase/ssr for proper Next.js App Router support

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in Client Components (browser-side).
 * Uses the public anon key — safe to expose in the browser.
 * Row Level Security (RLS) in Supabase protects the data.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
