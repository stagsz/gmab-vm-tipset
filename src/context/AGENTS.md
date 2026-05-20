<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-20 -->

# context

## Purpose
React context providers for global client-side state. `PlayerContext` manages player identity and authentication; `LocaleContext` manages language selection.

## Key Files
| File | Description |
|------|-------------|
| `PlayerContext.tsx` | Player state, login/logout, localStorage session restore |
| `LocaleContext.tsx` | Locale selection (sv/it), persisted to localStorage |

## For AI Agents

### Working in This Directory
- `Player` interface: `{ id: string; name: string; paid: boolean; is_admin: boolean }` — always include `is_admin` in Supabase selects.
- `login()` checks for a **returning player** (same `invite_code` + `ilike(name)`) before inserting. Uses `.limit(1).order('created_at')` — never `.single()`.
- localStorage keys: `gmab_player_id`, `gmab_player_name`.
- Auth options on the Supabase client (`persistSession:false` etc.) are **production-critical** — do not remove.

### Common Patterns
```ts
const { player, login, logout } = usePlayer();
const { t, locale, setLocale } = useLocale();
```

## Dependencies
### Internal
- `@/lib/supabase` — DB queries in login and restoreSession

### External
- `react` — createContext, useContext, useState, useEffect
