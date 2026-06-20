"use client";

import { useState, FormEvent } from "react";
import { Plus, Loader2, FileText, AlignLeft, CalendarDays, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NewProjectDialogProps {
  clientId: string;
  onCreated: () => void;
}

async function fetchWithAuth(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

export function NewProjectDialog({ clientId, onCreated }: NewProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!title) {
      setError("Título é obrigatório");
      return;
    }

    setLoading(true);

    try {
      await fetchWithAuth("/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || undefined,
          clientId,
          budget: budget ? Number(budget) : undefined,
          startDate: startDate || undefined,
          dueDate: dueDate || undefined,
        }),
      });
      setTitle("");
      setDescription("");
      setBudget("");
      setStartDate("");
      setDueDate("");
      setOpen(false);
      toast.success("Projeto criado com sucesso");
      onCreated();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar projeto";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5 shadow-xs hover:shadow-md">
            <Plus className="size-4" />
            Novo Projeto
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Projeto</DialogTitle>
            <DialogDescription>
              Crie um novo projeto para este cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="Nome do projeto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 pl-10"
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <div className="relative">
                <AlignLeft className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <textarea
                  id="description"
                  placeholder="Breve descrição do projeto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento (opcional)</Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="Valor do projeto"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-10 pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de início (opcional)</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de conclusão (opcional)</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-10 pl-10"
                  />
                </div>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Criando
                </>
              ) : (
                "Criar Projeto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
