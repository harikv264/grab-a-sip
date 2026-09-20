// ────────────────────────────────────────────────────────────────
// Grab A Sip — central content layer.
// Phase 1: static data. Swap these exports for API/Supabase calls later.
// ────────────────────────────────────────────────────────────────

export const BRAND = {
  name: "Grab A Sip",
  tagline: "Cold-pressed nutrition, delivered to your door.",
  founder: "Puppala Sai Ram",
  founderRole: "Founder, Grab A Sip",
  // Business WhatsApp: 8328116438 (India +91)
  whatsappNumber: "918328116438",
  whatsappDisplay: "+91 83281 16438",
  instagram: "https://grabasip2201.wixsite.com/grab-a-sip",
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${BRAND.whatsappNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Plans", href: "/plans" },
  { label: "Check delivery", href: "/#check" },
  { label: "Our Story", href: "/#mission" },
] as const;

// ── Products ────────────────────────────────────────────────────
export type Product = {
  slug: string;
  name: string;
  kicker: string;
  price: number;
  cadence: string;
  weight?: string;
  blurb: string;
  contents: string[];
  goodFor: string[]; // short, scannable benefit tags
  healthBenefits: HealthBenefit[]; // detailed "why it's good for you"
  gradient: string; // tailwind gradient stops
  accent: string; // hex for glows / rings
  emoji: string;
  badge?: string;
};

export type HealthBenefit = {
  emoji: string;
  title: string;
  desc: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "small",
    name: "Small Sip Bowl",
    kicker: "Loaded fruit + protein bowl",
    price: 1699,
    cadence: "/ month",
    weight: "390–420 g per box",
    blurb:
      "A perfectly portioned bowl of four seasonal fruits, a protein hit, a veggie boost and a handful of dry fruits. Built for one, built for everyday.",
    contents: [
      "4 seasonal fruits",
      "1 protein",
      "1 veggie",
      "Dry fruits mix",
    ],
    goodFor: ["Energy", "Digestion", "Immunity", "Keeps you full"],
    healthBenefits: [
      {
        emoji: "🍇",
        title: "Antioxidant-rich fruits",
        desc: "A rainbow of four fruits delivers vitamins, minerals and antioxidants that support everyday immunity.",
      },
      {
        emoji: "🌾",
        title: "Fibre for your gut",
        desc: "Whole fruit and veg keep the fibre intact — for smoother digestion and steadier energy.",
      },
      {
        emoji: "💪",
        title: "Protein + healthy fats",
        desc: "A protein source and dry-fruit mix help you stay fuller and support muscle recovery.",
      },
      {
        emoji: "⚡",
        title: "Natural, crash-free energy",
        desc: "Sweetness comes from real fruit, so you get steady energy without the sugar spike.",
      },
    ],
    gradient: "from-mango via-orange to-berry",
    accent: "#FFC542",
    emoji: "🥭",
  },
  {
    slug: "large",
    name: "Large Sip Bowl",
    kicker: "Same goodness, bigger portion",
    price: 2199,
    cadence: "/ month",
    weight: "550–590 g per box",
    blurb:
      "Everything in the Small bowl, scaled up for bigger appetites or sharing. Four fruits, protein, veggie and dry fruits — just more of it.",
    contents: [
      "4 seasonal fruits",
      "1 protein",
      "1 veggie",
      "Dry fruits mix",
    ],
    goodFor: ["Balanced meal", "Post-workout", "Fuller for longer", "Immunity"],
    healthBenefits: [
      {
        emoji: "🍽️",
        title: "A balanced mini-meal",
        desc: "Fruits, veg, protein and dry fruits in one bowl — carbs, fibre, protein and healthy fats together.",
      },
      {
        emoji: "🏋️",
        title: "Great post-workout refuel",
        desc: "The bigger portion of protein and natural carbs helps muscles recover after training.",
      },
      {
        emoji: "🌾",
        title: "More fibre, fuller for longer",
        desc: "A larger serving of whole fruit and veg keeps digestion smooth and hunger away.",
      },
      {
        emoji: "🛡️",
        title: "Everyday immunity support",
        desc: "Antioxidant-rich seasonal fruits give your body a daily nutrient top-up.",
      },
    ],
    gradient: "from-lime via-mango to-orange",
    accent: "#C6FF4F",
    emoji: "🍓",
    badge: "Most filling",
  },
  {
    slug: "abc",
    name: "ABC Everyday",
    kicker: "Amla · Beetroot · Carrot",
    price: 1500,
    cadence: "/ month",
    weight: "Fresh cold-pressed juice, daily",
    blurb:
      "The daily detox classic. Amla, beetroot and carrot cold-pressed fresh every single delivery day — glow, gut and immunity in one glass.",
    contents: [
      "Amla (Indian gooseberry)",
      "Beetroot",
      "Carrot",
      "Zero added sugar",
    ],
    goodFor: ["Immunity", "Skin & hair glow", "Stamina", "Daily detox"],
    healthBenefits: [
      {
        emoji: "🍋",
        title: "Amla — vitamin C powerhouse",
        desc: "One of the richest natural sources of vitamin C, supporting immunity, skin and hair.",
      },
      {
        emoji: "🫀",
        title: "Beetroot — stamina & circulation",
        desc: "Natural nitrates support healthy blood flow, stamina and the body's own detox.",
      },
      {
        emoji: "🥕",
        title: "Carrot — eyes & skin",
        desc: "Beta-carotene (vitamin A) supports eye health and a natural glow.",
      },
      {
        emoji: "✨",
        title: "A clean daily reset",
        desc: "Sugar-free and cold-pressed fresh — the easiest way to start every morning right.",
      },
    ],
    gradient: "from-berry via-grape to-orange",
    accent: "#FF3E9A",
    emoji: "🫐",
    badge: "Detox favourite",
  },
  {
    slug: "classic",
    name: "Classic Juice Plan",
    kicker: "A rotating week of juices",
    price: 1350,
    cadence: "/ month",
    weight: "6 juices a week, always changing",
    blurb:
      "Variety on repeat. A curated weekly rotation so no two days taste the same — ABC, coconut water, veggie and three fruit juices.",
    contents: [
      "1 day · ABC juice",
      "1 day · Coconut water",
      "1 day · Veggie juice",
      "3 days · Fruit juices",
    ],
    goodFor: ["Hydration", "Daily greens", "Antioxidants", "Nutrient variety"],
    healthBenefits: [
      {
        emoji: "💧",
        title: "Coconut water hydration",
        desc: "Natural electrolytes rehydrate and replenish — a clean alternative to sugary drinks.",
      },
      {
        emoji: "🥬",
        title: "Your daily greens",
        desc: "Veggie juice packs in the greens and minerals most days quietly miss.",
      },
      {
        emoji: "🍊",
        title: "Vitamin-C fruit juices",
        desc: "Three days of antioxidant-rich fruit juices help support everyday immunity.",
      },
      {
        emoji: "🔄",
        title: "A wider nutrient spectrum",
        desc: "A rotating week means your body gets variety instead of the same thing daily.",
      },
    ],
    gradient: "from-aqua via-lime to-mango",
    accent: "#38F5C9",
    emoji: "🥥",
    badge: "Best value",
  },
];

