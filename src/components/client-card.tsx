"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, FolderKanban } from "lucide-react";
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
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-card p-6 text-sm text-card-foreground border border-border/60 shadow-md shadow-black/[0.03] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-brand/10"
      onClick={() => router.push(`/dashboard/clientes/${clientId}`)}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-brand-light opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl text-sm font-bold tracking-tight shadow-sm", AVATAR_BG[bgForName(name)])}>
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-lg font-semibold truncate text-foreground">{name}</h3>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
          <ChevronRight className="mt-2 size-5 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:text-brand group-hover:translate-x-0.5" />
        </div>

        {projects.length > 0 && (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FolderKanban className="size-3" />
              <span>{projects.length} {projects.length === 1 ? "projeto" : "projetos"}</span>
            </div>
            <div className="space-y-1.5">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projetos/${project.id}`}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3.5 py-2.5 transition-all duration-200 hover:bg-muted"
                >
                  <span className="truncate text-sm font-medium text-foreground">
                    {project.title}
                  </span>
                  <StatusBadge status={project.status} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-4 text-xs text-muted-foreground">
            <FolderKanban className="size-3" />
            Nenhum projeto ainda
          </div>
        )}
      </div>
    </div>
  );
}
