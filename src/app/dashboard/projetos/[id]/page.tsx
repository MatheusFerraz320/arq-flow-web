import { ArrowLeft, CalendarDays, Clock, User, Info } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { ProjectActions } from "@/components/project-actions";
import { ProjectPhotos } from "@/components/project-photos";
import { ProjectTimeline } from "@/components/project-timeline";
import type { Project } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function ProjectPage(props: PageProps<"/dashboard/projetos/[id]">) {
  const { id } = await props.params;
  const cookieStore = await cookies();

  const res = await fetch(`${API_URL}/projects/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Erro ao carregar projeto");

  const project: Project = await res.json();

  return (
    <div className="animate-fade-in space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-2"
      >
        <ArrowLeft className="size-4" />
        Voltar para clientes
      </Link>

      {/* Hero Header */}
      <div className="rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="max-w-prose text-base text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="animate-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10">
            <Info className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="truncate text-sm font-medium">{project.status === "BRIEFING" ? "Briefing" : project.status === "PROJETO" ? "Em Projeto" : project.status === "REVISAO" ? "Em Revisão" : "Concluído"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 text-sky-600 ring-1 ring-sky-500/10">
            <User className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="truncate text-sm font-medium">{project.client.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600 ring-1 ring-amber-500/10">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Criado em</p>
            <p className="truncate text-sm font-medium">
              {new Intl.DateTimeFormat("pt-BR").format(new Date(project.createdAt))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 ring-1 ring-emerald-500/10">
            <Clock className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Atualizado em</p>
            <p className="truncate text-sm font-medium">
              {new Intl.DateTimeFormat("pt-BR").format(new Date(project.updatedAt))}
            </p>
          </div>
        </div>
      </div>

      {/* Photos */}
      <ProjectPhotos />

      {/* Approval Actions */}
      <ProjectActions projectId={project.id} status={project.status} />

      {/* Timeline */}
      <ProjectTimeline updates={project.updates} />
    </div>
  );
}
