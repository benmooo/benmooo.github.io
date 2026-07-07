import { Link, createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "~/lib/site-config";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <p className="text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
          Conceptual Alchemist
        </p>
        <h1 className="max-w-3xl font-serif text-6xl leading-[1.05] text-[var(--ink)]">
          {siteConfig.title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          {siteConfig.description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/blog"
            className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm text-[var(--paper)] transition hover:opacity-85"
          >
            Read the archive
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm text-[var(--ink)] transition hover:border-black/20"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-[var(--paper)] p-8 shadow-[16px_16px_0_rgba(33,20,15,0.08)]">
        <p className="text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
          Orientation
        </p>
        <div className="mt-6 grid gap-4">
          {[
            {
              to: "/blog",
              label: "Write to Think",
              description: "The full editorial archive.",
            },
            {
              to: "/about",
              label: "About",
              description: "Context, interests, and direction.",
            },
            {
              to: "/contact",
              label: "Contact",
              description: "A slower, more direct line.",
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-2xl border border-black/8 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-black/15"
            >
              <div className="font-serif text-2xl text-[var(--ink)]">
                {item.label}
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">
                {item.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
