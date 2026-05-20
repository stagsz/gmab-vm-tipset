# AGENTS.md – src/components/

## Purpose

The `components/` directory contains reusable React components for the UI. Components consume PlayerContext and LocaleContext to display player-aware, locale-aware content. All styling uses Tailwind CSS 4; all icons use lucide-react (no emoji characters).

## Key Files

- **Navbar.tsx** – Top navigation bar with locale switcher and admin link (visible only to `player.is_admin`)
- **Tournament Overview** – Display tournament name, entry fee, match count
- **Match Cards** – Render individual match predictions with team logos and score inputs
- **Leaderboard** – Rank players by points
- **Admin Components** – Results sync UI, player management, bonus question editor, code generator

## For AI Agents

**Context Consumption:** All components that display player or locale-dependent content must use `usePlayer()` and `useLocale()` hooks. These are provided by root layout.tsx.

**Icon Usage:** Import icons from lucide-react. Example: `import { Menu } from 'lucide-react'`. Never use emoji characters (`😀`, `🎯`) as icons in UI.

**Styling:** Use Tailwind CSS 4 classes. Build component layout with flexbox, grid, and responsive utilities. No custom CSS files unless absolutely necessary.

**Admin UI:** Navbar shows Admin link only when `player.is_admin === true`. Admin components assume user has already authenticated via password.

**Translations:** Use `useLocale()` to get current locale (sv or it). Import translation objects from `src/i18n/` and access strings like `sv.nav.home` or `it.admin.results`.

## Common Patterns

- **Client Components:** Mark interactive components with `'use client'`.
- **Props Drilling:** Minimize context; use hooks instead. If a component needs player data, call `usePlayer()` directly.
- **Responsive Design:** Use Tailwind breakpoints (sm, md, lg, xl) for mobile-first layouts.
- **Icons:** Lucide React provides 2000+ icons. Example: `<Menu size={24} />`.
- **Conditional Rendering:** Use ternary operators or logical AND for simple conditionals. Example: `player.is_admin && <AdminLink />`.

## Dependencies

- **Internal:** PlayerContext, LocaleContext, i18n objects
- **External:** react@19, tailwindcss@4, lucide-react
- **Environment Variables:** None (components are UI-only)

## Breaking Changes & Cautions

- **No Emoji Icons:** lucide-react is mandatory. Emoji characters in UI will be rejected in code review.
- **Locale is Client-Only:** Components rendered on server cannot access player locale. Use dynamic imports or client-side rendering for locale-aware content.
- **Player Data in SSR:** If a component needs player info at render time, it must be a client component. Root layout.tsx wraps providers, ensuring client-side hydration.
