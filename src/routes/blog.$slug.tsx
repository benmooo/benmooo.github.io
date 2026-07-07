import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPlaceholder,
});

function BlogPostPlaceholder() {
  const { slug } = Route.useParams();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Link
        to="/blog"
        className="text-sm uppercase tracking-[0.32em] text-[var(--muted)] transition hover:text-[var(--ink)]"
      >
        Back to archive
      </Link>
      <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-tight text-[var(--ink)]">
        Post route scaffold for <span className="italic">{slug}</span>
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">
        The typed MDX content pipeline and the dual-mode article renderer land in
        the next commits. This placeholder keeps the app buildable during the
        framework cutover.
      </p>
    </section>
  );
}
