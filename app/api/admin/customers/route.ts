import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function backend() {
  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) return null;
  return { base: base.replace(/\/+$/, ""), token };
}

/** GET /api/admin/customers?q= — list/search customers. */
export async function GET(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const be = backend();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const q = new URL(req.url).searchParams.get("q") ?? "";
  const url =
    `${be.base}/api/customers?token=${encodeURIComponent(be.token)}` +
    (q ? `&q=${encodeURIComponent(q)}` : "");
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

/** POST /api/admin/customers — create a customer. */
export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const be = backend();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${be.base}/api/customers?token=${encodeURIComponent(be.token)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
