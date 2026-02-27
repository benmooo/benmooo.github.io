## Context

The blog currently uses a single-column centered layout with MDX content rendered via `next-mdx-remote/rsc`. Blog posts are at `src/app/blog/[slug]/page.tsx` with a max-width of `max-w-2xl` (42rem). The MDX content uses standard markdown headings but has no heading extraction or navigation system.

The site uses Next.js 15.3.3 with static export mode, Tailwind CSS 4, and supports dark mode via class-based theming. All blog posts are pre-rendered at build time using `generateStaticParams`.

## Goals / Non-Goals

**Goals:**
- Add a sticky table of contents sidebar on desktop screens (≥1024px)
- Extract h2 and h3 headings from MDX content automatically
- Implement smooth scrolling to sections when TOC links are clicked
- Highlight the active section in TOC based on scroll position
- Maintain responsive design with TOC hidden on mobile/tablet
- Keep the implementation simple and performant for static export

**Non-Goals:**
- Supporting h4+ headings in TOC (keep it simple with 2 levels)
- Making TOC interactive/editable
- Adding TOC to blog index page (only post detail pages)
- Server-side heading extraction (use client-side for simplicity)
- Animated TOC transitions (keep it instant for performance)

## Decisions

### 1. Heading Extraction Strategy: Client-Side with Intersection Observer

**Decision:** Extract headings client-side after MDX renders, using Intersection Observer for active section tracking.

**Rationale:**
- Next.js static export means no server-side rendering available
- MDX content is already rendered, just need to query the DOM
- Intersection Observer provides efficient scroll tracking without performance issues
- Simpler than trying to parse MDX at build time

**Alternatives considered:**
- Build-time extraction: Would require custom MDX plugin, more complex
- Scroll event listener: Less performant than Intersection Observer
- Manual TOC in frontmatter: Too much manual work for authors

### 2. Layout Strategy: CSS Grid with Sticky Sidebar

**Decision:** Use CSS Grid to create a two-column layout on desktop, with TOC in a sticky sidebar.

**Rationale:**
- Grid provides clean separation between content and TOC
- Sticky positioning keeps TOC visible while scrolling
- Easy to make responsive with Tailwind breakpoints
- Maintains existing centered content on smaller screens

**Implementation:**
```css
/* Desktop: two columns */
grid-template-columns: 1fr 250px;
gap: 2rem;

/* TOC sticky positioning */
position: sticky;
top: 2rem;
```

**Alternatives considered:**
- Flexbox: Less semantic for this layout pattern
- Absolute positioning: Harder to maintain responsive behavior
- Fixed sidebar: Would overlap content on smaller screens

### 3. Heading ID Strategy: rehype-slug Plugin

**Decision:** Use `rehype-slug` plugin to automatically add IDs to headings during MDX processing.

**Rationale:**
- Standard solution for MDX heading IDs
- Generates URL-safe slugs automatically
- Works at build time, no client-side overhead
- Compatible with existing rehype plugins

**Alternatives considered:**
- Manual IDs in markdown: Too much work for authors
- Client-side ID injection: Would cause hydration issues
- Custom rehype plugin: Reinventing the wheel

### 4. Component Architecture: Single Client Component

**Decision:** Create a single `TableOfContents` client component that handles extraction, rendering, and scroll tracking.

**Rationale:**
- Keeps all TOC logic in one place
- Client component needed for DOM access and Intersection Observer
- Can be easily integrated into existing blog post layout
- Simple to test and maintain

**Component structure:**
```tsx
'use client'
export function TableOfContents() {
  // Extract headings from DOM
  // Track active section with Intersection Observer
  // Render TOC with smooth scroll links
}
```

### 5. Responsive Behavior: Hidden on Mobile

**Decision:** Hide TOC completely on screens < 1024px using Tailwind's `hidden lg:block`.

**Rationale:**
- Mobile screens don't have space for sidebar
- Keeps mobile experience clean and focused on content
- Users can still use browser's native "find in page" for navigation
- Simpler than implementing collapsible mobile TOC

**Alternatives considered:**
- Collapsible mobile TOC: Adds complexity, takes up valuable space
- Floating TOC button: Obtrusive, poor UX
- Top-of-page TOC: Pushes content down, breaks flow

## Risks / Trade-offs

**[Risk] Hydration mismatch if headings change → Mitigation:** Use `useEffect` to extract headings only after mount, preventing SSR/client mismatch.

**[Risk] Performance with many headings → Mitigation:** Limit TOC to h2 and h3 only (typically 5-15 items), Intersection Observer is efficient.

**[Risk] Smooth scroll not working in all browsers → Mitigation:** Use `scroll-behavior: smooth` CSS with JavaScript fallback for older browsers.

**[Trade-off] No mobile TOC:** Mobile users lose quick navigation, but gain cleaner reading experience. Acceptable trade-off for blog content.

**[Trade-off] Client-side extraction:** Adds small JavaScript overhead, but keeps implementation simple and works with static export.
