"use client";

import { useEffect, useState } from "react";
import { Users, FolderKanban, Plus } from "lucide-react";
import { ClientCard } from "@/components/client-card";
import { Search } from "@/components/search";
import { NewClientDialog } from "@/components/new-client-dialog";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  projects: {
    id: string;
    title: string;
    status: string;
  }[];
}

async function fetchWithAuth<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

export default function DashboardPage() {
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

  const totalProjects = clients.reduce((sum, c) => sum + c.projects.length, 0);

const filteredClients = clients.filter((client) =>
  client.name.toLowerCase().includes(search.toLowerCase())
);

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-fade-in-up h-40 rounded-xl bg-muted/50"
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
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="size-1.5 rounded-full bg-destructive" />
          </div>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {clients.length === 0
              ? "Nenhum cliente cadastrado ainda"
              : `${clients.length} ${clients.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}`}
          </p>
        </div>
        <NewClientDialog onCreated={handleCreated} />
      </div>

      {/* Stats */}
      {clients.length > 0 && (
        <div className="animate-stagger grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{clients.length}</p>
              <p className="text-xs text-muted-foreground">
                Total de clientes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 ring-1 ring-emerald-500/10">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{totalProjects}</p>
              <p className="text-xs text-muted-foreground">
                Total de projetos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
        <div className="animate-fade-in-up">
          <Search
          placeholder="Buscar clientes..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Client Cards */}
      {filteredClients.length > 0 && (
        <div className="animate-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              email={client.email}
              projects={client.projects}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {clients.length === 0 && (
        <div className="animate-scale-in flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center transition-all duration-200 hover:border-brand/20">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-white shadow-lg shadow-brand/25 transition-transform duration-200 hover:scale-105">
            <Plus className="size-6" />
          </div>
          <h3 className="mb-1 font-semibold">Nenhum cliente ainda</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Crie seu primeiro cliente para começar a gerenciar projetos e
            acompanhar o fluxo de trabalho.
          </p>
          <NewClientDialog onCreated={handleCreated} />
        </div>
      )}
    </div>
  );
}
