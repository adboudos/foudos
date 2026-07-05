import DrinkForm from "@/components/DrinkForm";
import PageShell from "@/components/PageShell";
import { getDrink } from "@/lib/db/drinks";

export default async function EditDrinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const drink = await getDrink(slug);

  if (!drink) {
    return <PageShell>Drink not found</PageShell>;
  }

  return <DrinkForm drink={drink} />;
}

