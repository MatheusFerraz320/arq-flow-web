export default function Loading() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Back link skeleton */}
      <div className="h-5 w-36 animate-skeleton rounded" />

      {/* Hero skeleton */}
      <div className="rounded-xl bg-gradient-to-br from-brand via-brand/95 to-brand-light dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-8 sm:p-10 lg:p-12">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="h-9 w-72 animate-skeleton rounded" />
            <div className="h-6 w-96 animate-skeleton rounded" />
          </div>
          <div className="h-8 w-28 animate-skeleton rounded-full" />
        </div>
      </div>

      {/* Client Sub-Hero skeleton */}
      <div className="rounded-xl border bg-card p-7 shadow-lg shadow-foreground/[0.04] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="size-14 animate-skeleton rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 w-16 animate-skeleton rounded" />
              <div className="h-8 w-56 animate-skeleton rounded" />
              <div className="h-5 w-24 animate-skeleton rounded-full" />
            </div>
          </div>
          <div className="h-9 w-28 animate-skeleton rounded-lg" />
        </div>
      </div>

      {/* Data Row skeleton — 3 columns */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-5 shadow-lg shadow-foreground/[0.04] animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 animate-skeleton rounded-lg" />
              <div className="h-3.5 w-16 animate-skeleton rounded" />
            </div>
            <div className="h-7 w-32 animate-skeleton rounded" />
          </div>
        ))}
      </div>

      {/* Photos skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-9 animate-skeleton rounded-lg" />
          <div className="h-5 w-16 animate-skeleton rounded" />
        </div>
        <div className="h-48 animate-skeleton rounded-xl" />
      </div>

      {/* Timeline skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-9 animate-skeleton rounded-lg" />
          <div className="h-5 w-28 animate-skeleton rounded" />
        </div>
        <div className="space-y-6 pl-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="size-10 shrink-0 mt-1 animate-skeleton rounded-full" />
              <div className="flex-1 space-y-2 rounded-lg border bg-card p-5 shadow-lg shadow-foreground/[0.04]">
                <div className="h-4 w-28 animate-skeleton rounded" />
                <div className="h-5 w-48 animate-skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
