<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-20 -->

# app/admin

## Purpose
Admin panel for managing the competition. Accessible at `/admin`. Password-gated for non-admin users; players with `is_admin = true` bypass the password form automatically.

## Key Files
| File | Description |
|------|-------------|
| `page.tsx` | Full admin page — password gate + 4 tabs |

## Tabs
| Tab | Purpose |
|-----|---------|
| Results | Enter/edit match scores; sync from api-football.com |
| Players | View all players, toggle paid status |
| Bonus | Set correct answers for bonus questions |
| Codes | View invite codes, toggle active, add new codes |

## For AI Agents

### Working in This Directory
- Admin access: `effectiveAuthed = authed || !!player?.is_admin`. The `player` comes from `usePlayer()`.
- The password fallback stores `gmab_admin=true` in `sessionStorage` (clears on tab close — intentional for shared machines).
- `NEXT_PUBLIC_ADMIN_PASSWORD` is embedded in the client bundle — do not add secrets assuming this gate is secure.
- Sync button calls `GET /api/sync-scores`; it returns `{ updated, total }`.

### Common Patterns
- Import `usePlayer` from `@/context/PlayerContext` for the `is_admin` bypass.
- Import `supabase` from `@/lib/supabase` for all DB operations.
- All tab content is in sub-components (`ResultsTab`, `PlayersTab`, `BonusTab`, `CodesTab`) defined in the same file.

## Dependencies
### Internal
- `@/context/PlayerContext` — is_admin bypass
- `@/lib/supabase` — all DB queries
- `@/data/matches` — bonusQuestions, BonusQuestionKey
### External
- `lucide-react` — Shield, Users, Award, Key, Save, Check, Lock, RefreshCw, LogOut
