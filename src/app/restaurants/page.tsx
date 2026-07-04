import Link from "next/link";

export default function WipPage() {
  return (
    <main className="min-h-screen bg-[#F7F3E9] flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        
        {/* Title */}
        <h1 className="text-5xl font-bold text-[#1B4332] mb-6">
          Work in Progress
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-700 leading-relaxed mb-10">
          We’re currently building out the <span className="font-semibold text-[#1B4332]">Drinks</span> and{" "}
          <span className="font-semibold text-[#1B4332]">Restaurants</span> sections.
          <br /><br />
          For now, explore our growing collection of recipes.
        </p>

        {/* CTA Button */}
        <Link
          href="/"
          className="inline-block rounded-xl bg-[#1B4332] px-8 py-4 text-[#F7F3E9] text-lg font-semibold shadow-md transition hover:bg-[#2D6A4F] hover:shadow-lg"
        >
          Back to Food
        </Link>

        {/* Decorative divider */}
        <div className="mt-12 flex items-center justify-center gap-3 text-[#1B4332]/40">
          <div className="h-px w-16 bg-[#1B4332]/30" />
          <span className="text-sm tracking-widest uppercase">
            Coming Soon
          </span>
          <div className="h-px w-16 bg-[#1B4332]/30" />
        </div>

      </div>
    </main>
  );
}