import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        Archive
      </p>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight text-[var(--ink)]">
        The ledger-style archive is replacing the current search-heavy list.
      </h1>
      <div className="mt-12 grid gap-6 border-t border-black/10 pt-10">
        {[
          {
            year: "2026",
            title: "Typed content pipeline",
            description:
              "This placeholder keeps the route alive while the MDX query layer is ported.",
          },
          {
            year: "2025",
            title: "Editorial archive redesign",
            description:
              "The final version will group real posts by year and reduce the UI chrome.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="grid gap-3 border-b border-black/5 pb-6 md:grid-cols-[96px_1fr]"
          >
            <p className="text-sm text-[var(--muted)]">{item.year}</p>
            <div>
              <h2 className="font-serif text-2xl text-[var(--ink)]">
                {item.title}
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--muted)]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <Link
          to="/"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[var(--ink)] transition hover:border-black/20"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
