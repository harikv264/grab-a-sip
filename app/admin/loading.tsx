/**
 * Shown while the /admin segment renders on the server. The authenticated
 * layout awaits the backend (role check), which can be slow on the first hit
 * after the free-tier API has gone idle — so give an on-brand loading state
 * instead of a seemingly-stuck screen.
 */
export default function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-lime" />
          <span className="text-2xl">🥤</span>
        </div>
        <p className="mt-5 font-display text-lg font-semibold">Opening your console…</p>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Waking up the server — the first load after a quiet spell can take a
          few seconds.
        </p>
      </div>
    </div>
  );
}
