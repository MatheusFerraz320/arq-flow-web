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
      <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10 animate-gradient sm:p-8" style={{ backgroundSize: "200% 100%" }}>
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
          href="/dashboard/clientes"
          className="inline-flex items-center gap-2 text-base text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-3"
        >
          <ArrowLeft className="size-5" />
          Voltar para clientes
        </Link>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 ring-1 ring-white/10 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="relative flex items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={cn("flex size-16 items-center justify-center rounded-2xl text-xl font-bold shadow-lg shadow-foreground/20 ring-2 ring-white/20", AVATAR_BG[bgForName(client.name)])}>
              {getInitials(client.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {client.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-base text-white/70">
                <span className="flex items-center gap-2">
                  <Mail className="size-4" />
                  {client.email}
                </span>
                {client.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="size-4" />
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

      {/* Projects Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FolderKanban className="size-5" />
            </div>
            <h2 className="text-base font-semibold tracking-tight">
              Projetos{client.projects.length > 0 && ` (${client.projects.length})`}
            </h2>
          </div>
        </div>

        {client.projects.length > 0 && (
          <div className="animate-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {client.projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projetos/${project.id}`}>
                <div className="flex h-full cursor-pointer flex-col gap-4 rounded-xl bg-gradient-to-br from-card to-muted/20 p-7 text-base text-card-foreground border border-border/60 shadow-lg shadow-foreground/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/5 hover:ring-1 hover:ring-accent/20">
                  <div className="flex h-full flex-col justify-between gap-3">
                    <div>
                      <h3 className="truncate font-semibold text-lg">{project.title}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={project.status} />
                      <span className="text-sm text-muted-foreground">
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
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-24 text-center transition-colors duration-200 hover:border-accent/30">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-indigo-500 text-white shadow-lg shadow-accent/25">
              <Plus className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">Nenhum projeto ainda</h3>
            <p className="mb-8 max-w-md text-base text-muted-foreground">
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
