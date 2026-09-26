import Link from "next/link";
import { SITE } from "@/lib/site";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/food", label: "Food" },
  { href: "/drinks", label: "Drinks" },
  { href: "/restaurants", label: "Restaurants" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-[#F7F3E9]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="text-xl font-bold transition hover:text-white">
            {SITE.name}
          </Link>
          <p className="mt-1 text-sm text-[#F7F3E9]/75">{SITE.tagline}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[#F7F3E9]/15">
        <p className="mx-auto max-w-7xl px-6 py-4 text-xs text-[#F7F3E9]/60">
          {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
