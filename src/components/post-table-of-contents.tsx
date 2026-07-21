import type { Post } from "~/lib/posts";

type PostTableOfContentsProps = {
  headings: Post["headings"];
};

export function PostTableOfContents({ headings }: PostTableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="目录"
      data-post-table-of-contents="true"
      className="hidden lg:block lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-auto lg:border-l lg:border-[var(--border)] lg:pl-6"
    >
      <p className="text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        目录
      </p>
      <ul className="mt-6 space-y-3">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-4" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className="text-sm leading-6 text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
