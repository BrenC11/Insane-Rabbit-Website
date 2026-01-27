import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span>© {year} Insane Rabbit</span>
          <span className="text-[11px] text-zinc-500/90">
            Insane Rabbit is a trading name of Fear Army Limited. Company
            registered in England and Wales.
          </span>
        </div>
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
