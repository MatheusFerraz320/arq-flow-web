import { Clock } from "lucide-react";
import type { ProjectUpdate } from "@/lib/types";

interface ProjectTimelineProps {
  updates: ProjectUpdate[];
}

export function ProjectTimeline({ updates }: ProjectTimelineProps) {
  const sorted = [...updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-tight">Atualizações</h2>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center transition-colors hover:border-muted-foreground/25">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
            <Clock className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Nenhuma atualização registrada ainda.
          </p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="relative">
          {sorted.map((update, i) => (
            <div
              key={update.id}
              className="animate-fade-in-up relative flex gap-4 pb-8 last:pb-0"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Connector */}
              <div className="flex flex-col items-center">
                <div className="size-3 shrink-0 rounded-full bg-brand ring-[3px] ring-background" />
                {i < sorted.length - 1 && (
                  <div className="mt-1.5 w-0.5 flex-1 bg-gradient-to-b from-brand/40 to-transparent" />
                )}
              </div>

              {/* Content Card */}
              <div className="min-w-0 flex-1 rounded-lg border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                <p className="text-xs font-medium text-brand">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(update.createdAt))}
                </p>
                <p className="mt-1 text-sm text-card-foreground">
                  {update.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
