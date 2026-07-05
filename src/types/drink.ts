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