"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Search as SearchIcon, ClipboardList, PencilRuler, CheckCircle2 } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import type { Project } from "@/lib/types";

async function fetchWithAuth<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

function useCountUp(end: number, duration = 1200): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    let startTime: number | null = null;
    let rafId: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);

  return count;
}

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchWithAuth<Project[]>("/projects");
        if (!cancelled) setProjects(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Erro ao carregar projetos";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const totalProjects = projects.length;
  const briefingCount = projects.filter((p) => p.status === "BRIEFING").length;
  const emProjetoCount = projects.filter((p) => p.status === "PROJETO").length;
  const concluidoCount = projects.filter((p) => p.status === "CONCLUIDO").length;

  const animatedTotal = useCountUp(totalProjects);
  const animatedBriefing = useCountUp(briefingCount);
  const animatedProjeto = useCountUp(emProjetoCount);
  const animatedConcluido = useCountUp(concluidoCount);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.client.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-xl bg-gradient-to-r from-purple-500/[0.07] via-purple-500/[0.03] to-transparent p-6 ring-1 ring-purple-500/10">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-skeleton rounded-md" />
            <div className="h-9 w-48 animate-skeleton rounded-md" />
            <div className="h-4 w-64 animate-skeleton rounded-md" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-skeleton rounded-xl" />
          ))}
        </div>
        <div className="h-12 animate-skeleton rounded-xl" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-skeleton rounded-xl animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="size-1.5 rounded-full bg-destructive" />
          </div>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-violet-500 p-8 ring-1 ring-white/10 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm animate-fade-in-up mb-4" style={{ animationDelay: "100ms" }}>
            <FolderKanban className="size-4" />
            PROJETOS
          </div>
          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Projetos</h1>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <FolderKanban className="size-7" />
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-white/70 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            Gerencie todos os seus projetos em um só lugar.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-500/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-purple-500/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-500 to-violet-400" />
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/10">
              <FolderKanban className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total</span>
          </div>
          <p className="text-4xl font-bold tracking-tight text-purple-600">{animatedTotal}</p>
          <p className="mt-1 text-sm text-muted-foreground">projetos</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-warning/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-warning/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-warning to-amber-400" />
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-warning/10 text-warning ring-1 ring-warning/10">
              <ClipboardList className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Briefing</span>
          </div>
          <p className="text-4xl font-bold tracking-tight text-warning">{animatedBriefing}</p>
          <p className="mt-1 text-sm text-muted-foreground">em fase inicial</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-primary/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary to-slate-600" />
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
              <PencilRuler className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Em projeto</span>
          </div>
          <p className="text-4xl font-bold tracking-tight text-primary">{animatedProjeto}</p>
          <p className="mt-1 text-sm text-muted-foreground">em andamento</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-success/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-success/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-success to-emerald-400" />
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success ring-1 ring-success/10">
              <CheckCircle2 className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Concluídos</span>
          </div>
          <p className="text-4xl font-bold tracking-tight text-success">{animatedConcluido}</p>
          <p className="mt-1 text-sm text-muted-foreground">finalizados</p>
        </div>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="group relative flex-1 max-w-md">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-purple-600" />
            <Input
              placeholder="Buscar projetos ou clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full pl-11 text-base transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-purple-500/20"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredProjects.length} {filteredProjects.length === 1 ? "projeto" : "projetos"}
          </span>
        </div>
      )}

      {/* Project Cards Grid */}
      {projects.length > 0 && (
        <>
          {filteredProjects.length > 0 && (
            <div className="animate-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center transition-colors hover:border-purple-500/30">
              <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-muted">
                <SearchIcon className="size-6 text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-muted-foreground">
                Nenhum projeto encontrado para &ldquo;{search}&rdquo;
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente buscar por outro título ou nome de cliente
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-24 text-center transition-colors hover:border-purple-500/30">
          <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-500/25">
            <FolderKanban className="size-9" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Nenhum projeto ainda</h3>
          <p className="mt-2 max-w-md text-base text-muted-foreground">
            Crie projetos a partir da página de clientes para começar a acompanhar o fluxo de trabalho.
          </p>
        </div>
      )}
    </div>
  );
}
