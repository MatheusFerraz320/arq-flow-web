"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, User, CalendarDays, DollarSign, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

const TYPE_LABELS: Record<string, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  INTERIORES: "Interiores",
  REFORMA: "Reforma",
  URBANISMO: "Urbanismo",
  OUTRO: "Outro",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const lastUpdate = project.updates?.[0];

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-card to-muted/20 p-6 text-base text-card-foreground border border-border/60 shadow-lg shadow-black/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/5 hover:ring-1 hover:ring-accent/20"
      onClick={() => router.push(`/dashboard/projetos/${project.id}`)}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent to-indigo-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold truncate text-foreground">{project.title}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="size-3.5 shrink-0" />
              <span className="truncate">{project.client.name}</span>
            </div>
          </div>
          <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:text-accent group-hover:translate-x-1" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={project.status} />
          {project.type && (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {TYPE_LABELS[project.type] ?? project.type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-3.5 shrink-0" />
            <span>{project.budget != null ? formatCurrency(project.budget) : "Sem orçamento"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>{project.dueDate ? formatDate(project.dueDate) : "Sem prazo"}</span>
          </div>
        </div>

        {lastUpdate && (
          <div className="rounded-lg bg-muted/50 px-3.5 py-2.5 transition-colors duration-200 group-hover:bg-muted/80">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Clock className="size-3" />
              <span>Última atualização</span>
            </div>
            <p className="text-sm text-foreground/80 line-clamp-2">{lastUpdate.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
