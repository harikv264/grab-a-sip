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

## Phase 2 (planned)

- Java (Spring Boot) backend + Supabase (Postgres) — plans/orders/subscribers
- Next.js API routes (`app/api/*`) as a thin proxy to the Java service
- In-site chatbot
- Automated WhatsApp responses (location check → conversion flow)
