import Navbar from "@/components/NavBar";
import DisplayCard from "@/components/DisplayCard";
import { SITE } from "@/lib/site";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F3E9]">
      
      <Navbar />

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
        <div className="space-y-4">
            <DisplayCard
              title="Coming Soon"
              description="Recipes are being crafted in the kitchen."
              tag="Food"
              type="Food"
            />
          </div>
        </div>

        {/* DRINKS */}
        <div>
          <Link href="/drinks" className="mb-6 text-2xl font-bold text-[#1B4332]">
            Drinks
          </Link>
        <div className="mb-6 h-px w-full bg-[#1B4332]/20" />

          <div className="space-y-4">
            <DisplayCard
              title="Spicy Mezcal Margarita"
              description="Mezcal, lime, jalapeño, tajín rim."
              image="https://images.unsplash.com/photo-1551024601-bec78aea704b"
              tag="Cocktail"
              type="Drink"
            />

            <DisplayCard
              title="Negroni Sbagliato"
              description="Campari, sweet vermouth, prosecco."
              image="https://images.unsplash.com/photo-1470337458703-46ad1756a187"
              tag="Cocktail"
              type="Drink"
            />

            <DisplayCard
              title="Espresso Martini"
              description="Vodka, espresso, coffee liqueur."
              image="https://images.unsplash.com/photo-1541542684-4a2b3a0f9b4c"
              tag="Cocktail"
              type="Drink"
            />
          </div>
        </div>

        {/* RESTAURANTS */}
        <div>
          <Link href="/restaurants" className="mb-6 text-2xl font-bold text-[#1B4332]">
            Restaurants
          </Link>
        <div className="mb-6 h-px w-full bg-[#1B4332]/20" />

          <div className="space-y-4">
            <DisplayCard
              title="Coming Soon"
              description="Restaurant reviews are on the way."
              tag="Restaurants"
              type="Restaurant"
            />
          </div>
        </div>

      </section>
    </main>
  );
}