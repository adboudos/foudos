import FoodForm from "@/components/foodComponents/FoodForm";
import { getFood } from "@/lib/db/food";

export default async function EditFoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const food = await getFood(slug);

  if (!food) {
    return <div>Recipe not found</div>;
  }

  return <FoodForm food={food} />;
}

