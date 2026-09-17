// ────────────────────────────────────────────────────────────────
// Serviceability ("the bracket") — is a location inside our delivery net?
//
// Phase 2 uses a simple, zero-cost pincode + locality list. When you're
// ready for drawn map zones, this is the one function that changes
// (PostGIS point-in-polygon) — nothing that calls it needs to.
//
// 👉 REPLACE THE SAMPLE DATA BELOW with the real pincodes / localities
//    Grab A Sip delivers to today.
// ────────────────────────────────────────────────────────────────

export type ServiceResult = {
  status: "serviceable" | "not_serviceable" | "invalid";
  pincode?: string;
  matchedArea?: string; // friendly name to show back to the customer
};

// The city you primarily operate in (shown in copy). Replace as needed.
export const SERVICE_CITY = "Hyderabad";

// ⚠️ SAMPLE — replace with your real delivery pincodes.
// Map of pincode -> friendly area label.
export const SERVICE_PINCODES: Record<string, string> = {
  "500081": "Gachibowli",
  "500084": "Kondapur",
  "500032": "Financial District",
  "500033": "Jubilee Hills",
  "500034": "Banjara Hills",
  "500018": "Ameerpet",
  "500072": "Kukatpally",
  "500049": "Nizampet",
};

// Optional: locality names we also accept (lowercased) -> friendly label.
// Lets customers who don't know their pincode still match.
export const SERVICE_LOCALITIES: Record<string, string> = {
  gachibowli: "Gachibowli",
  kondapur: "Kondapur",
  madhapur: "Madhapur",
  "hitech city": "HITEC City",
  hitechcity: "HITEC City",
  "jubilee hills": "Jubilee Hills",
  "banjara hills": "Banjara Hills",
  kukatpally: "Kukatpally",
  nizampet: "Nizampet",
  ameerpet: "Ameerpet",
};

/** Normalises free-text input and decides if we deliver there. */
export function checkServiceability(input: string): ServiceResult {
  const raw = (input || "").trim();
  if (!raw) return { status: "invalid" };

  // Pull a 6-digit pincode out of the input if present.
  const pinMatch = raw.match(/\b(\d{6})\b/);
  if (pinMatch) {
    const pin = pinMatch[1];
    const area = SERVICE_PINCODES[pin];
    return area
      ? { status: "serviceable", pincode: pin, matchedArea: area }
      : { status: "not_serviceable", pincode: pin };
  }

  // Otherwise try to match a known locality name.
  const key = raw.toLowerCase().replace(/\s+/g, " ");
  const localityHit =
    SERVICE_LOCALITIES[key] ||
    Object.entries(SERVICE_LOCALITIES).find(([name]) =>
      key.includes(name)
    )?.[1];

  if (localityHit) {
    return { status: "serviceable", matchedArea: localityHit };
  }

  // A plain, non-pincode, unrecognised location — treat as "not yet".
  return { status: "not_serviceable" };
}
