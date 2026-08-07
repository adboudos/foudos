import { createServerSupabaseClient } from "../supabase/server";
import { mapDrink } from "./mappers/drinks";


export async function getAllDrinks() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("drinks")
    .select("*");

  if (error) throw error;

  return (data ?? []).map(mapDrink);
}

export async function getDrink(slug: string) {
  const supabase = createServerSupabaseClient();

  if (!slug) return null;
  console.log("Fetching drink with slug:", slug);

  const { data, error } = await supabase
    .from("drinks")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  console.log("Supabase returned:", data);
  
  if (error) throw error;

  return data ? mapDrink(data) : null;
}

import { toDrinkRow } from "./mappers/drinks";
import type { Drink } from "@/types/drink";

export async function createDrink(drink: Drink) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("drinks")
    .insert(toDrinkRow(drink))
    .select()
    .maybeSingle();

  if (error) throw error;

  return data ? mapDrink(data) : null;
}

export async function updateDrink(slug: string, drink: Drink) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("drinks")
    .update(toDrinkRow(drink))
    .eq("slug", slug)
    .select()
    .single();

  if (error) throw error;

  return mapDrink(data);
}

export async function deleteDrink(slug: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("drinks")
    .delete()
    .eq("slug", slug);

  if (error) throw error;

  return true;
}