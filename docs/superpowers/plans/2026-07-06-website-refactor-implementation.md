# Website Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Next.js site with a TanStack Start blog that uses a typed MDX content layer and the new editorial archive/read experience.

**Architecture:** A single TanStack Start app owns routes and head metadata. `content-collections` owns the MDX schema and derived data. Pure content queries feed the archive and post routes. The UI adopts the editorial-ledger system globally and enables the skeuomorphic image treatment only for `随笔`.

**Tech Stack:** TanStack Start, TanStack Router, Vite, Nitro, React 19, Tailwind CSS v4, Zod, content-collections, MDX, Vitest

---

## File Map

### Create

- `content-collections.ts`
- `content/posts/*.mdx`
- `src/router.tsx`
- `src/routeTree.gen.ts`
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/blog.index.tsx`
- `src/routes/blog.$slug.tsx`
- `src/routes/about.tsx`
- `src/routes/contact.tsx`
- `src/components/site-shell.tsx`
- `src/components/archive-list.tsx`
- `src/components/post-article.tsx`
- `src/components/instant-photo.tsx`
- `src/components/post-table-of-contents.tsx`
- `src/components/mdx-components.tsx`
- `src/lib/posts.ts`
- `src/lib/seo.ts`
- `src/lib/date.ts`
- `src/lib/reading-time.ts`
- `src/lib/site-config.ts`
- `src/styles/app.css`
- `src/tests/posts.test.ts`
- `src/tests/archive-list.test.tsx`
- `src/tests/post-article.test.tsx`
- `vite.config.ts`
- `tsconfig.json`
- `eslint.config.js`

### Modify

- `package.json`
- `.gitignore`

### Delete

- `next.config.ts`
- `src/app/**`
- `src/components/blog-list.tsx`
- `src/components/image-with-fallback.tsx`
- `src/components/providers.tsx`
- `src/components/theme-provider.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/table-of-contents.tsx`
- `src/mdx-components.tsx`
- `src/styles/rehype-pretty-code.css`
- `src/types/blog.ts`

## Task 1: Capture Approved Design

- [ ] Write `docs/superpowers/specs/2026-07-06-website-refactor-design.md`
- [ ] Write `docs/superpowers/plans/2026-07-06-website-refactor-implementation.md`
- [ ] Review both docs for scope drift and ambiguity
- [ ] Commit: `docs: capture website rewrite spec and plan`

## Task 2: Replace Framework Tooling

- [ ] Update `package.json` to TanStack Start, Vite, Nitro, Tailwind v4, testing, and content dependencies
- [ ] Replace Next-specific config with `vite.config.ts`, TanStack router setup, and a root route shell
- [ ] Add `.superpowers/` to `.gitignore` because the brainstorming companion now writes project-local artifacts
- [ ] Run install and verify the empty TanStack shell builds
- [ ] Commit: `refactor: replace nextjs with tanstack start shell`

## Task 3: Port Content Source and Schema

- [ ] Move post sources into `content/posts`
- [ ] Add a Zod-first `content-collections` schema
- [ ] Derive `slug`, `year`, `isEssay`, `excerpt`, `readingMinutes`, and `headings`
- [ ] Write schema/query tests first in `src/tests/posts.test.ts`
- [ ] Run tests red/green, then run the build
- [ ] Commit: `feat: add typed mdx content pipeline`

## Task 4: Rebuild Shared Shell and Archive

- [ ] Write archive rendering tests first in `src/tests/archive-list.test.tsx`
- [ ] Implement the serif-first global shell and site navigation
- [ ] Build the archive ledger grouped by year with restrained metadata rows
- [ ] Remove the current search/filter-heavy list design
- [ ] Verify archive tests and production build
- [ ] Commit: `feat: rebuild archive in editorial ledger style`

## Task 5: Rebuild Post Route

- [ ] Write rendering tests first in `src/tests/post-article.test.tsx`
- [ ] Implement standard technical-post rendering
- [ ] Implement essay rendering triggered by the `随笔` tag
- [ ] Implement skeuomorphic instant-photo rendering for essay images only
- [ ] Replace DOM-scanned TOC with content-derived headings
- [ ] Verify post tests and production build
- [ ] Commit: `feat: add dual-mode post rendering`

## Task 6: Cleanup and Final Verification

- [ ] Delete obsolete Next.js files and dead components
- [ ] Run the full test suite
- [ ] Run the full production build
- [ ] Review git diff for leftovers or accidental artifacts
- [ ] Commit: `refactor: remove legacy nextjs implementation`

## Verification Commands

- `bun test`
- `bun run build`
- `bun run lint`

## Execution Mode

The user already requested direct implementation, so execution proceeds inline in
this session with commit checkpoints at each major milestone.
