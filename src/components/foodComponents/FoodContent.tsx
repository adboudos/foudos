"use client";

import { useState } from "react";
import Link from "next/link";
import DisplayCard from "@/components/DisplayCard";
import FoodSearch from "@/components/foodComponents/FoodSearch";
import { Food } from "@/types/food"

type SearchFood = {
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  relevance?: number;
};

type FoodContentProps = {
  foods: Food[];
};

export default function FoodContent({
  foods,
}: FoodContentProps) {
  const [filteredFoods, setFilteredFoods] = useState<Food[]>(foods);
  const [isSearching, setIsSearching] = useState(false);

  function handleSearchResults(results: SearchFood[]) {
    if (results.length === 0) {
      setFilteredFoods(foods);
      setIsSearching(false);
      return;
    }

    const foodsBySlug = new Map(
      foods.map((food) => [food.slug, food])
    );

    const rankedResults = results
      .map((result) => foodsBySlug.get(result.slug))
      .filter((food): food is Food => Boolean(food));

    setFilteredFoods(rankedResults);
    setIsSearching(true);
  }

  return (
    <>
    {/* ADD / SEARCH */}
    <section className="mx-auto max-w-6xl px-8 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <Link href="/food/new">
          <button
            className="h-10 rounded-lg bg-[#1B4332] px-4 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F]"
          >
            + Add New Food
          </button>
        </Link>
        
        {isSearching && (
          <div className="mb-4 text-m font-bold text-[#1B4332]">
            {filteredFoods.length === 0
              ? "No recipes found."
              : `${filteredFoods.length} ${
                  filteredFoods.length === 1 ? "recipe" : "recipes"
                } found`}
          </div>
        )}
        
        <FoodSearch onResults={handleSearchResults} />

      </div>
    </section>

    {/* DIVIDER */}
    <div className="mx-auto max-w-6xl px-8">
      <div className="border-t border-[#1B4332]/10" />
    </div>

    {/* GRID */}
    <section className="mx-auto max-w-6xl px-8 py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {filteredFoods.slice(0, 30).map((food) => (
          <DisplayCard
            key={food.slug}
            title={food.name}
            description={food.description}
            titleOne="Cuisine"
            valuesOne={food.cuisine}
            titleTwo="Course"
            valuesTwo={food.course ? [food.course] : []}
            vibes={food.vibes}
            type="food"
            slug={food.slug}
          />
        ))}
      </div>
    </section>
    </>
  );
}