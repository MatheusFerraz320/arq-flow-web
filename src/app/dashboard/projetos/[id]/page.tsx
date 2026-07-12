import { ArrowLeft, User, Info, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { ProjectStatusSelector } from "@/components/project-status-selector";
import { BudgetCard, DeadlineCard, TypeCard } from "@/components/project-editable-fields";
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

  return (
    <div className="animate-fade-in space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard/projetos"
        className="inline-flex items-center gap-2 text-base text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-3"
      >
        <ArrowLeft className="size-5" />
        Voltar para Projetos
      </Link>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand via-brand/95 to-brand-light dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-8 ring-1 ring-white/10 sm:p-10 lg:p-12">
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

      {/* Client Sub-Hero */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-7 shadow-lg shadow-foreground/[0.04] sm:p-8">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-brand to-brand-light" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-sm ring-1 ring-foreground/5 bg-accent/10 text-accent">
              {getInitials(project.client.name)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cliente</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {project.client.name}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent ring-1 ring-accent/20">
                  <User className="size-3" />
                  Cliente
                </span>
              </div>
            </div>
          </div>
          <Link
            href={`/dashboard/clientes/${project.client.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-foreground/20"
          >
            Ver perfil
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>

      {/* Data Row: Status · Type · Budget · Deadline */}
      <div className="animate-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status Card */}
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-muted/20 p-6 shadow-lg shadow-foreground/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-accent/20">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-accent to-indigo-400 rounded-r-sm" />
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
              <Info className="size-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</span>
          </div>
          <ProjectStatusSelector
            projectId={project.id}
            currentStatus={project.status}
          />
        </div>

        <TypeCard
          projectId={project.id}
          type={project.type}
        />

        <BudgetCard
          projectId={project.id}
          budget={project.budget}
        />

        <DeadlineCard
          projectId={project.id}
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
