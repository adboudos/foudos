"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#1B4332] text-[#F7F3E9]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO / SITE NAME */}
        <Link
          href="/"
          className="text-xl font-bold"
          onClick={() => setMenuOpen(false)}
        >
          {SITE.name}
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-8 text-lg md:flex">
          <Link
            href="/"
            className="transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/food"
            className="transition hover:text-white"
          >
            Food
          </Link>

          <Link
            href="/drinks"
            className="transition hover:text-white"
          >
            Drinks
          </Link>

          <Link
            href="/restaurants"
            className="transition hover:text-white"
          >
            Restaurants
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 hover:bg-[#2D6A4F] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="border-t border-[#F7F3E9]/10 px-6 pb-4 md:hidden">
          <div className="flex flex-col text-lg">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="border-b border-[#F7F3E9]/10 py-3"
            >
              Home
            </Link>

            <Link
              href="/food"
              onClick={() => setMenuOpen(false)}
              className="border-b border-[#F7F3E9]/10 py-3"
            >
              Food
            </Link>

            <Link
              href="/drinks"
              onClick={() => setMenuOpen(false)}
              className="border-b border-[#F7F3E9]/10 py-3"
            >
              Drinks
            </Link>

            <Link
              href="/restaurants"
              onClick={() => setMenuOpen(false)}
              className="py-3"
            >
              Restaurants
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
