/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { redirect } from "next/navigation";
import AdvertMaker from "@/components/admin/AdvertMaker";
import { projects } from "@/data/projects";
import { isAdminAuthenticatedOnServer } from "@/lib/admin/auth";
import {
  getDefaultAdvertModel,
  isBlobConfigured,
  isFileAiConfigured,
  listAdvertLibrarySections
} from "@/lib/admin/adverts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin"
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function AdminPage() {
  if (!isAdminAuthenticatedOnServer()) {
    redirect("/admin/login");
  }

  const librarySections = await listAdvertLibrarySections();
  const defaultModel = getDefaultAdvertModel();
  const hasBlob = isBlobConfigured();
  const hasFileAi = isFileAiConfigured();

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[#090909]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_34%),radial-gradient(circle_at_75%_20%,_rgba(255,255,255,0.08),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_45%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14">
        <section className="flex flex-col gap-6 rounded-[2.25rem] border border-white/10 bg-black/20 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.34em] text-amber-200/70">
                Admin Studio
              </p>
              <h1 className="text-5xl font-semibold leading-none text-white">
                Campaign image generation for every Insane Rabbit product.
              </h1>
              <p className="text-base leading-7 text-zinc-300">
                Start with the advert maker: select a project, build the creative
                brief, attach references, and store each generated asset back into
                a tidy project library.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                Back to site
              </Link>
              <form action="/api/admin/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </section>

        <AdvertMaker
          defaultModel={defaultModel}
          hasBlob={hasBlob}
          hasFileAi={hasFileAi}
          projects={projects}
        />

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                Generated library
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                Saved adverts by project
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Outputs are grouped by project slug using Blob paths under{" "}
              <code>admin/adverts/&lt;project&gt;/generated</code>.
            </p>
          </div>

          {librarySections.length ? (
            <div className="mt-8 space-y-10">
              {librarySections.map((section) => (
                <div key={section.projectSlug} className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold text-white">
                        {section.projectName}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {section.items.length} advert
                        {section.items.length === 1 ? "" : "s"} saved
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {section.items.map((item) => (
                      <article
                        key={item.pathname}
                        className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25"
                      >
                        <img
                          src={item.url}
                          alt={`${item.projectName} advert`}
                          className="aspect-[4/5] w-full object-cover"
                        />
                        <div className="space-y-3 p-4">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.projectName}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {formatTimestamp(item.uploadedAt)}
                            </p>
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/30 hover:text-white"
                          >
                            Open image
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-white/10 bg-black/20 px-6 py-10 text-sm leading-6 text-zinc-400">
              No adverts saved yet. Generate one above and it will appear here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
