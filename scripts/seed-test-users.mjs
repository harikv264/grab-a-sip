#!/usr/bin/env node
/**
 * Seed test users for every persona so you can log in and experience the
 * product end-to-end WITHOUT the phone/OTP flow being finished.
 *
 * Creates (idempotently — safe to re-run):
 *   • 3 Supabase auth users with EMAIL + PASSWORD (email pre-confirmed):
 *       testadmin@…    → role admin     → sign in at /admin/login
 *       testrider@…    → role rider     → sign in at /app/login  (or the app)
 *       testcustomer@… → role customer  → sign in at /app/login  (or the app)
 *   • their app_users rows (the entitlements source of truth), linking the
 *     rider to a delivery_person and the customer to a customer record;
 *   • a live subscription + a month of deliveries for the test customer, plus
 *     a couple of extra sample stops, so the dashboards/glasses show real data.
 *
 * It talks to Supabase with the SERVICE ROLE key (bypasses RLS). Nothing here
 * needs the Java backend to be awake.
 *
 * Run from the grab-a-sip/ repo root:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-test-users.mjs
 * or put those two in .env.local and just:  node scripts/seed-test-users.mjs
 *
 * Optional overrides: TEST_EMAIL_DOMAIN (default grabasip.test),
 *                     TEST_PASSWORD     (default GrabASip#Test1)
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ── Load .env.local if present (so you don't have to export vars) ──
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  /* no .env.local — rely on real env vars */
}

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error(
    "✗ Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "  Set them in .env.local or pass them inline. SUPABASE_URL must be the\n" +
      "  bare project URL (https://<ref>.supabase.co)."
  );
  process.exit(1);
}

const DOMAIN = process.env.TEST_EMAIL_DOMAIN || "grabasip.test";
const PASSWORD = process.env.TEST_PASSWORD || "GrabASip#Test1";
const db = createClient(URL, KEY, { auth: { persistSession: false } });
const now = () => new Date().toISOString();

// ── Auth users ────────────────────────────────────────────────────
async function ensureAuthUser(email) {
  const created = await db.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (created.data?.user) return created.data.user;

  // Already exists → find it and reset the password to the known one.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) {
      await db.auth.admin.updateUserById(hit.id, {
        password: PASSWORD,
        email_confirm: true,
      });
      return hit;
    }
    if (data.users.length < 200) break;
  }
  throw new Error(`Could not create or find auth user ${email}: ${created.error?.message}`);
}

