import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        Contact
      </p>
      <h1 className="max-w-2xl font-serif text-3xl leading-tight text-[var(--ink)]">
        If something here resonates, the simplest path is a direct message on
        GitHub.
      </h1>
      <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-[var(--paper)] p-8 shadow-[16px_16px_0_var(--shadow)]">
        <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
          I prefer deliberate conversations over inbox churn. If you want to
          talk about systems, writing, or something I published here, GitHub is
          the clearest starting point.
        </p>
        <a
          href="https://github.com/benmooo"
          className="mt-8 inline-flex rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm text-[var(--paper)] transition hover:opacity-85"
        >
          github.com/benmooo
        </a>
      </div>
    </section>
  );
}
