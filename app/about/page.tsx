export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          About
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Insane Rabbit
        </h1>
        <p className="max-w-3xl text-lg text-zinc-300">
          Insane Rabbit is an independent studio building software, iOS apps,
          and web tools.
        </p>
      </section>
    </div>
  );
}
