# Website Refactor Design

## Goal

Replace the current Next.js static blog with a TanStack Start application backed by
a typed MDX content pipeline, while redesigning the archive and reading
experience around a calmer editorial system.

## Scope

This refactor covers:

- framework migration from Next.js App Router to TanStack Start
- content migration from route-coupled MDX files to a dedicated content root
- typed schema and query layer using Zod-first `content-collections`
- archive-first blog index redesign
- serif-first shared typography
- dual reading modes for technical posts and `随笔`
- skeuomorphic instant-camera photo treatment only for `随笔`
- removal of the current search-first list UI

This refactor does not cover:

- browser CMS or web-native writing workflow
- image upload automation
- tag or search-heavy discovery surfaces beyond basic metadata display

## Current State

The site is a Next.js App Router app using:

- `src/app/posts/*.mdx` as both content storage and route-adjacent data source
- `gray-matter` and `fs` for frontmatter loading
- `next-mdx-remote/rsc` for post rendering
- client-side archive search and tag filters
- DOM-query based table of contents generation

This creates weak boundaries between content, routing, and presentation. The UI
is also visually inconsistent: serif is not the primary voice, the archive feels
tool-driven instead of editorial, and personal writing lacks a distinct visual
mode.

## Architecture

### Framework

Replace the existing app with a single TanStack Start application using the Vite
plugin stack and a server/runtime-capable deployment target.

### Content Root

Move post sources from `src/app/posts/*.mdx` to:

```text
content/posts/*.mdx
```

This separates source content from route files and keeps the route tree focused
on rendering and navigation.

### Content Schema

Define the post contract in a root-level `content-collections.ts` file with a
Zod-first schema, then infer the TypeScript types from that schema.

The schema owns:

- `title`
- `date`
- `description`
- `tags`
- `image`
- `keywords`
- `draft`

Derived fields should include:

- `slug`
- `year`
- `isEssay`
- `excerpt`
- `readingMinutes`
- `headings`
- normalized image metadata

### Query Layer

Expose pure helpers for:

- `listPosts()`
- `listPublishedPosts()`
- `listPostsByYear()`
- `getPostBySlug(slug)`
- `listTags()`

Routes consume typed query results instead of reading files directly.

### Route Surface

The public route surface remains intentionally small:

- `/`
- `/blog`
- `/blog/$slug`
- `/about`
- `/contact`

## UI System

### Visual Direction

The site adopts the approved visual split:

- **Overall system:** Editorial Ledger
- **Essay-only accent:** Quiet Journal photo treatment for `随笔`

### Typography

Typography becomes serif-first across the site. Sans is demoted to supporting
metadata or utility copy only when needed. Code remains mono.

### Archive

The archive becomes a chronological editorial ledger:

- calm intro
- year grouping
- restrained metadata
- date -> title -> one-line description -> muted tags
- no primary search box
- no filter-chip wall

### Post Modes

All posts use the same content schema, but the renderer exposes two visual
modes:

- **Standard mode** for technical writing
  - disciplined measure
  - neutral background
  - plain image treatment
  - TOC only when useful on large screens
- **Essay mode** when tags include `随笔`
  - warmer tones
  - softer paragraph rhythm
  - slightly more generous spacing
  - skeuomorphic instant-camera image treatment

### Essay Photo Treatment

The `随笔` image block should feel like an instant photo rather than a generic
card:

- warm paper surface
- thicker lower caption border
- subtle offset shadow
- slight tilt variance
- typed or printed-feeling caption styling

This treatment applies only to `随笔` posts, not to technical posts with cover
images.

## Rendering Pipeline

MDX compilation keeps the current markdown capabilities:

- GitHub-flavored markdown
- math
- code titles
- syntax highlighting
- heading slugs
- custom embedded components such as `BiliBili`

The new pipeline must derive heading metadata during compilation so the TOC no
longer depends on client-side DOM scanning.

## Metadata and SEO

Each route defines head metadata through TanStack route APIs. Article routes
should provide:

- title
- description
- keywords
- canonical URL
- Open Graph
- Twitter card metadata

## Error Handling

- invalid frontmatter fails the build
- invalid derived content fields fail the build
- unknown slugs resolve to the app not-found route
- optional images may degrade gracefully in the UI

## Testing and Verification

The refactor should add focused verification for:

- content schema and query behavior
- archive grouping and metadata rendering
- standard post rendering
- `随笔` rendering mode
- full production build

## Implementation Strategy

Use a big-bang rewrite instead of a compatibility bridge:

1. commit the approved design and plan
2. replace framework/tooling
3. port content pipeline and tests
4. rebuild archive and shell
5. rebuild post route and essay rendering
6. delete obsolete Next.js code
7. verify the new build end-to-end

## Commit Discipline

Each major progress checkpoint should land as its own git commit so the rewrite
can be reviewed and bisected cleanly.
