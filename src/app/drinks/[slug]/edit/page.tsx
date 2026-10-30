import { redirect } from "next/navigation";
import DrinkForm from "@/components/drinkComponents/DrinkForm";
import NoAccess from "@/components/auth/NoAccess";
import { getDrink } from "@/lib/db/drinks";
import { getAccess } from "@/lib/access";
import { canModify } from "@/lib/roles";

export default async function EditDrinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { userId, role } = await getAccess();

  if (!userId) {
    redirect(`/login?next=${encodeURIComponent(`/drinks/${slug}/edit`)}`);
  }

  const drink = await getDrink(slug);

  if (!drink) {
    return <div>Drink not found</div>;
  }

  if (!canModify(role, userId, drink.createdBy)) {
    return <NoAccess message="You can only edit drinks you added." />;
  }

  return <DrinkForm drink={drink} />;
}
