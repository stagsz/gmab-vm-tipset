# AGENTS.md — src/

## Purpose
Orchestrate the Next.js 16 application structure for GMAB VM-tipset 2026. The src/ directory contains all application logic, organized into feature-based and functional subdirectories. This document guides AI agents on the architecture, file organization, and dependencies that span across subdirectories.

## Key Files
- `layout.tsx` (via app/) — Root layout wrapping PlayerProvider + LocaleProvider
- `page.tsx` (via app/) — Home page with login and returning-player detection
- `supabase.ts` (via lib/) — Single Supabase client with critical auth options
- `PlayerContext.tsx` (via context/) — Player state (login, identity, is_admin)
- `LocaleContext.tsx` (via context/) — i18n state with localStorage persistence
- `matches.ts` (via data/) — 72 hardcoded group-stage matches, bonus questions, ENTRY_FEE_SEK
- Locale objects (via i18n/) — sv.ts, it.ts with app, nav, auth, home, predictions, leaderboard, matches, common, admin keys

## Directory Structure
```
src/
├── app/                    # Next.js App Router pages + layouts
│   ├── layout.tsx         # Root layout + providers
│   ├── page.tsx           # Home page
│   ├── admin/             # Password-gated admin panel
│   └── api/               # API routes (sync-scores)
├── components/            # Reusable React components
│   ├── Navbar.tsx         # Navigation, locale switcher, admin link
│   └── [other components]
├── context/               # React context providers
│   ├── PlayerContext.tsx  # Player state + login logic
│   └── LocaleContext.tsx  # i18n state + persistence
├── data/                  # Static data & constants
│   └── matches.ts         # Match list, entry fee, bonus questions
├── i18n/                  # Internationalization
│   ├── index.ts          # Locale type + defaultLocale
│   ├── sv.ts             # Swedish translations
│   └── it.ts             # Italian translations
└── lib/                   # Utilities & SDK clients
    └── supabase.ts       # Supabase client singleton
```

## For AI Agents

### Architecture Principles
- **Monolithic Supabase client**: `src/lib/supabase.ts` is the single source of truth. Auth options (persistSession, autoRefreshToken, detectSessionInUrl) MUST remain false—production depends on them.
- **Provider-based state**: PlayerContext + LocaleContext wrap the entire app in `src/app/layout.tsx`. Changes to provider logic affect all pages.
- **Hardcoded match data**: `src/data/matches.ts` contains 72 matches + bonus questions. Updates require direct file edits (no database).
- **Locale-first i18n**: LocaleContext reads/writes locale to localStorage; i18n objects expose nested keys (e.g., translations.app.title).
- **Admin bypass**: Admin panel uses password + is_admin flag. No role-based permissions; all admin routes are client-side gated.

### Common Patterns
1. **Consuming PlayerContext**: Import PlayerProvider context, call usePlayer() to access identity, login status, and is_admin flag.
2. **Consuming LocaleContext**: Import LocaleProvider context, call useLocale() to access current locale and translations.
3. **API integrations**: All API routes live in src/app/api/. Each route is a serverless function with environment variable access.
4. **Component styling**: Tailwind CSS 4 + lucide-react icons. Never use emoji characters as icons.
5. **Type safety**: Entire codebase is TypeScript strict mode. All context values, props, and API responses must be typed.

### Dependency Graph
- **app/** depends on: context/, i18n/, components/
- **components/** depends on: context/, i18n/, lucide-react, Tailwind CSS
- **context/** depends on: lib/ (Supabase client for auth)
- **lib/** depends on: supabase npm package, environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- **i18n/** is standalone (no runtime dependencies)
- **data/** is standalone (no runtime dependencies)

### Breaking Changes & Cautions
- **Supabase auth options are production-critical**: persistSession:false, autoRefreshToken:false, detectSessionInUrl:false. Never remove them.
- **Admin access is not RBAC**: is_admin is a boolean. There is no role-based permission system.
- **Locale is client-side only**: LocaleContext uses localStorage. No server-side locale detection or URL-based routing.
- **Match data is static**: No dynamic match fetching from database. Updates require editing src/data/matches.ts directly.

## Dependencies
- `react@19` — Client & server components
- `next@16.2.6` — App Router, API routes, image optimization
- `typescript@5` — Strict mode throughout
- `tailwindcss@4` — Utility-first CSS
- `lucide-react@latest` — Icon library (NO emoji icons)
- `@supabase/supabase-js@2` — Supabase client SDK
- `@supabase/auth-helpers-nextjs` — (if used; not evident in current code)
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `API_FOOTBALL_KEY` (for sync-scores)
