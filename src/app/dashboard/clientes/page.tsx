"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Search as SearchIcon, FolderKanban, UserPlus } from "lucide-react";
import { ClientCard } from "@/components/client-card";
import { NewClientDialog } from "@/components/new-client-dialog";
import { Input } from "@/components/ui/input";
import type { Client } from "@/lib/types";

async function fetchWithAuth<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

function useCountUp(end: number, duration = 1000): number {
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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchWithAuth<Client[]>("/clients");
        if (!cancelled) setClients(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Erro ao carregar clientes";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCreated() {
    setLoading(true);
    setError("");

    fetchWithAuth<Client[]>("/clients")
      .then(setClients)
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Erro ao recarregar clientes";
        setError(message);
      })
      .finally(() => setLoading(false));
  }

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const clientsWithProjects = clients.filter(c => c.projects.length > 0).length;
  const animatedTotal = useCountUp(clients.length);
  const animatedWithProjects = useCountUp(clientsWithProjects);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-skeleton rounded-md" />
            <div className="h-9 w-48 animate-skeleton rounded-md" />
            <div className="h-4 w-64 animate-skeleton rounded-md" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-24 animate-skeleton rounded-xl" />
          <div className="h-24 animate-skeleton rounded-xl" />
          <div className="h-24 animate-skeleton rounded-xl" />
        </div>
        <div className="h-12 animate-skeleton rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-skeleton rounded-xl animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            />
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
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand via-brand/95 to-brand-light p-8 ring-1 ring-white/10 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm animate-fade-in-up mb-4" style={{ animationDelay: "100ms" }}>
            <Users className="size-4" />
            GERENCIAMENTO
          </div>
          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Clientes</h1>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <Users className="size-7" />
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-white/70 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            Gerencie todos os seus clientes, acompanhe projetos e mantenha o fluxo de trabalho organizado.
          </p>
          <div className="mt-6 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <span className="text-3xl font-bold text-white">{animatedTotal}</span>
            <span className="text-base text-white/60">clientes cadastrados</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-stagger grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-lg shadow-black/[0.04]">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Total</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">{animatedTotal}</p>
          <p className="text-sm text-muted-foreground mt-1">clientes cadastrados</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-lg shadow-black/[0.04]">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Com projetos</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-success">{animatedWithProjects}</p>
          <p className="text-sm text-muted-foreground mt-1">clientes ativos</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-lg shadow-black/[0.04]">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Sem projetos</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-muted-foreground">{clients.length - clientsWithProjects}</p>
          <p className="text-sm text-muted-foreground mt-1">clientes inativos</p>
        </div>
      </div>

      {/* Search + Actions */}
      {clients.length > 0 && (
        <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="group relative flex-1 max-w-md">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
            <Input
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full pl-11 text-base transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-accent/20"
            />
          </div>
          <NewClientDialog onCreated={handleCreated} />
        </div>
      )}

      {/* Client Cards Grid */}
      {clients.length > 0 && (
        <>
          {filteredClients.length > 0 && (
            <div className="animate-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client) => (
                <ClientCard
                  key={client.id}
                  clientId={client.id}
                  name={client.name}
                  email={client.email}
                  projects={client.projects}
                />
              ))}
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center transition-colors hover:border-accent/30">
              <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-muted">
                <SearchIcon className="size-6 text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-muted-foreground">
                Nenhum cliente encontrado para &ldquo;{search}&rdquo;
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente buscar por outro nome
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty state - no clients */}
      {clients.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-24 text-center transition-colors hover:border-accent/30">
          <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-indigo-500 text-white shadow-lg shadow-accent/25">
            <UserPlus className="size-9" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Nenhum cliente ainda</h3>
          <p className="mt-2 max-w-md text-base text-muted-foreground">
            Crie seu primeiro cliente para começar a gerenciar projetos e acompanhar o fluxo de trabalho.
          </p>
          <div className="mt-8">
            <NewClientDialog onCreated={handleCreated} />
          </div>
        </div>
      )}
    </div>
  );
}
