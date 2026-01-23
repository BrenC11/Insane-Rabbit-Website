export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Terms &amp; Conditions
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Insane Rabbit Terms &amp; Conditions
        </h1>
        <p className="max-w-3xl text-lg text-zinc-300">
          This placeholder terms page applies when a project-specific document is
          not available. Each product may publish its own updated terms.
        </p>
      </section>

      <section className="border-t border-white/10 pt-8 text-base text-zinc-300">
        <p>
          By using Insane Rabbit products, you agree to use them responsibly and
          in accordance with applicable laws. For full details, consult the terms
          listed on each project page.
        </p>
      </section>
    </div>
  );
}
