
import { Drink, DrinkRow } from "@/types/drink";

export function mapDrink(row: DrinkRow): Drink {
  return {
    id: row.id,
    createdDate: new Date(row.created_at ?? ""),
    updatedDate: new Date(row.updated_at ?? ""),
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    image: row.image ?? "",
    link: row.link ?? "",

    mainAlcohols: row.main_alcohols ?? [],
    keyIngredients: row.key_ingredients ?? [],

    vibe: row.vibe ?? "",
    contributor: row.contributor ?? "",

    steps: row.steps ?? [],

    rating: row.rating ?? undefined,
    glassType: row.glass_type ?? undefined,

    tags: row.tags ?? [],
    similarDrinks: row.similar_drinks ?? [],
  };
}

export function toDrinkRow(drink: Drink): Partial<DrinkRow> {
  return {
    slug: drink.slug,
    name: drink.name,
    description: drink.description,
    image: drink.image,

    main_alcohols: drink.mainAlcohols,
    key_ingredients: drink.keyIngredients,

    vibe: drink.vibe,
    contributor: drink.contributor,

    steps: drink.steps,

    rating: drink.rating,
    glass_type: drink.glassType,

    tags: drink.tags,
    similar_drinks: drink.similarDrinks,
  };
}