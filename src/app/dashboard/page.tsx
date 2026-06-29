"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FolderKanban, ClipboardList, PencilRuler, Search, CheckCircle2, Plus, Clock, BarChart3 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Client } from "@/lib/types";

async function fetchWithAuth<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

const PIPELINE = [
  { status: "BRIEFING", label: "Briefing", icon: ClipboardList, color: "text-warning", bg: "bg-warning/10", bar: "bg-warning" },
  { status: "PROJETO", label: "Em Projeto", icon: PencilRuler, color: "text-primary", bg: "bg-primary/10", bar: "bg-primary" },
  { status: "REVISAO", label: "Em Revisão", icon: Search, color: "text-muted-foreground", bg: "bg-muted", bar: "bg-muted-foreground" },
  { status: "CONCLUIDO", label: "Concluído", icon: CheckCircle2, color: "text-success", bg: "bg-success/10", bar: "bg-success" },
];

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchWithAuth<Client[]>("/clients");
        if (!cancelled) setClients(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Erro ao carregar dados";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const totalProjects = clients.reduce((sum, c) => sum + c.projects.length, 0);

  const statusCounts = clients.reduce<Record<string, number>>((acc, client) => {
    client.projects.forEach((p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
    });
    return acc;
  }, {});

  const clientsWithProjects = clients.filter(c => c.projects.length > 0).length;

  const animatedClients = useCountUp(clients.length);
  const animatedProjects = useCountUp(totalProjects);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10">
          <div className="space-y-2">
            <div className="h-9 w-64 animate-skeleton rounded-md" />
            <div className="h-4 w-48 animate-skeleton rounded-md" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-40 animate-skeleton rounded-xl" />
          <div className="h-40 animate-skeleton rounded-xl" />
        </div>
        <div className="h-20 animate-skeleton rounded-xl" />
        <div className="h-56 animate-skeleton rounded-xl" />
        <div className="h-48 animate-skeleton rounded-xl" />
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
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand/[0.12] via-brand/[0.06] to-transparent p-6 ring-1 ring-brand/15 sm:p-8">
        <div className="animate-float pointer-events-none absolute -right-3 -top-3 size-16 rounded-full border border-brand/[0.15] sm:size-24" />
        <div className="animate-float pointer-events-none absolute bottom-4 right-[20%] size-8 rounded-full bg-brand/[0.10]" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <p className="text-base font-semibold text-muted-foreground/80 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {greeting}
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-foreground animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {user.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            Bem-vindo ao ArqFlow · {clients.length} {clients.length === 1 ? "cliente" : "clientes"} e {totalProjects} {totalProjects === 1 ? "projeto" : "projetos"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-stagger grid gap-4 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-md shadow-black/[0.03] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-brand/10 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-brand-light" />
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10">
              <Users className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Clientes</span>
          </div>
          <p className="text-5xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-brand">
            {animatedClients}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">clientes cadastrados</p>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {clientsWithProjects} {clientsWithProjects === 1 ? "com projeto ativo" : "com projetos ativos"}
            </p>
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <span className="size-1.5 rounded-full bg-success" />
              +5 este mês
            </span>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-md shadow-black/[0.03] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-brand/10 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-brand-light" />
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10">
              <FolderKanban className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Projetos</span>
          </div>
          <p className="text-5xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-brand">
            {animatedProjects}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">projetos registrados</p>
          <div className="mt-5 pt-4 border-t border-border space-y-1.5">
            {PIPELINE.map((stage) => {
              const count = statusCounts[stage.status] || 0;
              const Icon = stage.icon;
              return (
                <div key={stage.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`size-3 ${stage.color}`} />
                    <span className="text-muted-foreground">{stage.label}</span>
                  </div>
                  <span className={`font-medium ${stage.color}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="size-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ações rápidas</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/clientes"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-foreground/20 hover:shadow-sm"
          >
            <Plus className="size-4" />
            Novo Cliente
          </Link>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
            title="Em breve"
          >
            <Plus className="size-4" />
            Novo Projeto
            <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Em breve</span>
          </button>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
            title="Em breve"
          >
            <BarChart3 className="size-4" />
            Relatórios
            <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Em breve</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div className="animate-fade-in rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderKanban className="size-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Projetos por etapa</h3>
          </div>
          {totalProjects > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              Total: <span className="font-semibold text-foreground">{totalProjects}</span> projetos
            </span>
          )}
        </div>
        {totalProjects > 0 ? (
          <div className="space-y-5">
            {PIPELINE.map((stage) => {
              const Icon = stage.icon;
              const count = statusCounts[stage.status] || 0;
              const pct = Math.round((count / totalProjects) * 100);
              return (
                <div key={stage.status} className="space-y-1.5 group/progress">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${stage.bg} ${stage.color} ring-1 ring-border transition-transform duration-200 group-hover/progress:scale-110`}>
                        <Icon className="size-3.5" />
                      </div>
                      <span className="font-medium text-foreground truncate">{stage.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xl font-bold tracking-tight ${stage.color}`}>{count}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${stage.bar}`}
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={count}
                      aria-valuemin={0}
                      aria-valuemax={totalProjects}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50">
              <FolderKanban className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Nenhum projeto cadastrado ainda</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Crie projetos a partir da página de clientes</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="animate-fade-in rounded-xl border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="size-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Atividade recente</h3>
        </div>
        <div className="space-y-0">
          {[
            { name: "Ana Silva", project: "Residencial Carvalho", action: "atualizou o projeto", time: "há 2 horas" },
            { name: "Carlos Mendes", project: "Comercial Centro", action: "adicionou fotos", time: "há 5 horas" },
            { name: "Juliana Costa", project: "Apto 101", action: "enviou para revisão", time: "há 1 dia" },
          ].map((item, i) => (
            <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
              {i < 2 && (
                <div className="absolute left-[11px] top-5 bottom-0 w-px bg-border" />
              )}
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-background">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground truncate">
                    <span className="font-medium">{item.name}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                  <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Em breve</span>
                </div>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{item.project} · {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
