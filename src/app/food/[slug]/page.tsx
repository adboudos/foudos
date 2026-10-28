import FoodRecipe from "@/components/foodComponents/FoodRecipe";
import { getFood } from "@/lib/db/food";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const food = await getFood(slug)

  if (!food) {
    return (
        <div className="p-20 text-center bg-[#F7F3E9] text-[#1B4332]">
            Recipe not found
        </div>
    );
  }

  return <FoodRecipe food={food} />;
}