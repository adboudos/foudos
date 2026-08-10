
"use client";

import { useState } from "react";
import { Drink } from "@/types/drink";
import PageShell from "@/components/PageShell";
import {
  createDrinkAction,
  updateDrinkAction,
} from "@/app/actions/drinks";
import { useRouter } from "next/navigation";
import { Ingredient } from "@/types/ingredient";

type Props = {
  drink?: Drink;
};

const inputClass =
  "w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-2.5 text-sm text-[#1B4332] transition focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20";

const textareaClass =
  "w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-3 text-sm text-[#1B4332] transition focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20";

const labelClass =
  "mb-1 block text-sm font-semibold text-[#1B4332]";

const helpTextClass =
  "mt-1 text-xs text-[#1B4332]/50";

export default function DrinkForm({ drink }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");

  // ---------------------------
  // BASIC FIELDS
  // ---------------------------
  const [name, setName] = useState(drink?.name || "");
  const [description, setDescription] = useState(
    drink?.description || ""
  );
  const [image, setImage] = useState(drink?.image || "");
  const [link, setLink] = useState(drink?.link || "");
  const [contributor, setContributor] = useState(
    drink?.contributor || ""
  );
  const [glassType, setGlassType] = useState(
    drink?.glassType || ""
  );
  const [rating, setRating] = useState(drink?.rating || 0);
  const [notes, setNotes] = useState(drink?.notes || "");
  const [iceType, setIceType] = useState(drink?.iceType || "");
  const [servings, setServings] = useState(
    drink?.servings || ""
  );
  const [garnish, setGarnish] = useState(
    drink?.garnish || ""
  );

  // ---------------------------
  // ARRAY FIELDS
  // ---------------------------
  const [mainAlcohols, setMainAlcohols] = useState(
    drink?.mainAlcohols?.join(", ") || ""
  );

  const [keyIngredients, setKeyIngredients] = useState(
    drink?.keyIngredients?.join(", ") || ""
  );

  const [vibes, setVibes] = useState(
    drink?.vibes?.join(", ") || ""
  );

  const [tags, setTags] = useState(
    drink?.tags?.join(", ") || ""
  );

  // ---------------------------
  // INGREDIENTS
  // ---------------------------
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    drink?.ingredients || [
      {
        quantity: null,
        unit: "",
        name: "",
      },
    ]
  );

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        quantity: null,
        unit: "",
        name: "",
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(
      ingredients.filter((_, i) => i !== index)
    );
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: any
  ) => {
    setIngredients(
      ingredients.map((ingredient, i) =>
        i === index
          ? { ...ingredient, [field]: value }
          : ingredient
      )
    );
  };

  // ---------------------------
  // PREPARATION STEPS
  // ---------------------------
  const [steps, setSteps] = useState<string[]>(
    drink?.steps?.length
      ? drink.steps
      : [""]
  );

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index: number) => {
    setSteps(
      steps.filter((_, i) => i !== index)
    );
  };

  const updateStep = (index: number, value: string) => {
    setSteps(
      steps.map((step, i) =>
        i === index ? value : step
      )
    );
  };

  // ---------------------------
  // SLUG
  // ---------------------------
  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // ---------------------------
  // CANCEL
  // ---------------------------
  const handleCancel = () => {
    router.push("/drinks");
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async () => {
    setError("");

    const payload: Drink = {
      name,
      slug: generateSlug(name),
      description,
      image,
      link,
      createdDate: drink?.createdDate ?? new Date(),
      updatedDate: new Date(),
      notes,
      iceType,
      servings,
      garnish,

      vibes: vibes
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),

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

      ingredients: ingredients.filter(
        (ingredient) => ingredient.name.trim() !== ""
      ),

      // Steps are now already an array
      steps: steps
        .map((step) => step.trim())
        .filter(Boolean),

      tags: tags
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),

      similarDrinks: drink?.similarDrinks || [],
    };

    try {
      if (drink) {
        const updatedDrink = await updateDrinkAction(
          drink.slug,
          payload
        );

        router.push(`/drinks/${updatedDrink.slug}`);
      } else {
        const newDrink = await createDrinkAction(payload);

        newDrink
          ? router.push(`/drinks/${newDrink.slug}`)
          : router.push("/drinks");
      }
    } catch (error: any) {
      console.error("Failed to save drink:", error);

      setError(
        "Something went wrong while saving the drink."
      );
    }
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-4xl px-6 py-6 sm:px-8 lg:px-12">

        {/* HEADER */}
        <section className="mb-6">
          <h1 className="text-4xl font-bold text-[#1B4332]">
            {drink ? "Edit Drink" : "Create Drink"}
          </h1>

          <p className="mt-1.5 text-[#1B4332]/60">
            {drink
              ? "Update this cocktail"
              : "Add a new cocktail to Foudos"}
          </p>
        </section>

        <div className="space-y-7">

          {/* =========================
              BASIC INFORMATION
          ========================== */}
          <section>
            <SectionHeader
              title="Basic Information"
              description="The core information about this cocktail."
            />

            <div className="space-y-3.5">
              <div>
                <label className={labelClass}>Name</label>

                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Description
                </label>

                <textarea
                  rows={3}
                  className={textareaClass}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Image URL
                </label>

                <input
                  className={inputClass}
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Link
                  <span className="ml-1 font-normal text-[#1B4332]/40">
                    (optional)
                  </span>
                </label>

                <input
                  className={inputClass}
                  value={link}
                  onChange={(e) =>
                    setLink(e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* =========================
              KEY ELEMENTS
          ========================== */}
          <section>
            <SectionHeader
              title="Key Elements"
              description="These fields help define the drink's character."
            />

            <div className="space-y-3.5">
              <div>
                <label className={labelClass}>
                  Main Alcohols
                </label>

                <input
                  className={inputClass}
                  value={mainAlcohols}
                  onChange={(e) =>
                    setMainAlcohols(e.target.value)
                  }
                />

                <p className={helpTextClass}>
                  Separate multiple alcohols with commas.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Key Ingredients
                </label>

                <input
                  className={inputClass}
                  value={keyIngredients}
                  onChange={(e) =>
                    setKeyIngredients(e.target.value)
                  }
                />

                <p className={helpTextClass}>
                  Separate multiple ingredients with commas.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Vibes
                </label>

                <input
                  className={inputClass}
                  value={vibes}
                  onChange={(e) =>
                    setVibes(e.target.value)
                  }
                />

                <p className={helpTextClass}>
                  Examples: refreshing, boozy, bitter, tropical.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Tags
                </label>

                <input
                  className={inputClass}
                  value={tags}
                  onChange={(e) =>
                    setTags(e.target.value)
                  }
                />

                <p className={helpTextClass}>
                  Separate multiple tags with commas.
                </p>
              </div>
            </div>
          </section>

          {/* =========================
              DETAILS
          ========================== */}
          <section>
            <SectionHeader
              title="Details"
              description="Additional details about the cocktail."
            />

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Contributor
                </label>

                <input
                  className={inputClass}
                  value={contributor}
                  onChange={(e) =>
                    setContributor(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Glass Type
                </label>

                <input
                  className={inputClass}
                  value={glassType}
                  onChange={(e) =>
                    setGlassType(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Ice Type
                </label>

                <input
                  className={inputClass}
                  value={iceType}
                  onChange={(e) =>
                    setIceType(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Servings
                </label>

                <input
                  type="number"
                  className={inputClass}
                  value={servings}
                  onChange={(e) =>
                    setServings(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Garnish
                </label>

                <input
                  className={inputClass}
                  value={garnish}
                  onChange={(e) =>
                    setGarnish(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Rating
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className={inputClass}
                  value={rating}
                  onChange={(e) =>
                    setRating(
                      Number(e.target.value)
                    )
                  }
                />

                <p className={helpTextClass}>
                  Rating from 0–5.
                </p>
              </div>
            </div>
          </section>

          {/* =========================
              INGREDIENTS
          ========================== */}
          <section>
            <SectionHeader
              title="Ingredients"
              description="Add the ingredients and quantities for this drink."
            />

            <div className="space-y-2.5">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[#1B4332]/10 bg-[#1B4332]/[0.02] p-3"
                >
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[100px_120px_1fr_auto]">

                    <div>
                      <label className={labelClass}>
                        Quantity
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        className={inputClass}
                        value={
                          ingredient.quantity ?? ""
                        }
                        onChange={(e) =>
                          updateIngredient(
                            index,
                            "quantity",
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Unit
                      </label>

                      <input
                        className={inputClass}
                        value={ingredient.unit}
                        onChange={(e) =>
                          updateIngredient(
                            index,
                            "unit",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Ingredient
                      </label>

                      <input
                        className={inputClass}
                        value={ingredient.name}
                        onChange={(e) =>
                          updateIngredient(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-end pb-2">
                      <button
                        type="button"
                        onClick={() =>
                          removeIngredient(index)
                        }
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addIngredient}
                className="rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F]"
              >
                + Add Ingredient
              </button>
            </div>
          </section>

          {/* =========================
              PREPARATION
          ========================== */}
          <section>
            <SectionHeader
              title="Preparation"
              description="Add the steps for making this cocktail."
            />

            <div className="space-y-2.5">

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 rounded-lg border border-[#1B4332]/10 bg-[#1B4332]/[0.02] p-3"
                >
                  <div className="flex-1">
                    <label className={labelClass}>
                      Step {index + 1}
                    </label>

                    <input
                      className={inputClass}
                      value={step}
                      onChange={(e) =>
                        updateStep(
                          index,
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeStep(index)
                    }
                    className="mb-2 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addStep}
                className="rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F]"
              >
                + Add Step
              </button>

              <div className="pt-2">
                <label className={labelClass}>
                  Notes
                </label>

                <textarea
                  rows={2}
                  className={textareaClass}
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 border-t border-[#1B4332]/10 pt-5 sm:flex-row-reverse">
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-[#1B4332] py-3 font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F] sm:flex-1"
            >
              {drink ? "Update Drink" : "Save Drink"}
            </button>

            <button
              onClick={handleCancel}
              className="w-full rounded-lg bg-[#D9D9D9] py-3 font-medium text-[#333] transition hover:bg-[#BFBFBF] sm:flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* --------------------------------
   SECTION HEADER
-------------------------------- */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-3 border-b border-[#1B4332]/10 pb-2">
      <h2 className="text-lg font-bold text-[#1B4332]">
        {title}
      </h2>

      <p className="mt-0.5 text-xs text-[#1B4332]/50">
        {description}
      </p>
    </div>
  );
}

