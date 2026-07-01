import { ArrowLeft, User, Info } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { ProjectStatusSelector } from "@/components/project-status-selector";
import { ProjectEditableFields } from "@/components/project-editable-fields";
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
          href={`/dashboard/clientes/${project.client.id}`}
          className="inline-flex items-center gap-2 text-base text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-3"
        >
          <ArrowLeft className="size-5" />
          Voltar para {project.client.name}
        </Link>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand via-brand/95 to-brand-light p-8 ring-1 ring-white/10 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="relative flex items-start justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="max-w-prose text-lg text-white/70">
                {project.description}
              </p>
            )}
          </div>
          <div className="shrink-0 rounded-full bg-white/15 p-1 backdrop-blur-sm ring-1 ring-white/20">
            <StatusBadge status={project.status} />
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="animate-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-accent/20">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
            <Info className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <ProjectStatusSelector
              projectId={project.id}
              currentStatus={project.status}
            />
          </div>
        </div>

          <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-accent/20">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
            <User className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="truncate text-base font-medium">{project.client.name}</p>
          </div>
        </div>

        <ProjectEditableFields
          projectId={project.id}
          budget={project.budget}
          startDate={project.startDate}
          dueDate={project.dueDate}
        />
      </div>

      {/* Photos */}
      <ProjectPhotos projectId={project.id} />

      {/* Timeline */}
      <ProjectTimeline projectId={project.id} updates={project.updates} />
    </div>
  );
}
