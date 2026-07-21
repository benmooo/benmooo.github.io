# Post Reading Surface and Archive Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify archive entries, align their timeline markers, give every
post the shared system-aware reading surface, and restore dedicated serif
typography for `随笔` prose.

**Architecture:** The content schema continues to own optional `description`
and generated `excerpt`; the archive receives a smaller `PostSummary` that
does not include descriptions. `ArchiveList` owns the title-row marker
structure. `PostArticle` uses one semantic post surface and applies
reflective-only classes for `随笔`, while `PostTableOfContents` becomes a
single semantic-token component.

**Tech Stack:** TanStack Start, React 19, Content Collections MDX, Tailwind
CSS v4, Google Fonts CSS API, Vitest, Testing Library

---

## File Map

### Create

- `docs/superpowers/plans/2026-07-21-post-reading-surface-and-archive-cleanup-implementation.md`

### Modify

- `src/lib/posts.ts` - define the description-free archive summary contract
- `src/components/archive-list.tsx` - remove archive description rendering
  and anchor post markers to title rows
- `src/components/post-article.tsx` - use shared semantic post surface and
  select reflective prose classes only for `随笔`
- `src/components/post-table-of-contents.tsx` - remove visual-mode branches
  and consume semantic tokens
- `src/styles/app.css` - register Google Fonts Noto Serif SC and its dedicated
  reflective typography token
- `src/tests/posts.test.ts` - ensure archive summaries omit descriptions
- `src/tests/archive-list.test.tsx` - lock description-free rows and the
  title-row marker boundary
- `src/tests/post-article.test.tsx` - lock shared post surfaces and
  reflective prose markers
- `src/tests/site-theme.test.ts` - lock the packaged reflective font token

## Task 1: Define the Description-Free Archive Contract

**Files:**
- Modify: `src/tests/posts.test.ts`
- Modify: `src/tests/archive-list.test.tsx`
- Modify: `src/lib/posts.ts`
- Modify: `src/components/archive-list.tsx`

- [ ] **Step 1: Add a failing summary-contract regression**

Add this assertion to `src/tests/posts.test.ts`:

```ts
it("omits optional descriptions from archive summaries", () => {
  const archivePost = listPostsByYear()
    .flatMap((group) => group.posts)
    .find((post) => post.slug === "fp-ts-tap");

  expect(archivePost).toBeDefined();
  expect(archivePost).not.toHaveProperty("description");
});
```

- [ ] **Step 2: Add a failing archive-rendering regression**

Replace the description assertion in `src/tests/archive-list.test.tsx` with:

```tsx
expect(
  screen.queryByText(/深入探讨 fp-ts 中 TaskEither 的 tap 系列函数/),
).toBeNull();
expect(within(article as HTMLElement).getByText("fp-ts")).toBeTruthy();
expect(screen.getByText("2026.01.28")).toBeTruthy();
```

- [ ] **Step 3: Run the focused archive tests and verify they fail**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/posts.test.ts src/tests/archive-list.test.tsx
```

Expected: FAIL because `PostSummary` still includes `description` and
`ArchiveList` still renders it.

- [ ] **Step 4: Remove `description` from the archive data and view**

In `src/lib/posts.ts`, make `PostSummary`:

```ts
export type PostSummary = Pick<
  Post,
  "slug" | "title" | "date" | "tags" | "year" | "isEssay"
>;
```

Remove `description: post.description` from `toPostSummary`.

In `src/components/archive-list.tsx`, remove the conditional `<p>` that
renders `post.description`.

- [ ] **Step 5: Run the focused archive tests and verify they pass**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/posts.test.ts src/tests/archive-list.test.tsx
```

Expected: PASS with the archive contract and rendering regressions green.

- [ ] **Step 6: Commit the archive description cleanup**

```bash
git add src/lib/posts.ts src/components/archive-list.tsx src/tests/posts.test.ts src/tests/archive-list.test.tsx
git commit -m "refactor: remove descriptions from archive summaries"
```

## Task 2: Anchor Timeline Markers to Title Rows

**Files:**
- Modify: `src/tests/archive-list.test.tsx`
- Modify: `src/components/archive-list.tsx`

- [ ] **Step 1: Add a failing title-row marker regression**

After locating the `fp-ts-tap` article, add:

```tsx
const titleRow = article?.querySelector(
  "[data-archive-title-row='fp-ts-tap']",
);

expect(titleRow).toBeTruthy();
expect(
  titleRow?.querySelector("[data-archive-marker='true']"),
).toBeTruthy();
expect(article?.querySelector(":scope > [data-archive-marker='true']")).toBeNull();
```

- [ ] **Step 2: Run the focused archive-list test and verify it fails**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/archive-list.test.tsx
```

Expected: FAIL because the marker is currently an absolute child of the
padded article rather than the title row.

- [ ] **Step 3: Move the marker into a relative title-row wrapper**

In `src/components/archive-list.tsx`, replace the article-level marker and
header with:

```tsx
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
```

The `top-[0.62rem]` anchor aligns the marker with the first title line rather
than the article's variable top padding.

- [ ] **Step 4: Run the focused archive-list test and verify it passes**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/archive-list.test.tsx
```

Expected: PASS with the marker nested under its title-row wrapper.

- [ ] **Step 5: Commit the marker alignment**

```bash
git add src/components/archive-list.tsx src/tests/archive-list.test.tsx
git commit -m "fix: align archive timeline markers with post titles"
```

## Task 3: Apply One Semantic Reading Surface

**Files:**
- Modify: `src/tests/post-article.test.tsx`
- Modify: `src/components/post-article.tsx`
- Modify: `src/components/post-table-of-contents.tsx`

