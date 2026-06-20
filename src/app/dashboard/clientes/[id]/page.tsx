"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, FolderKanban, Plus, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { cn } from "@/lib/utils";
import { getInitials, bgForName } from "@/lib/utils";
import type { Client } from "@/lib/types";

const AVATAR_BG = ["bg-brand/10 text-brand", "bg-accent/10 text-accent", "bg-muted text-muted-foreground"];

async function fetchWithAuth<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

export default function ClientPage() {
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await fetchWithAuth<Client>(`/clients/${id}`);
      setClient(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar cliente";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  function handleProjectCreated() {
    load();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8">
          <div className="space-y-3">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="size-1.5 rounded-full bg-destructive" />
          </div>
          <p className="text-sm text-destructive">{error || "Cliente não encontrado"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-2"
        >
          <ArrowLeft className="size-4" />
          Voltar para clientes
        </Link>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn("flex size-12 items-center justify-center rounded-full text-sm font-semibold", AVATAR_BG[bgForName(client.name)])}>
              {getInitials(client.name)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {client.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5" />
                  {client.email}
                </span>
                {client.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3.5" />
                    {client.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <NewProjectDialog
            clientId={client.id}
            onCreated={handleProjectCreated}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-tight">
              Projetos{client.projects.length > 0 && ` (${client.projects.length})`}
            </h2>
          </div>
        </div>

        {client.projects.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {client.projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projetos/${project.id}`}>
                <div className="flex h-full cursor-pointer flex-col gap-4 rounded-xl bg-card p-5 text-sm text-card-foreground border border-border/60 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex h-full flex-col justify-between gap-3">
                    <div>
                      <h3 className="truncate font-medium">{project.title}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={project.status} />
                      <span className="text-xs text-muted-foreground">
                        {project.status === "BRIEFING"
                          ? "Em briefing"
                          : project.status === "PROJETO"
                            ? "Em desenvolvimento"
                            : project.status === "REVISAO"
                              ? "Em revisão"
                              : "Concluído"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {client.projects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center transition-colors duration-200 hover:border-primary/30">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-white shadow-lg shadow-brand/25">
              <Plus className="size-6" />
            </div>
            <h3 className="mb-1 font-semibold">Nenhum projeto ainda</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Crie o primeiro projeto para este cliente.
            </p>
            <NewProjectDialog
              clientId={client.id}
              onCreated={handleProjectCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
}
