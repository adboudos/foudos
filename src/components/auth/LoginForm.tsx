"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type Props = {
  next: string;
  initialError?: boolean;
};

export default function LoginForm({ next, initialError = false }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    initialError ? "error" : "idle"
  );
  const [message, setMessage] = useState(
    initialError ? "That sign-in link didn't work. Please try again." : ""
  );

  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const signInWithGoogle = async () => {
    setStatus("sending");
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });

    // On success the browser is sent to Google, so only errors land here.
    if (error) {
      console.error("Google sign-in failed:", error.message);
      setStatus("error");
      setMessage("Couldn't start Google sign-in. Please try again.");
    }
  };

  const sendMagicLink = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("sending");
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: callbackUrl() },
    });

    if (error) {
      console.error("Magic link failed:", error.message);
      setStatus("error");
      setMessage("Couldn't send the link. Please wait a minute and try again.");
      return;
    }

    setStatus("sent");
    setMessage("Check your email for a sign-in link. You can close this tab.");
  };

  const busy = status === "sending";

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={busy}
        className="w-full rounded-lg bg-[#1B4332] px-4 py-3 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#1B4332]/50">
        <span className="h-px flex-1 bg-[#1B4332]/15" />
        or
        <span className="h-px flex-1 bg-[#1B4332]/15" />
      </div>

      <form onSubmit={sendMagicLink} className="space-y-3">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-[#1B4332]"
        >
          Email me a sign-in link
        </label>

        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-[#1B4332]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1B4332]"
        />

        <button
          type="submit"
          disabled={busy || !email.trim()}
          className="w-full rounded-lg border border-[#1B4332] px-4 py-2 text-sm font-medium text-[#1B4332] transition hover:bg-[#1B4332]/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Working…" : "Send link"}
        </button>
      </form>

      <div aria-live="polite">
        {message && (
          <p
            className={`rounded-lg border px-3 py-2 text-sm ${
              status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-[#1B4332]/15 bg-[#1B4332]/5 text-[#1B4332]"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
