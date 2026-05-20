<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-20 -->

# app/api

## Purpose
Next.js API routes (server-side). Currently one route: `sync-scores` which fetches live match results from api-football.com and updates the Supabase `matches` table.

## Key Files
| File | Description |
|------|-------------|
| `sync-scores/route.ts` | GET — fetches scores from api-football.com, upserts into `matches` |

## For AI Agents

### Working in This Directory
- `API_FOOTBALL_KEY` is a **server-side** env var (no `NEXT_PUBLIC_` prefix) — safe to use in route handlers, never expose to the client.
- The route is called by the admin panel sync button AND by a Vercel cron (defined in `vercel.json`, runs hourly).
- Returns `{ updated: number, total: number }` on success, `{ error: string }` on failure.
- Uses the same `supabase` client from `@/lib/supabase` — valid in server context since `persistSession:false`.

### Common Patterns
```ts
// route.ts pattern
export async function GET() {
  // fetch from api-football.com
  // upsert into supabase matches table
  return Response.json({ updated, total });
}
```

## Dependencies
### Internal
- `@/lib/supabase`
### External
- `API_FOOTBALL_KEY` env var
- `https://v3.football.api-sports.io` — api-football.com REST API
