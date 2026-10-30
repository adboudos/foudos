import { NextResponse, type NextRequest } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed";
import { safeNext } from "@/lib/safeNext";

// Google and email links both land here with a one-time code, which we
// exchange for a session cookie.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createAuthedSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("Sign-in code exchange failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=1`);
}
