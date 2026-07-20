# Archive Field Notes Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/blog` editorial ledger with the approved Field Notes
Timeline while preserving the existing archive data flow, post order, and URLs.

**Architecture:** `BlogIndexPage` owns the centered Quiet Journal archive
introduction. `ArchiveList` remains a pure `PostsByYear[]` presentation
component and renders semantic year sections, article entries, and decorative
timeline markers. The existing `formatPostDate()` remains the only date
formatting boundary.

**Tech Stack:** TanStack Start, TanStack Router, React 19, Tailwind CSS v4,
Vitest, Testing Library

---

## File Map

### Create

- `docs/superpowers/plans/2026-07-20-archive-field-notes-timeline-implementation.md`

### Modify

- `src/tests/archive-list.test.tsx` - locks the timeline semantics and
  preserved archive content contract
- `src/components/archive-list.tsx` - renders the pure grouped Field Notes
  Timeline
- `src/routes/blog.index.tsx` - provides the centered Quiet Journal archive
  introduction and timeline spacing

## Task 1: Lock the Timeline Contract

**Files:**
- Modify: `src/tests/archive-list.test.tsx`

- [ ] **Step 1: Replace the archive-list test with a failing timeline regression**

```tsx
// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArchiveList } from "~/components/archive-list";
import { listPostsByYear } from "~/lib/posts";

describe("archive list", () => {
  it("renders year-grouped field notes timeline entries without search chrome", () => {
    const { container } = render(
      <ArchiveList groups={listPostsByYear()} />,
    );

    expect(
      container.querySelector("[data-archive-timeline='true']"),
    ).toBeTruthy();
    expect(
      container.querySelector("[data-archive-year='2026']"),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "2026" })).toBeTruthy();

    const article = container.querySelector(
      "[data-archive-entry='fp-ts-tap']",
    );

    expect(article?.tagName).toBe("ARTICLE");
    expect(
      screen.getByRole("link", {
        name: /fp-ts 进阶指南：深度解析 tap 系列副作用函数/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(/深入探讨 fp-ts 中 TaskEither 的 tap 系列函数/),
    ).toBeTruthy();
    expect(screen.getByText("fp-ts")).toBeTruthy();
    expect(screen.getByText("2026.01.28")).toBeTruthy();
    expect(screen.queryByPlaceholderText(/搜索|search/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/archive-list.test.tsx
```

Expected: FAIL because `ArchiveList` does not expose the Field Notes Timeline
data attributes or the year heading semantics.

- [ ] **Step 3: Implement the minimal semantic timeline in `ArchiveList`**

Replace `src/components/archive-list.tsx` with:

```tsx
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
                    <span
                      aria-hidden="true"
                      className="absolute -left-[1.67rem] top-8 h-1.5 w-1.5 rounded-full bg-[var(--accent)] md:-left-[2.1rem]"
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

                    {post.description ? (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                        {post.description}
                      </p>
                    ) : null}

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
```

- [ ] **Step 4: Run the focused archive regression test**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/archive-list.test.tsx
```

Expected: PASS with one archive-list test.

- [ ] **Step 5: Commit the semantic timeline component**

```bash
git add src/components/archive-list.tsx src/tests/archive-list.test.tsx
git commit -m "feat: add archive field notes timeline"
```

## Task 2: Compose the Quiet Journal Archive Page

**Files:**
- Modify: `src/routes/blog.index.tsx`

- [ ] **Step 1: Replace the archive route layout with the approved centered introduction**

Replace the `BlogIndexPage` return value in `src/routes/blog.index.tsx` with:

```tsx
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
```

- [ ] **Step 2: Run focused archive coverage**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/archive-list.test.tsx
```

Expected: PASS with one archive-list test.

- [ ] **Step 3: Run the complete validation sequence**

Run:

```bash
bun run test
bun run lint
bun run build
```

Expected: every command exits with status `0`.

- [ ] **Step 4: Commit the route composition**

```bash
git add src/routes/blog.index.tsx
git commit -m "feat: compose archive field notes layout"
```

## Task 3: Verify the Built Archive Route

**Files:**
- Modify: none

- [ ] **Step 1: Start the built server**

Run:

```bash
node .output/server/index.mjs
```

Expected: the production server listens on its configured local port.

- [ ] **Step 2: Audit the archive response**

Run:

```bash
curl -sS http://127.0.0.1:3000/blog
```

Expected: HTML includes `Collected writings`, `Write to Think`, the 2026
archive content, and the `fp-ts` post URL. It contains no `placeholder`
attribute for search controls.

- [ ] **Step 3: Stop the local built server**

Stop the exact process started in Step 1 without affecting unrelated local
processes.
