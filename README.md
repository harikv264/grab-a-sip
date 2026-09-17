# Grab A Sip — Website (Phase 1: UI)

Modern, mobile-first marketing site for **Grab A Sip** — cold-pressed juices &
loaded fruit bowls, delivered fresh Mon–Sat.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — custom "Liquid Neon" design system
- **Framer Motion** — scroll + entrance animation
- Self-contained inline SVG icons (no icon dependency)
- Fonts: Bricolage Grotesque (display) + Inter (body) via `next/font`

Zero runtime backend in Phase 1 — all content is static data in
[`lib/data.ts`](lib/data.ts), ready to be swapped for API/Supabase calls.

## Pages

| Route       | Contents                                                            |
| ----------- | ------------------------------------------------------------------- |
| `/`         | Hero, mission/purpose/promise, benefits, product & plan previews, how-it-works, CTA |
| `/products` | All 4 products with details + Small vs Large comparison             |
| `/plans`    | Pricing, delivery logic (24–26 boxes), pause policy, FAQ            |

Every CTA opens WhatsApp chat to **+91 83281 16438** with a prefilled message.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel

This is a standard Next.js app — Vercel auto-detects everything.

**Option A — via GitHub (recommended):**
1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset: **Next.js** (auto). No env vars needed for Phase 1. Deploy.

**Option B — via CLI:**
```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

## Editing content

All copy, prices, products, plans and delivery facts live in
[`lib/data.ts`](lib/data.ts). Change a price or blurb there and it updates
everywhere on the site.

## Phase 2 — Serviceability check & lead capture (shipped)

A visitor enters their pincode/area on the home page (`#check`):
- **We deliver** → success card + deep link to WhatsApp to convert.
- **Not yet** → "coming soon" + optional phone capture. The wanted area is
  logged as demand, so you know where to expand next.

**Files:** [`lib/serviceability.ts`](lib/serviceability.ts) (the delivery-area
list — edit this with your real pincodes), [`components/ServiceabilityCheck.tsx`](components/ServiceabilityCheck.tsx),
[`app/api/leads/route.ts`](app/api/leads/route.ts) (lead capture),
[`app/api/leads/export/route.ts`](app/api/leads/export/route.ts) (CSV export).

### It works with no setup…
The check runs off the static list in `lib/serviceability.ts`. Leads just
aren't persisted until Supabase is connected (the API safely no-ops).

### …turn on lead storage + export (≈5 min)
1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Vercel → Settings → Environment Variables** add (see `.env.example`):
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Settings → API)
   - `ADMIN_TOKEN` (any long random string)
4. Redeploy. Now every check is stored, and you can download the
   **undelivered areas** as an Excel-ready CSV:
   `https://YOUR-SITE/api/leads/export?token=YOUR_ADMIN_TOKEN`
   (add `&all=1` for every lead).

> **Edit your delivery areas** in `lib/serviceability.ts` — replace the SAMPLE
> pincodes/localities with the real ones. (Later this can move into the
> `service_areas` DB table and be managed from the admin.)

## Phase 3+ (planned)

- Java (Spring Boot) backend on Render/Railway — reads the same Supabase DB
- Admin dashboard: customers, subscriptions, deliveries, inventory
- WhatsApp FAQ chatbot + outbound notifications

See the full architecture: the phased roadmap artifact shared in-app.
