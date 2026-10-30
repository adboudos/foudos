/**
 * Only allow same-site relative paths after sign-in, so a crafted link
 * can't bounce someone to another website (open redirect).
 */
export function safeNext(value: string | null | undefined): string {
  if (!value) return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//") || value.startsWith("/\\")) return "/";

  return value;
}
