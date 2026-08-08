import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { Ingredient } from "./ingredient";

export type Drink = {
    slug: string;
    name: string;
    description: string;
    image: string;
    link?: string;
    createdDate: Date;
    updatedDate: Date;

    mainAlcohols: string[];
    keyIngredients: string[];

    vibes: string[];
    contributor: string;

    ingredients: Ingredient[];
    steps: string[];

    rating?: number;
    glassType?: string;
    iceType?: string;
    servings?: string;
    garnish?: string;
    notes?: string;
    tags?: string[];

    similarDrinks?: string[];
}

export type DrinkRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  link: string | null;
  updated_at: Timestamp | null;
  created_at: Timestamp | null;

  main_alcohols: string[] | null;
  key_ingredients: string[] | null;
  vibes: string[] | null;
  contributor: string | null;
  rating: number | null;

  ingredients: Ingredient[] | null;
  steps: string[] | null;

  glass_type: string | null;
  ice_type: string | null;
  notes: string | null;
  servings: string | null;
  garnish: string | null;
  tags: string[] | null;

  similar_drinks: string[] | null;

};

type DrinkRecipeProps = {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  link?: string;

  mainAlcohols: string[];
  keyIngredients: string[];

  vibes: string[];
  contributor: string;

  steps?: string[];

  rating?: number; // 0–5 scale
  glassType?: string;
  tags?: string[];
  similarDrinks?: {
    name: string;
    image?: string;
  }[];
};