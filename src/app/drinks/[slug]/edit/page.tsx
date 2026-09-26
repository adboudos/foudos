import DrinkForm from "@/components/DrinkForm";
import { getDrink } from "@/lib/db/drinks";

export default async function EditDrinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const drink = await getDrink(slug);

  if (!drink) {
    return <div>Drink not found</div>;
  }

  return <DrinkForm drink={drink} />;
}

