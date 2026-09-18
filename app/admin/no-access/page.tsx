"use client";

import { useRouter } from "next/navigation";

export default function NoAccessPage() {
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-berry/15 text-2xl">
          🔒
        </div>
        <h1 className="font-display text-2xl font-bold">No admin access</h1>
        <p className="mt-2 text-muted">
          This account isn&apos;t an admin. The admin dashboard is for the owner
          and staff. If you&apos;re a customer or delivery partner, you&apos;ll
          use the Grab A Sip app.
        </p>
        <button onClick={signOut} className="btn-ghost mt-6">
          Sign out
        </button>
      </div>
    </div>
  );
}
