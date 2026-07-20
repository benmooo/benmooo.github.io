# Homepage Theme and Typography Design

## Goal

Restore the conceptual illustration to the homepage, redesign the landing page
as the approved Quiet Journal composition, honor the browser's preferred color
scheme, and reduce the oversized type scale throughout the public site.

## Scope

This change covers:

- the homepage composition at `/`
- browser-system light and dark themes
- semantic color tokens used by the shared shell and standard reading surfaces
- smaller typography across home, archive, post, about, and contact pages
- the existing paired conceptual illustration assets

This change does not cover:

- a manual theme toggle or persisted theme preference
- changes to MDX content, routes, metadata, or authoring workflow
- a redesign of the intentional dark visual mode for `随笔` posts

## Homepage

The homepage adopts the approved Quiet Journal direction:

- a calm, centered introduction rather than the current split hero and
  orientation-card layout
- the title `格物致知` as the primary focal point
- the existing description, `探索从经验到抽象，再用抽象重组世界图景的思维艺术`,
  directly below the title
- restrained text links to the archive, about, and contact pages
- the conceptual illustration as a wide visual field beneath the opening copy

The illustration remains part of the homepage's core narrative, not a generic
decorative card. It should have generous breathing room and no heavy rounded
container, shadow, or competing sidebar.

## Illustration Selection

The prior homepage used a matched pair:

- `/paradigm.svg` in light mode
- `/paradigm1.svg` in dark mode

The homepage will use a semantic `<picture>` element with a
`prefers-color-scheme: dark` source. This preserves the original contrast and
allows the browser to choose the correct illustration before client
hydration.

## System Theme

The default site theme will follow the operating-system/browser preference
without a site-level override:

- light tokens remain warm paper and dark ink
- dark tokens become a low-glare charcoal/brown canvas with warm light text
- `color-scheme: light dark` is declared on the document root
- the semantic token layer owns canvas, elevated surface, ink, muted text,
  accent, and subtle border colors

Components on standard surfaces will consume semantic tokens instead of
hardcoded `white` and black alpha utilities. This includes cards, borders,
hover states, and navigation chrome in the shell, archive, home, about,
contact, and standard post views.

The existing `随笔` article surface remains intentionally dark in both system
themes because its visual mode is part of the article treatment rather than a
browser-theme fallback.

## Typography

The site remains serif-first. The size hierarchy will become more restrained:

- homepage title: reduce from `text-6xl` to a `text-4xl` base with a
  `text-5xl` large-screen maximum
- archive title: reduce from `text-5xl`/`text-6xl` to `text-4xl`/`text-5xl`
- post titles: reduce from `text-4xl`/`text-6xl` to `text-3xl`/`text-5xl`
- about and contact titles: reduce from `text-4xl` to `text-3xl`
- descriptive copy: use the current `text-base` scale where `text-lg` is
  decorative rather than necessary for reading
- archive row titles and home navigation links: reduce from `text-2xl` to a
  comfortable `text-xl` or `text-lg` contextually
- prose: reduce standard article prose from `prose-lg` to `prose-base` while
  retaining practical line-height for long-form readability

Small uppercase labels and compact metadata remain legible but should not
expand into display typography.

## Responsive Behavior

The homepage stays single-column at all viewport sizes. It should:

- use compact horizontal padding on narrow screens
- keep the opening copy centered and readable
- scale the illustration down without cropping
- allow the navigation links to wrap without colliding
- use a desktop maximum width that avoids a billboard-like hero

## Testing and Verification

Add regression coverage that verifies:

- the homepage renders the restored conceptual illustration with the light and
  dark asset sources
- the homepage preserves the title, description, and primary navigation links
- the stylesheet declares the dark system-theme media query and semantic dark
  tokens

Run the focused tests, then the full `bun run test`, `bun run lint`, and
`bun run build` verification sequence before committing the implementation.

## Acceptance Criteria

- In a browser that prefers dark mode, standard site pages render a dark
  canvas, surfaces, borders, and text treatment without a manual toggle.
- In a browser that prefers light mode, the existing warm-paper editorial
  palette remains available.
- The homepage visibly includes the conceptual illustration for
  `探索从经验到抽象，再用抽象重组世界图景的思维艺术`.
- The homepage matches the Quiet Journal intent: centered, contemplative, and
  minimal, with no orientation-card grid.
- Large text is visibly less dominant across public routes while preserving
  clear hierarchy and comfortable long-form reading.
