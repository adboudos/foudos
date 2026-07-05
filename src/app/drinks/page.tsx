import DisplayCard from "@/components/DisplayCard";
import NavBar from "@/components/NavBar";
import Link from "next/dist/client/link";

const drinks = [
  {
    slug: "spicy-mezcal-margarita",
    title: "Spicy Mezcal Margarita",
    description: "Mezcal, lime, jalapeño, tajín rim.",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b",
    tag: "Cocktail",
  },
  {
    Slug: "negroni-sbagliato",
    title: "Negroni Sbagliato",
    description: "Campari, sweet vermouth, prosecco.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
    tag: "Cocktail",
  },
  {
    slug: "espresso-martini",
    title: "Espresso Martini",
    description: "Vodka, espresso, coffee liqueur.",
    image:
      "https://images.unsplash.com/photo-1541542684-4a2b3a0f9b4c",
    tag: "Cocktail",
  },
  {
    slug: "aperol-spritz",
    title: "Aperol Spritz",
    description: "Aperol, prosecco, soda, orange slice.",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
    tag: "Cocktail",
  },
  {
    slug: "old-fashioned",
    title: "Old Fashioned",
    description: "Bourbon, bitters, sugar, orange peel.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
    tag: "Classic",
  },
  {
    slug: "paloma",
    title: "Paloma",
    description: "Tequila, grapefruit soda, lime.",
    image:
      "https://images.unsplash.com/photo-1587223962930-cb7f31384c19",
    tag: "Cocktail",
  },
];

export default function DrinksPage() {
  return (
    <main className="min-h-screen bg-[#F7F3E9]">
      <NavBar />

      {/* HEADER */}
      <section className="bg-[#1B4332] py-20 text-center text-[#F7F3E9]">
        <h1 className="text-5xl font-bold mb-4">
          Drinks
        </h1>
        <p className="mx-auto max-w-2xl text-lg opacity-90">
          Cocktails, classics, and experiments worth pouring again.
        </p>
      </section>
      
      {/*Add Drink*/}
      <section className="mx-auto max-w-7xl px-8 py-16">
        <Link href="/drinks/new">
          <button className="rounded bg-[#1B4332] px-4 py-2 text-[#F7F3E9]">
            + Add New Drink
          </button>
        </Link>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {drinks.map((drink) => (
            <Link href={`/drinks/${drink.slug}`}>
              <DisplayCard
                key={drink.slug}
                title={drink.title}
                description={drink.description}
                image={drink.image}
                tag={drink.tag}
                type="Drink"
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
