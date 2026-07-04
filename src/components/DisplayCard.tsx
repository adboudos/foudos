type RecipeCardProps = {
  title: string;
  description: string;
  image?: string;
  tag?: string;
  type: string;
};

export default function DisplayCard({
  title,
  description,
  image,
}: RecipeCardProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={image}
        alt={title}
        className="h-56 w-full object-cover"
      />

      <div className="p-6">
        <h2 className="mb-2 text-2xl font-semibold text-[#1B4332]">
          {title}
        </h2>

        <p className="text-gray-600">{description}</p>

        <button className="mt-5ounded-lg bg-[#1B4332] px-5 py-2 text-[#F7F3E9] transition hover:bg-[#2D6A4F]">
          Read Recipe →
        </button>
      </div>
    </div>
  );
}