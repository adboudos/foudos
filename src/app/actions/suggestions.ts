"use server";

import { headers } from "next/headers";
import { SITE } from "@/lib/site";

export type SuggestionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const RESEND_URL = "https://api.resend.com/emails";
const SUPPORT_EMAIL = "support@foudos.com";
const FROM_EMAIL = process.env.SUGGESTIONS_FROM_EMAIL || SUPPORT_EMAIL;

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;

/* --------------------------------
   BEST-EFFORT RATE LIMIT
   In-memory, so it is per server instance and resets on cold start. It
   slows down casual abuse only.
-------------------------------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
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

function error(message: string): SuggestionState {
  return { status: "error", message };
}

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function sendSuggestionAction(
  _previousState: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  // Hidden field that real visitors never fill in. Pretend it worked.
  if (field(formData, "website")) {
    return { status: "success", message: "Thanks for your suggestion!" };
  }

  const name = field(formData, "name");
  const email = field(formData, "email");
  const message = field(formData, "message");

  if (!message) {
    return error("Please tell us what's on your mind.");
  }

  if (
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    message.length > MAX_MESSAGE
  ) {
    return error("That's a bit too long. Please shorten it and try again.");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error("That email address doesn't look right.");
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return error("Suggestions aren't set up yet.");
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return error(
      "That's a lot of suggestions in a short time. Please try again in a few minutes."
    );
  }

  const body = [
    `Name: ${name || "(not provided)"}`,
    `Email: ${email || "(not provided)"}`,
    "",
    message,
  ].join("\n");

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE.name} Suggestions <${FROM_EMAIL}>`,
        to: [SUPPORT_EMAIL],
        // Lets you hit reply to answer the person directly.
        ...(email ? { reply_to: email } : {}),
        subject: `${SITE.name} suggestion${name ? ` from ${name}` : ""}`,
        text: body,
      }),
    });

    if (!response.ok) {
      console.error(
        "Failed to send suggestion:",
        response.status,
        await response.text()
      );
      return error("Something went wrong sending your suggestion.");
    }
  } catch (err) {
    console.error("Failed to send suggestion:", err);
    return error("Something went wrong sending your suggestion.");
  }

  return {
    status: "success",
    message: "Thanks for your suggestion! We read every one.",
  };
}
