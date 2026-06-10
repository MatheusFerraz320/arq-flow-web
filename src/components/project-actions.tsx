"use client";

import { useState } from "react";
import { Check, X, Loader2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { ProjectStatus } from "@/lib/types";

interface ProjectActionsProps {
  projectId: string;
  status: ProjectStatus;
}

export function ProjectActions({ projectId, status }: ProjectActionsProps) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  async function handleApprove() {
    setApproving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONCLUIDO" }),
      });
      if (!res.ok) throw new Error("Erro ao aprovar projeto");
      toast.success("Projeto aprovado com sucesso");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao aprovar projeto";
      toast.error(message);
    } finally {
      setApproving(false);
    }
  }

  async function handleReject() {
    setRejecting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REVISAO" }),
      });
      if (!res.ok) throw new Error("Erro ao reprovar projeto");
      toast.success("Projeto enviado para revisão");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao reprovar projeto";
      toast.error(message);
    } finally {
      setRejecting(false);
    }
  }

  const isDisabled = approving || rejecting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aprovação</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "CONCLUIDO" ? (
          <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600">
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/20">
              <ThumbsUp className="size-4" />
            </div>
            Projeto já aprovado
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={isDisabled}
              size="lg"
              className="gap-2"
            >
              {approving ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Check className="size-5" />
              )}
              Aprovar
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              disabled={isDisabled}
              size="lg"
              className="gap-2"
            >
              {rejecting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <X className="size-5" />
              )}
              Reprovar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
