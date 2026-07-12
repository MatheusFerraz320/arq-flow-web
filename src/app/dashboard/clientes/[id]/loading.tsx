export default function ClientLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="h-5 w-32 animate-skeleton rounded" />
      <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 sm:p-10 lg:p-12">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-16 animate-skeleton rounded-2xl" />
            <div className="space-y-3">
              <div className="h-9 w-56 animate-skeleton rounded" />
              <div className="h-5 w-44 animate-skeleton rounded" />
            </div>
          </div>
          <div className="h-10 w-36 animate-skeleton rounded-lg" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="size-9 animate-skeleton rounded-lg" />
        <div className="h-5 w-24 animate-skeleton rounded" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-36 animate-skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}
