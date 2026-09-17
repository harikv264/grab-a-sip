-- ─────────────────────────────────────────────────────────────
-- Grab A Sip — Phase 2 schema (serviceability & lead capture)
-- Run this in Supabase → SQL Editor once, after creating your project.
-- The Spring Boot backend (Phase 3+) will read these same tables.
-- ─────────────────────────────────────────────────────────────

-- Leads: every serviceability check becomes a row.
-- is_serviceable = false rows are your "undelivered areas" / expansion demand.
create table if not exists public.leads (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  raw_location          text,
  pincode               text,
  matched_area          text,
  is_serviceable        boolean not null default false,
  phone                 text,
  converted_customer_id uuid
);

create index if not exists leads_created_at_idx  on public.leads (created_at desc);
create index if not exists leads_serviceable_idx on public.leads (is_serviceable);
create index if not exists leads_pincode_idx     on public.leads (pincode);

-- Row Level Security: lock the table down. All access goes through the
-- Next.js API using the service-role key (which bypasses RLS). No public
-- policies are created, so anon/public clients cannot read or write.
alter table public.leads enable row level security;

-- (Future) Service areas, if/when you want to manage them in the DB
-- instead of the static list in lib/serviceability.ts.
create table if not exists public.service_areas (
  id        uuid primary key default gen_random_uuid(),
  city      text not null,
  pincode   text,
  locality  text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.service_areas enable row level security;
