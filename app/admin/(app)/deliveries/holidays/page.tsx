import Link from "next/link";
import { HolidaysManager } from "@/components/admin/HolidaysManager";

export const dynamic = "force-dynamic";

type Holiday = { id: string; date: string; name: string | null };

async function getHolidays(): Promise<Holiday[]> {
  const base = (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
  const token = process.env.ADMIN_API_TOKEN ?? "";
  if (!base || !token) return [];
  try {
    const res = await fetch(`${base}/api/holidays?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as Holiday[];
  } catch {
    return [];
  }
}

export default async function HolidaysPage() {
  const holidays = await getHolidays();
  return (
    <>
      <div className="mb-6">
        <Link href="/admin/deliveries" className="text-sm text-muted hover:text-cream">
          ← Deliveries
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold">Public holidays</h1>
        <p className="mt-1 text-muted">
          No deliveries are generated on these dates (Sundays are skipped
          automatically).
        </p>
      </div>
      <HolidaysManager initial={holidays} />
    </>
  );
}
