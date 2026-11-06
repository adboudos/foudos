"use server";

import { revalidatePath } from "next/cache";
import { getAccess } from "@/lib/access";
import { saveDisplayName } from "@/lib/db/members";
import { cleanDisplayName, validateDisplayName } from "@/lib/members";

export type ProfileState = { ok: boolean; message: string };

export async function saveDisplayNameAction(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const { userId } = await getAccess();

  if (!userId) return { ok: false, message: "Please sign in first." };

  const raw = String(formData.get("displayName") ?? "");
  const problem = validateDisplayName(raw);
  if (problem) return { ok: false, message: problem };

  try {
    await saveDisplayName(userId, cleanDisplayName(raw));
  } catch (err) {
    console.error("Saving display name failed:", err);
    return { ok: false, message: "Couldn't save your name. Please try again." };
  }

  // Credits on recipes are renamed by the database, so refresh everything.
  revalidatePath("/", "layout");

  return { ok: true, message: "Saved." };
}
