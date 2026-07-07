import { createFileRoute } from "@tanstack/react-router";

import { ArchiveList } from "~/components/archive-list";
import { fetchArchiveGroups } from "~/lib/posts-api";

export const Route = createFileRoute("/blog/")({
  loader: () => fetchArchiveGroups(),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const groups = Route.useLoaderData();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        Archive
      </p>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight text-[var(--ink)] md:text-6xl">
        Write to Think
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
        Notes on engineering, systems, games, and the occasional essay that
        wants a slower rhythm.
      </p>

      <div className="mt-14">
        <ArchiveList groups={groups} />
      </div>
    </section>
  );
}
