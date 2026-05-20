# AGENTS.md – src/app/

## Purpose

The `app/` directory contains all Next.js App Router pages and API routes. It orchestrates user-facing routes (group stage, predictions, leaderboard, home), authentication flows, and backend integrations with Supabase and api-football.com.

## Key Files

- **layout.tsx** – Root layout; wraps PlayerProvider + LocaleProvider
- **page.tsx** – Home page with tournament overview
- **admin/** – Password-gated admin panel (Results, Players, Bonus, Codes tabs)
- **api/** – Backend API routes (sync-scores, auth endpoints)

## Directory Structure

```
src/app/
├── layout.tsx
├── page.tsx
├── admin/
│   ├── page.tsx
│   ├── results/
│   ├── players/
│   ├── bonus/
│   ├── codes/
│   └── AGENTS.md
├── api/
│   ├── sync-scores/
│   │   └── route.ts
│   ├── auth/
│   │   ├── login/
│   │   ├── logout/
│   │   └── check/
│   └── AGENTS.md
└── (other routes: group-stage, predictions, leaderboard, etc.)
```

## For AI Agents

**Critical Pattern:** All pages inherit PlayerProvider + LocaleProvider context from root layout.tsx. Use `usePlayer()` and `useLocale()` to access player identity, login state, and locale.

**Admin Access:** Check `player.is_admin` before rendering sensitive content. Admin panel is password-gated; only users with `is_admin=true` can access `/admin`.

**API Calls:** Use Supabase client from `src/lib/supabase.ts` for database operations. Supabase auth options are production-critical; do not modify `persistSession`, `autoRefreshToken`, or `detectSessionInUrl`.

**Locale Switching:** Player locale preference is stored in localStorage. Changes are persisted via LocaleContext—no database round-trip.

**Static Data:** Match data is hardcoded in `src/data/matches.ts` (72 group-stage matches, entry fee 50 SEK, bonus questions). No database fetching for match schedule.

## Common Patterns

- **Page Components:** Use `'use client'` for interactive pages; inherit context from root layout.
- **API Routes:** Export `GET` and/or `POST` functions in `route.ts` files. Example: `/api/sync-scores/route.ts` fetches live scores.
- **Authentication:** Login logic lives in PlayerContext.login(). Admin check uses `is_admin` boolean flag.
- **Error Handling:** API routes should return JSON with status codes. Pages should handle errors gracefully with user-friendly messages.
- **Translations:** Use `useLocale()` hook and import locale objects from `src/i18n/` to render translated text.

## Dependencies

- **Internal:** PlayerContext, LocaleContext, Supabase client, match data, i18n objects
- **External:** react@19, next@16.2.6, @supabase/supabase-js@2
- **Environment Variables:** NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, API_FOOTBALL_KEY (for /api/sync-scores)

## Breaking Changes & Cautions

- **Supabase Auth Options:** `persistSession: false`, `autoRefreshToken: false`, `detectSessionInUrl: false` are non-negotiable. Removing these will break production.
- **Admin Bypass:** No RBAC; admin access is a single boolean flag. All admin logic depends on `player.is_admin === true`.
- **Locale Persistence:** Locale is client-side only (localStorage). Server-side rendering does not know player locale.
- **Match Data:** Static data only. Changes require redeploy; no dynamic updates from database.
