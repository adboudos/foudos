
import Link from "next/link";

type RecipeCardProps = {
  title: string;
  description: string;
  image?: string;
  mainAlcohols?: string[];
  keyIngredients?: string[];
  vibes?: string[];
  slug: string;
  type: string;
};

export default function DisplayCard({
  title,
  description,
  mainAlcohols,
  keyIngredients,
  vibes,
  slug, 
  type
}: RecipeCardProps) {
  return (
    <Link href={`/${type}/${slug}`} className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl">

        {/* Title */}
        <h2 className="text-xl font-semibold leading-tight text-[#1B4332]">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-600">
          {description}
        </p>

        {/* Divider */}
        <div className="my-3 border-t border-[#1B4332]/20" />

        {/* Metadata */}
        <div className="space-y-3">

          {/* Main Alcohols */}
          {mainAlcohols && mainAlcohols.length > 0 && (
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1B4332]/70">
                Main Alcohols
              </p>

              <div className="flex flex-wrap gap-1.5">
                {mainAlcohols.map((alcohol) => (
                  <span
                    key={alcohol}
                    className="rounded-full bg-[#1B4332]/10 px-2.5 py-1 text-xs font-medium leading-none text-[#1B4332]"
                  >
                    {alcohol}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Ingredients */}
          {keyIngredients && keyIngredients.length > 0 && (
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1B4332]/70">
                Key Ingredients
              </p>

              <div className="flex flex-wrap gap-1.5">
                {keyIngredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full bg-[#1B4332]/10 px-2.5 py-1 text-xs font-medium leading-none text-[#1B4332]"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vibes */}
        {vibes && vibes.length > 0 && (
          <>
            <div className="my-3 border-t border-[#1B4332]/20" />

            <div className="flex flex-wrap gap-1.5">
              {vibes.map((vibe) => (
                <span
                  key={vibe}
                  className="rounded-full bg-[#1B4332] px-2.5 py-1 text-xs font-semibold leading-none text-[#F7F3E9]"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

