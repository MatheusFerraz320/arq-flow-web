export default function Loading() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Back link skeleton */}
      <div className="h-4 w-28 animate-skeleton rounded" />

      {/* Hero skeleton */}
      <div className="space-y-4 rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-8 w-72 animate-skeleton rounded" />
            <div className="h-5 w-96 animate-skeleton rounded" />
          </div>
          <div className="h-7 w-28 animate-skeleton rounded-full" />
        </div>
      </div>

      {/* Info cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border bg-card p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="size-11 animate-skeleton rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 animate-skeleton rounded" />
              <div className="h-4 w-24 animate-skeleton rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Photos skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-16 animate-skeleton rounded" />
        <div className="h-40 animate-skeleton rounded-xl" />
      </div>

      {/* Timeline skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-28 animate-skeleton rounded" />
        <div className="space-y-6 pl-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="size-10 shrink-0 mt-1 animate-skeleton rounded-full" />
              <div className="flex-1 space-y-2 rounded-lg border bg-card p-4">
                <div className="h-3 w-28 animate-skeleton rounded" />
                <div className="h-4 w-48 animate-skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
