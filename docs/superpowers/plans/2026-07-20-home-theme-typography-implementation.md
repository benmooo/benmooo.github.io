# Homepage Theme and Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the Quiet Journal homepage with restored concept illustration, browser-system light/dark theming, and a more restrained site-wide type scale.

**Architecture:** Semantic CSS custom properties define the standard light and dark editorial surfaces. Public-page components consume those tokens instead of fixed light-only surfaces. The homepage is a route-level, centered composition that uses the original image pair through a semantic `<picture>` element.

**Tech Stack:** TanStack Start, TanStack Router, React 19, Tailwind CSS v4, Vitest, Testing Library

---

## File Map

### Create

- `src/tests/site-theme.test.ts`
- `src/tests/home-page.test.tsx`
- `docs/superpowers/plans/2026-07-20-home-theme-typography-implementation.md`

### Modify

- `src/styles/app.css`
- `src/components/site-shell.tsx`
- `src/components/archive-list.tsx`
- `src/components/mdx-components.tsx`
- `src/components/post-article.tsx`
- `src/components/DefaultCatchBoundary.tsx`
- `src/components/NotFound.tsx`
- `src/routes/index.tsx`
- `src/routes/blog.index.tsx`
- `src/routes/about.tsx`
- `src/routes/contact.tsx`

## Task 1: Add System Theme Tokens

**Files:**
- Create: `src/tests/site-theme.test.ts`
- Modify: `src/styles/app.css`
- Modify: `src/components/site-shell.tsx`
- Modify: `src/components/archive-list.tsx`
- Modify: `src/components/mdx-components.tsx`
- Modify: `src/components/post-article.tsx`
- Modify: `src/components/DefaultCatchBoundary.tsx`
- Modify: `src/components/NotFound.tsx`
- Modify: `src/routes/about.tsx`
- Modify: `src/routes/contact.tsx`

- [ ] **Step 1: Write the failing stylesheet regression test**

```ts
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  fileURLToPath(new URL("../styles/app.css", import.meta.url)),
  "utf8",
);

describe("site system theme", () => {
  it("defines semantic tokens for browser-preferred dark mode", () => {
    expect(stylesheet).toContain("color-scheme: light dark");
    expect(stylesheet).toContain("@media (prefers-color-scheme: dark)");
    expect(stylesheet).toContain("--canvas: #181412");
    expect(stylesheet).toContain("--paper: #211c18");
    expect(stylesheet).toContain("--ink: #f4ece2");
    expect(stylesheet).toContain("--border: rgba(244, 236, 226, 0.14)");
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/site-theme.test.ts
```

Expected: FAIL because the current stylesheet lacks `color-scheme`, the dark
media query, and dark semantic tokens.

- [ ] **Step 3: Add semantic theme tokens and update standard surfaces**

In `src/styles/app.css`, replace the single light-only token block with the
following semantic structure:

```css
:root {
  color-scheme: light dark;
  --canvas: #f4efe8;
  --paper: #fbf8f3;
  --ink: #1f140f;
  --muted: #6f625a;
  --accent: #7c443e;
  --border: rgba(31, 20, 15, 0.08);
  --border-strong: rgba(31, 20, 15, 0.16);
  --surface-hover: rgba(31, 20, 15, 0.05);
  --shadow: rgba(31, 20, 15, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --canvas: #181412;
    --paper: #211c18;
    --ink: #f4ece2;
    --muted: #c2b6ab;
    --accent: #e3a69b;
    --border: rgba(244, 236, 226, 0.14);
    --border-strong: rgba(244, 236, 226, 0.24);
    --surface-hover: rgba(244, 236, 226, 0.08);
    --shadow: rgba(0, 0, 0, 0.28);
  }
}
```

Replace fixed light-only `bg-white`, `border-black/*`, and light-only shadows
on standard surfaces with `var(--paper)`, `var(--border)`,
`var(--border-strong)`, `var(--surface-hover)`, and `var(--shadow)`.
Do not change the intentionally dark `随笔` surface or its instant-photo
treatment.

