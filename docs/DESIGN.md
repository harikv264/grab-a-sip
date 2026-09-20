# DESIGN.md — Grab A Sip web design system

The brand look is **"Liquid Neon"**: a deep near-black canvas lit by juicy neon
fruit colours, glassmorphic surfaces, generous rounding and physical, liquid
motion. Futuristic but appetising — it should feel like fresh juice, not a SaaS
dashboard. Read this before any UI work; reuse what's here before inventing new.

---

## 1. Colour tokens (`tailwind.config.ts`)

| Token   | Hex       | Use                                  |
|---------|-----------|--------------------------------------|
| ink     | `#0B0A12` | page background (near-black)         |
| ink-2   | `#07060B` | deeper wells / footers               |
| cream   | `#ECEAF6` | primary text                         |
| muted   | `#A6A2BD` | secondary text                       |
| dim     | `#726E88` | tertiary / captions                  |
| lime    | `#C6FF4F` | primary accent / CTAs / "go"         |
| mango   | `#FFC542` | warm accent / paused / warnings      |
| berry   | `#FF3E9A` | hot accent / demand / errors         |
| aqua    | `#38F5C9` | cool accent / info                   |
| grape   | `#A855F7` | secondary accent                     |
| orange  | `#FF6B2C` | garnish / tertiary                   |

Rules: **one** dominant accent per surface. Lime = primary action. Semantic
mapping stays consistent: active/success = lime, paused/warning = mango,
error/demand = berry, info = aqua. Never introduce raw hex in a component when a
token exists.

**Plans** map to a fixed juice colour via `planColors(name)` in `lib/data.ts`
(Small=mango, Large=lime, ABC=berry, Classic=aqua). Use it — don't re-pick.

## 2. Type

- Display / headings: **Bricolage Grotesque** (`font-display`), tight tracking.
- Body: **Inter** (`font-sans`).
- Scale is Tailwind defaults; heroes go `text-6xl`→`text-8xl`. Use
  `.gradient-text` for the one shimmering accent phrase per heading, sparingly.

## 3. Surfaces & shape

- `.glass` / `.glass-strong` — bordered translucent panels (the default card).
- Rounding is large: `rounded-3xl` / `rounded-4xl` for cards, `rounded-full`
  for chips, pills and buttons.
- Buttons: `.btn-primary` (lime), `.btn-ghost` (outline). Chips: `.chip`.
- Accent glows via blurred coloured radial blobs, not hard shadows.

## 4. Motion

Motion should feel **liquid and physical** — ease-out, springy settles, never
linear/mechanical. Standard easing: `cubic-bezier(0.22, 1, 0.36, 1)`.

- Scroll-in reveals: `components/Reveal.tsx` (Framer Motion).
- **Every** animation must no-op under `prefers-reduced-motion` — CSS keyframes
  are guarded in `globals.css`; JS primitives check `matchMedia`.
- Keep it tasteful: motion supports the content, it doesn't compete with it.

## 5. Signature motif — the juice glass

`components/JuiceGlass.tsx` — an animated SVG glass that fills to a percentage in
the plan colour (wavy surface, bubbles, straw, fruit garnish). It is the brand's
hero device for **subscription / progress**. Use it for progress meaning
(month filled, route completed) — not as generic decoration.

## 6. FX toolkit (`components/fx/`)

Reusable interaction primitives. **Place each where it earns its keep — do not
apply one idea everywhere.** Pick the smallest set that serves the surface.

| Component        | Effect                                   | Good for                         |
|------------------|------------------------------------------|----------------------------------|
| `CountUp`        | number rolls up on scroll-in             | KPIs, stats, hero figures        |
| `Sparkline`      | SVG trend line that draws in             | KPI cards with a time series     |
| `Tilt`           | pointer 3D tilt + glare                  | feature/product cards            |
| `MagneticButton` | button drifts toward cursor              | one primary CTA per view         |
| `Aurora`         | drifting gradient-mesh backdrop (CSS)    | shell / section backgrounds      |
| `JuiceBurst`     | one-shot droplet celebration (canvas)    | 100%/completion moments          |
| `.sheen` (CSS)   | light sweep on hover                     | cards, CTAs                      |

All honour reduced-motion and disable pointer effects on touch. When you need a
new effect, add it here as a small, single-purpose primitive rather than inline.

## 7. Accessibility & responsiveness

- Mobile-first; every view works at ~375px with a comfortable side gutter.
- Maintain contrast against `ink`; `muted`/`dim` are for non-essential text.
- Decorative layers are `aria-hidden` + `pointer-events-none`.
- Icons that are the only label get an `aria-label`.
