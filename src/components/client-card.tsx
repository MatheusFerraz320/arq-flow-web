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
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-card p-7 text-base text-card-foreground border border-border/60 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-accent/20"
      onClick={() => router.push(`/dashboard/clientes/${clientId}`)}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent to-indigo-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={cn("flex size-16 shrink-0 items-center justify-center rounded-2xl text-base font-bold tracking-tight shadow-sm ring-1 ring-black/5", AVATAR_BG[bgForName(name)])}>
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1 pt-1.5">
            <h3 className="text-xl font-semibold truncate text-foreground">{name}</h3>
            <p className="truncate text-base text-muted-foreground">{email}</p>
          </div>
          <ChevronRight className="mt-3 size-6 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:text-accent group-hover:translate-x-1" />
        </div>

        {projects.length > 0 && (
          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FolderKanban className="size-4" />
              <span>{projects.length} {projects.length === 1 ? "projeto" : "projetos"}</span>
            </div>
            <div className="space-y-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projetos/${project.id}`}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 transition-all duration-200 hover:bg-muted"
                >
                  <span className="truncate text-base font-medium text-foreground">
                    {project.title}
                  </span>
                  <StatusBadge status={project.status} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-5 text-sm text-muted-foreground">
            <FolderKanban className="size-4" />
            Nenhum projeto ainda
          </div>
        )}
      </div>
    </div>
  );
}
