import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        About
      </p>
      <h1 className="max-w-2xl font-serif text-4xl leading-tight text-[var(--ink)]">
        The site is moving to a calmer editorial system built on typed content.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">
        This route is intentionally minimal in the framework-cutover commit. The
        final copy and layout will be rewritten after the content and archive
        system land.
      </p>
    </section>
  );
}
