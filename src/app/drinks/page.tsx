import DisplayCard from "@/components/DisplayCard";
import NavBar from "@/components/NavBar";
import { getAllDrinks } from "@/lib/db/drinks";
import Link from "next/link";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import DrinksContent from "@/components/DrinksContent";
import PageShell from "@/components/PageShell";

export const dynamic = "force-dynamic";

export default async function DrinksPage() {
  const drinks = await getAllDrinks();

  return (
    <main>
      <PageShell>
      {/* HEADER */}
      <section className="bg-[#1B4332] py-16 text-center text-[#F7F3E9]">
        <h1 className="mb-4 text-5xl font-bold">
          Drinks
        </h1>

        <p className="mx-auto max-w-2xl text-lg opacity-90">
          Cocktails, classics, and experiments worth pouring again.
        </p>
      </section>

      {/* SEARCH / ADD DRINK / GRID */}
      <section className="py-4 text-[#F7F3E9]">
        <DrinksContent drinks={drinks} />
      </section>

      <RealtimeRefresh />
      </PageShell>
    </main>
  );
}