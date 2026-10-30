import { redirect } from "next/navigation";
import FoodForm from "@/components/foodComponents/FoodForm";
import NoAccess from "@/components/auth/NoAccess";
import { getFood } from "@/lib/db/food";
import { getAccess } from "@/lib/access";
import { canModify } from "@/lib/roles";

export default async function EditFoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { userId, role } = await getAccess();

  if (!userId) {
    redirect(`/login?next=${encodeURIComponent(`/food/${slug}/edit`)}`);
  }

  const food = await getFood(slug);

  if (!food) {
    return <div>Recipe not found</div>;
  }

  if (!canModify(role, userId, food.createdBy)) {
    return <NoAccess message="You can only edit recipes you added." />;
  }

  return <FoodForm food={food} />;
}
