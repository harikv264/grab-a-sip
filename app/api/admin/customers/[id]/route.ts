import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function backend() {
  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) return null;
  return { base: base.replace(/\/+$/, ""), token };
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const be = backend();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const res = await fetch(
    `${be.base}/api/customers/${params.id}?token=${encodeURIComponent(be.token)}`,
    { cache: "no-store" }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const be = backend();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${be.base}/api/customers/${params.id}?token=${encodeURIComponent(be.token)}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
