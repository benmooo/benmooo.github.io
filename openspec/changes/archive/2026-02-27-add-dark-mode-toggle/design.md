## Context

The site is built with Next.js 15.3.3 using static export mode and Tailwind CSS 4. Dark mode is currently implemented using CSS custom properties (`--background`, `--foreground`) that respond to the `prefers-color-scheme` media query. All components use Tailwind's `dark:` prefix for dark mode variants.

The root layout (`src/app/layout.tsx`) is currently a server component. Global styles are defined in `src/app/globals.css` with CSS custom properties. Tailwind is configured to use these custom properties through its `@theme inline` directive.

## Goals / Non-Goals

**Goals:**
- Allow users to manually toggle between light, dark, and system preference modes
- Persist theme preference across sessions using localStorage
- Prevent flash of unstyled content (FOUC) on page load
- Maintain all existing dark mode styling without breaking changes
- Keep the implementation simple and performant for static export

**Non-Goals:**
- Changing existing color schemes or design tokens
- Adding theme customization beyond light/dark modes
- Server-side theme detection (not possible with static export)
- Animated theme transitions (keep it instant for performance)

## Decisions

### 1. Theme Strategy: Class-based with Script Injection

**Decision:** Use Tailwind's `class` strategy with a blocking script in the document head.

**Rationale:**
- Tailwind supports both `media` and `class` strategies for dark mode
- Class strategy (`<html class="dark">`) allows JavaScript control while maintaining CSS-only fallback
- Blocking script in `<head>` reads localStorage before render to prevent FOUC
- Works perfectly with Next.js static export since it's purely client-side

**Alternatives considered:**
- Media query only: Doesn't allow manual override
- CSS custom properties only: Requires more complex JavaScript and doesn't leverage Tailwind's built-in dark mode
- Server-side detection: Not possible with static export

### 2. State Management: React Context + localStorage

**Decision:** Create a ThemeProvider using React Context API with localStorage persistence.

**Rationale:**
- Context API is built-in, no external dependencies needed
- Provides theme state and toggle function to all components
- localStorage is standard for client-side persistence
- Simple enough for a single piece of state (theme preference)

**Alternatives considered:**
- Zustand/Redux: Overkill for single state value
- URL parameter: Would clutter URLs and not persist across navigation
- Cookies: Unnecessary complexity for client-only feature

### 3. Theme Modes: Light, Dark, and System

**Decision:** Support three modes - light, dark, and system (follows OS preference).

**Rationale:**
- Gives users full control while respecting those who want OS sync
- System mode maintains current behavior as default
- Common pattern in modern applications (GitHub, VS Code, etc.)

**Implementation:**
- Store preference as `"light" | "dark" | "system"` in localStorage
- When system mode, listen to `prefers-color-scheme` media query changes
- Apply `dark` class to `<html>` element based on resolved theme

### 4. Component Architecture: Provider + Toggle Button

**Decision:** Create two components:
- `ThemeProvider`: Wraps app in root layout, manages state
- `ThemeToggle`: Button component that can be placed anywhere

**Rationale:**
- Separation of concerns: state management vs UI
- ThemeToggle can be reused in header, footer, or mobile menu
- Provider pattern is idiomatic React for cross-cutting concerns

### 5. FOUC Prevention: Inline Blocking Script

**Decision:** Inject inline script in `<head>` before any content renders.

**Rationale:**
- Script runs synchronously before first paint
- Reads localStorage and applies class immediately
- No flash between system preference and user preference
- Standard technique for theme persistence in static sites

**Implementation:**
```javascript
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      const theme = localStorage.getItem('theme') || 'system';
      const isDark = theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) document.documentElement.classList.add('dark');
    })();
  `
}} />
```

## Risks / Trade-offs

**[Risk] JavaScript disabled → Mitigation:** Falls back to CSS `prefers-color-scheme` media query. Tailwind's dark mode will still work based on OS preference.

**[Risk] localStorage unavailable (private browsing) → Mitigation:** Theme state still works in memory for current session, just won't persist. Graceful degradation.

**[Risk] Hydration mismatch if script fails → Mitigation:** Script is simple and synchronous. If it fails, worst case is a brief flash before React hydrates and applies correct theme.

**[Trade-off] Inline script in head:** Adds ~200 bytes to every page, but necessary for FOUC prevention. Acceptable for better UX.

**[Trade-off] Root layout becomes client component:** Actually, we'll keep root layout as server component and create a separate client component wrapper for the provider. This maintains Next.js optimization benefits.
