import RealtimeRefresh from "@/components/RealtimeRefresh";
import FoodContent from "@/components/foodComponents/FoodContent";
import { getAllFoods } from "@/lib/db/food";

export const dynamic = "force-dynamic";

export default async function FoodPage() {
  const foods = await getAllFoods();

  return (
    <main>
      {/* HEADER */}
      <section className="bg-[#1B4332] py-16 text-center text-[#F7F3E9]">
        <h1 className="mb-4 text-5xl font-bold">
          Food
        </h1>

        <p className="mx-auto max-w-2xl text-lg opacity-90">
            Something witty about recipes
        </p>
      </section>

      {/* SEARCH / ADD FOOD / GRID */}
      <section className=" bg-[#F7F3E9] text-[#F7F3E9]">
        <FoodContent foods={foods} />
      </section>

      <RealtimeRefresh />
    </main>
  );
}