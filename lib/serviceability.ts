// ────────────────────────────────────────────────────────────────
// Serviceability ("the bracket") — is a location inside our delivery net?
//
// Coarse AREA gate only. The full address is confirmed by a human on
// WhatsApp (now) and stored structured in the admin (Phase 3). When you
// move to drawn map zones, only checkServiceability() changes.
//
// To edit where we deliver: update SERVED below (display name + aliases
// for typo/variant matching) and, optionally, SERVICE_PINCODES.
// ────────────────────────────────────────────────────────────────

export type ServiceStatus = "serviceable" | "not_serviceable" | "ask_again";

export type ServiceResult = {
  status: ServiceStatus;
  matchedArea?: string; // friendly name shown back to the customer
  pincode?: string;
  message?: string; // for ask_again
};

export const SERVICE_CITY = "Hyderabad";

// Real served localities (display name) + aliases (spelling/variant forms).
const SERVED: { name: string; aliases?: string[] }[] = [
  { name: "Gachibowli", aliases: ["gachibowly", "gachhibowli"] },
  { name: "Gowlidoddy", aliases: ["gowli doddy", "gowlidody"] },
  { name: "TNGOs Colony", aliases: ["tngos", "tngo colony", "tngos colony", "t n g o s"] },
  { name: "Chandanagar", aliases: ["chanda nagar", "chandhanagar"] },
  { name: "Madinaguda", aliases: ["madina guda", "madeenaguda"] },
  { name: "Miyapur", aliases: ["mayapur", "miapur"] },
  { name: "Kukatpally", aliases: ["kukatpalli", "kukat pally"] },
  { name: "KPHB", aliases: ["k p h b", "kphb colony", "kukatpally housing board"] },
  { name: "JNTU", aliases: ["jntu", "jntuh", "jntu kukatpally"] },
  { name: "Moosapet", aliases: ["musapet", "moosapeta"] },
  { name: "Ameerpet", aliases: ["amirpet", "ameer pet"] },
  { name: "S.R. Nagar", aliases: ["sr nagar", "s r nagar", "srnagar", "sanjeeva reddy nagar"] },
  { name: "Yousufguda", aliases: ["yusufguda", "yousufgooda", "yousuf guda"] },
  { name: "Jubilee Hills", aliases: ["jubilee hill", "jublee hills"] },
  { name: "Madhapur", aliases: ["madapur", "madhapoor"] },
  { name: "Kondapur", aliases: ["kondapoor", "konda pur"] },
  { name: "Kothaguda", aliases: ["kotha guda", "kothaguda x roads"] },
  { name: "Hafeezpet", aliases: ["hafizpet", "hafeez pet", "hafeezpeta"] },
  { name: "Uppal", aliases: ["uppal depot", "uppal x roads"] },
  { name: "Boduppal", aliases: ["bodduppal", "bodu ppal"] },
  { name: "Medipally", aliases: ["medipalli", "medpally", "medipally"] },
  { name: "Narapally", aliases: ["narapalli", "nara pally"] },
  { name: "Chengicherla", aliases: ["chengicharla", "chengi cherla"] },
  { name: "Bolligudam", aliases: ["bolligudem", "bolli gudam"] },
];

// Optional convenience: a few well-known pincodes → served area.
// Unknown pincodes are NOT auto-rejected (we ask for the area name instead),
// so an incomplete map never wrongly turns away a real customer.
export const SERVICE_PINCODES: Record<string, string> = {
  "500032": "Gachibowli",
  "500084": "Kondapur",
  "500081": "Madhapur",
  "500072": "Kukatpally",
  "500085": "KPHB",
  "500049": "Miyapur",
  "500050": "Chandanagar",
  "500033": "Jubilee Hills",
  "500045": "Yousufguda",
  "500038": "S.R. Nagar",
  "500018": "Moosapet",
  "500016": "Ameerpet",
  "500039": "Uppal",
  "500092": "Boduppal",
};

// The list customers can pick from (autocomplete). Sorted for the dropdown.
export const LOCALITY_OPTIONS = SERVED.map((s) => s.name).sort();

// ── matching internals ──────────────────────────────────────────
const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

type Entry = { key: string; display: string; multi: boolean };
const ENTRIES: Entry[] = [];
for (const s of SERVED) {
  const add = (raw: string) => {
    const key = norm(raw);
    if (key) ENTRIES.push({ key, display: s.name, multi: key.includes(" ") });
  };
  add(s.name);
  s.aliases?.forEach(add);
}

function lev(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return d[m][n];
}

const fuzzyThreshold = (len: number) => (len <= 5 ? 1 : 2);

/**
 * Try to match free text to a served locality. Scores every candidate and
 * returns the best (exact = 0 always beats a fuzzy hit), so word order in
 * the entry list never changes the result.
 */
function matchLocality(input: string): string | null {
  const n = norm(input);
  if (!n) return null;
  const tokens = n.split(" ");

  let best: string | null = null;
  let bestScore = Infinity;
  const consider = (display: string, score: number) => {
    if (score < bestScore) {
      bestScore = score;
      best = display;
    }
  };

  for (const e of ENTRIES) {
    if (n === e.key) return e.display; // whole-input exact — unbeatable
    if (e.multi) {
      // multi-word keys: contiguous phrase anywhere in the input
      if (n.includes(e.key)) consider(e.display, 0);
      continue;
    }
    // single-word keys: score each token (exact = 0, else typo distance)
    for (const t of tokens) {
      if (t.length < 3) continue;
      if (t === e.key) {
        consider(e.display, 0);
      } else {
        const d = lev(t, e.key);
        if (d <= fuzzyThreshold(Math.max(t.length, e.key.length)))
          consider(e.display, d);
      }
    }
  }
  return best;
}

/**
 * Decide serviceability from free text (pincode or area/address).
 * Returns ask_again for empty / too-short / unclear input so the customer
 * can correct it, instead of wrongly telling them "coming soon".
 */
export function checkServiceability(input: string): ServiceResult {
  const raw = (input || "").trim();
  const n = norm(raw);

  if (!n || n.length < 3) {
    return {
      status: "ask_again",
      message: "Please enter your area (e.g. Gachibowli) or 6-digit pincode.",
    };
  }

  // Pincode path
  const pin = n.match(/\b(\d{6})\b/);
  if (pin) {
    const area = SERVICE_PINCODES[pin[1]];
    if (area) return { status: "serviceable", matchedArea: area, pincode: pin[1] };
    // Unknown pincode + no locality text alongside → ask for the area name.
    if (!matchLocality(n))
      return {
        status: "ask_again",
        message:
          "We couldn't match that pincode. Please type your area name (e.g. Kondapur) so we can check precisely.",
      };
  }

  // Locality / address text path
  const area = matchLocality(n);
  if (area) return { status: "serviceable", matchedArea: area };

  // Pure digits that aren't a valid pincode → ask again.
  if (/^\d+$/.test(n)) {
    return {
      status: "ask_again",
      message: "That doesn't look complete. Enter a 6-digit pincode or your area name.",
    };
  }

  // A plausible place name we don't serve yet → coming soon.
  if (n.replace(/\s/g, "").length >= 4) {
    return { status: "not_serviceable" };
  }

  return {
    status: "ask_again",
    message: "Please enter your area (e.g. Gachibowli) or 6-digit pincode.",
  };
}
