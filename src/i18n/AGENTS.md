<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-20 -->

# i18n

## Purpose
Swedish and Italian locale string objects. Every user-visible string in the app has a key here. Both locale files must stay in sync.

## Key Files
| File | Description |
|------|-------------|
| `index.ts` | `DeepStringRecord` type, locale list, locale names, default locale |
| `sv.ts` | Swedish translations (source of truth for key structure) |
| `it.ts` | Italian translations (must mirror sv.ts structure exactly) |

## For AI Agents

### Working in This Directory
- **Always add keys to BOTH `sv.ts` AND `it.ts`.** The `DeepStringRecord` type in `index.ts` enforces that `it` matches `sv`'s shape — TypeScript will error if a key is missing in Italian.
- Key sections: `app`, `nav`, `auth` (includes `returningHint`), `home`, `predictions`, `leaderboard`, `matches`, `common`, `admin`.
- Access strings in components via `const { t } = useLocale()` then `t.auth.join`, `t.admin.save`, etc.

### Common Patterns
```ts
// sv.ts / it.ts structure
export const sv = {
  auth: {
    returningHint: "Redan med? Ange samma namn och kod för att fortsätta.",
    // ...
  },
  admin: {
    logoutBtn: "Logga ut",
    // ...
  },
} as const;
```

## Dependencies
### Internal
- None
### External
- None
