"use server";

import { createDrink, updateDrink, deleteDrink } from "@/lib/db/drinks";
import type { Drink } from "@/types/drink";

export async function updateDrinkAction(slug: string, drink: Drink) {
  return await updateDrink(slug, drink);
}

export async function deleteDrinkAction(slug: string) {
  return await deleteDrink(slug);
}

export async function createDrinkAction(drink: Drink) {
  return await createDrink(drink);
}