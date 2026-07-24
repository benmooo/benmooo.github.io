import { MDXContent } from "@content-collections/mdx/react";

import { createMdxComponents } from "~/components/mdx-components";
import { InstantPhoto } from "~/components/instant-photo";
import { PostTableOfContents } from "~/components/post-table-of-contents";
import type { Post } from "~/lib/posts";
import { formatPostDate } from "~/lib/date";

type PostArticleProps = {
  post: Post;
};

export function PostArticle({ post }: PostArticleProps) {
  const mdxComponents = createMdxComponents({
    isEssay: post.isEssay,
    title: post.title,
  });
  const proseClassName = [
    "post-prose prose prose-semantic prose-base mt-14 max-w-none prose-p:text-[var(--ink)] prose-strong:text-[var(--ink)] prose-a:text-[var(--ink)] prose-a:decoration-[var(--accent)] prose-blockquote:border-[var(--muted)] prose-code:text-[var(--ink)] prose-pre:bg-[var(--paper)] prose-pre:text-[var(--ink)] prose-img:rounded-[1.5rem]",
    post.isEssay ? "reflective-prose prose-p:indent-6" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      data-post-surface="standard"
      className="bg-[var(--canvas)] text-[var(--ink)]"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <article className="mx-auto w-full max-w-3xl">
          <a
            href="/blog"
            className="text-sm uppercase tracking-[0.32em] text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            Back to archive
          </a>

          <header className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="post-reading-title text-3xl leading-tight md:text-5xl">
              {post.title}
            </h1>

            {post.description ? (
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                {post.description}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span>{formatPostDate(post.date)}</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </header>

          {post.image ? (
            <div className="mt-12">
              {post.isEssay ? (
                <InstantPhoto
                  src={post.image}
                  alt={post.title}
                  caption={post.description ?? "A note worth keeping."}
                  tilt="left"
                />
              ) : (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-[2rem] border border-[var(--border)] object-cover shadow-[0_24px_64px_var(--shadow)]"
                />
              )}
            </div>
          ) : null}

          <div
            data-reflective-prose={post.isEssay ? "true" : undefined}
            className={proseClassName}
          >
            <MDXContent code={post.mdx} components={mdxComponents} />
          </div>
        </article>

        <PostTableOfContents headings={post.headings} />
      </div>
    </section>
  );
}
