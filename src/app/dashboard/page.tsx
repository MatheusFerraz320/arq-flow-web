"use client";

import { useEffect, useState } from "react";
import { Users, FolderKanban, ClipboardList, PencilRuler, Search, CheckCircle2 } from "lucide-react";
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
  { status: "BRIEFING", label: "Briefing", icon: ClipboardList, color: "text-warning", bg: "bg-warning/10" },
  { status: "PROJETO", label: "Em Projeto", icon: PencilRuler, color: "text-primary", bg: "bg-primary/10" },
  { status: "REVISAO", label: "Em Revisão", icon: Search, color: "text-muted-foreground", bg: "bg-muted" },
  { status: "CONCLUIDO", label: "Concluído", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
];

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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10">
          <div className="space-y-2">
            <div className="h-7 w-40 animate-skeleton rounded-md" />
            <div className="h-4 w-48 animate-skeleton rounded-md" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 animate-skeleton rounded-xl" />
          <div className="h-24 animate-skeleton rounded-xl" />
        </div>
        <div className="h-28 animate-skeleton rounded-xl" />
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
      <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10 animate-gradient sm:p-8" style={{ backgroundSize: "200% 100%" }}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-foreground">Olá, {user.name}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {clients.length} {clients.length === 1 ? "cliente" : "clientes"} · {totalProjects} {totalProjects === 1 ? "projeto" : "projetos"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-stagger grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-md shadow-black/[0.03] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-brand/10">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10 animate-gradient" style={{ backgroundSize: "400% 100%" }}>
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Total de clientes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-md shadow-black/[0.03] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-brand/10">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10 animate-gradient" style={{ backgroundSize: "400% 100%" }}>
            <FolderKanban className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight">{totalProjects}</p>
            <p className="text-xs text-muted-foreground">Total de projetos</p>
          </div>
        </div>
      </div>

      {/* Kanban Pipeline */}
      {totalProjects > 0 && (
        <div className="animate-fade-in rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <FolderKanban className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Projetos por etapa</h3>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-0">
            {PIPELINE.map((stage, i) => {
              const Icon = stage.icon;
              const count = statusCounts[stage.status] || 0;
              return (
                <div key={stage.status} className="flex flex-1 flex-col items-center gap-2 text-center sm:flex-row sm:gap-3">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stage.bg} ${stage.color} ring-1 ring-border`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 sm:flex-1">
                    <p className="text-xs text-muted-foreground truncate">{stage.label}</p>
                    <p className={`text-lg font-semibold tracking-tight ${stage.color}`}>
                      {count}
                      <span className="ml-0.5 text-xs font-normal text-muted-foreground">proj.</span>
                    </p>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="hidden h-px flex-1 self-center border-t border-dashed border-border sm:block mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalProjects === 0 && clients.length > 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center transition-colors hover:border-primary/30">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50">
            <FolderKanban className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Nenhum projeto cadastrado ainda
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Crie projetos a partir da página de clientes
          </p>
        </div>
      )}
    </div>
  );
}
