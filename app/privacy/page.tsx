export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Privacy Policy
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Insane Rabbit Privacy Policy
        </h1>
        <p className="max-w-3xl text-lg text-zinc-300">
          This placeholder policy applies when a project-specific policy is not
          available. Each product may publish its own updated policy.
        </p>
      </section>

      <section className="border-t border-white/10 pt-8 text-base text-zinc-300">
        <p>
          Insane Rabbit collects only the minimum information required to operate
          its products. We do not sell personal data. For details, consult the
          specific policy listed on each project page.
        </p>
      </section>
    </div>
  );
}
