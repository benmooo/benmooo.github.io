import { createFileRoute } from "@tanstack/react-router";

import { ArchiveList } from "~/components/archive-list";
import { fetchArchiveGroups } from "~/lib/posts-api";
import type { PostsByYear } from "~/lib/posts";

export const Route = createFileRoute("/blog/")({
  loader: () => fetchArchiveGroups(),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const groups = Route.useLoaderData();

  return <ArchivePage groups={groups} />;
}

type ArchivePageProps = {
  groups: PostsByYear[];
};

export function ArchivePage({ groups }: ArchivePageProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <header
        data-archive-introduction="true"
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
          Collected writings
        </p>
        <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-[var(--ink)] md:text-5xl">
          Write to Think
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">
          Notes on engineering, systems, games, and the occasional essay that
          wants a slower rhythm.
        </p>
      </header>

      <div className="mt-14 md:mt-16">
        <ArchiveList groups={groups} />
      </div>
    </section>
  );
}
