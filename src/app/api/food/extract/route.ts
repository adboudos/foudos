import { NextResponse } from "next/server";
import { getAccess } from "@/lib/access";
import { canCreate } from "@/lib/roles";
import {
  EXTRACTION_SYSTEM_PROMPT,
  EXTRACTION_TOOL,
  normalizeExtraction,
} from "@/lib/recipeExtraction";

// Vision calls can take a while; give the function room to finish.
export const maxDuration = 60;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

const MAX_IMAGES = 3;
// Vercel serverless functions reject request bodies over 4.5 MB.
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/* --------------------------------
   BEST-EFFORT RATE LIMIT
   In-memory, so it is per server instance and resets on cold start. It
   slows down casual abuse only. Sign-in is the real gate.
-------------------------------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound.
  if (hits.size > 1000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return false;
}

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  // Each scan costs money, so only signed-in friends and family can use it.
  const access = await getAccess();

  if (!access.userId) {
    return fail("Please sign in to scan recipes.", 401);
  }

  if (!canCreate(access.role)) {
    return fail("Your account can't add recipes.", 403);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set");
    return fail("Recipe scanning isn't set up yet.", 500);
  }

  // Limit per person rather than per network address.
  if (isRateLimited(access.userId)) {
    return fail(
      "That's a lot of scans in a short time. Please try again in a few minutes.",
      429
    );
  }

  // ---- Read and validate the upload ----
  let files: File[];

  try {
    const form = await request.formData();
    files = form
      .getAll("images")
      .filter((v): v is File => typeof v !== "string");
  } catch {
    return fail("Couldn't read the upload. Please try again.", 400);
  }

  if (files.length === 0) {
    return fail("Add a photo or screenshot of a recipe first.", 400);
  }

  if (files.length > MAX_IMAGES) {
    return fail(`Please add at most ${MAX_IMAGES} images.`, 400);
  }

  if (files.some((f) => !ALLOWED_TYPES.has(f.type))) {
    return fail("Please upload a JPG, PNG, WebP or GIF image.", 415);
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  if (totalBytes > MAX_TOTAL_BYTES) {
    return fail("Those images are too large. Try a smaller photo.", 413);
  }

  const imageBlocks = await Promise.all(
    files.map(async (file) => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: file.type,
        data: Buffer.from(await file.arrayBuffer()).toString("base64"),
      },
    }))
  );

  // ---- Call the model ----
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50_000);

  let apiResponse: Response;

  try {
    apiResponse = await fetch(ANTHROPIC_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: EXTRACTION_SYSTEM_PROMPT,
        tools: [EXTRACTION_TOOL],
        // Claude 5.5 models reject forced tool choice ("tool"/"any"), so let
        // the model choose and instruct it to call the tool in the message.
        tool_choice: { type: "auto" },
        messages: [
          {
            role: "user",
            content: [
              ...imageBlocks,
              {
                type: "text",
                text: "Extract this recipe. You must respond by calling the save_recipe tool.",
              },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error("Recipe extraction request failed:", error);

    return fail(
      timedOut
        ? "Reading the recipe took too long. Please try again."
        : "Couldn't reach the recipe reader. Please try again.",
      timedOut ? 504 : 502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!apiResponse.ok) {
    // Log details server-side only; never return them to the browser.
    console.error(
      "Anthropic API error:",
      apiResponse.status,
      (await apiResponse.text()).slice(0, 500)
    );

    if (apiResponse.status === 429 || apiResponse.status === 529) {
      return fail("The recipe reader is busy. Please try again shortly.", 503);
    }

    if (apiResponse.status === 400) {
      return fail(
        "That image couldn't be read. Try a clearer photo or a screenshot. Or I might just be poor and my API spend limit is reached lol venmo @alex-boudos",
        422
      );
    }

    return fail("Something went wrong reading the recipe.", 502);
  }

  // ---- Parse and validate the result ----
  const data = (await apiResponse.json()) as {
    content?: { type: string; input?: unknown }[];
  };

  const toolUse = data.content?.find((block) => block.type === "tool_use");

  if (!toolUse) {
    // With tool_choice "auto" the model could answer in plain text instead.
    console.error("No tool_use block in response:", JSON.stringify(data.content));
    return fail("The recipe reader didn't return a result. Please try again.", 502);
  }

  const result = normalizeExtraction(toolUse.input);

  if (!result.isRecipe) {
    return fail(
      "I couldn't find a recipe in that image. Try a clearer photo that shows the ingredients and steps.",
      422
    );
  }

  return NextResponse.json({
    recipe: result.recipe,
    uncertain: result.uncertain,
  });
}
