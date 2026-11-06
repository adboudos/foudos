"use client";

import { useActionState } from "react";
import {
  saveDisplayNameAction,
  type ProfileState,
} from "@/app/actions/profile";

const initial: ProfileState = { ok: false, message: "" };

export default function ProfileForm({
  initialName,
}: {
  initialName: string;
}) {
  const [state, action, pending] = useActionState(
    saveDisplayNameAction,
    initial
  );

  return (
    <form action={action} className="space-y-3">
      <label
        htmlFor="displayName"
        className="block text-sm font-medium text-[#1B4332]"
      >
        Display name
      </label>

      <input
        id="displayName"
        name="displayName"
        defaultValue={initialName}
        required
        minLength={2}
        maxLength={40}
        autoComplete="off"
        placeholder="e.g. Grandma Sue"
        className="w-full rounded-lg border border-[#1B4332]/20 bg-white px-3 py-2 text-sm text-[#1B4332] outline-none [color-scheme:light] placeholder:text-[#1B4332]/40 focus:border-[#1B4332]"
      />

      <p className="text-xs text-[#1B4332]/60">
        Shown publicly as &ldquo;Recipe by&rdquo; on everything you add. Please
        don&apos;t use your email or full real name if you&apos;d rather keep
        it private.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-medium text-[#F7F3E9] transition hover:bg-[#2D6A4F] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save name"}
      </button>

      <div aria-live="polite">
        {state.message && (
          <p
            className={`rounded-lg border px-3 py-2 text-sm ${
              state.ok
                ? "border-[#1B4332]/15 bg-[#1B4332]/5 text-[#1B4332]"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
