"use client";

import { useState } from "react";
import { Food } from "@/types/food";
import {
  createFoodAction,
  updateFoodAction,
} from "@/app/actions/food";
import { useRouter } from "next/navigation";
import { Ingredient } from "@/types/ingredient";

type Props = {
  food?: Food;
};

const inputClass =
  "w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-2.5 text-sm text-[#1B4332] transition focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20";

const textareaClass =
  "w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-3 text-sm text-[#1B4332] transition focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20";

const labelClass =
  "mb-1 block text-sm font-semibold text-[#1B4332]";

const helpTextClass =
  "mt-1 text-xs text-[#1B4332]/50";

export default function FoodForm({ food }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");

  // ---------------------------
  // BASIC FIELDS
  // ---------------------------
  const [name, setName] = useState(food?.name || "");
  const [description, setDescription] = useState(
    food?.description || ""
  );
  const [image, setImage] = useState(food?.image || "");
  const [link, setLink] = useState(food?.link || "");
  const [contributor, setContributor] = useState(
    food?.contributor || ""
  );
  const [course, setCourse] = useState(
    food?.course || ""
  );
  const [rating, setRating] = useState(food?.rating || 0);
  const [notes, setNotes] = useState(food?.notes || "");
  const [cookTime, setCookTime] = useState(
    food?.cookTime || ""
  );
  const [servings, setServings] = useState(
    food?.servings || ""
  );

  // ---------------------------
  // ARRAY FIELDS
  // ---------------------------
  const [cuisine, setCuisine] = useState(
    food?.cuisine?.join(", ") || ""
  );

  const [vibes, setVibes] = useState(
    food?.vibes?.join(", ") || ""
  );

  const [tags, setTags] = useState(
    food?.tags?.join(", ") || ""
  );

  // ---------------------------
  // INGREDIENTS
  // ---------------------------
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    food?.ingredients || [
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
    food?.steps?.length
      ? food.steps
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
    router.push("/food");
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async () => {
    setError("");

    const payload: Food = {
      name,
      slug: generateSlug(name),
      description,
      image,
      link,
      createdDate: food?.createdDate ?? new Date(),
      updatedDate: new Date(),
      notes,
      course,
      cookTime,
      servings,

      vibes: vibes
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),

      contributor,
      rating,

      cuisine: cuisine
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

      similarFoods: food?.similarFoods || [],
    };

    try {
      if (food) {
        const updatedFood = await updateFoodAction(
          food.slug,
          payload
        );

        router.push(`/food/${updatedFood.slug}`);
      } else {
        const newFood = await createFoodAction(payload);

        newFood
          ? router.push(`/food/${newFood.slug}`)
          : router.push("/food");
      }
    } catch (error: any) {
      console.error("Failed to save food:", error);

      setError(
        "Something went wrong while saving the food."
      );
    }
  };

  return (
      <main className="bg-[#F7F3E9] text-[#1B4332]">
      <div className="mx-auto w-full max-w-4xl px-6 py-6 sm:px-8 lg:px-12 bg-[#F7F3E9]">

        {/* HEADER */}
        <section className="mb-6">
          <h1 className="text-4xl font-bold text-[#1B4332]">
            {food ? "Edit Food Recipe" : "Create Food Recipe"}
          </h1>

          <p className="mt-1.5 text-[#1B4332]/60">
            {food
              ? "Update this recipe"
              : "Add a new recipe to Foudos"}
          </p>
        </section>

        <div className="space-y-7">

          {/* =========================
              BASIC INFORMATION
          ========================== */}
          <section>
            <SectionHeader
              title="Basic Information"
              description="The core information about this recipe."
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
              description="Separate multiple values with commas."
            />

            <div className="space-y-3.5">
              <div>
                <label className={labelClass}>
                  Cuisine
                </label>

                <input
                  className={inputClass}
                  value={cuisine}
                  onChange={(e) =>
                    setCuisine(e.target.value)
                  }
                />

                <p className={helpTextClass}>
                  Italian, Thai, Mexican, etc.
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
                  Cozy, Quick, Crowd-pleaser, Weeknight, etc.
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
              description="Additional details about the recipe."
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
                  Course
                </label>

                <input
                  className={inputClass}
                  value={course}
                  onChange={(e) =>
                    setCourse(e.target.value)
                  }
                />

                <p className={helpTextClass}>
                  Appetizer, Main, Dessert, etc.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Cook Time
                </label>

                <input
                  className={inputClass}
                  value={cookTime}
                  onChange={(e) =>
                    setCookTime(e.target.value)
                  }
                />

                <p className={helpTextClass}>
                  20 minutes, 1.5 hours, etc.
                </p>
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
              description="Add the ingredients and quantities for this recipe."
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
              description="Add the steps for making this recipe."
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
              {food ? "Update Food" : "Save Food"}
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
      </main>
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
