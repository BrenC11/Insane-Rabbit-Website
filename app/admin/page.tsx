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
          librarySections={librarySections}
          projects={projects}
        />
      </div>
    </div>
  );
}
