## Why

The site currently supports dark mode only through OS-level `prefers-color-scheme` detection, which doesn't allow users to manually override their system preference. Users reading blog posts may want to toggle between light and dark themes independently of their system settings for better reading comfort in different lighting conditions.

## What Changes

- Add a client-side theme toggle button accessible from all pages
- Implement theme persistence using localStorage to remember user preference across sessions
- Override OS-level dark mode detection when user explicitly sets a preference
- Ensure theme switching is instant without page flicker or layout shift
- Maintain existing dark mode styling and color schemes

## Capabilities

### New Capabilities
- `theme-toggle`: Manual theme switching with a toggle button component that allows users to switch between light, dark, and system preference modes
- `theme-persistence`: Client-side theme state management using React context and localStorage to persist user preference across sessions

### Modified Capabilities
<!-- No existing capabilities are being modified at the requirements level -->

## Impact

- Root layout (`src/app/layout.tsx`) needs to become a client component or wrap children with theme provider
- Global styles (`src/app/globals.css`) may need adjustment to support class-based dark mode alongside media query
- Tailwind configuration needs to ensure dark mode strategy supports manual toggling
- All existing pages will automatically inherit the theme toggle functionality
- No breaking changes to existing dark mode styling or color schemes
