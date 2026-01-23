import Link from "next/link";
import { projects } from "../data/projects";

export default function Nav() {
  return (
    <header className="border-b border-white/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Insane Rabbit
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-200">
          <div className="relative group">
            <button
              className="flex items-center gap-2 text-sm text-zinc-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
              aria-haspopup="true"
            >
              Projects
              <span className="text-xs text-zinc-400">v</span>
            </button>
            <div className="invisible absolute right-0 top-8 w-56 rounded-md border border-white/10 bg-ink/95 p-2 text-sm text-zinc-100 shadow-lg opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block rounded px-3 py-2 text-zinc-200 hover:bg-white/5 hover:text-white"
                >
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
