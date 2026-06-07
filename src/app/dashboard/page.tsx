"use client";

import { useEffect, useState, useCallback } from "react";
import { ClientCard } from "@/components/client-card";
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
    description?: string | null;
  }[];
}

async function fetchWithAuth<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    try {
      const data = await fetchWithAuth<Client[]>("/clients");
      setClients(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar clientes";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  async function handleCreateClient(data: { name: string; email: string; phone?: string }) {
    await fetchWithAuth("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    });
    loadClients();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-fade-in text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-fade-in text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {clients.length === 0
              ? "Nenhum cliente cadastrado ainda"
              : `${clients.length} ${clients.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}`}
          </p>
        </div>
        <NewClientDialog onCreated={loadClients} />
      </div>

      {clients.length > 0 && (
        <div className="animate-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              email={client.email}
              projects={client.projects}
            />
          ))}
        </div>
      )}

      {clients.length === 0 && (
        <div className="animate-fade-in-up flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
            +
          </div>
          <h3 className="mb-1 font-semibold">Nenhum cliente ainda</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Crie seu primeiro cliente para começar
          </p>
          <NewClientDialog onCreated={loadClients} />
        </div>
      )}
    </div>
  );
}
