## 1. Dependencies Setup

- [ ] 1.1 Install rehype-slug package for automatic heading IDs
- [ ] 1.2 Add rehype-slug to MDX plugins configuration in blog post page

## 2. TableOfContents Component

- [ ] 2.1 Create TableOfContents component file as client component
- [ ] 2.2 Implement heading extraction logic using DOM queries
- [ ] 2.3 Add TypeScript types for heading data structure
- [ ] 2.4 Implement basic TOC rendering with heading list

## 3. Active Section Tracking

- [ ] 3.1 Set up Intersection Observer for heading visibility tracking
- [ ] 3.2 Implement active section state management
- [ ] 3.3 Add active section highlighting in TOC links
- [ ] 3.4 Handle cleanup of Intersection Observer on unmount

## 4. Smooth Scrolling

- [ ] 4.1 Implement smooth scroll to section on TOC link click
- [ ] 4.2 Update URL hash when TOC link is clicked
- [ ] 4.3 Add scroll-behavior CSS for smooth scrolling
- [ ] 4.4 Test smooth scrolling works across browsers

## 5. Layout Restructuring

- [ ] 5.1 Update blog post page layout to use CSS Grid for two-column design
- [ ] 5.2 Integrate TableOfContents component into blog post page
- [ ] 5.3 Add responsive breakpoints to hide TOC on mobile/tablet
- [ ] 5.4 Adjust content max-width to accommodate TOC sidebar

## 6. Styling and Design

- [ ] 6.1 Style TOC component to match site design (colors, typography)
- [ ] 6.2 Add sticky positioning to TOC sidebar
- [ ] 6.3 Style active section highlight with appropriate colors
- [ ] 6.4 Add hover states for TOC links
- [ ] 6.5 Ensure dark mode compatibility for TOC styling
- [ ] 6.6 Add indentation for h3 headings to show hierarchy

## 7. Testing and Verification

- [ ] 7.1 Test heading extraction works with various blog posts
- [ ] 7.2 Verify smooth scrolling works on all sections
- [ ] 7.3 Test active section tracking updates correctly on scroll
- [ ] 7.4 Verify TOC is hidden on mobile/tablet screens
- [ ] 7.5 Test TOC sticky positioning on desktop
- [ ] 7.6 Verify dark mode styling works correctly
- [ ] 7.7 Test with blog posts that have few headings
- [ ] 7.8 Test with blog posts that have many headings
- [ ] 7.9 Run build to ensure no errors
