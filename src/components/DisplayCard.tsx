
import Link from "next/link";

type RecipeCardProps = {
  title: string;
  description: string;
  image?: string;
  titleOne?: string;
  valuesOne?: string[];
  titleTwo?: string;
  valuesTwo?: string[];
  vibes?: string[];
  slug: string;
  type: string;
};

export default function DisplayCard({
  title,
  description,
  titleOne,
  valuesOne,
  titleTwo,
  valuesTwo,
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
          {valuesOne && valuesOne.length > 0 && (
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1B4332]/70">
                {titleOne}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {valuesOne.map((value) => (
                  <span
                    key={value}
                    className="rounded-full bg-[#1B4332]/10 px-2.5 py-1 text-xs font-medium leading-none text-[#1B4332]"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Ingredients */}
          {valuesTwo && valuesTwo.length > 0 && (
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1B4332]/70">
                {titleTwo}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {valuesTwo.map((value) => (
                  <span
                    key={value}
                    className="rounded-full bg-[#1B4332]/10 px-2.5 py-1 text-xs font-medium leading-none text-[#1B4332]"
                  >
                    {value}
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

