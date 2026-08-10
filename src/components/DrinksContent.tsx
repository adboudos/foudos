"use client";

import { useState } from "react";
import Link from "next/link";
import DisplayCard from "@/components/DisplayCard";
import DrinkSearch from "@/components/DrinkSearch";

type Drink = {
  slug: string;
  name: string;
  description: string;
  image: string;
  tags?: string[];
};

type SearchDrink = {
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  relevance?: number;
};

type DrinksContentProps = {
  drinks: Drink[];
};

export default function DrinksContent({
  drinks,
}: DrinksContentProps) {
  const [filteredDrinks, setFilteredDrinks] = useState<Drink[]>(drinks);
  const [isSearching, setIsSearching] = useState(false);

  function handleSearchResults(results: SearchDrink[]) {
    if (results.length === 0) {
      setFilteredDrinks(drinks);
      setIsSearching(false);
      return;
    }

    const drinksBySlug = new Map(
      drinks.map((drink) => [drink.slug, drink])
    );

    const rankedResults = results
      .map((result) => drinksBySlug.get(result.slug))
      .filter((drink): drink is Drink => Boolean(drink));

    setFilteredDrinks(rankedResults);
    setIsSearching(true);
  }

  return (
    <>
      {/* SEARCH / ADD DRINK */}
      <section className="mx-auto  bg-[#F7F3E9] sticky top-15 z-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-8 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/drinks/new">
            <button className="rounded bg-[#1B4332] px-4 py-2 text-[#F7F3E9]">
              + Add Drink
            </button>
          </Link>
          <DrinkSearch onResults={handleSearchResults} />
        </div>
        <div className="mx-auto border-t border-[#1B4332]/10" />
      </section>

      {/* DIVIDER */}


      {/* GRID */}
      <section className="mx-auto max-w-7xl px-8 py-8">
        {isSearching && filteredDrinks.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">
              No drinks found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {filteredDrinks.slice(0, 30).map((drink) => (
              <DisplayCard
                key={drink.slug}
                title={drink.name}
                description={drink.description}
                image={drink.image}
                tags={drink.tags?.join(", ") ?? ""}
                type="Drink"
                slug={drink.slug}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}