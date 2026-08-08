
import { Drink, DrinkRow } from "@/types/drink";

export function mapDrink(row: DrinkRow): Drink {
  return {
    createdDate: new Date(row.created_at ?? ""),
    updatedDate: new Date(row.updated_at ?? ""),
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    image: row.image ?? "",
    link: row.link ?? "",

    mainAlcohols: row.main_alcohols ?? [],
    keyIngredients: row.key_ingredients ?? [],

    vibes: row.vibes ?? [],
    contributor: row.contributor ?? "",

    ingredients: row.ingredients ?? [],
    steps: row.steps ?? [],

    rating: row.rating ?? undefined,
    glassType: row.glass_type ?? undefined,
    iceType: row.ice_type ?? undefined,
    servings: row.servings ?? "",
    garnish: row.garnish ?? undefined,
    notes: row.notes ?? undefined,

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

    vibes: drink.vibes,
    contributor: drink.contributor,

    ingredients: drink.ingredients,
    steps: drink.steps,

    rating: drink.rating,
    glass_type: drink.glassType,
    notes: drink.notes,
    ice_type: drink.iceType,
    servings: drink.servings,
    garnish: drink.garnish,
    tags: drink.tags,
    similar_drinks: drink.similarDrinks,
  };
}