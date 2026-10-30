"use server";

import { createDrink, updateDrink, deleteDrink } from "@/lib/db/drinks";
import type { Drink } from "@/types/drink";
import { revalidatePath } from "next/cache";
import { requireWriter } from "@/lib/access";

function revalidateDrinkList() {
  revalidatePath("/");
  revalidatePath("/drinks");
}

export async function updateDrinkAction(slug: string, drink: Drink) {
  await requireWriter();

  const updatedDrink = await updateDrink(slug, drink);

  revalidateDrinkList();
  revalidatePath(`/drinks/${slug}`);
  revalidatePath(`/drinks/${drink.slug}`);

  return updatedDrink;
}

export async function deleteDrinkAction(slug: string) {
  await requireWriter();

  const result = await deleteDrink(slug);

  revalidateDrinkList();
  revalidatePath(`/drinks/${slug}`);

  return result;
}

export async function createDrinkAction(drink: Drink) {
  await requireWriter();

  const newDrink = await createDrink(drink);

  revalidateDrinkList();

  return newDrink;
}
