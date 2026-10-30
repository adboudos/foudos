import { createAuthedSupabaseClient } from "@/lib/supabase/authed";
import { toRole, canCreate, type Role } from "@/lib/roles";

export type Access = {
  userId: string | null;
  role: Role;
};

/**
 * Who is making this request, and what level are they? Server-side only.
 * getClaims() verifies the session token, so cookies can't be faked.
 */
export async function getAccess(): Promise<Access> {
  const supabase = await createAuthedSupabaseClient();

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;

  if (!userId) return { userId: null, role: "general" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return { userId, role: toRole(profile?.role) };
}

/**
 * For Server Actions that create, edit or delete. Throws a readable error
 * for anyone below Friend. The database still enforces ownership, so this
 * is the friendly first line of defence, not the only one.
 */
export async function requireWriter(): Promise<Access> {
  const access = await getAccess();

  if (!access.userId) {
    throw new Error("Please sign in to do that.");
  }

  if (!canCreate(access.role)) {
    throw new Error("Your account can view recipes but not change them.");
  }

  return access;
}
