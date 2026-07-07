import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        Contact
      </p>
      <h1 className="max-w-2xl font-serif text-4xl leading-tight text-[var(--ink)]">
        Contact details will return after the shell and archive settle.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">
        The framework cutover keeps the public route in place while the rest of
        the site migrates off Next.js.
      </p>
    </section>
  );
}
