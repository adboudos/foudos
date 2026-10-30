/**
 * Foudos access levels. Pure helpers, safe to import from client or server.
 *
 *   general - view only (signed out, or signed in but revoked)
 *   friend  - create recipes; edit and delete their own
 *   family  - admin: add, edit and delete anything
 *
 * These checks drive the UI and friendly server-action errors. The real
 * enforcement is Row Level Security in the database (see
 * supabase/migrations), so hiding a button is never the only protection.
 */
export const ROLES = ["general", "friend", "family"] as const;

export type Role = (typeof ROLES)[number];

/** Anything unexpected is treated as the lowest level. */
export function toRole(value: unknown): Role {
  return ROLES.includes(value as Role) ? (value as Role) : "general";
}

export function canCreate(role: Role): boolean {
  return role === "friend" || role === "family";
}

export function canModify(
  role: Role,
  userId: string | null,
  createdBy?: string | null
): boolean {
  if (role === "family") return true;

  return role === "friend" && !!userId && !!createdBy && createdBy === userId;
}
