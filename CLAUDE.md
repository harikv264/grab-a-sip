# CLAUDE.md — grab-a-sip (web)

Repo facts for the **Grab A Sip** marketing site + admin console + persona
portals. The global `~/.claude/CLAUDE.md` owns *how to think*; this file owns
*this repo*. Two companion docs carry the detail — read them when relevant:

- **`docs/DESIGN.md`** — the "Liquid Neon" design system, motion rules and the
  reusable FX toolkit. Read before any UI / visual change.
- **`docs/RULES.md`** — engineering rules for this repo (patterns, security,
  do/don't). Read before writing code.

---

## What this is

Next.js 14 (App Router) front end. One codebase serves three audiences:

1. **Marketing** — public site (`app/(marketing)`), incl. the serviceability
   check + lead capture.
2. **Admin console** — `/admin` (admin-only), customers / subscriptions /
   deliveries / leads.
3. **Persona portals** — `/me` (customer) and `/rider` (rider), plus the shared
   login at `/app/login`.

The Java backend (`grab-a-sip-api`) is the system of record; this app mostly
proxies to it. Supabase provides Auth (asymmetric JWT) and Postgres.

## Stack

Next.js 14.2 · TypeScript · Tailwind CSS v3 · Framer Motion · `@supabase/ssr`.
No component library — icons are inline SVG in `components/icons.tsx`.
Node ≥ 18 (see `.nvmrc`).

## Commands

```bash
npm install
npm run dev      # local dev at http://localhost:3000
npm run build    # production build — MUST pass before pushing
npm run lint     # eslint (next lint)
npx tsc --noEmit # typecheck (does not corrupt .next while dev runs)
```

Note: running `npm run build` while `npm run dev` is live can corrupt `.next`.
If a build misbehaves, `rm -rf .next` and rebuild.

## Structure

```
app/
  (marketing)/     public site (has Navbar/Footer/WhatsApp chrome)
  admin/           login + (app) group (authenticated, admin-only)
  me/  rider/      persona portals (role-gated)
  app/login/       shared persona login
  api/             route handlers (proxy to backend / Supabase)
components/
  fx/              reusable interaction primitives (see docs/DESIGN.md)
  home/  admin/  portal/   section + feature components
  JuiceGlass.tsx   signature subscription-progress motif
lib/
  data.ts          brand + product content, planColors(), MONTHLY_BOXES
  serviceability.ts  Hyderabad locality/pincode matching
  countries.ts     allowed phone countries (India/USA + 5; excludes some)
  supabase*.ts, admin-*.ts, user-api.ts   auth + backend proxy helpers
middleware.ts      route guards for /admin, /rider, /me
supabase/schema.sql
```

## Environment & deploy

- Env vars: see `.env.example`. Server-side names have **no** `NEXT_PUBLIC_`
  prefix on purpose (auth + backend calls run server-side). `SUPABASE_URL` must
  be the **bare** project URL (`https://<ref>.supabase.co`) — no `/rest/v1/`,
  no trailing slash.
- Hosted on **Vercel**, auto-deploys on push to `main`. Set the same env vars
  in Vercel → Settings → Environment Variables.

## Conventions (summary — full list in docs/RULES.md)

- Default to **Server Components**; add `"use client"` only for interactivity.
- All content/config flows through `lib/data.ts` — don't hard-code brand copy,
  prices or colours in components.
- `/admin` is admin-only at **both** the page gate and every `/api/admin/*`
  route (fails closed with 403). Never rely on the page gate alone.
- Respect `prefers-reduced-motion` in every animation.
