## Why

Blog posts currently lack navigation within the content, making it difficult for readers to quickly jump to specific sections or understand the article structure at a glance. A table of contents on the right side would improve readability and user experience, especially for longer technical posts.

## What Changes

- Add a table of contents (TOC) component that displays on the right side of blog posts
- Extract headings from MDX content to populate the TOC
- Implement smooth scrolling to sections when TOC links are clicked
- Add active section highlighting based on scroll position
- Make TOC responsive: visible on desktop (sticky sidebar), hidden or collapsible on mobile
- Adjust blog post layout from single-column to two-column on desktop to accommodate TOC

## Capabilities

### New Capabilities
- `blog-toc`: Table of contents component that extracts and displays headings from blog post content with smooth scrolling and active section tracking

### Modified Capabilities
<!-- No existing capabilities are being modified at the requirements level -->

## Impact

- Blog post detail page layout (`src/app/blog/[slug]/page.tsx`) needs layout restructuring for two-column design
- New TOC component needs to be created with heading extraction logic
- MDX rendering may need adjustment to add IDs to headings for anchor links
- Responsive design considerations for mobile vs desktop views
- No breaking changes to existing blog post content or frontmatter
