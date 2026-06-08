"use client";

import { useState, FormEvent } from "react";
import { User, Mail, Phone, Plus, Loader2 } from "lucide-react";
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

interface NewClientDialogProps {
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

export function NewClientDialog({ onCreated }: NewClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email) {
      setError("Nome e email são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      await fetchWithAuth("/clients", {
        method: "POST",
        body: JSON.stringify({ name, email, phone: phone || undefined }),
      });
      setName("");
      setEmail("");
      setPhone("");
      setOpen(false);
      toast.success("Cliente criado com sucesso");
      onCreated();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar cliente";
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
            Novo Cliente
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente para começar um projeto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Nome do cliente"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 pl-10"
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="(11) 99999-8888"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 pl-10"
                />
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
            <Button type="submit" disabled={loading} className="shadow-xs hover:shadow-md">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
