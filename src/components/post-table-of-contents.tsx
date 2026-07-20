import type { Post } from "~/lib/posts";

type PostTableOfContentsProps = {
  headings: Post["headings"];
  tone: "essay" | "standard";
};

export function PostTableOfContents({
  headings,
  tone,
}: PostTableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="目录"
      className={
        tone === "essay"
          ? "hidden lg:block lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-auto lg:border-l lg:border-white/8 lg:pl-6"
          : "hidden lg:block lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-auto lg:border-l lg:border-[var(--border)] lg:pl-6"
      }
    >
      <p
        className={
          tone === "essay"
            ? "text-sm uppercase tracking-[0.32em] text-[#ddb3ae]"
            : "text-sm uppercase tracking-[0.32em] text-[var(--muted)]"
        }
      >
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
              className={
                tone === "essay"
                  ? "text-sm leading-6 text-[#f2d8d3] transition hover:text-white"
                  : "text-sm leading-6 text-[var(--muted)] transition hover:text-[var(--ink)]"
              }
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
