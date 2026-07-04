type DrinkRecipeProps = {
  name: string;
  description?: string;
  image?: string;
  link?: string;

  mainAlcohols: string[];
  keyIngredients: string[];

  vibe: string;
  contributor: string;

  steps?: string[];

  rating?: number; // 0–5 scale
  glassType?: string;
  tags?: string[];
  similarDrinks?: {
    name: string;
    image?: string;
  }[];
};

export default function DrinkRecipe({
  name,
  description,
  image,
  link,
  mainAlcohols,
  keyIngredients,
  vibe,
  contributor,
  steps,
  rating,
  glassType,
  tags,
  similarDrinks,
}: DrinkRecipeProps) {
  return (
    <article className="min-h-screen bg-[#F7F3E9] text-[#1B4332]">

      {/* HEADER */}
      <header className="bg-[#1B4332] text-[#F7F3E9] px-8 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">{name}</h1>

        <p className="mx-auto max-w-3xl text-lg opacity-90">
          {description}
        </p>

        {/* Optional rating */}
        {typeof rating === "number" && (
          <div className="mt-4 text-lg">
            {"★".repeat(Math.round(rating))}
            <span className="opacity-70 ml-2">
              ({rating.toFixed(1)}/5)
            </span>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F7F3E9] px-3 py-1 text-sm text-[#1B4332]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            className="mt-6 inline-block text-sm underline opacity-80 hover:opacity-100"
          >
            View original source
          </a>
        )}
      </header>

      {/* IMAGE + DETAILS */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 py-16 md:grid-cols-2">

        {/* IMAGE */}
        <div className="overflow-hidden rounded-xl shadow-lg">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* INFO */}
        <div className="space-y-8">

          {/* Main Alcohols */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Main Alcohol(s)
            </h2>
            <div className="flex flex-wrap gap-2">
              {mainAlcohols.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-[#1B4332] px-3 py-1 text-sm text-[#F7F3E9]"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Key Ingredients */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Key Ingredients
            </h2>
            <ul className="space-y-2 text-base">
              {keyIngredients.map((i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#1B4332]" />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          {/* Glass Type */}
          {glassType && (
            <div>
              <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
                Glass Type
              </h2>
              <p className="text-gray-700">{glassType}</p>
            </div>
          )}

          {/* Vibe */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Vibe
            </h2>
            <p className="text-gray-700">{vibe}</p>
          </div>

          {/* Contributor */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b border-[#1B4332]/20 pb-2">
              Contributor
            </h2>
            <p className="text-gray-700">{contributor}</p>
          </div>
        </div>
      </section>

      {/* SIMILAR DRINKS */}
      {similarDrinks && similarDrinks.length > 0 && (
        <section className="mx-auto max-w-7xl px-8 pb-20">
          <h2 className="text-3xl font-bold mb-6 border-b border-[#1B4332]/20 pb-3">
            Similar Drinks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarDrinks.map((drink) => (
              <div
                key={drink.name}
                className="rounded-xl bg-white shadow-md overflow-hidden"
              >
                {drink.image && (
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="font-semibold text-[#1B4332]">
                    {drink.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEPS */}
      <section className="mx-auto max-w-4xl px-8 pb-20">
        <h2 className="text-3xl font-bold mb-6 border-b border-[#1B4332]/20 pb-3">
          Steps
        </h2>

        <ol className="space-y-6">
          {steps?.map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B4332] text-[#F7F3E9] text-sm font-bold">
                {idx + 1}
              </span>
              <p className="text-lg leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}