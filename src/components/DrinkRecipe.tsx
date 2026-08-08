"use client";

import Link from "next/link";
import { Drink } from "@/types/drink";
import { deleteDrinkAction } from "@/app/actions/drinks";
import { useRouter } from "next/navigation";

type DrinkRecipeProps = {
  drink: Drink;
};

export default function DrinkRecipe({ drink }: DrinkRecipeProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this drink?")) {
      await deleteDrinkAction(drink.slug);
      router.push("/drinks");
    }
  };

  return (
    <article className="min-h-screen bg-[#F7F3E9] text-[#1B4332]">

      {/* =========================================================
          HERO
      ========================================================= */}
      <header className="px-6 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-4xl">

          {/* Eyebrow */}
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] opacity-60">
            Cocktail
          </p>

          {/* Name */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {drink.name}
          </h1>

          {/* Description */}
          {drink.description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-75 sm:text-xl">
              {drink.description}
            </p>
          )}

          {/* Rating */}
          {typeof drink.rating === "number" && drink.rating > 0 && (
            <div className="mt-7 flex items-center justify-center gap-3">
              <span
                className="text-xl tracking-widest"
                aria-label={`${drink.rating} out of 5 stars`}
              >
                {"★".repeat(Math.round(drink.rating))}
                <span className="opacity-20">
                  {"★".repeat(5 - Math.round(drink.rating))}
                </span>
              </span>

              <span className="text-sm opacity-60">
                {drink.rating.toFixed(1)} / 5
              </span>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm">
            {drink.mainAlcohols && drink.mainAlcohols.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Spirit</span>
                <span className="opacity-60">
                  {drink.mainAlcohols.join(" · ")}
                </span>
              </div>
            )}

            {drink.glassType && (
              <>
                <span className="hidden opacity-30 sm:inline">•</span>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">Glass</span>
                  <span className="opacity-60">{drink.glassType}</span>
                </div>
              </>
            )}

            {drink.vibe && (
              <>
                <span className="hidden opacity-30 sm:inline">•</span>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">Vibe</span>
                  <span className="opacity-60">{drink.vibe}</span>
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          {drink.tags && drink.tags.length > 0 && (
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {drink.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#1B4332]/20 px-3 py-1 text-xs font-medium uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Source */}
          {drink.link && (
            <a
              href={drink.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block text-sm underline underline-offset-4 opacity-60 transition hover:opacity-100"
            >
              View original source →
            </a>
          )}
        </div>
      </header>

      {/* =========================================================
          IMAGE
          Only rendered when an image exists.
      ========================================================= */}
      {drink.image && (
        <section className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={drink.image}
              alt={drink.name}
              className="max-h-[650px] w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* =========================================================
          RECIPE
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:gap-20">

          {/* =====================================================
              INGREDIENTS
          ===================================================== */}
          <aside>
            <div className="lg:sticky lg:top-8">

              <div className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
                  What you need
                </p>

                <h2 className="text-3xl font-bold">
                  Ingredients
                </h2>
              </div>
              {/* Ingredient List */}
              <ul>
                {drink.ingredients.map((ingredient, index) => (
                  <li
                    key={`${ingredient.name}-${index}`}
                    className="flex gap-4 border-b border-[#1B4332]/10 py-4"
                  >
                    <span className="w-20 shrink-0 font-medium">
                      {ingredient.quantity ?? ""}
                      {ingredient.unit && ` ${ingredient.unit}`}
                    </span>

                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>

              {/* Additional Info */}
              {(drink.glassType || drink.vibe || drink.contributor) && (
                <div className="mt-10 space-y-5 border-t border-[#1B4332]/10 pt-8">

                  {drink.glassType && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-50">
                        Glass
                      </p>
                      <p className="mt-1 text-sm">
                        {drink.glassType}
                      </p>
                    </div>
                  )}

                  {drink.vibe && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-50">
                        Vibe
                      </p>
                      <p className="mt-1 text-sm">
                        {drink.vibe}
                      </p>
                    </div>
                  )}

                  {drink.contributor && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-50">
                        Recipe by
                      </p>
                      <p className="mt-1 text-sm">
                        {drink.contributor}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* =====================================================
              INSTRUCTIONS
          ===================================================== */}
          <main>
            <div className="mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
                How to make it
              </p>

              <h2 className="text-3xl font-bold">
                Instructions
              </h2>
            </div>

            {drink.steps && drink.steps.length > 0 ? (
              <ol className="space-y-8">
                {drink.steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex gap-5 border-b border-[#1B4332]/10 pb-8 last:border-0"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B4332] text-sm font-semibold text-[#F7F3E9]">
                      {String(index + 1)}
                    </span>

                    <p className="pt-1 text-lg leading-relaxed text-[#1B4332]/85 sm:text-xl">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-lg opacity-60">
                No instructions have been added yet.
              </p>
            )}
          </main>
        </div>
      </section>

      {/* =========================================================
          FOOTER / ACTIONS
      ========================================================= */}
      <footer className="border-t border-[#1B4332]/10 px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">

          <div className="text-sm opacity-50">
            {drink.updatedDate
              ? `Last updated ${new Date(drink.updatedDate).toLocaleDateString()}`
              : "Foudos Cocktail"}
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Link
              href={`/drinks/${drink.slug}/edit`}
              className="font-medium underline underline-offset-4 opacity-70 transition hover:opacity-100"
            >
              Edit recipe
            </Link>

            <button
              onClick={handleDelete}
              className="text-red-700/70 transition hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </footer>

    </article>
  );
}
