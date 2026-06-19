"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FolderKanban, Plus, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
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
        <Skeleton variant="text" className="h-5 w-32" />
        <div className="rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8">
          <div className="space-y-3">
            <Skeleton variant="text" className="h-8 w-48" />
            <Skeleton variant="text" className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  if (error || !client) {
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
          <p className="text-sm text-destructive">{error || "Cliente não encontrado"}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger}
      className="space-y-8"
    >
      {/* Back link */}
      <motion.div variants={fadeIn}>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-2"
        >
          <ArrowLeft className="size-4" />
          Voltar para clientes
        </Link>
      </motion.div>

      {/* Hero Header */}
      <motion.div
        variants={fadeIn}
        className="rounded-xl bg-gradient-to-br from-brand/[0.07] to-transparent p-6 ring-1 ring-brand/10 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={client.name} size="lg" />
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
      </motion.div>

      {/* Projects Section */}
      <div className="space-y-4">
        <motion.div
          variants={fadeIn}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <FolderKanban className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-tight">
              Projetos{client.projects.length > 0 && ` (${client.projects.length})`}
            </h2>
          </div>
        </motion.div>

        {client.projects.length > 0 && (
          <motion.div
            variants={fadeIn}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {client.projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projetos/${project.id}`}>
                <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-md">
                  <CardContent className="flex h-full flex-col justify-between gap-3">
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        )}

        {client.projects.length === 0 && (
          <motion.div variants={fadeIn}>
            <EmptyState
              icon={<Plus className="size-6" />}
              title="Nenhum projeto ainda"
              description="Crie o primeiro projeto para este cliente."
              action={
                <NewProjectDialog
                  clientId={client.id}
                  onCreated={handleProjectCreated}
                />
              }
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
