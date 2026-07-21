# Dark Prose Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Tailwind Typography-controlled MDX element readable on both browser-preferred color schemes.

**Architecture:** Keep the site palette centralized in existing semantic CSS custom properties. Add one reusable prose-token adapter that assigns Tailwind Typography variables to those tokens, then apply it to the single shared MDX article container so technical and reflective posts share the same color behavior.

**Tech Stack:** React 19, TanStack Start, Tailwind CSS 4, `@tailwindcss/typography`, Vitest.

---

### Task 1: Capture the Dark-Mode Prose Regression

**Files:**
- Modify: `src/tests/site-theme.test.ts`
- Modify: `src/tests/post-article.test.tsx`

- [x] **Step 1: Add stylesheet assertions for semantic prose variables**

```ts
  it("maps Typography prose variables to the semantic site palette", () => {
    expect(stylesheet).toContain(".prose-semantic");
    expect(stylesheet).toContain("--tw-prose-body: var(--ink)");
    expect(stylesheet).toContain("--tw-prose-headings: var(--ink)");
    expect(stylesheet).toContain("--tw-prose-bullets: var(--muted)");
    expect(stylesheet).toContain("--tw-prose-th-borders: var(--border-strong)");
    expect(stylesheet).toContain("--tw-prose-td-borders: var(--border)");
  });
```

- [x] **Step 2: Add article assertions for the shared prose class**

```ts
    expect(reflectiveProse?.className ?? "").toContain("prose-semantic");
```

```ts
    const prose = container.querySelector(".prose");

    expect(prose?.className ?? "").toContain("prose-semantic");
```

- [x] **Step 3: Run the focused tests and confirm they fail because the class and token map are absent**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/site-theme.test.ts src/tests/post-article.test.tsx
```

Expected: FAIL with missing `prose-semantic` assertions.

### Task 2: Implement the Semantic Typography Adapter

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/components/post-article.tsx`

- [x] **Step 1: Add the scoped prose-variable mapping after the global body styles**

```css
.prose-semantic {
  --tw-prose-body: var(--ink);
  --tw-prose-headings: var(--ink);
  --tw-prose-lead: var(--muted);
  --tw-prose-links: var(--ink);
  --tw-prose-bold: var(--ink);
  --tw-prose-counters: var(--muted);
  --tw-prose-bullets: var(--muted);
  --tw-prose-hr: var(--border-strong);
  --tw-prose-quotes: var(--ink);
  --tw-prose-quote-borders: var(--muted);
  --tw-prose-captions: var(--muted);
  --tw-prose-kbd: var(--ink);
  --tw-prose-kbd-shadows: var(--shadow);
  --tw-prose-code: var(--ink);
  --tw-prose-pre-code: var(--ink);
  --tw-prose-pre-bg: var(--paper);
  --tw-prose-th-borders: var(--border-strong);
  --tw-prose-td-borders: var(--border);
}
```

- [x] **Step 2: Apply the adapter to the existing shared prose class**

```ts
    "prose prose-semantic prose-base mt-14 max-w-none ..."
```

- [x] **Step 3: Re-run the focused tests**

Run:

```bash
bunx vitest run --config vitest.config.mjs src/tests/site-theme.test.ts src/tests/post-article.test.tsx
```

Expected: PASS.

### Task 3: Verify and Commit the Focused Fix

**Files:**
- Verify: `src/components/post-article.tsx`
- Verify: `src/styles/app.css`
- Verify: `src/tests/post-article.test.tsx`
- Verify: `src/tests/site-theme.test.ts`

- [x] **Step 1: Run the full test suite**

Run:

```bash
bun run test
```

Expected: PASS.

- [x] **Step 2: Run static validation**

Run:

```bash
bun run lint
bun run build
git diff --check
```

Expected: each command exits with status `0`.

- [x] **Step 3: Commit the scoped regression fix**

```bash
git add src/components/post-article.tsx src/styles/app.css src/tests/post-article.test.tsx src/tests/site-theme.test.ts docs/superpowers/plans/2026-07-21-dark-prose-contrast-implementation.md
git commit -m "fix: restore dark prose contrast"
```
