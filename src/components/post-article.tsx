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
  const mode = post.isEssay ? "essay" : "standard";
  const mdxComponents = createMdxComponents({
    isEssay: post.isEssay,
    title: post.title,
  });

  return (
    <section
      data-post-mode={mode}
      className={
        post.isEssay
          ? "bg-[linear-gradient(180deg,#1b0507_0%,#120203_100%)] text-[#f8efed]"
          : "bg-[var(--canvas)] text-[var(--ink)]"
      }
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <article className="mx-auto w-full max-w-3xl">
          <a
            href="/blog"
            className={
              post.isEssay
                ? "text-sm uppercase tracking-[0.32em] text-[#ddb3ae] transition hover:text-white"
                : "text-sm uppercase tracking-[0.32em] text-[var(--muted)] transition hover:text-[var(--ink)]"
            }
          >
            Back to archive
          </a>

          <header className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={
                    post.isEssay
                      ? "rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#ddb3ae]"
                      : "rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
                  }
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-3xl leading-tight md:text-5xl">
              {post.title}
            </h1>

            {post.description ? (
              <p
                className={
                  post.isEssay
                    ? "max-w-2xl text-base leading-7 text-[#f0d8d4]"
                    : "max-w-2xl text-base leading-7 text-[var(--muted)]"
                }
              >
                {post.description}
              </p>
            ) : null}

            <div
              className={
                post.isEssay
                  ? "flex flex-wrap gap-4 text-sm text-[#d7b2ac]"
                  : "flex flex-wrap gap-4 text-sm text-[var(--muted)]"
              }
            >
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
            className={
              post.isEssay
                ? "prose prose-base mt-14 max-w-none prose-headings:font-serif prose-headings:text-[#fff7f5] prose-p:text-[#f8efed] prose-p:leading-8 prose-strong:text-[#fff7f5] prose-a:text-[#ffd2cb] prose-blockquote:border-[#d08a82] prose-code:text-[#fff7f5] prose-pre:bg-black/30 prose-img:rounded-[1.5rem]"
                : "prose prose-base mt-14 max-w-none prose-headings:font-serif prose-p:text-[var(--ink)] prose-p:leading-8 prose-strong:text-[var(--ink)] prose-a:text-[var(--ink)] prose-a:decoration-[#ccb3ab] prose-blockquote:border-[var(--muted)] prose-code:text-[var(--ink)] prose-pre:bg-[#221f1c] prose-img:rounded-[1.5rem]"
            }
          >
            <MDXContent code={post.mdx} components={mdxComponents} />
          </div>
        </article>

        <PostTableOfContents
          headings={post.headings}
          tone={post.isEssay ? "essay" : "standard"}
        />
      </div>
    </section>
  );
}
