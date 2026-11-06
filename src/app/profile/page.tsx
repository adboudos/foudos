import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import { getAccess } from "@/lib/access";
import {
  getDisplayName,
  getMyDrinks,
  getMyFoods,
  type MyRecipe,
} from "@/lib/db/members";

export const metadata = { title: "Your profile" };
export const dynamic = "force-dynamic";

const LEVEL: Record<string, string> = {
  general: "General (view only)",
  friend: "Friend (add and edit your own)",
  family: "Family (full access)",
};

function RecipeList({
  title,
  type,
  items,
}: {
  title: string;
  type: "food" | "drinks";
  items: MyRecipe[];
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[#1B4332]/60">Nothing yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-[#1B4332]/10 rounded-xl border border-[#1B4332]/15 bg-white/60">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${type}/${item.slug}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#1B4332]/5"
              >
                <span className="font-medium">{item.name}</span>
                {item.updatedAt && (
                  <span className="text-xs text-[#1B4332]/50">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ needName?: string }>;
}) {
  const { userId, role } = await getAccess();

  if (!userId) redirect("/login?next=/profile");

  const { needName } = await searchParams;

  const [name, foods, drinks] = await Promise.all([
    getDisplayName(userId),
    getMyFoods(userId),
    getMyDrinks(userId),
  ]);

  return (
    <main className="min-h-screen bg-[#F7F3E9] px-6 py-16 text-[#1B4332]">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-bold">Your profile</h1>

        {needName && !name && (
          <p className="mt-4 rounded-lg border border-[#1B4332]/15 bg-[#1B4332]/5 px-3 py-2 text-sm">
            Pick a display name first so your recipes can be credited to you.
          </p>
        )}

        <div className="mt-6 rounded-xl border border-[#1B4332]/15 bg-white/60 p-6">
          <ProfileForm initialName={name ?? ""} />

          <p className="mt-5 text-sm">
            <span className="font-medium">Access level:</span>{" "}
            {LEVEL[role] ?? role}
          </p>
        </div>

        <RecipeList title="Your recipes" type="food" items={foods} />
        <RecipeList title="Your drinks" type="drinks" items={drinks} />

        <p className="mt-8 text-xs text-[#1B4332]/60">
          Please don&apos;t put private or sensitive information in your name,
          recipes or notes.
        </p>
      </div>
    </main>
  );
}
