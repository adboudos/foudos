import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Drink {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    link?: string;
    createdDate: Date;
    updatedDate: Date;

    mainAlcohols: string[];
    keyIngredients: string[];

    vibe: string;
    contributor: string;

    steps: string[];

    rating?: number;
    glassType?: string;

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

  vibe: string | null;
  contributor: string | null;

  steps: string[] | null;

  rating: number | null;
  glass_type: string | null;

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

  vibe: string;
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