"use client";

import { useEffect, useState } from "react";

type SearchFood = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  vibe?: string | null;
  cuisine?: string[];
  course?: string[];
  tags?: string[];
  relevance?: number;
};

type FoodSearchProps = {
  onResults: (foods: SearchFood[]) => void;
};

export default function FoodSearch({
  onResults,
}: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    // Empty search = show everything
    if (!trimmedQuery) {
      onResults([]);
      setLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/food/search?q=${encodeURIComponent(trimmedQuery)}`
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        onResults(data.foods ?? []);
      } catch (error) {
        console.error("Food search error:", error);
        onResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, onResults]);

  return (
    <div className="relative w-full max-w-md text-[#1B4332]">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search food (Doesn't work yet)..."
        className="w-full rounded-lg border border-[#1B4332]/20 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]"
      />

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        {loading ? "…" : "⌕"}
      </span>
    </div>
  );
}