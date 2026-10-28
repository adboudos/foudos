import { createServerSupabaseClient } from "../supabase/server";
import { mapFood, toFoodRow } from "./mappers/food";
import type { Food } from "@/types/food";

export async function getAllFoods() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("food")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapFood);
}

export async function getFood(slug: string) {
  const supabase = createServerSupabaseClient();

  if (!slug) return null;

  const { data, error } = await supabase
    .from("food")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data ? mapFood(data) : null;
}

export async function createFood(food: Food) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("food")
    .insert(toFoodRow(food))
    .select()
    .maybeSingle();

  if (error) throw error;

  return data ? mapFood(data) : null;
}

export async function updateFood(slug: string, food: Food) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("food")
    .update(toFoodRow(food))
    .eq("slug", slug)
    .select()
    .single();

  if (error) throw error;

  return mapFood(data);
}

export async function deleteFood(slug: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("food")
    .delete()
    .eq("slug", slug);

  if (error) throw error;

  return true;
}