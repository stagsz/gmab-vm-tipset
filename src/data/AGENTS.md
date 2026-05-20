<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-20 -->

# data

## Purpose
Static data definitions — the full World Cup 2026 group-stage match schedule, bonus questions, and competition constants. No runtime database dependency.

## Key Files
| File | Description |
|------|-------------|
| `matches.ts` | 72 group-stage matches, `ENTRY_FEE_SEK = 50`, `bonusQuestions` array, tournament deadline |

## For AI Agents

### Working in This Directory
- Match data is **hardcoded** — changes require a code edit + redeploy, not a database update.
- The matches table in Supabase is seeded separately; `src/data/matches.ts` is the source of truth for the client.
- `BonusQuestionKey` is a union type exported from this file — add new bonus keys here AND in both locale files (`sv.ts`, `it.ts`).

### Common Patterns
```ts
import { matches, bonusQuestions, ENTRY_FEE_SEK } from '@/data/matches';
```

## Dependencies
### Internal
- None
### External
- None