// ── Domain helpers (idempotent) ───────────────────────────────────
async function upsertCustomer(c) {
  const { data, error } = await db
    .from("customers")
    .upsert(
      {
        name: c.name,
        phone: c.phone,
        locality: c.locality,
        pincode: c.pincode,
        address_status: "verified",
        source: "manual",
        flat_house: c.flatHouse,
        notes: "TEST DATA — created by seed-test-users.mjs",
        created_at: now(),
        updated_at: now(),
      },
      { onConflict: "phone" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function ensureDeliveryPerson(p) {
  const found = await db.from("delivery_persons").select("*").eq("phone", p.phone).maybeSingle();
  if (found.data) return found.data;
  const { data, error } = await db
    .from("delivery_persons")
    .insert({ name: p.name, phone: p.phone, area: p.area, active: true, created_at: now() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function ensureSubscription(s) {
  const found = await db
    .from("subscriptions")
    .select("*")
    .eq("customer_id", s.customerId)
    .eq("plan_code", s.planCode)
    .maybeSingle();
  if (found.data) return found.data;
  const { data, error } = await db
    .from("subscriptions")
    .insert({
      customer_id: s.customerId,
      plan_code: s.planCode,
      plan_name: s.planName,
      price: s.price,
      status: "active",
      start_date: s.startDate,
      pause_days_used: 1,
      created_at: now(),
      updated_at: now(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function upsertAppUser(row) {
  const { error } = await db.from("app_users").upsert(
    {
      id: row.id,
      role: row.role,
      customer_id: row.customerId ?? null,
      delivery_person_id: row.deliveryPersonId ?? null,
      email: row.email,
      phone: row.phone ?? null,
      active: true,
      created_at: now(),
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

// Build a month of delivery dates (Mon–Sat), 1st → today, + next 2 weekdays.
function deliveryDates() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const iso = (d) => d.toISOString().slice(0, 10);
  const dates = [];
  for (let day = 1; day <= today.getDate(); day++) {
    const d = new Date(y, m, day);
    if (d.getDay() !== 0) dates.push(iso(d)); // skip Sundays
  }
  const future = [];
  const d = new Date(today);
  while (future.length < 2) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) future.push(iso(d));
  }
  return { todayIso: iso(today), past: dates.slice(0, -1), future };
}

async function seedDeliveries({ sub, customer, riderId, todayStatus }) {
  const { todayIso, past, future } = deliveryDates();
  const rows = [];
  const snapshot = {
    customer_id: customer.id,
    delivery_person_id: riderId,
    customer_name: customer.name,
    customer_phone: customer.phone,
    address_text: `${customer.flatHouse ?? ""}, ${customer.locality}${
      customer.pincode ? " " + customer.pincode : ""
    }`.trim(),
    plan_name: sub.plan_name,
  };
  for (const date of past) rows.push({ ...snapshot, subscription_id: sub.id, date, status: "delivered", created_at: now(), updated_at: now() });
  rows.push({ ...snapshot, subscription_id: sub.id, date: todayIso, status: todayStatus, created_at: now(), updated_at: now() });
  for (const date of future) rows.push({ ...snapshot, subscription_id: sub.id, date, status: "pending", created_at: now(), updated_at: now() });

  const { error } = await db
    .from("deliveries")
    .upsert(rows, { onConflict: "subscription_id,date" });
  if (error) throw error;
  return rows.length;
}

// ── Run ───────────────────────────────────────────────────────────
async function main() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const startIso = startOfMonth.toISOString().slice(0, 10);

  console.log("→ Creating auth users…");
  const adminU = await ensureAuthUser(`testadmin@${DOMAIN}`);
  const riderU = await ensureAuthUser(`testrider@${DOMAIN}`);
  const custU = await ensureAuthUser(`testcustomer@${DOMAIN}`);

  console.log("→ Creating rider (delivery_person)…");
  const rider = await ensureDeliveryPerson({
    name: "Test Rider",
    phone: "+919000000002",
    area: "West — Gachibowli, Kondapur",
  });

  console.log("→ Creating test customer + subscription + deliveries…");
  const customer = await upsertCustomer({
    name: "Test Customer",
    phone: "+919000000001",
    locality: "Gachibowli",
    pincode: "500032",
    flatHouse: "Flat 101, Test Residency",
  });
  const sub = await ensureSubscription({
    customerId: customer.id,
    planCode: "abc",
    planName: "ABC Everyday",
    price: 1500,
    startDate: startIso,
  });
  const nDeliv = await seedDeliveries({ sub, customer, riderId: rider.id, todayStatus: "dispatched" });

  // A couple of extra sample stops so the rider's route + admin views have volume.
  const samples = [
    { name: "Sample — Aarav", phone: "+919000000011", locality: "Kondapur", planCode: "small", planName: "Small Sip Bowl", price: 1699, todayStatus: "pending" },
    { name: "Sample — Meera", phone: "+919000000012", locality: "Madhapur", planCode: "classic", planName: "Classic Juice Plan", price: 1350, todayStatus: "dispatched" },
  ];
  for (const s of samples) {
    const c = await upsertCustomer({ name: s.name, phone: s.phone, locality: s.locality, pincode: "500081", flatHouse: "Sample address" });
    const su = await ensureSubscription({ customerId: c.id, planCode: s.planCode, planName: s.planName, price: s.price, startDate: startIso });
    await seedDeliveries({ sub: su, customer: c, riderId: rider.id, todayStatus: s.todayStatus });
  }

  console.log("→ Linking roles (app_users)…");
  await upsertAppUser({ id: adminU.id, role: "admin", email: adminU.email });
  await upsertAppUser({ id: riderU.id, role: "rider", email: riderU.email, deliveryPersonId: rider.id });
  await upsertAppUser({ id: custU.id, role: "customer", email: custU.email, customerId: customer.id });

  console.log(`\n✓ Done. Seeded ${nDeliv} deliveries for the test customer + 2 sample routes.\n`);
  console.log("  Log in with these (password for all):", PASSWORD);
  console.table([
    { persona: "admin", email: `testadmin@${DOMAIN}`, where: "/admin/login (web)" },
    { persona: "rider", email: `testrider@${DOMAIN}`, where: "/app/login (web) or the mobile app" },
    { persona: "customer", email: `testcustomer@${DOMAIN}`, where: "/app/login (web) or the mobile app" },
  ]);
  console.log(
    "\n  To remove later: delete these 3 auth users in Supabase → Authentication,\n" +
      "  and the rows tagged 'TEST DATA' / phones +9190000000xx in the tables."
  );
}

main().catch((e) => {
  console.error("\n✗ Seed failed:", e.message || e);
  process.exit(1);
});