- [ ] **Step 1: Add failing shared-surface regressions**

Replace the mode-specific assertions in `src/tests/post-article.test.tsx`
with assertions that require both routes to expose the same surface and
semantic table-of-contents:

```tsx
expect(
  container.querySelector("[data-post-surface='standard']"),
).toBeTruthy();
expect(
  container.querySelector("[data-post-surface='essay']"),
).toBeNull();
expect(
  container.querySelector("[data-post-table-of-contents='true']"),
).toBeTruthy();
```

For the technical test:

```tsx
expect(
  container.querySelector("[data-post-surface='standard']"),
).toBeTruthy();
expect(
  container.querySelector("[data-reflective-prose='true']"),
).toBeNull();
```

For the `随笔` test:

```tsx
expect(
  container.querySelector("[data-reflective-prose='true']"),
).toBeTruthy();
```

- [ ] **Step 2: Run the focused post-article test and verify it fails**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/post-article.test.tsx
```

Expected: FAIL because essay posts expose their own dark surface and TOC tone.

- [ ] **Step 3: Remove post-surface and TOC visual-mode branches**

In `src/components/post-article.tsx`:

- Set the outer section to
  `data-post-surface="standard"` and
  `className="bg-[var(--canvas)] text-[var(--ink)]"`.
- Use the existing standard semantic classes for archive link, tags,
  description, and metadata for every post.
- Replace the two prose class branches with a shared base class plus
  `data-reflective-prose={post.isEssay ? "true" : undefined}` and the
  reflective class only when `post.isEssay`:

```tsx
const proseClassName = [
  "prose prose-base mt-14 max-w-none prose-headings:font-serif prose-p:text-[var(--ink)] prose-p:leading-8 prose-strong:text-[var(--ink)] prose-a:text-[var(--ink)] prose-a:decoration-[#ccb3ab] prose-blockquote:border-[var(--muted)] prose-code:text-[var(--ink)] prose-pre:bg-[#221f1c] prose-img:rounded-[1.5rem]",
  post.isEssay
    ? "font-[family-name:var(--font-reflective)] prose-headings:font-[family-name:var(--font-reflective)] prose-p:indent-6"
    : "",
].filter(Boolean).join(" ");
```

Keep the `InstantPhoto` conditional unchanged.

In `src/components/post-table-of-contents.tsx`:

- Remove the `tone` prop and all conditional classes.
- Add `data-post-table-of-contents="true"` to the `<nav>`.
- Use the existing standard semantic classes:

```tsx
className="hidden lg:block lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-auto lg:border-l lg:border-[var(--border)] lg:pl-6"
```

```tsx
className="text-sm uppercase tracking-[0.32em] text-[var(--muted)]"
```

```tsx
className="text-sm leading-6 text-[var(--muted)] transition hover:text-[var(--ink)]"
```

- [ ] **Step 4: Run the focused post-article test and verify it passes**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/post-article.test.tsx
```

Expected: PASS with one shared surface, retained instant photos, and a
reflective-prose marker only for `随笔`.

- [ ] **Step 5: Commit the shared post surface**

```bash
git add src/components/post-article.tsx src/components/post-table-of-contents.tsx src/tests/post-article.test.tsx
git commit -m "refactor: unify post reading surfaces"
```

## Task 4: Load Reflective Noto Serif SC Typography

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/tests/site-theme.test.ts`

- [ ] **Step 1: Add a failing stylesheet regression**

Add this test to `src/tests/site-theme.test.ts`:

```ts
it("loads the reflective serif from Google Fonts", () => {
  expect(stylesheet).toContain(
    '@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap")',
  );
  expect(stylesheet).toContain('--font-reflective: "Noto Serif SC"');
});
```

- [ ] **Step 2: Run the focused stylesheet test and verify it fails**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/site-theme.test.ts
```

Expected: FAIL because no Google Fonts import or reflective font token is
registered.

- [ ] **Step 3: Register the Google Fonts stylesheet**

- [ ] **Step 4: Register the font token**

At the top of `src/styles/app.css`, add:

```css
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap");
```

In `:root`, add:

```css
--font-reflective: "Noto Serif SC", "Iowan Old Style", "Palatino Linotype",
  "Book Antiqua", "Times New Roman", serif;
```

- [ ] **Step 5: Run the focused stylesheet test and verify it passes**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/site-theme.test.ts
```

Expected: PASS with a Google Fonts import and dedicated reflective font token.

- [ ] **Step 6: Commit the reflective font delivery**

```bash
git add src/styles/app.css src/tests/site-theme.test.ts
git commit -m "feat: restore reflective serif typography"
```

## Task 5: Run Full Verification and Audit Built Routes

**Files:**
- Verify only

- [ ] **Step 1: Run the full test suite**

Run:

```bash
bun run test
```

Expected: PASS with all tests green.

- [ ] **Step 2: Run lint**

Run:

```bash
bun run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 3: Build production output**

Run:

```bash
bun run build
```

Expected: PASS with `.output/server/index.mjs` generated.

- [ ] **Step 4: Serve the built output and audit route HTML**

Run:

```bash
bun run start
```

In another shell, run:

```bash
curl --fail --silent http://127.0.0.1:3000/blog
curl --fail --silent http://127.0.0.1:3000/blog/fp-ts-tap
curl --fail --silent http://127.0.0.1:3000/blog/emotion-normalize
```

Expected: each route returns HTTP 200. Confirm the standard and `随笔` post
routes render, and archive HTML has no published description text.

- [ ] **Step 5: Inspect the final diff and repository state**

Run:

```bash
git diff --check
git status --short
git log --oneline -4
```

Expected: no whitespace errors, a clean working tree, and four implementation
commits following the design and plan commits.
