import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client acting as the signed-in visitor (Server Components,
 * Server Actions and Route Handlers). Every write goes through this so the
 * database's Row Level Security sees who is asking.
 *
 * Create a new one per request; never keep it in a module-level variable.
 * Reading public data should keep using createServerSupabaseClient() from
 * ./server.ts, which doesn't touch cookies and keeps pages cacheable.
 */
export async function createAuthedSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, which can't set cookies.
            // Safe to ignore: the proxy refreshes the session on each request.
          }
        },
      },
    }
  );
}
