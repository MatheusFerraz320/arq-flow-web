"use client";

import { useEffect, useState, useRef } from "react";
import { ImageIcon, Upload, X, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ProjectPhoto } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ProjectPhotosProps {
  projectId: string;
}

export function ProjectPhotos({ projectId }: ProjectPhotosProps) {
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await fetch(`/api/projects/${projectId}/photos`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao carregar fotos");
      const data: ProjectPhoto[] = await res.json();
      setPhotos(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar fotos";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [projectId]);

  async function handleUpload(file: File) {
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
    formData.append("file", file);

    try {
      const res = await fetch(`/api/projects/${projectId}/photos`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Erro ao fazer upload");
      toast.success("Foto adicionada");
      load();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer upload";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photoId: string) {
    setDeleting(photoId);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/photos/${photoId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Erro ao remover foto");
      toast.success("Foto removida");
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao remover foto";
      toast.error(message);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight">Fotos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight">Fotos</h2>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed py-14 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">
          Fotos{photos.length > 0 && ` (${photos.length})`}
        </h2>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          size="sm"
          className="gap-1.5"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {uploading ? "Enviando..." : "Adicionar"}
        </Button>
      </div>

      {photos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={`${API_URL}${photo.url}`}
                  alt={photo.caption ?? "Foto do projeto"}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {photo.caption && (
                <div className="px-3 py-2">
                  <p className="truncate text-xs text-muted-foreground">
                    {photo.caption}
                  </p>
                </div>
              )}
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deleting === photo.id}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/80 opacity-0 shadow-sm backdrop-blur transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              >
                {deleting === photo.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-14 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-sm">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10 transition-transform duration-200 group-hover:scale-110">
            <ImageIcon className="size-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Nenhuma foto adicionada
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Adicione fotos para documentar o processo.
          </p>
        </div>
      )}
    </section>
  );
}
