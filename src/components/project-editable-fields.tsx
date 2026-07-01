"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, DollarSign, Loader2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProjectEditableFieldsProps {
  projectId: string;
  budget: number | null;
  startDate: string | null;
  dueDate: string | null;
}

export function ProjectEditableFields({ projectId, budget, startDate, dueDate }: ProjectEditableFieldsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<"budget" | "deadline" | null>(null);
  const [saving, setSaving] = useState(false);

  const [editBudget, setEditBudget] = useState(budget?.toString() ?? "");
  const [editStartDate, setEditStartDate] = useState(startDate ?? "");
  const [editDueDate, setEditDueDate] = useState(dueDate ?? "");

  const budgetRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const dueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing === "budget") budgetRef.current?.focus();
    if (editing === "deadline") startRef.current?.focus();
  }, [editing]);

  function resetBudget() {
    setEditBudget(budget?.toString() ?? "");
    setEditing(null);
  }

  function resetDeadline() {
    setEditStartDate(startDate ?? "");
    setEditDueDate(dueDate ?? "");
    setEditing(null);
  }

  async function saveBudget() {
    const val = editBudget ? Number(editBudget) : undefined;
    if (val !== undefined && (isNaN(val) || val < 0)) return;
    if (val === budget) { resetBudget(); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: val }),
      });
      if (!res.ok) throw new Error();
      toast.success("Orçamento atualizado");
      setEditing(null);
      router.refresh();
    } catch {
      resetBudget();
      toast.error("Erro ao atualizar orçamento");
    } finally {
      setSaving(false);
    }
  }

  async function saveDeadline() {
    const s = editStartDate || undefined;
    const d = editDueDate || undefined;
    if (s === startDate && d === dueDate) { resetDeadline(); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: s, dueDate: d }),
      });
      if (!res.ok) throw new Error();
      toast.success("Prazo atualizado");
      setEditing(null);
      router.refresh();
    } catch {
      resetDeadline();
      toast.error("Erro ao atualizar prazo");
    } finally {
      setSaving(false);
    }
  }

  function handleBudgetKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") saveBudget();
    if (e.key === "Escape") resetBudget();
  }

  function handleDeadlineKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") resetDeadline();
  }

  return (
    <>
      {/* Budget Card */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-accent/20">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
          <DollarSign className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">Orçamento</p>
          {editing === "budget" ? (
            <div className="flex items-center gap-1">
              <span className="text-base text-muted-foreground">R$</span>
              <Input
                ref={budgetRef}
                type="number"
                step="0.01"
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                onKeyDown={handleBudgetKeyDown}
                onBlur={saveBudget}
                className="h-9 w-32 text-base"
                disabled={saving}
              />
              {saving && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            </div>
          ) : (
            <div
              className="group flex cursor-pointer items-center gap-2"
              onClick={() => { setEditBudget(budget?.toString() ?? ""); setEditing("budget"); }}
            >
              <p className="truncate text-base font-medium">
                {budget
                  ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(budget)
                  : "Não definido"}
              </p>
              <Pencil className="size-4 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/50" />
            </div>
          )}
        </div>
      </div>

      {/* Deadline Card */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-accent/20">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/5 text-success ring-1 ring-success/10">
          <CalendarDays className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">Prazo</p>
          {editing === "deadline" ? (
            <div className="flex items-center gap-2">
              <Input
                ref={startRef}
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                onKeyDown={handleDeadlineKeyDown}
                className="h-9 text-sm"
                disabled={saving}
              />
              <span className="text-sm text-muted-foreground">→</span>
              <Input
                ref={dueRef}
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                onBlur={saveDeadline}
                onKeyDown={handleDeadlineKeyDown}
                className="h-9 text-sm"
                disabled={saving}
              />
              {saving && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
            </div>
          ) : (
            <div
              className="group flex cursor-pointer items-center gap-2"
              onClick={() => { setEditStartDate(startDate ?? ""); setEditDueDate(dueDate ?? ""); setEditing("deadline"); }}
            >
              <p className="truncate text-base font-medium">
                {startDate && dueDate
                  ? `${new Intl.DateTimeFormat("pt-BR").format(new Date(startDate))} → ${new Intl.DateTimeFormat("pt-BR").format(new Date(dueDate))}`
                  : "Não definido"}
              </p>
              <Pencil className="size-4 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/50" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
