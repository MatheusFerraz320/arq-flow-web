import { ArrowLeft, User, Info, Building2 } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { ProjectStatusSelector } from "@/components/project-status-selector";
import { ProjectEditableFields } from "@/components/project-editable-fields";
import { ProjectPhotos } from "@/components/project-photos";
import { ProjectTimeline } from "@/components/project-timeline";
import { getInitials } from "@/lib/utils";
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

  const AVATAR_BG = ["bg-brand/10 text-brand", "bg-accent/10 text-accent", "bg-muted text-muted-foreground"];

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

      {/* Info Cards Grid — 2 columns */}
      <div className="animate-stagger grid gap-5 sm:grid-cols-2">
        {/* Status Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:ring-1 hover:ring-accent/20">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-accent to-indigo-400" />
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
              <Info className="size-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Status</span>
          </div>
          <ProjectStatusSelector
            projectId={project.id}
            currentStatus={project.status}
          />
        </div>

        {/* Client Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:ring-1 hover:ring-brand/20">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-brand to-brand-light" />
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10">
              <Building2 className="size-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Cliente</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold shadow-sm ring-1 ring-black/5 bg-accent/10 text-accent">
              {getInitials(project.client.name)}
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {project.client.name}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-1 rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
                <User className="size-3" />
                Cliente
              </span>
            </div>
          </div>
        </div>

        {/* Budget Card + Deadline Card */}
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