// ── Plan → juice-glass colours ──────────────────────────────────
// Maps any plan/product name to the {fill, garnish} used by <JuiceGlass>.
// Falls back to the mango/orange pairing for unknown names.
export const PLAN_COLORS: { match: string; fill: string; garnish: string }[] = [
  { match: "large", fill: "#C6FF4F", garnish: "#38F5C9" }, // check "large" before "small" won't clash
  { match: "small", fill: "#FFC542", garnish: "#FF6B2C" },
  { match: "abc", fill: "#FF3E9A", garnish: "#A855F7" },
  { match: "classic", fill: "#38F5C9", garnish: "#C6FF4F" },
];

export function planColors(planName: string | null | undefined): {
  fill: string;
  garnish: string;
} {
  const n = (planName ?? "").toLowerCase();
  const hit = PLAN_COLORS.find((p) => n.includes(p.match));
  return hit
    ? { fill: hit.fill, garnish: hit.garnish }
    : { fill: "#FFC542", garnish: "#FF6B2C" };
}

// Target fresh boxes in a festival-free month — the "full glass".
export const MONTHLY_BOXES = 26;

// ── Functional ingredient highlights (home "what's inside" section) ──
export const INGREDIENT_BENEFITS = [
  { emoji: "🍋", name: "Amla", benefit: "Immunity & vitamin C", accent: "#C6FF4F" },
  { emoji: "🫀", name: "Beetroot", benefit: "Stamina & circulation", accent: "#FF3E9A" },
  { emoji: "🥕", name: "Carrot", benefit: "Eyes & skin", accent: "#FF6B2C" },
  { emoji: "💧", name: "Coconut water", benefit: "Hydration & electrolytes", accent: "#38F5C9" },
  { emoji: "🥬", name: "Leafy greens", benefit: "Detox & minerals", accent: "#A855F7" },
  { emoji: "🥜", name: "Dry fruits", benefit: "Protein & healthy fats", accent: "#FFC542" },
];

