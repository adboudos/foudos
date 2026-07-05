"use client";

import { useState } from "react";
import { Drink } from "@/types/drink";
import PageShell from "@/components/PageShell";
import { createDrinkAction, updateDrinkAction } from "@/app/actions/drinks";
import { useRouter } from "next/navigation";

type Props = {
  drink?: Drink;
};

const inputClass =
  "w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1B4332]";

export default function DrinkForm({ drink }: Props) {
    const router = useRouter();
  // ---------------------------
  // BASIC FIELDS
  // ---------------------------
  const [name, setName] = useState(drink?.name || "");
  const [description, setDescription] = useState(drink?.description || "");
  const [image, setImage] = useState(drink?.image || "");
  const [link, setLink] = useState(drink?.link || "");
  const [vibe, setVibe] = useState(drink?.vibe || "");
  const [contributor, setContributor] = useState(drink?.contributor || "");
  const [glassType, setGlassType] = useState(drink?.glassType || "");
  const [rating, setRating] = useState(drink?.rating || 0);

  // ---------------------------
  // ARRAY FIELDS (stored as comma-separated [pipe for steps] input for simplicity)
  // ---------------------------
  const [mainAlcohols, setMainAlcohols] = useState(
    drink?.mainAlcohols?.join(", ") || ""
  );

  const [keyIngredients, setKeyIngredients] = useState(
    drink?.keyIngredients?.join(", ") || ""
  );

  const [steps, setSteps] = useState(
    drink?.steps?.join(" | ") || ""
  );

  const [tags, setTags] = useState(
    drink?.tags?.join(", ") || ""
  );
  const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async () => {
    const payload: Drink = {
      name,
      slug: generateSlug(name),
      description,
      image,
      link,
      createdDate: new Date(),
      updatedDate: new Date(),

      vibe,
      contributor,
      glassType,
      rating,

      mainAlcohols: mainAlcohols
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),

      keyIngredients: keyIngredients
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),

      steps: steps
        .split("|")
        .map((v) => v.trim())
        .filter(Boolean),

      tags: tags
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),

      similarDrinks: drink?.similarDrinks || [],
    };
    console.log("Submitting drink: ", payload);
    if (drink) {
        await updateDrinkAction(drink.slug, payload);
        router.push(`/drinks/${drink.slug}`);
        router.refresh()
    } else {
        await createDrinkAction(payload);
        router.push(`/drinks/${payload.slug}`);
        router.refresh()
    }
  };

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 border-b border-[#1B4332]/20 pb-4">
            <h1 className="text-3xl font-bold">
            {drink ? "Edit Drink" : "Create Drink"}
            </h1>
            <p className="text-sm opacity-70">
            {drink
                ? "Update this cocktail"
                : "Add a new cocktail to Foudos"}
            </p>
        </div>

        {/* FIELDS */}
        <input
            className={inputClass}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />

        <textarea
            className={inputClass}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Main Alcohols (comma separated)"
            value={mainAlcohols}
            onChange={(e) => setMainAlcohols(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Key Ingredients (comma separated)"
            value={keyIngredients}
            onChange={(e) => setKeyIngredients(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Steps (separate with | )"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Vibe"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Contributor"
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
        />

        <input
            className={inputClass}
            placeholder="Glass Type"
            value={glassType}
            onChange={(e) => setGlassType(e.target.value)}
        />

        <input
            className={inputClass}
            type="number"
            step="0.1"
            placeholder="Rating (0–5)"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
        />

        <input
            className={inputClass}
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
        />

        {/* SAVE */}
        <button
            onClick={handleSubmit}
            className="w-full rounded-lg bg-[#1B4332] py-3 text-[#F7F3E9] hover:bg-[#2D6A4F] transition"
        >
            Save Drink
        </button>
        </div>
    </PageShell>
  );
}

