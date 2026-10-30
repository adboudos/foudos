import Link from "next/link";

export default function NoAccess({ message }: { message: string }) {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-20 text-center text-[#1B4332]">
      <h1 className="text-2xl font-bold">Not available</h1>

      <p className="mt-3 text-sm text-[#1B4332]/70">{message}</p>

      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
      >
        Back to home
      </Link>
    </main>
  );
}
