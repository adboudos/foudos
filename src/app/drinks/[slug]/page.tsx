import { drinks } from "@/data/drinks";
import DrinkRecipe from "@/components/DrinkRecipe";
import { getDrink } from "@/lib/db/drinks";
import PageShell from "@/components/PageShell";


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const drink = await getDrink(slug)

  if (!drink) {
    return (
      <PageShell>
        <div className="p-20 text-center text-[#1B4332]">
            Drink not found
        </div>
      </PageShell>
    );
  }

  return <DrinkRecipe drink={drink} />;
}