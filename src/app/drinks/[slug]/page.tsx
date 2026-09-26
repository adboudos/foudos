import DrinkRecipe from "@/components/drinkComponents/DrinkRecipe";
import { getDrink } from "@/lib/db/drinks";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const drink = await getDrink(slug)

  if (!drink) {
    return (
        <div className="p-20 text-center bg-[#F7F3E9]text-[#1B4332]">
            Drink not found
        </div>
    );
  }

  return <DrinkRecipe drink={drink} />;
}