- [ ] **Step 4: Run the focused theme regression test**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/site-theme.test.ts
```

Expected: PASS with one test passing.

- [ ] **Step 5: Run the full test suite, lint, and build**

Run:

```bash
bun run test
bun run lint
bun run build
```

Expected: every command exits with status `0`.

- [ ] **Step 6: Commit the system-theme foundation**

```bash
git add src/styles/app.css src/tests/site-theme.test.ts src/components/site-shell.tsx src/components/archive-list.tsx src/components/mdx-components.tsx src/components/post-article.tsx src/components/DefaultCatchBoundary.tsx src/components/NotFound.tsx src/routes/about.tsx src/routes/contact.tsx
git commit -m "feat: honor browser system theme"
```

## Task 2: Build the Quiet Journal Homepage and Reduce Type Scale

**Files:**
- Create: `src/tests/home-page.test.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/routes/blog.index.tsx`
- Modify: `src/routes/about.tsx`
- Modify: `src/routes/contact.tsx`
- Modify: `src/components/site-shell.tsx`
- Modify: `src/components/archive-list.tsx`
- Modify: `src/components/post-article.tsx`

- [ ] **Step 1: Write the failing homepage route test**

```tsx
// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { RouterProvider } from "@tanstack/react-router";
import { afterEach, describe, expect, it } from "vitest";

import { getRouter } from "~/router";

afterEach(cleanup);

describe("homepage", () => {
  it("renders the Quiet Journal introduction with theme-aware concept art", async () => {
    const router = getRouter();
    await router.load();

    const { container } = render(<RouterProvider router={router} />);

    expect(
      screen.getByText("探索从经验到抽象，再用抽象重组世界图景的思维艺术"),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Read the archive" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "About" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Contact" })).toBeTruthy();

    const illustration = container.querySelector(
      '[data-home-illustration="true"]',
    );

    expect(illustration?.querySelector('source[srcset="/paradigm1.svg"]')).toBeTruthy();
    expect(illustration?.querySelector('img[src="/paradigm.svg"]')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the new homepage test to verify it fails**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/home-page.test.tsx
```

Expected: FAIL because the current homepage does not include the
`data-home-illustration` picture element.

- [ ] **Step 3: Replace the split homepage with the centered Quiet Journal composition**

In `src/routes/index.tsx`:

- remove the two-column grid and the orientation-card link grid
- use a single centered section with compact mobile padding and a
  non-billboard desktop maximum width
- render the page title as `text-4xl md:text-5xl`
- render the description as `text-base leading-7`
- use a wrapping row of quiet text links for archive, about, and contact
- render:

```tsx
<picture
  data-home-illustration="true"
  className="mt-14 block w-full max-w-3xl"
>
  <source
    media="(prefers-color-scheme: dark)"
    srcSet="/paradigm1.svg"
  />
  <img
    src="/paradigm.svg"
    alt="概念炼金术的思维图景"
    className="h-auto w-full"
  />
</picture>
```

Use semantic border and surface tokens only for any link hover treatment; do
not introduce a card around the illustration.

- [ ] **Step 4: Reduce public typography to the specified hierarchy**

Apply these concrete class changes:

```text
src/routes/blog.index.tsx
  text-5xl ... md:text-6xl -> text-4xl ... md:text-5xl
  text-lg leading-8 -> text-base leading-7

src/components/post-article.tsx
  text-4xl ... md:text-6xl -> text-3xl ... md:text-5xl
  standard prose prose-lg -> prose prose-base

src/routes/about.tsx and src/routes/contact.tsx
  text-4xl -> text-3xl
  text-lg leading-8 -> text-base leading-7
  supporting list text-2xl -> text-xl

src/components/archive-list.tsx
  text-2xl -> text-xl

src/components/site-shell.tsx
  brand text-xl -> text-lg
```

Keep body copy line-height at `leading-7` or `leading-8` where needed for
long-form readability.

- [ ] **Step 5: Run the focused homepage regression test**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/home-page.test.tsx
```

Expected: PASS with one test passing.

- [ ] **Step 6: Run the full verification suite**

Run:

```bash
bun run test
bun run lint
bun run build
```

Expected: every command exits with status `0`.

- [ ] **Step 7: Commit the homepage and typography change**

```bash
git add src/tests/home-page.test.tsx src/routes/index.tsx src/routes/blog.index.tsx src/routes/about.tsx src/routes/contact.tsx src/components/site-shell.tsx src/components/archive-list.tsx src/components/post-article.tsx
git commit -m "feat: redesign quiet journal homepage"
```

## Final Review

- [ ] Confirm `src/styles/app.css` declares both light and dark semantic token
  values.
- [ ] Confirm `/paradigm.svg` is the default illustration and
  `/paradigm1.svg` is the dark-mode source.
- [ ] Confirm no standard public page retains `bg-white` or `border-black/*`
  light-only chrome.
- [ ] Confirm the homepage has no orientation-card grid.
- [ ] Confirm title and prose size reductions match the approved design.
- [ ] Run `bun run test`, `bun run lint`, and `bun run build` after the final
  commit.
