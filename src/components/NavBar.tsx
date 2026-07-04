import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#1B4332] text-[#F7F3E9]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide bg-[#1B4332] hover:text-white"
        >
            {SITE.name}
        </Link>

        <div className="flex gap-8 text-lg">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>

          <Link href="/food" className="hover:text-white transition">
            Food
          </Link>

          <Link href="/drinks" className="hover:text-white transition">
            Drinks
          </Link>

          <Link href="/restaurants" className="hover:text-white transition">
            Restaurants
          </Link>
        </div>
      </div>
    </nav>
  );
}