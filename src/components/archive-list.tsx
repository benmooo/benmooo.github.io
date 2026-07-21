import type { PostsByYear } from "~/lib/posts";

import { formatPostDate } from "~/lib/date";

type ArchiveListProps = {
  groups: PostsByYear[];
};

const getYearHeadingId = (year: number) => `archive-year-${year}`;

export function ArchiveList({ groups }: ArchiveListProps) {
  return (
    <div
      data-archive-timeline="true"
      className="relative mx-auto max-w-3xl before:absolute before:bottom-0 before:left-[0.56rem] before:top-0 before:w-px before:bg-[var(--border)] before:content-[''] md:before:left-[0.68rem]"
    >
      <div className="space-y-12">
        {groups.map((group) => {
          const headingId = getYearHeadingId(group.year);

          return (
            <section
              key={group.year}
              data-archive-year={group.year}
              aria-labelledby={headingId}
              className="relative pl-8 md:pl-11"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-[1.125rem] w-[1.125rem] rounded-full border border-[var(--accent)] bg-[var(--canvas)] md:left-[0.12rem]"
              />
              <h2
                id={headingId}
                className="text-xs tracking-[0.2em] text-[var(--muted)]"
              >
                {group.year}
              </h2>

              <div className="mt-4">
                {group.posts.map((post) => (
                  <article
                    key={post.slug}
                    data-archive-entry={post.slug}
                    className="relative border-t border-[var(--border)] py-6 first:border-t-0 first:pt-0"
                  >
                    <div
                      data-archive-title-row={post.slug}
                      className="relative"
                    >
                      <span
                        aria-hidden="true"
                        data-archive-marker="true"
                        className="absolute -left-[1.67rem] top-[0.62rem] h-1.5 w-1.5 rounded-full bg-[var(--accent)] md:-left-[2.1rem]"
                      />

                      <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <h3 className="font-serif text-xl leading-tight text-[var(--ink)]">
                          <a
                            href={`/blog/${post.slug}`}
                            className="transition hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                          >
                            {post.title}
                          </a>
                        </h3>
                        <time
                          dateTime={post.date}
                          className="shrink-0 text-xs tracking-[0.08em] text-[var(--muted)]"
                        >
                          {formatPostDate(post.date)}
                        </time>
                      </header>
                    </div>

                    {post.tags.length > 0 ? (
                      <ul
                        aria-label={`${post.title} tags`}
                        className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]"
                      >
                        {post.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
