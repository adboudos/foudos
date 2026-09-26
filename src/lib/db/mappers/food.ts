import { Food, FoodRow } from "@/types/food";

export function mapFood(row: FoodRow): Food {
  return {
    createdDate: new Date(row.created_at ?? ""),
    updatedDate: new Date(row.updated_at ?? ""),
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    image: row.image ?? "",
    link: row.link ?? "",

    course: row.course ?? undefined,
    cuisine: row.cuisine ?? [],
    cookTime: row.cook_time ?? "",

    vibes: row.vibes ?? [],
    contributor: row.contributor ?? "",

    ingredients: row.ingredients ?? [],
    steps: row.steps ?? [],

    rating: row.rating ?? undefined,
    notes: row.notes ?? undefined,
    servings: row.servings ?? "",

    tags: row.tags ?? [],
    similarFoods: row.similar_foods ?? [],
  };
}

export function toFoodRow(food: Food): Partial<FoodRow> {
  return {
    slug: food.slug,
    name: food.name,
    description: food.description,
    image: food.image,
    link: food.link,

    course: food.course,
    cuisine: food.cuisine,
    cook_time: food.cookTime,

    vibes: food.vibes,
    contributor: food.contributor,

    ingredients: food.ingredients,
    steps: food.steps,

    rating: food.rating,
    notes: food.notes,
    servings: food.servings,

    tags: food.tags,
    similar_foods: food.similarFoods,
  };
}