import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components that need the signed-in session
 * (sign in, sign out, reading the user's own role). The session lives in
 * cookies so the server can see it too. createBrowserClient reuses a single
 * instance in the browser, so calling this repeatedly is fine.
 *
 * Public, read-only data still goes through the plain client in ./client.ts.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
