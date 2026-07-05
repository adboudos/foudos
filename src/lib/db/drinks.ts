import { supabase } from "../supabase/client";
import { mapDrink } from "./mappers/drinks";

export async function getAllDrinks() {
  const { data, error } = await supabase
    .from("drinks")
    .select("*");

  if (error) throw error;

  return (data ?? []).map(mapDrink);
}

export async function getDrink(slug: string) {
  if (!slug) return null;
  console.log("Fetching drink with slug:", slug);

  const { data } = await supabase
    .from("drinks")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  return data ?? null;

  return mapDrink(data);
}

import { toDrinkRow } from "./mappers/drinks";
import type { Drink } from "@/types/drink";

export async function createDrink(drink: Drink) {
  const { data, error } = await supabase
    .from("drinks")
    .insert(toDrinkRow(drink))
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function updateDrink(slug: string, drink: Drink) {
  const { data, error } = await supabase
    .from("drinks")
    .update(toDrinkRow(drink))
    .eq("slug", slug)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteDrink(slug: string) {
  const { error } = await supabase
    .from("drinks")
    .delete()
    .eq("slug", slug);

  if (error) throw error;

  return true;
}