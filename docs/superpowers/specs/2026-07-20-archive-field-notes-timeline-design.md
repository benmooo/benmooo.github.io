# Archive Field Notes Timeline Design

## Goal

Redesign `/blog` as the approved Field Notes Timeline: a contemplative archive
that shares the Quiet Journal homepage's centered editorial opening while using
time as the primary visual structure for the writing list.

## Scope

This change covers:

- the archive introduction in `src/routes/blog.index.tsx`
- the year-grouped archive list in `src/components/archive-list.tsx`
- archive-list regression coverage

This change does not cover:

- post content, frontmatter, slug URLs, sorting, or route loading
- archive search, filters, pagination, cards, or sidebars
- the `随笔` instant-photo treatment on individual article pages
- a manual theme preference or changes to the existing system-theme tokens

## Preserved Data Flow

The route continues to load `PostsByYear[]` through `fetchArchiveGroups()`.
`ArchiveList` remains a pure presentation component receiving those groups as
props.

The current newest-first ordering, year grouping, post descriptions, tag data,
and `/blog/$slug` destinations remain unchanged.

## Visual Structure

### Archive Introduction

The archive opens with the same centered, restrained rhythm as the Quiet
Journal homepage:

- a compact `Collected writings` eyebrow
- the `Write to Think` title as the primary focal point
- the existing archive description in a narrow, centered text block
- no archive-specific navigation, search chrome, cards, or controls

The introduction uses the established serif-first typography and semantic
`--ink` and `--muted` tokens.

### Timeline

The list becomes a single vertical timeline beneath the introduction:

- one subtle vertical rule runs through the archive content
- each year is a timeline chapter with a hollow marker
- each post is an article on that chapter with a smaller filled marker
- year headings stay visible and chronological without a separate left gutter
- each post presents its title first, its compact formatted date beside it, its
  description beneath, then its tags as low-emphasis metadata

The timeline rule and markers are decorative CSS. The document structure stays
semantic: year sections have headings, every entry is an `article`, and post
titles remain standard links.

Tags must remain substantially quieter than titles. They should avoid
large, high-contrast rounded pills that compete with the timeline or reading
order.

### Responsive Behavior

On desktop, the timeline sits at the left of a centered reading column. A
reserved marker gutter separates the rule from post content; dates align at
the entry heading's trailing edge when space permits.

On narrow screens, the timeline stays present rather than collapsing into a
plain list. The marker gutter narrows, date content may wrap below or above
the title when needed, and descriptions and tags remain readable without
horizontal scrolling.

## Theme and Interaction

The timeline uses only existing semantic tokens:

- `--canvas` for the page
- `--ink` for titles and key headings
- `--muted` for dates, descriptions, and quiet metadata
- `--border` for the rule and separators
- `--accent` for markers and focused link treatment

This ensures the browser's `prefers-color-scheme` selection changes the
archive with the rest of the standard site. No fixed light-background,
light-border, or theme-specific color values are introduced in archive
components.

Post links retain a visible keyboard focus state and an understated hover
accent. Timeline markers do not communicate state independently of the
semantic heading and link content.

## Component Boundaries

`BlogIndexPage` owns only the page-level centered introduction and spacing.
`ArchiveList` owns the grouped timeline semantics and entry layout. The
existing `formatPostDate()` remains the single date-formatting boundary.

No data mapping, date sorting, or tag filtering logic moves into the route or
component during this visual redesign.

## Testing and Verification

Update `src/tests/archive-list.test.tsx` to verify that the archive:

- renders year headings and post links from supplied groups
- exposes a semantic archive timeline/list structure with article entries
- retains descriptions and tags as content metadata
- has no search input or search/filter chrome

Run focused archive coverage, then the existing full verification sequence:

```bash
bun run test
bun run lint
bun run build
```

## Acceptance Criteria

- `/blog` has a centered Quiet Journal-style introduction followed by a
  Field Notes Timeline.
- Years and posts are visually connected by one restrained vertical timeline.
- The archive remains easy to scan on both desktop and mobile.
- All existing published posts remain grouped, ordered, linked, and
  accessible.
- Browser light and dark preferences render through the existing semantic
  theme layer without archive-specific overrides.
- The archive contains no search/filter controls, card grid, or sidebar.
