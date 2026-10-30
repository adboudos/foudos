"use client";

import { useActionState } from "react";
import {
  sendSuggestionAction,
  type SuggestionState,
} from "@/app/actions/suggestions";

const initialState: SuggestionState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-2.5 text-sm text-[#1B4332] transition focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20";

const textareaClass =
  "w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-3 text-sm text-[#1B4332] transition focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20";

const labelClass = "mb-1 block text-sm font-semibold text-[#1B4332]";

const helpTextClass = "mt-1 text-xs text-[#1B4332]/50";

export default function SuggestionForm() {
  const [state, formAction, pending] = useActionState(
    sendSuggestionAction,
    initialState
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-[#1B4332]/20 bg-white px-4 py-6 text-center text-[#1B4332]"
      >
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3.5">
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
          <span className="ml-1 font-normal text-[#1B4332]/40">
            (optional)
          </span>
        </label>

        <input
          id="name"
          name="name"
          autoComplete="name"
          maxLength={100}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
          <span className="ml-1 font-normal text-[#1B4332]/40">
            (optional)
          </span>
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={200}
          className={inputClass}
        />

        <p className={helpTextClass}>
          Only used if you&apos;d like a reply.
        </p>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Suggestion
        </label>

        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          className={textareaClass}
        />
      </div>

      {/* Spam trap: hidden from people, but bots tend to fill it in. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      )}

      <div className="border-t border-[#1B4332]/10 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[#1B4332] py-3 font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F] disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send Suggestion"}
        </button>
      </div>
    </form>
  );
}
