"use client";

import Link from "next/link";
import { Food } from "@/types/food";
import { deleteFoodAction } from "@/app/actions/food";
import { useRouter } from "next/navigation";

type FoodRecipeProps = {
  food: Food;
};

export default function FoodRecipe({ food }: FoodRecipeProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      await deleteFoodAction(food.slug);
      router.push("/food");
    }
  };

  return (
    <article className="min-h-screen bg-[#F7F3E9] text-[#1B4332]">

      {/* =========================================================
          HERO / RECIPE HEADER
      ========================================================= */}
      <header className="px-6 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-4xl">

          {/* Eyebrow */}
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] opacity-60">
            Recipe
          </p>

          {/* Title */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {food.name}
          </h1>

          {/* Description */}
          {food.description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-75 sm:text-xl">
              {food.description}
            </p>
          )}

          {/* =====================================================
              PRIMARY METADATA
              Course · Cuisine · Vibes
          ===================================================== */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-4 text-sm sm:text-base">

            {food.course && (
              <div>
                <span className="font-semibold">Course:</span>{" "}
                <span className="opacity-60">
                  {food.course}
                </span>
              </div>
            )}

            {food.cuisine && food.cuisine.length > 0 && (
              <>
                <span className="hidden opacity-30 sm:inline">•</span>

                <div>
                  <span className="font-semibold">Cuisine:</span>{" "}
                  <span className="opacity-60">
                    {food.cuisine.join(" · ")}
                  </span>
                </div>
              </>
            )}

            {food.vibes && food.vibes.length > 0 && (
              <>
                <span className="hidden opacity-30 sm:inline">•</span>

                <div>
                  <span className="font-semibold">Vibe:</span>{" "}
                  <span className="opacity-60">
                    {food.vibes.join(" · ")}
                  </span>
                </div>
              </>
            )}

          </div>

          {/* =====================================================
              SECONDARY METADATA
              Cook Time · Servings
          ===================================================== */}
          {(food.cookTime || food.servings) && (
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-4 text-sm sm:text-base">

              {food.cookTime && (
                <div>
                  <span className="font-semibold">Cook Time:</span>{" "}
                  <span className="opacity-60">
                    {food.cookTime}
                  </span>
                </div>
              )}

              {food.servings && (
                <>
                  <span className="hidden opacity-30 sm:inline">•</span>

                  <div>
                    <span className="font-semibold">Serves:</span>{" "}
                    <span className="opacity-60">
                      {food.servings}
                    </span>
                  </div>
                </>
              )}

            </div>
          )}

          {/* Rating */}
          {typeof food.rating === "number" && food.rating > 0 && food.rating < 5 && (
            <div className="mt-7 flex items-center justify-center gap-3">
              <span
                className="text-xl tracking-widest"
                aria-label={`${food.rating} out of 5 stars`}
              >
                {"★".repeat(Math.round(food.rating))}
                <span className="opacity-20">
                  {"★".repeat(5 - Math.round(food.rating))}
                </span>
              </span>

              <span className="text-sm opacity-60">
                {food.rating.toFixed(1)} / 5
              </span>
            </div>
          )}

          {/* Tags */}
          {food.tags && food.tags.length > 0 && (
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {food.tags.map((tag) => (
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
          {food.link && (
            <a
              href={food.link}
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
      {food.image && (
        <section className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={food.image}
              alt={food.name}
              className="max-h-[650px] w-full object-cover"
            />
          </div>
        </section>
      )}

      <div className="mx-auto max-w-4xl border-t border-[#1B4332]/10 px-6 sm:px-8" />

      {/* =========================================================
          RECIPE
      ========================================================= */}
      <section className="mx-auto max-w-4xl px-6 pt-8 pb-14 sm:px-8 sm:pt-10 sm:pb-20 border-t border-[#1B4332]/10" >

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.1fr)] lg:gap-20">

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

              <ul>
                {food.ingredients.map((ingredient, index) => (
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

            {food.steps && food.steps.length > 0 ? (
              <ol className="space-y-8">
                {food.steps.map((step, index) => (
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

            {/* Notes */}
            {food.notes && (
              <section className="mt-12 rounded-xl border border-[#1B4332]/10 bg-[#1B4332]/[0.04] p-6 sm:p-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
                  Notes
                </p>

                <p className="text-base leading-relaxed text-[#1B4332]/80 sm:text-lg">
                  {food.notes}
                </p>
              </section>
            )}

          </main>

        </div>
      </section>

      {/* =========================================================
          FOOTER / RECIPE INFO / ACTIONS
      ========================================================= */}
      <footer className="border-t border-[#1B4332]/10 px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          {/* Recipe information */}
          <div className="space-y-2 text-sm opacity-60 flex flex-col sm:flex-row gap-4">

            {food.contributor && (
              <p>
                Recipe by{" "}
                <span className="font-medium text-[#1B4332]">
                  {food.contributor}
                </span>
              </p>
            )}

            {food.createdDate && (
              <>
                <span className="hidden opacity-30 sm:inline">•</span>
                <span>
                  Created{" "}
                  {new Date(food.createdDate).toLocaleDateString()}
                </span>

              </>
            )}

            {food.updatedDate && (
              <>
                <span className="hidden opacity-30 sm:inline">•</span>
                <span>
                  Last updated{" "}
                  {new Date(food.updatedDate).toLocaleDateString()}
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5 text-sm">
            <Link
              href={`/food/${food.slug}/edit`}
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