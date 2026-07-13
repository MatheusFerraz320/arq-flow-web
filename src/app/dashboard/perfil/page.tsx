"use client";

import { useEffect, useRef, useState } from "react";
import { User, Mail, Shield, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getInitials, bgForName, cn } from "@/lib/utils";
import type { User as UserType } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const AVATAR_BG = ["bg-brand/10 text-brand", "bg-accent/10 text-accent", "bg-muted text-muted-foreground"];

type ProfileUser = Pick<UserType, "id" | "name" | "email" | "photo" | "role">;

async function fetchProfile(): Promise<ProfileUser> {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao carregar perfil");
  return res.json();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchProfile();
        if (!cancelled) setProfile(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Erro ao carregar perfil";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function handlePhotoUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Erro ao atualizar foto");
      const updated: ProfileUser = await res.json();
      setProfile(updated);
      toast.success("Foto atualizada com sucesso");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar foto";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-xl bg-gradient-to-r from-brand/[0.07] via-brand/[0.03] to-transparent p-6 ring-1 ring-brand/10">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-skeleton rounded-md" />
            <div className="h-9 w-48 animate-skeleton rounded-md" />
            <div className="h-4 w-64 animate-skeleton rounded-md" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 rounded-xl border bg-card p-8 shadow-lg shadow-foreground/[0.04]">
          <div className="size-32 animate-skeleton rounded-full" />
          <div className="space-y-3 text-center">
            <div className="mx-auto h-7 w-48 animate-skeleton rounded-md" />
            <div className="mx-auto h-5 w-64 animate-skeleton rounded-md" />
            <div className="mx-auto h-6 w-24 animate-skeleton rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="size-1.5 rounded-full bg-destructive" />
          </div>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand via-brand/95 to-brand-light dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-8 ring-1 ring-white/10 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm animate-fade-in-up mb-4" style={{ animationDelay: "100ms" }}>
            <User className="size-4" />
            PERFIL
          </div>
          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Meu Perfil</h1>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <User className="size-7" />
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-white/70 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            Visualize e gerencie suas informações pessoais.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="flex flex-col items-center gap-8 rounded-xl border bg-card p-8 shadow-lg shadow-foreground/[0.04] animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          {/* Avatar + Camera overlay */}
          <div className="relative group">
            {profile.photo ? (
              <img
                src={`${API_URL}${profile.photo}`}
                alt={profile.name}
                className="size-32 rounded-full object-cover ring-4 ring-border shadow-lg"
              />
            ) : (
              <div
                className={cn(
                  "flex size-32 items-center justify-center rounded-full text-4xl font-bold ring-4 ring-border shadow-lg",
                  AVATAR_BG[bgForName(profile.name)],
                )}
              >
                {getInitials(profile.name)}
              </div>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
                e.target.value = "";
              }}
            />
            <button
              disabled={uploading}
              onClick={() => photoInputRef.current?.click()}
              className="absolute inset-0 flex size-32 items-center justify-center rounded-full bg-background/60 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 disabled:cursor-wait"
              title="Alterar foto de perfil"
            >
              {uploading ? (
                <Loader2 className="size-8 text-muted-foreground animate-spin" />
              ) : (
                <Camera className="size-8 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Info */}
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>

            <div className="flex justify-center">
              <Badge variant={profile.role === "ARCHITECT" ? "default" : "secondary"} className="gap-1.5 px-3 py-1.5 text-sm">
                <Shield className="size-3.5" />
                {profile.role === "ARCHITECT" ? "Arquiteto" : "Cliente"}
              </Badge>
            </div>

            <div className="rounded-xl border bg-background/50 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Nome</p>
                  <p className="text-sm font-medium text-foreground">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Shield className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Função</p>
                  <p className="text-sm font-medium text-foreground">{profile.role === "ARCHITECT" ? "Arquiteto" : "Cliente"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
