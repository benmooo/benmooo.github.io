import { Link, createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "~/lib/site-config";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-4xl flex-col items-center px-6 py-16 text-center md:py-20">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
          Conceptual Alchemist
        </p>
        <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-[var(--ink)] md:text-5xl">
          {siteConfig.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">
          {siteConfig.description}
        </p>
        <nav
          aria-label="Homepage navigation"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[var(--muted)]"
        >
          <Link
            to="/blog"
            className="border-b border-[var(--border-strong)] pb-1 text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Read the archive
          </Link>
          <Link
            to="/about"
            className="border-b border-transparent pb-1 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="border-b border-transparent pb-1 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Contact
          </Link>
        </nav>
      </div>

      <picture
        data-home-illustration="true"
        className="mt-14 block w-full max-w-3xl md:mt-16"
      >
        <source
          media="(prefers-color-scheme: dark)"
          srcSet="/paradigm1.svg"
        />
        <img
          src="/paradigm.svg"
          alt="概念炼金术的思维图景"
          className="h-auto w-full"
        />
      </picture>
    </section>
  );
}
