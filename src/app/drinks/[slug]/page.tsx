import { drinks } from "@/data/drinks";
import DrinkRecipe from "@/components/DrinkRecipe";

const drinkData: Record<string, any> = {
  "espresso-martini": {
    name: "Espresso Martini",
    description:
      "A bold, creamy cocktail that blends caffeine and alcohol into a perfect nightcap.",
    image:
      "https://images.unsplash.com/photo-1541542684-4a2b3a0f9b4c",

    mainAlcohols: ["Vodka", "Coffee Liqueur"],
    keyIngredients: ["Fresh espresso", "Simple syrup", "Coffee beans"],

    vibe: "Late night city bar energy",
    contributor: "Foudos Test Kitchen",

    rating: 4.8,
    glassType: "Martini Glass",
    tags: ["Classic", "Coffee", "Nightcap"],

    steps: [
      "Brew espresso and let it cool slightly.",
      "Add all ingredients to a shaker with ice.",
      "Shake vigorously until frothy.",
      "Strain into a chilled martini glass.",
      "Garnish with coffee beans.",
    ],

    similarDrinks: [
      {
        name: "White Russian",
        image:
          "https://images.unsplash.com/photo-1587223962930-cb7f31384c19",
      },
      {
        name: "Negroni",
        image:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
      },
    ],
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const drink = drinkData[slug];

  if (!drink) {
    return (
      <div className="p-20 text-center text-[#1B4332]">
        Drink not found
      </div>
    );
  }

  return <DrinkRecipe {...drink} />;
}