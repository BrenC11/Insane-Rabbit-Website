import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {year} Insane Rabbit</span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/privacy" className="transition hover:text-zinc-200">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-zinc-200">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
