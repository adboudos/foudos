import { redirect } from "next/navigation";
import FoodForm from "@/components/foodComponents/FoodForm";
import NoAccess from "@/components/auth/NoAccess";
import { getAccess } from "@/lib/access";
import { canCreate } from "@/lib/roles";

export default async function NewFoodPage() {
  const { userId, role } = await getAccess();

  if (!userId) redirect("/login?next=/food/new");

  if (!canCreate(role)) {
    return <NoAccess message="Your account can view recipes but not add them." />;
  }

  return <FoodForm />;
}
