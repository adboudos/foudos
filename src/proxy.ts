import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

// Next.js 16 calls this file "proxy" (it used to be "middleware").
export async function proxy(request: NextRequest) {
  // Anonymous visitors have no Supabase cookie, so there is nothing to
  // refresh. Skipping them keeps public page views fast.
  const hasSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-"));

  if (!hasSession) return NextResponse.next();

  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except static files and images.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
