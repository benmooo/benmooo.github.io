## Why

The blog index page currently displays all posts in chronological order with no way to search or filter content. As the number of posts grows, readers need a way to quickly find specific articles by keyword or narrow down posts by topic/tag. This improves content discoverability and user experience.

## What Changes

- Add a search input field that filters blog posts by title, description, and tags in real-time
- Add tag filter buttons/chips that allow users to filter posts by selecting one or more tags
- Display active filters with clear visual feedback
- Show filtered post count and empty state when no posts match
- Maintain responsive design and dark mode compatibility
- Keep the existing chronological sort order for filtered results

## Capabilities

### New Capabilities
- `blog-search`: Client-side search functionality that filters blog posts by keyword matching against title, description, and tags
- `blog-tag-filter`: Tag-based filtering system that allows users to filter posts by selecting tags, with multi-select support and visual feedback

### Modified Capabilities
<!-- No existing capabilities are being modified at the requirements level -->

## Impact

- Blog index page (`src/app/blog/page.tsx`) needs to be converted to a client component or use a client-side filtering component
- Search and filter state management needs to be implemented (React state)
- UI components for search input and tag filter chips need to be created
- No breaking changes to existing blog post structure or frontmatter
- No impact on static export mode - filtering happens client-side after posts are loaded
