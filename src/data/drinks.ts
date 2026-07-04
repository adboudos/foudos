export type Drink = {
  slug: string;
  name: string;
  description: string;
  image: string;

  mainAlcohols: string[];
  keyIngredients: string[];

  vibe: string;
  contributor: string;

  rating?: number;
  glassType?: string;
  tags?: string[];

  steps: string[];
};

export const drinks: Drink[] = [
  {
    slug: "espresso-martini",
    name: "Espresso Martini",
    description: "A bold coffee cocktail.",
    image: "https://images.unsplash.com/photo-1541542684-4a2b3a0f9b4c",
    mainAlcohols: ["Vodka", "Coffee Liqueur"],
    keyIngredients: ["Espresso", "Simple syrup"],
    vibe: "Late night city bar",
    contributor: "Foudos",
    rating: 4.8,
    glassType: "Martini Glass",
    tags: ["Classic", "Coffee"],
    steps: ["Shake", "Strain", "Serve"],
  },
];