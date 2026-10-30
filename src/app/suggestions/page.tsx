import type { Metadata } from "next";
import SuggestionForm from "@/components/SuggestionForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Suggestions | ${SITE.name}`,
};

export default function SuggestionsPage() {
  return (
    <main className="bg-[#F7F3E9] text-[#1B4332]">
      <div className="mx-auto w-full max-w-2xl px-6 py-6 sm:px-8">
        {/* HEADER */}
        <section className="mb-6">
          <h1 className="text-4xl font-bold text-[#1B4332]">
            Send a Suggestion
          </h1>

          <p className="mt-1.5 text-[#1B4332]/60">
            Ideas, feedback, or something broken? Let us know.
          </p>
        </section>

        <SuggestionForm />
      </div>
    </main>
  );
}
