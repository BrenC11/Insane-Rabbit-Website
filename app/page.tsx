import Link from "next/link";
import { projects } from "../data/projects";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Independent Studio
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Insane Rabbit
        </h1>
        <p className="max-w-2xl text-lg text-zinc-300">
          Independent software studio building focused tools and apps.
        </p>
      </section>

      <section className="border-t border-white/10 pt-10">
        <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          About
        </h2>
        <p className="mt-4 max-w-3xl text-base text-zinc-300">
          Insane Rabbit is an independent studio building software, iOS apps, and
          web tools. This site exists primarily to host project information,
          privacy policies, and terms for compliance and transparency.
        </p>
      </section>

      <section className="border-t border-white/10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Projects
          </h2>
          <span className="text-xs text-zinc-500">
            Current and upcoming products
          </span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group rounded-lg border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {project.name}
                </h3>
                <span className="text-xs text-zinc-400">
                  {project.platform}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                {project.description}
              </p>
              <span className="mt-4 inline-flex text-xs text-zinc-500 group-hover:text-zinc-200">
                View project -&gt;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
