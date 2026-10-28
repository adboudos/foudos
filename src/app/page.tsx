import DisplayCard from "@/components/DisplayCard";
import { SITE } from "@/lib/site";
import Link from "next/link";
import { getAllDrinks } from "@/lib/db/drinks"
import { getAllFoods } from "@/lib/db/food";

export default async function Home() {
  const drinks = await getAllDrinks();
  const foods = await getAllFoods()

  return (
    <main className="min-h-screen bg-[#F7F3E9]">

      {/* HERO */}
      <section className="bg-[#1B4332] py-16 text-center text-[#F7F3E9]">
        <h1 className="text-6xl font-bold mb-6">
          {SITE.name}
        </h1>
        <p className="mx-auto max-w-3xl text-xl">
          {SITE.tagline}
        </p>
      </section>

      {/* 3 COLUMN SECTION */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 py-16 md:grid-cols-3">

        {/* FOOD */}
        <div>
          <Link href="/food" className="mb-6 text-2xl font-bold text-[#1B4332]">
            Food
          </Link>
        <div className="mb-6 h-px w-full bg-[#1B4332]/20" />          
          <div className="flex flex-col gap-4">
            {foods.slice(0,3).map((food) => (
                <DisplayCard
                    key={food.slug}
                    title={food.name}
                    description={food.description}
                    image={food.image}
                    vibes={food.vibes}
                    titleOne="Cuisine"
                    valuesOne={food.cuisine}
                    titleTwo="Course"
                    valuesTwo={food.course ? [food.course] : []}
                    type="food"
                    slug={food.slug}
                />
            ))}
          </div>
        </div>
        
        {/* DRINKS */}
        <div>
          <Link href="/drinks" className="mb-6 text-2xl font-bold text-[#1B4332]">
            Drinks
          </Link>
        <div className="mb-6 h-px w-full bg-[#1B4332]/20" />

          <div className="flex flex-col gap-4">
            {drinks.slice(0,3).map((drink) => (
                <DisplayCard
                    key={drink.slug}
                    title={drink.name}
                    description={drink.description}
                    image={drink.image}
                    vibes={drink.vibes}
                    titleOne="Main Alcohols"
                    valuesOne={drink.mainAlcohols}
                    titleTwo="Key Ingredients"
                    valuesTwo={drink.keyIngredients}
                    type="drinks"
                    slug={drink.slug}
                />
            ))}
          </div>
        </div>

        {/* RESTAURANTS */}
        <div>
          <Link href="/restaurants" className="mb-6 text-2xl font-bold text-[#1B4332]">
            Restaurants
          </Link>
        <div className="mb-6 h-px w-full bg-[#1B4332]/20" />

          <div className="flex flex-col gap-4">
            <DisplayCard
              title="Coming Soon"
              description="Restaurant reviews are on the way."
              type="restaurants"
              slug="coming-soon"
            />
          </div>
        </div>

      </section>
    </main>
  );
}
