## ADDED Requirements

### Requirement: Tag display
The system SHALL display all available tags extracted from blog posts as interactive filter chips.

#### Scenario: Extract unique tags
- **WHEN** the blog index page loads
- **THEN** the system SHALL extract all unique tags from all blog posts

#### Scenario: Sort tags alphabetically
- **WHEN** displaying tags
- **THEN** the system SHALL sort tags in alphabetical order

#### Scenario: Display tag chips
- **WHEN** tags are available
- **THEN** the system SHALL display each tag as a clickable chip or button

### Requirement: Tag selection
The system SHALL allow users to select one or more tags to filter blog posts.

#### Scenario: Select single tag
- **WHEN** user clicks on an unselected tag chip
- **THEN** the system SHALL mark that tag as selected and filter posts

#### Scenario: Select multiple tags
- **WHEN** user clicks on multiple tag chips
- **THEN** the system SHALL mark all clicked tags as selected

#### Scenario: Deselect tag
- **WHEN** user clicks on a selected tag chip
- **THEN** the system SHALL deselect that tag and update the filtered posts

### Requirement: Multi-tag filtering with AND logic
The system SHALL filter blog posts to show only posts that have ALL selected tags.

#### Scenario: Single tag filter
- **WHEN** user selects one tag
- **THEN** the system SHALL display only posts that have that tag

#### Scenario: Multiple tag filter
- **WHEN** user selects multiple tags
- **THEN** the system SHALL display only posts that have ALL selected tags

#### Scenario: No tags selected
- **WHEN** no tags are selected
- **THEN** the system SHALL display all posts (no tag filtering applied)

### Requirement: Visual feedback
The system SHALL provide clear visual feedback for selected and unselected tag states.

#### Scenario: Selected tag appearance
- **WHEN** a tag is selected
- **THEN** the system SHALL display the tag with distinct styling to indicate selection

#### Scenario: Unselected tag appearance
- **WHEN** a tag is not selected
- **THEN** the system SHALL display the tag with default styling

#### Scenario: Hover state
- **WHEN** user hovers over a tag chip
- **THEN** the system SHALL display hover styling to indicate interactivity

### Requirement: Tag filter persistence
The tag filter selection SHALL persist while the user interacts with the search input.

#### Scenario: Combine with search
- **WHEN** user has selected tags and then enters a search query
- **THEN** the system SHALL apply both tag filters and search together

#### Scenario: Maintain tags on search change
- **WHEN** user modifies the search query
- **THEN** the system SHALL maintain the current tag selections

### Requirement: Responsive tag layout
The tag chips SHALL be displayed in a responsive layout that works on all screen sizes.

#### Scenario: Desktop layout
- **WHEN** viewing on desktop screens
- **THEN** the system SHALL display tags in a horizontal layout with wrapping

#### Scenario: Mobile layout
- **WHEN** viewing on mobile screens
- **THEN** the system SHALL display tags in a horizontal scrollable layout or wrapped layout

### Requirement: Empty filter results
The system SHALL display an appropriate message when no posts match the selected tag filters.

#### Scenario: No matching posts for tags
- **WHEN** the selected tag combination results in zero matching posts
- **THEN** the system SHALL display a message indicating no posts match the selected tags

#### Scenario: Show filtered count
- **WHEN** posts are filtered by tags
- **THEN** the system SHALL display the count of matching posts
