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
  const { data, error } = await supabase
    .from("drinks")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return mapDrink(data);
}