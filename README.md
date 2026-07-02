# Penny

A warm, single-user personal budgeting PWA. Log a spend, see the impact instantly.

Built from the design handoff in `../design_handoff_budgie` with:
**React + Vite + TypeScript + Tailwind v4 + shadcn-style primitives + Supabase**, shipped as an installable PWA.

## Stack

- **Vite + React + TypeScript**
- **Tailwind v4** (`@tailwindcss/vite`) — design tokens live as CSS vars in `src/index.css`, exposed via `@theme inline`. Light/dark flip on a `.dark` class.
- **shadcn/ui** conventions (`components.json`, `@/lib/utils` `cn()`); UI primitives in `src/components/ui`.
- **Supabase** — auth (email + password) and Postgres data, scoped per-user by RLS.
- **TanStack Query** — caching + optimistic mutations for the "instant impact" feel.
- **vite-plugin-pwa** — manifest + service worker (icons from the handoff).

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + publishable/anon key
npm run dev
```

Environment variables (`.env.local`, gitignored):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable or anon key>
```

## Database

Schema (tables, RLS policies, indexes, and a trigger that seeds the 8 default
categories on first sign-in) is applied to the linked Supabase project via
migrations: `init_budgie_schema`, `lock_down_seed_function`.

- `categories` — id, user_id, name, emoji, color, budget, sort_order
- `transactions` — id, user_id, type (`expense`|`income`), amount, category_id, note, date, recurring

Money is stored as `numeric(12,2)`; month bucketing is derived from `date`.
Per-category / monthly / pace stats are computed client-side in `src/lib/derive.ts`
(never stored).

> **Email confirmation:** the Supabase project has "Confirm email" on by default,
> so `signUp` won't return a session until the email is confirmed. For local
> single-user dev, turn it off in Dashboard → Authentication → Providers → Email.

## Structure

```
src/
  lib/         supabase client, types, money/date helpers, derive(), db data layer
  hooks/       useAuth, useTheme, query + optimistic mutation hooks
  components/  ui primitives (card, ring, progress-bar, badge…), tab bar, pace chip
  screens/     sign-in, app-shell, home (Cards), placeholders
```

## Status

Milestone 1 complete: schema + project, data layer, app shell + **Home (Cards)**.
Next: Add/Edit transaction sheet (keypad), Activity, Insights, Settings, Category Detail.
