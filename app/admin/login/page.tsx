import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  isAdminAuthenticatedOnServer,
  isAdminPasswordConfigured
} from "@/lib/admin/auth";

export const metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  if (isAdminAuthenticatedOnServer()) {
    redirect("/admin");
  }

  const isConfigured = isAdminPasswordConfigured();

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl items-center px-6 py-16">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-center gap-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-amber-200/70">
              Insane Rabbit Admin
            </p>
            <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.03em] leading-none text-white">
              Clean internal tools for making adverts faster.
            </h1>
            <p className="max-w-lg text-base leading-7 text-zinc-300">
              This admin area keeps prompt experiments, campaign images, and
              project-specific advert generation in one place. Unlock it and get
              straight into the tool.
            </p>
            {!isConfigured ? (
              <div className="max-w-lg rounded-[1.75rem] border border-amber-300/25 bg-amber-300/10 px-5 py-4 text-sm leading-6 text-amber-50">
                Set <code>ADMIN_PASSWORD</code> in your environment before using
                the admin area. The image generator also expects{" "}
                <code>BLOB_READ_WRITE_TOKEN</code> and <code>FAL_KEY</code>.
              </div>
            ) : null}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Studio access
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Unlock the admin workspace
              </h2>
            </div>
            <AdminLoginForm isConfigured={isConfigured} />
          </section>
        </div>
      </div>
    </div>
  );
}
