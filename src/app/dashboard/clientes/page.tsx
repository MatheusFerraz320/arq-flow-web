"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Search as SearchIcon } from "lucide-react";
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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10">
          <div className="space-y-2">
            <div className="h-7 w-40 animate-skeleton rounded-md" />
            <div className="h-4 w-56 animate-skeleton rounded-md" />
          </div>
        </div>
        <div className="h-10 w-full animate-skeleton rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-skeleton rounded-xl animate-fade-in-up"
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
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10 animate-gradient sm:p-8" style={{ backgroundSize: "200% 100%" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clientes</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {clients.length === 0
                ? "Nenhum cliente cadastrado ainda"
                : `${clients.length} ${clients.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}`}
            </p>
          </div>
          <NewClientDialog onCreated={handleCreated} />
        </div>
      </div>

      {clients.length > 0 && (
        <>
          <div className="group relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
            <Input
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full pl-10 transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-primary/20"
            />
          </div>

          {filteredClients.length > 0 && (
            <div className="animate-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center transition-colors hover:border-primary/30">
              <p className="text-sm text-muted-foreground">
                Nenhum cliente encontrado para &quot;{search}&quot;
              </p>
            </div>
          )}
        </>
      )}

      {clients.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center transition-colors hover:border-primary/30">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-white shadow-lg shadow-brand/25">
            <Plus className="size-6" />
          </div>
          <h3 className="mb-1 font-semibold">Nenhum cliente ainda</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Crie seu primeiro cliente para começar a gerenciar projetos e acompanhar o fluxo de trabalho.
          </p>
          <NewClientDialog onCreated={handleCreated} />
        </div>
      )}
    </div>
  );
}
