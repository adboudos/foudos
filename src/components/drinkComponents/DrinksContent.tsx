"use client";

import { useState } from "react";
import Link from "next/link";
import DisplayCard from "@/components/DisplayCard";
import DrinkSearch from "@/components/drinkComponents/DrinkSearch";
import { Drink } from "@/types/drink"

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
    {/* ADD / SEARCH */}
    <section className="mx-auto max-w-6xl px-8 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <Link href="/drinks/new">
          <button
            className="h-10 rounded-lg bg-[#1B4332] px-4 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F]"
          >
            + Add New Drink
          </button>
        </Link>
        
        {isSearching && (
          <div className="mb-4 text-m font-bold text-[#1B4332]">
            {filteredDrinks.length === 0
              ? "No drinks found."
              : `${filteredDrinks.length} ${
                  filteredDrinks.length === 1 ? "drink" : "drinks"
                } found`}
          </div>
        )}
        
        <DrinkSearch onResults={handleSearchResults} />

      </div>
    </section>

    {/* DIVIDER */}
    <div className="mx-auto max-w-6xl px-8">
      <div className="border-t border-[#1B4332]/10" />
    </div>

    {/* GRID */}
    <section className="mx-auto max-w-6xl px-8 py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {filteredDrinks.slice(0, 30).map((drink) => (
          <DisplayCard
            key={drink.slug}
            title={drink.name}
            description={drink.description}
            image={drink.image}
            titleOne="Main Alcohols"
            valuesOne={drink.mainAlcohols}
            titleTwo="Key Ingredients"
            valuesTwo={drink.keyIngredients}
            vibes={drink.vibes}
            type="drinks"
            slug={drink.slug}
          />
        ))}
      </div>
    </section>
    </>
  );
}