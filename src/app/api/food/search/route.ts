import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() ?? "";

  try {
    const { data, error } = await supabase.rpc("search_food", {
      search_query: query,
    });

    if (error) {
      console.error("Food search error:", error);

      return NextResponse.json(
        { error: "Failed to search food" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      foods: data ?? [],
    });
  } catch (error) {
    console.error("Unexpected food search error:", error);

    return NextResponse.json(
      { error: "Failed to search food" },
      { status: 500 }
    );
  }
}