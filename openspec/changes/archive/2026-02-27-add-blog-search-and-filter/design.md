## Context

The blog index page is currently a server component that fetches all blog posts at build time and renders them in chronological order. Posts have frontmatter with title, description, date, and tags. The site uses Next.js 15.3.3 with static export mode, Tailwind CSS 4, and supports dark mode.

Users need to search and filter posts, but static export means no server-side search. All filtering must happen client-side after the page loads.

## Goals / Non-Goals

**Goals:**
- Add client-side search that filters posts by keyword (title, description, tags)
- Add tag-based filtering with multi-select support
- Maintain static export compatibility (no server-side search)
- Keep the implementation simple and performant
- Preserve existing chronological sort order
- Support dark mode and responsive design

**Non-Goals:**
- Server-side search or API endpoints (static export constraint)
- Advanced search features (fuzzy matching, search operators)
- Search history or saved filters
- URL-based filter state (keep it simple, no query params)
- Pagination (current post count is manageable)

## Decisions

### 1. Component Architecture: Hybrid Server/Client Approach

**Decision:** Keep the page as a server component, create a separate `BlogList` client component for search/filter UI and logic.

**Rationale:**
- Server component can still fetch posts at build time (static export)
- Client component handles interactive filtering without affecting SSR
- Clean separation: data fetching vs. UI interactivity
- Avoids converting entire page to client component

**Implementation:**
```tsx
// page.tsx (server component)
export default async function BlogIndex() {
  const posts = await getBlogPosts();
  return <BlogList posts={posts} />;
}

// blog-list.tsx (client component)
'use client'
export function BlogList({ posts }) {
  // Search and filter logic here
}
```

**Alternatives considered:**
- Convert entire page to client component: Loses SSR benefits, more complex
- Use URL query params for filters: Adds complexity, not needed for this use case

### 2. Search Strategy: Simple String Matching

**Decision:** Use case-insensitive substring matching against title, description, and tags.

**Rationale:**
- Simple to implement and understand
- Fast enough for typical blog post counts (< 100 posts)
- No external dependencies needed
- Works well for exact phrase matching

**Implementation:**
```tsx
const searchTerm = query.toLowerCase();
const matchesSearch =
  post.frontmatter.title.toLowerCase().includes(searchTerm) ||
  post.frontmatter.description?.toLowerCase().includes(searchTerm) ||
  post.frontmatter.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
```

**Alternatives considered:**
- Fuzzy search (Fuse.js): Overkill for this use case, adds dependency
- Full-text search: Would require indexing, too complex
- Regex matching: More powerful but harder to use for end users

### 3. Tag Filter Strategy: Multi-Select with AND Logic

**Decision:** Allow selecting multiple tags, show posts that match ALL selected tags (AND logic).

**Rationale:**
- AND logic helps narrow down results progressively
- More intuitive for finding specific content
- Matches common filtering UX patterns
- Easy to implement with array filtering

**Implementation:**
```tsx
const matchesTags = selectedTags.length === 0 ||
  selectedTags.every(tag => post.frontmatter.tags?.includes(tag));
```

**Alternatives considered:**
- OR logic (any tag matches): Too broad, less useful for narrowing
- Single tag selection: Too limiting, users may want multiple topics
- Exclude tags (NOT logic): Adds complexity, rarely needed

### 4. UI Layout: Search Bar + Tag Chips

**Decision:** Place search input at top, followed by horizontal scrollable tag chips, then filtered post list.

**Rationale:**
- Search is primary action, gets top placement
- Tag chips provide visual overview of available topics
- Horizontal scroll works well on mobile
- Matches common blog/e-commerce filter patterns

**Layout:**
```
[Search input field]
[Tag: React] [Tag: TypeScript] [Tag: Next.js] ...
[Filtered post count]
[Post 1]
[Post 2]
...
```

**Alternatives considered:**
- Sidebar filters: Takes up too much space on mobile
- Dropdown tag selector: Hides available options, less discoverable
- Search-only (no tag filters): Less powerful, users want both

### 5. State Management: React useState

**Decision:** Use React `useState` for search query and selected tags, derive filtered posts in render.

**Rationale:**
- Simple and sufficient for this use case
- No need for complex state management (Redux, Zustand)
- Filtering is fast enough to run on every render
- Keeps component self-contained

**Implementation:**
```tsx
const [searchQuery, setSearchQuery] = useState('');
const [selectedTags, setSelectedTags] = useState<string[]>([]);

const filteredPosts = posts.filter(post => {
  const matchesSearch = /* ... */;
  const matchesTags = /* ... */;
  return matchesSearch && matchesTags;
});
```

**Alternatives considered:**
- useReducer: Overkill for simple state
- External state library: Unnecessary dependency
- useMemo for filtered posts: Premature optimization, filtering is fast

### 6. Tag Collection: Extract from Posts

**Decision:** Extract unique tags from all posts dynamically, sort alphabetically.

**Rationale:**
- No manual tag list maintenance needed
- Always in sync with actual post tags
- Simple to implement with Set
- Alphabetical sort makes tags easy to find

**Implementation:**
```tsx
const allTags = Array.from(
  new Set(posts.flatMap(post => post.frontmatter.tags || []))
).sort();
```

**Alternatives considered:**
- Manual tag list: Requires maintenance, can get out of sync
- Tag frequency sorting: More complex, alphabetical is simpler
- Tag categories: Overkill for current blog size

## Risks / Trade-offs

**[Risk] Performance with many posts → Mitigation:** Filtering is O(n) per render, but acceptable for < 100 posts. If needed later, add useMemo for filtered results.

**[Risk] No search highlighting → Mitigation:** Keep it simple for v1. Can add highlighting later if users request it.

**[Risk] Mobile tag overflow → Mitigation:** Use horizontal scroll with clear visual indicators (shadows/gradients) to show more tags available.

**[Trade-off] Client-side only:** No search indexing or advanced features, but keeps implementation simple and works with static export.

**[Trade-off] AND logic for tags:** More restrictive than OR, but better for narrowing results. Users can always deselect tags to broaden search.

**[Trade-off] No URL state:** Filters reset on page reload, but keeps implementation simple and avoids URL complexity.
