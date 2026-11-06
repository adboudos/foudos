import { createAuthedSupabaseClient } from "../supabase/authed";

export type MyRecipe = {
  slug: string;
  name: string;
  updatedAt: string;
};

export async function getDisplayName(userId: string): Promise<string | null> {
  const supabase = await createAuthedSupabaseClient();

  const { data } = await supabase
    .from("members")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  return data?.display_name ?? null;
}

export async function saveDisplayName(userId: string, name: string) {
  const supabase = await createAuthedSupabaseClient();

  // upsert so it also works if the sign-up row is somehow missing
  const { error } = await supabase
    .from("members")
    .upsert({ id: userId, display_name: name }, { onConflict: "id" });

  if (error) throw error;
}

async function listMine(table: "food" | "drinks", userId: string) {
  const supabase = await createAuthedSupabaseClient();

  const { data, error } = await supabase
    .from(table)
    .select("slug, name, updated_at")
    .eq("created_by", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(
    (r): MyRecipe => ({
      slug: r.slug,
      name: r.name,
      updatedAt: r.updated_at ?? "",
    })
  );
}

export const getMyFoods = (userId: string) => listMine("food", userId);
export const getMyDrinks = (userId: string) => listMine("drinks", userId);
