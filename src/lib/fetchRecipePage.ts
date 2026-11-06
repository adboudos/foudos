import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/* --------------------------------
   Fetches a recipe web page on the server and boils it down to the text a
   model needs. The URL comes from a user, so this is built to not be usable
   for reaching internal services (SSRF):
     - http/https only, default ports only, no credentials in the URL
     - every hostname is resolved and rejected if ANY address is private,
       loopback, link-local or otherwise non-public
     - redirects are followed by hand, and each hop is checked again
     - hard caps on time, redirects and download size
   Note: the address is checked and then fetched separately, so a hostile DNS
   server could in theory change its answer in between. Running on serverless
   with no internal network keeps that risk low.
-------------------------------- */

const FETCH_TIMEOUT_MS = 8_000;
const MAX_REDIRECTS = 4;
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_TEXT_CHARS = 30_000;
const MAX_JSON_CHARS = 20_000;

export type PageResult =
  | { ok: true; text: string; host: string }
  | { ok: false; error: string; status: number };

const bad = (error: string, status = 422): PageResult => ({
  ok: false,
  error,
  status,
});

/* ---------- address checks ---------- */

function isPrivateV4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) return isPrivateV4(ip);

  const v6 = ip.toLowerCase();

  // IPv4-mapped (::ffff:a.b.c.d or ::ffff:7f00:1) — judge the embedded v4.
  const dotted = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) return isPrivateV4(dotted[1]);
  if (v6.startsWith("::ffff:")) return true;

  return (
    v6 === "::" ||
    v6 === "::1" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe8") ||
    v6.startsWith("fe9") ||
    v6.startsWith("fea") ||
    v6.startsWith("feb") ||
    v6.startsWith("ff")
  );
}

async function assertPublicUrl(raw: string): Promise<URL | string> {
  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    return "That doesn't look like a valid link.";
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Please use a web link that starts with http:// or https://.";
  }

  if (url.username || url.password) {
    return "Links with a username or password aren't supported.";
  }

  if (url.port && url.port !== "80" && url.port !== "443") {
    return "That link isn't supported.";
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");

  if (host === "localhost" || host.endsWith(".localhost") || !host) {
    return "That link isn't supported.";
  }

  try {
    const addresses = isIP(host)
      ? [{ address: host }]
      : await lookup(host, { all: true });

    if (addresses.length === 0 || addresses.some((a: { address: string }) => isPrivateIp(a.address))) {
      return "That link isn't supported.";
    }
  } catch {
    return "Couldn't find that website. Check the link and try again.";
  }

  return url;
}

/* ---------- download ---------- */

async function readCapped(response: Response): Promise<string | null> {
  const reader = response.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    total += value.length;

    if (total > MAX_BYTES) {
      await reader.cancel();
      return null;
    }

    chunks.push(value);
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(
    Buffer.concat(chunks)
  );
}

/* ---------- html -> text ---------- */

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : " ";
    });
}

const RECIPE_KEYS = [
  "name",
  "description",
  "recipeYield",
  "prepTime",
  "cookTime",
  "totalTime",
  "recipeCategory",
  "recipeCuisine",
  "keywords",
  "recipeIngredient",
  "recipeInstructions",
];

function isRecipeNode(node: unknown): node is Record<string, unknown> {
  if (!node || typeof node !== "object") return false;
  const type = (node as Record<string, unknown>)["@type"];
  return Array.isArray(type) ? type.includes("Recipe") : type === "Recipe";
}

function findRecipeNode(node: unknown, depth = 0): Record<string, unknown> | null {
  if (depth > 6 || !node || typeof node !== "object") return null;
  if (isRecipeNode(node)) return node;

  const children = Array.isArray(node)
    ? node
    : Object.values(node as Record<string, unknown>);

  for (const child of children) {
    const found = findRecipeNode(child, depth + 1);
    if (found) return found;
  }

  return null;
}

/** Most recipe sites publish schema.org Recipe data; it is the cleanest source. */
function extractJsonLdRecipe(html: string): string | null {
  const pattern =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  for (const match of html.matchAll(pattern)) {
    try {
      const recipe = findRecipeNode(JSON.parse(match[1].trim()));
      if (!recipe) continue;

      const picked: Record<string, unknown> = {};
      for (const key of RECIPE_KEYS) {
        if (recipe[key] !== undefined) picked[key] = recipe[key];
      }

      // Only trust it if it actually carries the recipe body.
      if (!picked.recipeIngredient || !picked.recipeInstructions) continue;

      return JSON.stringify(picked).slice(0, MAX_JSON_CHARS);
    } catch {
      // Malformed JSON-LD is common; try the next block.
    }
  }

  return null;
}

function extractReadableText(html: string): string {
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(
      /<(script|style|noscript|svg|nav|header|footer|form|aside|iframe)\b[\s\S]*?<\/\1>/gi,
      " "
    )
    .replace(/<\/?(p|div|li|ul|ol|br|h[1-6]|tr|section|article)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeEntities(stripped)
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim()
    .slice(0, MAX_TEXT_CHARS);
}

/* ---------- public entry point ---------- */

export async function fetchRecipePage(rawUrl: string): Promise<PageResult> {
  let current = await assertPublicUrl(rawUrl.trim());
  if (typeof current === "string") return bad(current);

  let response: Response | null = null;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    try {
      response = await fetch(current, {
        redirect: "manual",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; FoudosRecipeImport/1.0)",
          accept: "text/html,application/xhtml+xml",
        },
      });
    } catch {
      return bad(
        "Couldn't open that page. It may be slow or blocking automated visits. Try a screenshot instead.",
        502
      );
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.body?.cancel();

      if (!location || hop === MAX_REDIRECTS) {
        return bad("That link redirects too many times.");
      }

      const next = await assertPublicUrl(new URL(location, current).toString());
      if (typeof next === "string") return bad(next);

      current = next;
      continue;
    }

    break;
  }

  if (!response || !response.ok) {
    await response?.body?.cancel();
    return bad(
      "That website wouldn't let me read the page. Try a screenshot of the recipe instead.",
      502
    );
  }

  const type = response.headers.get("content-type") ?? "";

  if (!/text\/html|application\/xhtml/i.test(type)) {
    await response.body?.cancel();
    return bad("That link isn't a web page I can read.");
  }

  const html = await readCapped(response);

  if (html === null) {
    return bad("That page is too large to read.");
  }

  const text = extractJsonLdRecipe(html) ?? extractReadableText(html);

  if (text.length < 40) {
    return bad(
      "I couldn't find any readable text on that page. Try a screenshot instead."
    );
  }

  return { ok: true, text, host: current.hostname };
}
