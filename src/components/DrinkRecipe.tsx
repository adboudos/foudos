"use client";

import Link from "next/dist/client/link";
import { Drink } from "@/types/drink";
import { deleteDrinkAction } from "@/app/actions/drinks";
import { useRouter } from "next/navigation";

type DrinkRecipeProps = {
  drink: Drink;
};



export default function DrinkRecipe({
  drink,
}: DrinkRecipeProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this drink?")) {
      await deleteDrinkAction(drink.slug);
      router.push("/drinks");
    }
  };

  return (
    <article className="min-h-screen bg-[#F7F3E9] text-[#1B4332]">

      {/* HEADER */}
      <header className="bg-[#1B4332] text-[#F7F3E9] px-8 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">{drink.name}</h1>

        <p className="mx-auto max-w-3xl text-lg opacity-90">
          {drink.description}
        </p>

        {/* Optional rating */}
        {typeof drink.rating === "number" && (
          <div className="mt-4 text-lg">
            {"★".repeat(Math.round(drink.rating))}
            <span className="opacity-70 ml-2">
              ({drink.rating.toFixed(1)}/5)
            </span>
          </div>
        )}

        {/* Tags */}
        {drink.tags && drink.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(drink.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F7F3E9] px-3 py-1 text-sm text-[#1B4332]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {drink.link && (
          <a
            href={drink.link}
            target="_blank"
            className="mt-6 inline-block text-sm underline opacity-80 hover:opacity-100"
          >
            View original source
          </a>
        )}
        {/* EDIT BUTTON */}
        <div className="mt-6">
          <Link
            href={`/drinks/${drink.slug}/edit`}
            className="text-sm underline opacity-80 hover:opacity-100"
          >
            Edit Drink
          </Link>
        </div>

      </header>

      {/* IMAGE + DETAILS */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 py-16 md:grid-cols-2">

        {/* IMAGE */}
        <div className="overflow-hidden rounded-xl shadow-lg">
          <img
            src={drink.image}
            alt={drink.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* INFO */}
        <div className="space-y-8">

          {/* Main Alcohols */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Main Alcohol(s)
            </h2>
            <div className="flex flex-wrap gap-2">
              {(drink.mainAlcohols ?? []).map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-[#1B4332] px-3 py-1 text-sm text-[#F7F3E9]"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Key Ingredients */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Key Ingredients
            </h2>
            <ul className="space-y-2 text-base">
              {(drink.keyIngredients ?? []).map((i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#1B4332]" />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          {/* Glass Type */}
          {drink.glassType && (
            <div>
              <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
                Glass Type
              </h2>
              <p className="text-gray-700">{drink.glassType}</p>
            </div>
          )}

          {/* Vibe */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Vibe
            </h2>
            <p className="text-gray-700">{drink.vibe}</p>
          </div>

          {/* Contributor */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Contributor
            </h2>
            <p className="text-gray-700">{drink.contributor}</p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-4xl px-8 pb-20">
        <h2 className="text-3xl font-bold mb-6 border-b border-[#1B4332]/20 pb-3">
          Steps
        </h2>

        <ol className="space-y-6">
          {(drink.steps ?? []).map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B4332] text-[#F7F3E9] text-sm font-bold">
                {idx + 1}
              </span>
              <p className="text-lg leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Delete */}
      <section>
        <button
          onClick={async () => {
            handleDelete();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Drink
        </button>
      </section>
    </article>
  );
}