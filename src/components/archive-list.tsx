import type { PostsByYear } from "~/lib/posts";

import { formatPostDate } from "~/lib/date";

type ArchiveListProps = {
  groups: PostsByYear[];
};

export function ArchiveList({ groups }: ArchiveListProps) {
  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section key={group.year} className="grid gap-8 md:grid-cols-[96px_1fr]">
          <div className="pt-2 text-sm tracking-[0.24em] text-[var(--muted)]">
            {group.year}
          </div>

          <div className="space-y-8">
            {group.posts.map((post) => (
              <article
                key={post.slug}
                className="border-t border-[var(--border)] pt-6 first:border-t-0 first:pt-0"
              >
                <div className="grid gap-3 md:grid-cols-[110px_1fr] md:items-start">
                  <p className="text-sm text-[var(--muted)]">
                    {formatPostDate(post.date)}
                  </p>

                  <div className="space-y-3">
                    <a
                      href={`/blog/${post.slug}`}
                      className="block font-serif text-xl leading-tight text-[var(--ink)] transition hover:text-[var(--accent)]"
                    >
                      {post.title}
                    </a>

                    {post.description ? (
                      <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                        {post.description}
                      </p>
                    ) : null}

                    {post.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--border)] px-3 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
