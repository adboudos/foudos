
import { getDrinkBySlug } from "@/lib/db/drinks";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const drink = await getDrinkBySlug(params.slug);

    return Response.json(drink);
}

export async function getDrinksBySlug(slug: string) {
    // @todo all to supabase
    
}