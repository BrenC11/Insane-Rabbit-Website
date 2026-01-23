import Link from "next/link";
import { notFound } from "next/navigation";
import PolicyContent from "../../../../components/PolicyContent";
import { getProjectBySlug, projects } from "../../../../data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectTermsPage({
  params
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="text-xs uppercase tracking-[0.3em] text-zinc-500 transition hover:text-zinc-300"
        >
          Back to project
        </Link>
        <p className="text-sm text-zinc-400">{project.name}</p>
      </div>

      <PolicyContent text={project.terms} />
    </div>
  );
}
