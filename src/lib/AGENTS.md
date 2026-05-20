<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-20 -->

# lib

## Purpose
Singleton utility instances. Currently contains only the Supabase client.

## Key Files
| File | Description |
|------|-------------|
| `supabase.ts` | Single exported `supabase` client — import this everywhere, never instantiate another |

## For AI Agents

### Working in This Directory
**The auth options are production-critical. Do NOT remove or change them:**
```ts
export const supabase = createClient(url, key, {
  auth: {
    persistSession: false,      // required — prevents session detection hanging queries in prod
    autoRefreshToken: false,    // required — no background token refresh
    detectSessionInUrl: false,  // required — prevents URL callback interception
  },
});
```
Removing any of these options causes the Supabase JS client to silently fail to make HTTP requests in the production Next.js bundle (confirmed in debugging session 2026-05-20).

### Common Patterns
```ts
import { supabase } from '@/lib/supabase';
const { data, error } = await supabase.from('players').select('id, name, paid, is_admin');
```

## Dependencies
### External
- `@supabase/supabase-js@^2`
- `NEXT_PUBLIC_SUPABASE_URL` env var
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` env var
