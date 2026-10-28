"use server";

import { createFood, updateFood, deleteFood } from "@/lib/db/food";
import type { Food } from "@/types/food";
import { revalidatePath } from "next/cache";

function revalidateFoodList() {
  revalidatePath("/");
  revalidatePath("/food");
}

export async function updateFoodAction(slug: string, food: Food) {
  const updatedFood = await updateFood(slug, food);

  revalidateFoodList();
  revalidatePath(`/food/${slug}`);
  revalidatePath(`/food/${food.slug}`);

  return updatedFood;
}

export async function deleteFoodAction(slug: string) {
  const result = await deleteFood(slug);

  revalidateFoodList();
  revalidatePath(`/food/${slug}`);

  return result;
}

export async function createFoodAction(food: Food) {
  const newFood = await createFood(food);

  revalidateFoodList();

  return newFood;
}