"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type {
  ExtractMode,
  ExtractedRecipe,
  ExtractResponse,
} from "@/types/extractedRecipe";

type Props = {
  onExtracted: (recipe: ExtractedRecipe) => void;
};

const MAX_FILES = 3;
const MAX_NOTE = 2000;
// Long edge in pixels. Keeps recipe text legible while staying well under
// the 4.5 MB request limit on Vercel serverless functions.
const MAX_EDGE = 1800;

const MODES: { value: ExtractMode; label: string; hint: string }[] = [
  {
    value: "strict",
    label: "Only what's in my photos, link or note",
    hint: "Anything missing is left blank for you to fill in.",
  },
  {
    value: "infer",
    label: "Fill in everything",
    hint: "AI estimates missing amounts, times and details, and flags each guess.",
  },
];

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

/* =========================================================
   DIALOG
   Rendered through a portal so none of its inputs end up inside
   the recipe <form> (no stray fields, no accidental submits).
========================================================= */

type Picked = { id: string; file: File; url: string };

function ImportDialog({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: (recipe: ExtractedRecipe, uncertain: string[]) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pickedRef = useRef<Picked[]>([]);

  const [picked, setPicked] = useState<Picked[]>([]);
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<ExtractMode>("strict");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pickedRef.current = picked;
  }, [picked]);

  // Open as a true modal (focus trap, Esc, inert page behind it).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Free preview URLs and cancel any in-flight request on close.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      pickedRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const atLimit = picked.length >= MAX_FILES;
  const canSubmit =
    !loading &&
    (picked.length > 0 || note.trim().length > 0 || url.trim().length > 0);

  const addFiles = (list: FileList | null) => {
    const incoming = Array.from(list ?? []);
    const room = Math.max(MAX_FILES - picked.length, 0);
    const accepted = incoming.slice(0, room);

    if (accepted.length > 0) {
      setPicked((prev) => [
        ...prev,
        ...accepted.map((file, i) => ({
          id: `${Date.now()}-${i}`,
          file,
          url: URL.createObjectURL(file),
        })),
      ]);
    }

    setError(
      incoming.length > room
        ? `Only ${MAX_FILES} photos are used, so the extras were skipped.`
        : ""
    );

    // Allow picking the same file again.
    if (cameraRef.current) cameraRef.current.value = "";
    if (uploadRef.current) uploadRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setPicked((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
    setError("");
  };

  const close = () => {
    abortRef.current?.abort();
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      for (const [index, p] of picked.entries()) {
        const blob = await resizeToJpeg(p.file);
        formData.append("images", blob, `recipe-${index + 1}.jpg`);
      }

      formData.append("mode", mode);
      if (note.trim()) formData.append("note", note.trim());
      if (url.trim()) formData.append("url", url.trim());

      const response = await fetch("/api/food/extract", {
        method: "POST",
        body: formData,
        signal: controller.signal,
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

      onDone(data.recipe, data.uncertain);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      console.error("Recipe import failed:", err);
      setError(
        "Couldn't process that. Try a JPG or PNG, or fill in the form by hand."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="recipe-import-title"
      onCancel={(e) => {
        // Esc: route through our own close so requests get aborted.
        e.preventDefault();
        close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-[#F7F3E9] p-0 text-[#1B4332] shadow-xl backdrop:bg-black/50"
    >
      <div className="max-h-[85vh] space-y-5 overflow-y-auto p-5">
        <div>
          <h2 id="recipe-import-title" className="text-xl font-bold">
            Import a recipe with AI
          </h2>
          <p className="mt-1 text-sm text-[#1B4332]/70">
            Add photos, a link, a few words, or any mix. You can edit everything before
            saving.
          </p>
        </div>

        {/* ---------- 1. PHOTOS ---------- */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">
            Photos{" "}
            <span className="font-normal text-[#1B4332]/60">
              ({picked.length}/{MAX_FILES})
            </span>
          </legend>

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || atLimit}
              onClick={() => cameraRef.current?.click()}
              className="flex-1 rounded-lg border border-[#1B4332]/30 bg-white px-3 py-2 text-sm font-medium transition hover:bg-[#1B4332]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Take photo
            </button>
            <button
              type="button"
              disabled={loading || atLimit}
              onClick={() => uploadRef.current?.click()}
              className="flex-1 rounded-lg border border-[#1B4332]/30 bg-white px-3 py-2 text-sm font-medium transition hover:bg-[#1B4332]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Upload
            </button>
          </div>

          {picked.length > 0 && (
            <ul className="grid grid-cols-3 gap-2">
              {picked.map((p, index) => (
                <li
                  key={p.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-[#1B4332]/20 bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={`Recipe photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => removeFile(p.id)}
                    aria-label={`Remove photo ${index + 1}`}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm leading-none text-white hover:bg-black/80 disabled:opacity-50"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {/* ---------- 2. LINK ---------- */}
        <div className="space-y-1">
          <label htmlFor="recipe-import-url" className="text-sm font-semibold">
            Recipe link{" "}
            <span className="font-normal text-[#1B4332]/60">(optional)</span>
          </label>
          <input
            id="recipe-import-url"
            type="url"
            inputMode="url"
            value={url}
            maxLength={2000}
            disabled={loading}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/best-lasagna"
            className="w-full rounded-lg border border-[#1B4332]/30 bg-white px-3 py-2 text-sm placeholder:text-[#1B4332]/40 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <p className="text-xs text-[#1B4332]/50">
            Works with most recipe sites. If one blocks us, use a screenshot.
          </p>
        </div>

        {/* ---------- 3. NOTE ---------- */}
        <div className="space-y-1">
          <label htmlFor="recipe-import-note" className="text-sm font-semibold">
            Details or instructions{" "}
            <span className="font-normal text-[#1B4332]/60">(optional)</span>
          </label>
          <textarea
            id="recipe-import-note"
            value={note}
            maxLength={MAX_NOTE}
            rows={4}
            disabled={loading}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Paste recipe text, or tell the AI what to do, e.g. "Grandma's lasagna, serves 8. Convert to metric."`}
            className="w-full resize-none rounded-lg border border-[#1B4332]/30 bg-white px-3 py-2 text-sm placeholder:text-[#1B4332]/40 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <p className="text-right text-xs text-[#1B4332]/50">
            {note.length}/{MAX_NOTE}
          </p>
        </div>

        {/* ---------- 4. MODE ---------- */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">
            How much should the AI fill in?
          </legend>

          {MODES.map((m) => (
            <label
              key={m.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 transition ${
                mode === m.value
                  ? "border-[#1B4332] bg-[#1B4332]/5"
                  : "border-[#1B4332]/20 bg-white hover:bg-[#1B4332]/5"
              }`}
            >
              <input
                type="radio"
                name="recipe-import-mode"
                value={m.value}
                checked={mode === m.value}
                disabled={loading}
                onChange={() => setMode(m.value)}
                className="mt-1 accent-[#1B4332]"
              />
              <span>
                <span className="block text-sm font-medium">{m.label}</span>
                <span className="block text-xs text-[#1B4332]/60">
                  {m.hint}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <div aria-live="polite">
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        {/* ---------- ACTIONS ---------- */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#1B4332]/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={submit}
            className="rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Reading recipe…" : "Fill in form"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

/* =========================================================
   TRIGGER + RESULT BANNER
========================================================= */

export default function RecipeImageImport({ onExtracted }: Props) {
  const [open, setOpen] = useState(false);
  const [uncertain, setUncertain] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const handleDone = (recipe: ExtractedRecipe, flagged: string[]) => {
    onExtracted(recipe);
    setUncertain(flagged);
    setDone(true);
    setOpen(false);
  };

  return (
    <section className="rounded-xl border border-dashed border-[#1B4332]/30 bg-white/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1B4332]">
            Import with AI
          </h2>

          <p className="mt-0.5 text-xs text-[#1B4332]/60">
            Snap or upload up to {MAX_FILES} photos, paste a link, add a few details, and the
            form will fill itself in. You can edit everything before saving.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full shrink-0 rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F] sm:w-auto"
        >
          Start import
        </button>
      </div>

      <div aria-live="polite">
        {done && (
          <div className="mt-3 rounded-lg border border-[#1B4332]/15 bg-[#1B4332]/5 px-3 py-2 text-sm text-[#1B4332]">
            <p>
              Form filled in. Please review everything below before saving.
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

      {open &&
        createPortal(
          <ImportDialog onClose={() => setOpen(false)} onDone={handleDone} />,
          document.body
        )}
    </section>
  );
}
