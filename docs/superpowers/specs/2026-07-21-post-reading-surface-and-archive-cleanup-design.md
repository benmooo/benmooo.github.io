# Post Reading Surface and Archive Cleanup Design

## Goal

Remove manual descriptions from the archive-writing workflow, align Field Notes
Timeline markers with post titles, keep every post detail page on the same
system-aware reading surface, and restore the serif-first reflective-writing
typography that was lost in the Next.js to TanStack Start migration.

## Scope

This change covers:

- archive summaries and the Field Notes Timeline entry layout
- the standard surface treatment for every `/blog/$slug` page
- serif-only reflective-writing prose for posts tagged `随笔`
- regression coverage for archive and post presentation behavior

This change does not cover:

- deleting existing `description` frontmatter from published posts
- requiring a description in new frontmatter
- renaming the existing `随笔` tag to `随想`
- changing post URLs, ordering, MDX source, or metadata routes
- removing the instant-photo image treatment for `随笔` posts

`随想` in the original request is treated as the existing reflective-writing
category currently represented by the `随笔` tag in this repository.

## Archive Descriptions

New posts may omit `description` frontmatter. The archive must not render,
require, or carry descriptions in its summary data.

`PostSummary` will exclude `description`. `ArchiveList` will render only:

- title and post link
- formatted date
- quiet tag metadata

The content-collection schema keeps `description` optional. Existing
descriptions remain available to the post-detail header, instant-photo
caption fallback, and SEO fallback. When a description is absent, the existing
generated `excerpt` remains the metadata fallback for the detail route.

## Timeline Marker Alignment

Each timeline post entry has one title row. The filled timeline marker is
positioned from that row rather than from the padded article box.

The marker center aligns with the first title line's vertical center:

- the marker belongs to a relative title-row wrapper
- the separator and entry spacing remain on the outer article
- later entries receive vertical spacing without moving their marker relative
  to the title
- wrapped titles keep the marker aligned to their first line

The vertical timeline rule and hollow year markers remain unchanged.

## Shared Post Detail Surface

Every post detail page uses the site semantic reading surface:

- `--canvas` for the page background
- `--ink`, `--muted`, `--border`, and `--accent` for header, metadata, links,
  tags, and table-of-contents treatment
- browser light and dark preferences continue to select those values through
  the existing token layer

The current dark essay gradient and all dark-only header, tag, metadata, and
table-of-contents branches are removed. A `随笔` tag no longer changes the
page background or text palette.

The `随笔` classification remains responsible for the intentional
instant-photo image rendering and reflective prose typography only.

## Reflective Prose Typography

The migration removed the legacy app's loaded `Noto Serif SC` font and its
reflective-writing prose rules. The replacement follows the approved
serif-only option:

- load `Noto Serif SC` from the Google Fonts CSS API with `display=swap`
- make it the dedicated reflective-writing font token while retaining the
  established site serif stack for standard content
- apply the reflective font to `随笔` MDX prose and headings
- restore first-line paragraph indentation with `prose-p:indent-6`
- retain the current comfortable prose line height and semantic link, code,
  quote, and image styles
- do not restore the legacy sans-serif heading exception

The normal post title, global navigation, and non-reflective MDX prose remain
on the existing serif-first site typography.

## Component Boundaries

`content-collections.ts` remains the source of truth for optional
`description`, generated `excerpt`, and the `isEssay`/reflective classifier.
`src/lib/posts.ts` defines the reduced archive summary contract.

`ArchiveList` stays a pure `PostsByYear[]` renderer. It owns no content
excerpt generation and has no description fallback.

`PostArticle` owns the common semantic post surface and selects only
reflective content behavior. `PostTableOfContents` uses the same standard
semantic token treatment for every post.

Global font registration and CSS custom properties live in `src/styles/app.css`.
No route-level code downloads, selects, or switches fonts.

## Testing and Verification

Update focused tests to verify:

- archive summaries do not expose `description`
- archive entries omit description text while retaining title, date, and tags
- each post marker is structurally anchored to its title row
- both technical and `随笔` post pages use the shared semantic surface
- a `随笔` post retains instant-photo rendering and receives the reflective
  prose typography marker
- a technical post does not receive reflective prose typography

Run:

```bash
bun run test
bun run lint
bun run build
```

Then serve `.output/server/index.mjs` and audit a standard post, a `随笔`
post, and `/blog` over HTTP.

## Acceptance Criteria

- A new post without `description` appears correctly in the archive.
- Existing description text no longer appears in archive entries.
- Every timeline post marker aligns to the first line of its title.
- Technical and `随笔` post pages share the same canvas and standard semantic
  surrounding UI in both browser color schemes.
- `随笔` prose uses the Google Fonts Noto Serif SC treatment and first-line
  paragraph indentation, with serif headings.
- `随笔` images retain their instant-photo treatment.
