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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_32%),radial-gradient(circle_at_78%_18%,_rgba(255,255,255,0.08),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_45%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
          >
            Back
          </Link>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>

        <AdvertMaker
          defaultModel={defaultModel}
          hasBlob={hasBlob}
          hasFileAi={hasFileAi}
          projects={projects}
        />

        <section className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-300">Library</p>
            <p className="text-xs text-zinc-500">By project</p>
          </div>
          {librarySections.length ? (
            <div className="space-y-6">
              {librarySections.map((section) => (
                <div key={section.projectSlug} className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">
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
                        className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/25 transition hover:border-white/20 hover:bg-black/35"
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
            <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-black/20 px-6 py-10 text-sm leading-6 text-zinc-400">
              No adverts saved yet. Generate one above and it will appear here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
