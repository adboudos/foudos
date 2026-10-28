import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { Ingredient } from "./ingredient";

export type Food = {
    slug: string;
    name: string;
    description: string;
    image: string;
    link?: string;
    createdDate: Date;
    updatedDate: Date;

    course?: string;
    cuisine?: string[];
    cookTime?: string;

    
    vibes: string[];
    contributor: string;

    ingredients: Ingredient[];
    steps: string[];

    rating?: number;

    servings?: string;

    notes?: string;
    tags?: string[];

    similarFoods?: string[];
}

export type FoodRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  link: string | null;
  updated_at: Timestamp | null;
  created_at: Timestamp | null;

  course: string | null;
  cuisine: string[] | null;
  cook_time: string | null;
  vibes: string[] | null;
  contributor: string | null;
  rating: number | null;

  ingredients: Ingredient[] | null;
  steps: string[] | null;


  notes: string | null;
  servings: string | null;

  tags: string[] | null;

  similar_foods: string[] | null;

};

type FoodRecipeProps = {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  link?: string;

  course?: string;
  cuisine?: string[];
  cookTime?: string;

  vibes: string[];
  contributor: string;

  steps?: string[];

  rating?: number; // 0–5 scale

  tags?: string[];
  similarDrinks?: {
    name: string;
    image?: string;
  }[];
};