// ── Benefits ────────────────────────────────────────────────────
export const BENEFITS = [
  {
    title: "Cold-pressed, never concentrate",
    desc: "Real fruit and veg, pressed fresh for each delivery. No syrups, no shortcuts.",
    emoji: "❄️",
  },
  {
    title: "Zero added sugar",
    desc: "Sweetness comes from the fruit itself — nothing else sneaks in.",
    emoji: "🚫",
  },
  {
    title: "Delivered Mon–Sat",
    desc: "Fresh to your door six days a week. We skip Sundays and public holidays.",
    emoji: "🛵",
  },
  {
    title: "Pause anytime",
    desc: "Travelling? Pause your plan for up to 5 days a month, no questions asked.",
    emoji: "⏸️",
  },
  {
    title: "Seasonal & local",
    desc: "We source what's ripe and in season, so every box tastes like it should.",
    emoji: "🌿",
  },
  {
    title: "One tap to start",
    desc: "No clunky checkout. Message us on WhatsApp, share your area, and you're in.",
    emoji: "💬",
  },
];

// ── Mission / Purpose ───────────────────────────────────────────
export const MISSION = {
  eyebrow: "Why we exist",
  heading: "Healthy shouldn't be hard.",
  body: [
    "Grab A Sip started with a simple frustration: eating well every day is annoying. Cutting fruit, sourcing veg, remembering to actually drink your greens — life gets in the way.",
    "So we made it effortless. Every morning, a freshly made bowl or juice arrives at your door, portioned and ready. No prep, no planning, no packaged junk pretending to be healthy.",
    "And every recipe is built to do something for your body — immunity, hydration, digestion, stamina, glow. Nutrition you can actually feel, not just count.",
  ],
  pillars: [
    {
      title: "Our Mission",
      desc: "Make fresh, functional nutrition the easiest choice in your day — every fruit and juice chosen for what it does for you.",
      emoji: "🎯",
    },
    {
      title: "Our Purpose",
      desc: "Replace processed snacks and sugary drinks with real food that supports immunity, energy and everyday wellbeing.",
      emoji: "💚",
    },
    {
      title: "Our Promise",
      desc: "Cold-pressed, zero added sugar, fairly priced, and delivered like clockwork six days a week.",
      emoji: "🤝",
    },
  ],
};

// ── How it works ────────────────────────────────────────────────
export const STEPS = [
  {
    n: "01",
    title: "Message us",
    desc: "Tap any WhatsApp button and say hi. It's the only checkout you need.",
  },
  {
    n: "02",
    title: "Share your area",
    desc: "Tell us your delivery location. If we serve it, we'll confirm the rest instantly.",
  },
  {
    n: "03",
    title: "Pick your plan",
    desc: "Choose a Sip Bowl, ABC Everyday or the Classic rotation. Monthly, flexible, pausable.",
  },
  {
    n: "04",
    title: "Sip fresh, daily",
    desc: "Wake up to fresh nutrition at your door, Monday through Saturday.",
  },
];

// ── Delivery facts (used on Plans page) ─────────────────────────
export const DELIVERY_FACTS = [
  {
    label: "Delivery days",
    value: "Mon – Sat",
    note: "Sundays & public holidays excluded",
  },
  {
    label: "Boxes / month",
    value: "24 – 26",
    note: "26 with no festivals, min 24 in festive months",
  },
  {
    label: "Pause allowance",
    value: "Up to 5 days",
    note: "Per monthly subscription, whenever you need",
  },
];

export const DELIVERY_DETAIL = [
  "A full festival-free month gets you 26 fresh boxes.",
  "One public holiday in the month? You'll receive 25 boxes.",
  "Two or more holidays — we cap it at two — so you always get at least 24 boxes.",
];
