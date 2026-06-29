"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { getInitials, bgForName } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  status: string;
}

interface ClientCardProps {
  clientId: string;
  name: string;
  email: string;
  projects: Project[];
}

const AVATAR_BG = ["bg-brand/10 text-brand", "bg-accent/10 text-accent", "bg-muted text-muted-foreground"];

export function ClientCard({ clientId, name, email, projects }: ClientCardProps) {
  const router = useRouter();

  return (
    <div
      className="flex cursor-pointer flex-col gap-4 rounded-xl bg-card p-5 text-sm text-card-foreground border border-border/60 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-brand/10"
      onClick={() => router.push(`/dashboard/clientes/${clientId}`)}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn("flex size-10 items-center justify-center rounded-full text-xs font-semibold", AVATAR_BG[bgForName(name)])}>
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{name}</h3>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
          <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/40" />
        </div>

        {projects.length > 0 && (
          <div
            className="space-y-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projetos/${project.id}`}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 transition-all duration-200 hover:bg-muted hover:translate-x-0.5"
              >
                <span className="truncate text-sm font-medium">
                  {project.title}
                </span>
                <StatusBadge status={project.status} />
              </Link>
            ))}
          </div>
        )}

        {projects.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Nenhum projeto ainda
          </p>
        )}
      </div>
    </div>
  );
}
