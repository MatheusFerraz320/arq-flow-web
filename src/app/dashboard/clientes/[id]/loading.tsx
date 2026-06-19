import { Skeleton } from "@/components/ui/skeleton";

export default function ClientLoading() {
  return (
    <div className="space-y-6">
      <Skeleton variant="text" className="h-5 w-32" />
      <div className="rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Skeleton variant="text" className="h-8 w-48" />
            <Skeleton variant="text" className="h-4 w-32" />
          </div>
          <Skeleton variant="text" className="h-8 w-28 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    </div>
  );
}
