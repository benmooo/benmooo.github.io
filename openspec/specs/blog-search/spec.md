## ADDED Requirements

### Requirement: Search input field
The system SHALL provide a search input field that allows users to enter keywords to filter blog posts.

#### Scenario: Display search input
- **WHEN** the blog index page loads
- **THEN** the system SHALL display a search input field at the top of the page

#### Scenario: Search input placeholder
- **WHEN** the search input is empty
- **THEN** the system SHALL display placeholder text indicating search functionality

### Requirement: Keyword matching
The system SHALL filter blog posts by matching the search query against post title, description, and tags using case-insensitive substring matching.

#### Scenario: Match post title
- **WHEN** user enters a search query that matches part of a post title
- **THEN** the system SHALL include that post in the filtered results

#### Scenario: Match post description
- **WHEN** user enters a search query that matches part of a post description
- **THEN** the system SHALL include that post in the filtered results

#### Scenario: Match post tags
- **WHEN** user enters a search query that matches part of any post tag
- **THEN** the system SHALL include that post in the filtered results

#### Scenario: Case-insensitive matching
- **WHEN** user enters a search query with any combination of uppercase and lowercase letters
- **THEN** the system SHALL match posts regardless of case

### Requirement: Real-time filtering
The system SHALL update the displayed blog posts in real-time as the user types in the search input.

#### Scenario: Filter on input change
- **WHEN** user types or modifies the search query
- **THEN** the system SHALL immediately update the filtered post list without requiring a button click

#### Scenario: Clear search
- **WHEN** user clears the search input
- **THEN** the system SHALL display all posts again

### Requirement: Empty search results
The system SHALL display an appropriate message when no posts match the search query.

#### Scenario: No matching posts
- **WHEN** the search query results in zero matching posts
- **THEN** the system SHALL display a message indicating no posts were found

#### Scenario: Show post count
- **WHEN** posts are filtered by search
- **THEN** the system SHALL display the count of matching posts

### Requirement: Search persistence
The search query SHALL persist while the user interacts with other filters on the page.

#### Scenario: Combine with tag filters
- **WHEN** user has entered a search query and then selects tag filters
- **THEN** the system SHALL apply both search and tag filters together

#### Scenario: Maintain search on tag change
- **WHEN** user changes tag filter selection
- **THEN** the system SHALL maintain the current search query
