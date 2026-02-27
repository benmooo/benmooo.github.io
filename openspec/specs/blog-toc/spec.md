## ADDED Requirements

### Requirement: Heading extraction
The system SHALL automatically extract h2 and h3 headings from blog post MDX content to populate the table of contents.

#### Scenario: Extract headings from rendered content
- **WHEN** a blog post page loads
- **THEN** the system SHALL extract all h2 and h3 headings from the rendered content

#### Scenario: Ignore other heading levels
- **WHEN** extracting headings
- **THEN** the system SHALL exclude h1, h4, h5, and h6 headings from the table of contents

### Requirement: TOC visibility
The table of contents SHALL be visible on desktop screens and hidden on mobile/tablet screens.

#### Scenario: Desktop display
- **WHEN** viewing a blog post on a screen ≥1024px wide
- **THEN** the table of contents SHALL be visible in a sidebar on the right side

#### Scenario: Mobile/tablet hidden
- **WHEN** viewing a blog post on a screen <1024px wide
- **THEN** the table of contents SHALL be hidden

### Requirement: Smooth scrolling
The system SHALL provide smooth scrolling to sections when TOC links are clicked.

#### Scenario: Click TOC link
- **WHEN** user clicks a link in the table of contents
- **THEN** the page SHALL smoothly scroll to the corresponding heading

#### Scenario: URL hash update
- **WHEN** user clicks a TOC link
- **THEN** the browser URL SHALL update with the section hash

### Requirement: Active section tracking
The system SHALL highlight the currently visible section in the table of contents based on scroll position.

#### Scenario: Highlight active section
- **WHEN** user scrolls through the blog post
- **THEN** the TOC SHALL highlight the link corresponding to the currently visible section

#### Scenario: Update on scroll
- **WHEN** user scrolls past a heading
- **THEN** the active section highlight SHALL update to reflect the new section

### Requirement: Sticky positioning
The table of contents SHALL remain visible while scrolling through the blog post on desktop screens.

#### Scenario: TOC stays visible on scroll
- **WHEN** user scrolls down the blog post on desktop
- **THEN** the table of contents SHALL remain fixed in the viewport

#### Scenario: TOC respects viewport boundaries
- **WHEN** the TOC height exceeds the viewport height
- **THEN** the TOC SHALL scroll independently within its container

### Requirement: Heading IDs
All h2 and h3 headings in blog posts SHALL have unique IDs for anchor linking.

#### Scenario: Automatic ID generation
- **WHEN** a blog post is rendered
- **THEN** all h2 and h3 headings SHALL have automatically generated URL-safe IDs

#### Scenario: ID uniqueness
- **WHEN** multiple headings have similar text
- **THEN** each heading SHALL have a unique ID to prevent conflicts
