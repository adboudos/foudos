import LoginForm from "@/components/auth/LoginForm";
import { safeNext } from "@/lib/safeNext";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-[#1B4332]">Sign in</h1>

      <p className="mt-2 text-sm text-[#1B4332]/70">
        Anyone can browse Foudos. Signing in lets you add your own recipes and
        drinks.
      </p>

      <div className="mt-8 rounded-xl border border-[#1B4332]/15 bg-white/60 p-6">
        <LoginForm next={safeNext(next)} initialError={Boolean(error)} />
      </div>

      <p className="mt-6 text-xs text-[#1B4332]/60">
        We only use your email to sign you in. Please don&apos;t put private or
        sensitive information in recipes, notes or anywhere else on the site.
      </p>
    </main>
  );
}
