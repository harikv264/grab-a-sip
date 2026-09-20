import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin, backendConfig } from "@/lib/admin-proxy";
import { toE164 } from "@/lib/phone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Generate a readable temporary password (interim until phone-OTP). */
function tempPassword(): string {
  const words = ["mango", "lime", "berry", "coco", "guava", "melon"];
  const w = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${w}-${n}-sip`;
}

/**
 * Admin provisioning: create a Supabase login (by phone) for a rider/customer
 * and link it to their record with the right role. Returns a temp password to
 * share until MSG91 phone-OTP is enabled.
 *   POST { kind: "rider" | "customer", id, phone }
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let kind = "";
  let id = "";
  let phone = "";
  try {
    ({ kind, id, phone } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (kind !== "rider" && kind !== "customer") {
    return NextResponse.json({ error: "kind must be rider or customer" }, { status: 400 });
  }
  const e164 = toE164(phone);
  if (!e164) {
    return NextResponse.json(
      { error: "This record needs a valid phone number first." },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY isn't set — add it on Vercel to enable invites." },
      { status: 503 }
    );
  }
  const be = backendConfig();
  if (!be) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  }

  // 1) Create the auth user (phone-confirmed so they can log in immediately).
  const password = tempPassword();
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    phone: e164,
    password,
    phone_confirm: true,
  });
  if (createErr || !created?.user) {
    return NextResponse.json(
      { error: createErr?.message || "Could not create the login (already invited?)." },
      { status: 409 }
    );
  }

  // 2) Link uid -> role + owned record in the backend.
  const link = await fetch(
    `${be.base}/api/admin/app-users?token=${encodeURIComponent(be.token)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: created.user.id,
        role: kind,
        customerId: kind === "customer" ? id : null,
        deliveryPersonId: kind === "rider" ? id : null,
        phone: e164,
      }),
    }
  );
  if (!link.ok) {
    // Roll back the auth user so a half-provisioned account isn't left behind.
    await admin.auth.admin.deleteUser(created.user.id).catch(() => {});
    const msg = await link.text().catch(() => "");
    return NextResponse.json(
      { error: `Linking role failed: ${msg || link.status}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, phone: e164, tempPassword: password });
}
