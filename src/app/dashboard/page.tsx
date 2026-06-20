"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FolderKanban, Plus } from "lucide-react";
import { ClientCard } from "@/components/client-card";
import { Search } from "@/components/search";
import { NewClientDialog } from "@/components/new-client-dialog";
import { MetricCard } from "@/components/ui/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeIn, stagger } from "@/lib/animations";
import type { Client } from "@/lib/types";

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton variant="text" className="h-7 w-32" />
            <Skeleton variant="text" className="h-4 w-48" />
          </div>
          <Skeleton variant="text" className="h-8 w-28 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <Skeleton variant="text" className="h-10 w-full rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="card"
              className="animate-fade-in-up"
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="size-1.5 rounded-full bg-destructive" />
          </div>
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger}
      className="space-y-6"
    >
      <motion.div variants={fadeIn} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {clients.length === 0
              ? "Nenhum cliente cadastrado ainda"
              : `${clients.length} ${clients.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}`}
          </p>
        </div>
        <NewClientDialog onCreated={handleCreated} />
      </motion.div>

      {clients.length > 0 && (
        <motion.div variants={fadeIn} className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            icon={<Users className="size-5" />}
            value={clients.length}
            label="Total de clientes"
          />
          <MetricCard
            icon={<FolderKanban className="size-5" />}
            value={totalProjects}
            label="Total de projetos"
          />
        </motion.div>
      )}

      {clients.length > 0 && (
        <motion.div variants={fadeIn}>
          <Search
            placeholder="Buscar clientes..."
            value={search}
            onChange={setSearch}
          />
        </motion.div>
      )}

      <motion.div variants={fadeIn}
        className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Clientes</h2>
      </motion.div>

      {filteredClients.length > 0 && (
        <motion.div variants={fadeIn} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              clientId={client.id}
              name={client.name}
              email={client.email}
              projects={client.projects}
            />
          ))}
        </motion.div>
      )}

      {clients.length === 0 && (
        <motion.div variants={fadeIn}>
          <EmptyState
            icon={<Plus className="size-6" />}
            title="Nenhum cliente ainda"
            description="Crie seu primeiro cliente para começar a gerenciar projetos e acompanhar o fluxo de trabalho."
            action={<NewClientDialog onCreated={handleCreated} />}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
