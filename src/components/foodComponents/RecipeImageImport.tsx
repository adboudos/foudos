"use client";

import { useRef, useState } from "react";
import type {
  ExtractedRecipe,
  ExtractResponse,
} from "@/types/extractedRecipe";

type Props = {
  onExtracted: (recipe: ExtractedRecipe) => void;
};

const MAX_FILES = 3;
// Long edge in pixels. Keeps recipe text legible while staying well under
// the 4.5 MB request limit on Vercel serverless functions.
const MAX_EDGE = 1800;

/** Downscale and re-encode as JPEG in the browser before uploading. */
async function resizeToJpeg(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("Canvas is not supported");
  }

  // White background so transparent PNG screenshots don't turn black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode image")),
      "image/jpeg",
      0.85
    );
  });
}

export default function RecipeImageImport({ onExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uncertain, setUncertain] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).slice(0, MAX_FILES);

    if (files.length === 0) return;

    setLoading(true);
    setError("");
    setUncertain([]);
    setDone(false);

    try {
      const formData = new FormData();

      for (const [index, file] of files.entries()) {
        const blob = await resizeToJpeg(file);
        formData.append("images", blob, `recipe-${index + 1}.jpg`);
      }

      const response = await fetch("/api/food/extract", {
        method: "POST",
        body: formData,
      });

      const data = (await response
        .json()
        .catch(() => null)) as ExtractResponse | null;

      if (!response.ok || !data || "error" in data) {
        setError(
          data && "error" in data
            ? data.error
            : "Something went wrong reading the recipe."
        );
        return;
      }

      onExtracted(data.recipe);
      setUncertain(data.uncertain);
      setDone(true);
    } catch (err) {
      console.error("Recipe import failed:", err);
      setError(
        "Couldn't process that image. Try a JPG or PNG, or fill in the form by hand."
      );
    } finally {
      setLoading(false);

      // Allow picking the same file again.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-xl border border-dashed border-[#1B4332]/30 bg-white/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1B4332]">
            Import from a photo
          </h2>

          <p className="mt-0.5 text-xs text-[#1B4332]/60">
            Upload a photo or screenshot of a recipe (up to {MAX_FILES} images
            for multi-page recipes) and the form will fill itself in. You can
            edit everything before saving.
          </p>
        </div>

        <div className="shrink-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Reading recipe…" : "Choose photo"}
          </button>
        </div>
      </div>

      <div aria-live="polite">
        {error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {done && !error && (
          <div className="mt-3 rounded-lg border border-[#1B4332]/15 bg-[#1B4332]/5 px-3 py-2 text-sm text-[#1B4332]">
            <p>
              Filled in from your photo. Please review everything below before
              saving.
            </p>

            {uncertain.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Worth double-checking:</p>

                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[#1B4332]/80">
                  {uncertain.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
