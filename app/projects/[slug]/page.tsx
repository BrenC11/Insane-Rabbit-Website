import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "../../../data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectPage({
  params
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Project
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {project.name}
          </h1>
          <span className="text-sm text-zinc-400">{project.platform}</span>
        </div>
        <p className="max-w-3xl text-lg text-zinc-300">
          {project.description}
        </p>
        {project.slug === "timecam" ? (
          <a
            href="https://www.timecam.ai"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-300 transition hover:text-white"
          >
            Visit TimeCam.ai
          </a>
        ) : null}
        {project.slug === "scriptforge" ? (
          <a
            href="https://www.scriptforgeapp.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-300 transition hover:text-white"
          >
            Visit ScriptForge
          </a>
        ) : null}
      </section>

      <section className="border-t border-white/10 pt-8">
        <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          About
        </h2>
        <p className="mt-4 text-base text-zinc-300">
          {project.name} is part of the Insane Rabbit product lineup. We focus on
          clarity, utility, and responsible software design. Details will evolve
          as the product grows.
        </p>
      </section>

      <section className="border-t border-white/10 pt-8">
        <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Policies
        </h2>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-300">
          <Link
            href={`/projects/${project.slug}/privacy`}
            className="transition hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href={`/projects/${project.slug}/terms`}
            className="transition hover:text-white"
          >
            Terms
          </Link>
        </div>
      </section>
    </div>
  );
}
