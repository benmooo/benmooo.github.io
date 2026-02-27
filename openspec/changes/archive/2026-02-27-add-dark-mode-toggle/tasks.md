## 1. Configuration Setup

- [x] 1.1 Update Tailwind config to use class-based dark mode strategy
- [x] 1.2 Verify existing dark mode styles work with class strategy

## 2. Theme Provider Implementation

- [x] 2.1 Create ThemeProvider component with React Context
- [x] 2.2 Implement theme state management (light/dark/system modes)
- [x] 2.3 Add localStorage persistence for theme preference
- [x] 2.4 Implement system preference detection with matchMedia
- [x] 2.5 Add effect to apply dark class to html element based on resolved theme
- [x] 2.6 Handle localStorage unavailability gracefully

## 3. FOUC Prevention

- [x] 3.1 Add inline blocking script to root layout head
- [x] 3.2 Test that theme applies before first paint on page load
- [x] 3.3 Verify no flash occurs when navigating between pages

## 4. Theme Toggle Component

- [x] 4.1 Create ThemeToggle button component
- [x] 4.2 Implement three-state toggle UI (light/dark/system)
- [x] 4.3 Add keyboard accessibility (Tab, Enter, Space)
- [x] 4.4 Add ARIA labels for screen readers
- [x] 4.5 Style toggle button to match site design

## 5. Integration

- [x] 5.1 Wrap app with ThemeProvider in root layout
- [x] 5.2 Add ThemeToggle component to site header or navigation
- [x] 5.3 Verify toggle is accessible on all pages

## 6. Testing & Verification

- [x] 6.1 Test theme switching works instantly without flicker
- [x] 6.2 Test theme preference persists across browser sessions
- [x] 6.3 Test system mode follows OS preference changes
- [x] 6.4 Test keyboard navigation and screen reader accessibility
- [x] 6.5 Test graceful degradation with JavaScript disabled
- [x] 6.6 Test graceful degradation with localStorage unavailable
- [x] 6.7 Verify all existing dark mode styles still work correctly
