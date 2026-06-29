export default function ClientLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-5 w-32 animate-skeleton rounded" />
      <div className="rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 animate-skeleton rounded-full" />
            <div className="space-y-3">
              <div className="h-8 w-48 animate-skeleton rounded" />
              <div className="h-4 w-40 animate-skeleton rounded" />
            </div>
          </div>
          <div className="h-9 w-32 animate-skeleton rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}
