import type { Ingredient } from "./ingredient";

/**
 * Shape returned by /api/food/extract. Only contains fields that can be
 * read from a recipe photo; image, link, contributor and rating are left
 * for the user to fill in.
 */
export type ExtractedRecipe = {
  name: string;
  description: string;
  course: string;
  cuisine: string[];
  tags: string[];
  cookTime: string;
  /** Digits only (the form's servings input is type="number"), or "". */
  servings: string;
  ingredients: Ingredient[];
  steps: string[];
  notes: string;
};

export type ExtractResponse =
  | { recipe: ExtractedRecipe; uncertain: string[] }
  | { error: string };
