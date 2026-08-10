import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() ?? "";

  try {
    const { data, error } = await supabase.rpc("search_drinks", {
      search_query: query,
    });

    if (error) {
      console.error("Drink search error:", error);

      return NextResponse.json(
        { error: "Failed to search drinks" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      drinks: data ?? [],
    });
  } catch (error) {
    console.error("Unexpected drink search error:", error);

    return NextResponse.json(
      { error: "Failed to search drinks" },
      { status: 500 }
    );
  }
}