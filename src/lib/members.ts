/** Display-name rules. Mirrors the check constraint on public.members. */
export const DISPLAY_NAME_MIN = 2;
export const DISPLAY_NAME_MAX = 40;

export function validateDisplayName(input: string): string | null {
  const name = input.trim().replace(/\s+/g, " ");

  if (name.length < DISPLAY_NAME_MIN || name.length > DISPLAY_NAME_MAX) {
    return `Use ${DISPLAY_NAME_MIN}–${DISPLAY_NAME_MAX} characters.`;
  }

  if (/[@<>]/.test(name)) {
    return "Please don't use @, < or > (no email addresses).";
  }

  return null;
}

export function cleanDisplayName(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
