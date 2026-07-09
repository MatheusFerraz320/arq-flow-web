"use client";

import { useState, FormEvent } from "react";
import { Plus, Loader2, FileText, AlignLeft, CalendarDays, DollarSign, Building2, ChevronDown } from "lucide-react";
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
  const [type, setType] = useState("");
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
          type: type || undefined,
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
      setType("");
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
          <Button className="gap-2 shadow-xs hover:shadow-md">
            <Plus className="size-5" />
            Novo Projeto
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Novo Projeto</DialogTitle>
            <DialogDescription className="text-base">
              Crie um novo projeto para este cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm">Título</Label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="Nome do projeto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-11"
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Descrição (opcional)</Label>
              <div className="relative">
                <AlignLeft className="pointer-events-none absolute left-3.5 top-3.5 size-5 text-muted-foreground" />
                <textarea
                  id="description"
                  placeholder="Breve descrição do projeto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2.5 pl-11 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm">Tipo (opcional)</Label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2.5 pl-11 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                >
                  <option value="">Selecione um tipo</option>
                  <option value="RESIDENCIAL">Residencial</option>
                  <option value="COMERCIAL">Comercial</option>
                  <option value="INTERIORES">Interiores</option>
                  <option value="REFORMA">Reforma</option>
                  <option value="URBANISMO">Urbanismo</option>
                  <option value="OUTRO">Outro</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm">Orçamento (opcional)</Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="Valor do projeto"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm">Data de início (opcional)</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm">Data de conclusão (opcional)</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-11"
                  />
                </div>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
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
