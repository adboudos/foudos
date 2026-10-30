import { NextResponse, type NextRequest } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed";

// POST only, so a stray link or image tag can't sign someone out.
export async function POST(request: NextRequest) {
  const supabase = await createAuthedSupabaseClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
