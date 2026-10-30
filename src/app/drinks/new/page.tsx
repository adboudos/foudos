import { redirect } from "next/navigation";
import DrinkForm from "@/components/drinkComponents/DrinkForm";
import NoAccess from "@/components/auth/NoAccess";
import { getAccess } from "@/lib/access";
import { canCreate } from "@/lib/roles";

export default async function NewDrinkPage() {
  const { userId, role } = await getAccess();

  if (!userId) redirect("/login?next=/drinks/new");

  if (!canCreate(role)) {
    return <NoAccess message="Your account can view drinks but not add them." />;
  }

  return <DrinkForm />;
}
