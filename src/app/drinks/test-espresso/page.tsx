import DrinkRecipe from "@/components/DrinkRecipe";

export default function Page() {
  return (
    <DrinkRecipe
      name="Espresso Martini"
      description="A bold, creamy cocktail that blends caffeine and alcohol into a perfect nightcap."
      image="https://images.unsplash.com/photo-1541542684-4a2b3a0f9b4c"
      link="https://example.com/espresso-martini"

      mainAlcohols={["Vodka", "Coffee Liqueur"]}
      keyIngredients={[
        "Fresh espresso",
        "Simple syrup",
        "Coffee beans (garnish)",
      ]}

      vibe="Late night city bar, dim lights, smooth jazz, post-dinner energy."
      contributor="Foudos Test Kitchen"

      steps={[
        "Brew a fresh shot of espresso and let it cool slightly.",
        "Add vodka, coffee liqueur, and espresso to a shaker with ice.",
        "Shake vigorously until frothy.",
        "Strain into a chilled martini glass.",
        "Garnish with three coffee beans and serve immediately.",
      ]}
    />
  );
}