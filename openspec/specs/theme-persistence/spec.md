## ADDED Requirements

### Requirement: Theme preference persistence
The system SHALL persist the user's theme preference across browser sessions using localStorage.

#### Scenario: Preference saved on selection
- **WHEN** user selects a theme mode
- **THEN** the preference SHALL be saved to localStorage immediately

#### Scenario: Preference restored on page load
- **WHEN** user returns to the site in a new session
- **THEN** the system SHALL restore their previously selected theme mode

#### Scenario: First-time visitor default
- **WHEN** user visits the site for the first time with no saved preference
- **THEN** the system SHALL default to system mode

### Requirement: Flash prevention on page load
The system SHALL prevent flash of incorrect theme (FOUC) when loading pages.

#### Scenario: No flash on initial load
- **WHEN** user loads any page with a saved theme preference
- **THEN** the correct theme SHALL be applied before content renders

#### Scenario: No flash on navigation
- **WHEN** user navigates between pages
- **THEN** the theme SHALL remain consistent without flicker

### Requirement: localStorage unavailability handling
The system SHALL function gracefully when localStorage is unavailable or disabled.

#### Scenario: Private browsing mode
- **WHEN** localStorage is unavailable due to browser settings
- **THEN** the theme SHALL still work for the current session but not persist

#### Scenario: Storage quota exceeded
- **WHEN** localStorage write fails due to quota limits
- **THEN** the theme SHALL continue to function without throwing errors
