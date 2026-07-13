"use client";

import { useEffect, useState, useRef } from "react";
import { ImageIcon, Upload, X, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getAssetUrl } from "@/lib/asset-url";
import type { ProjectPhoto } from "@/lib/types";

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
      const data = await api.get<ProjectPhoto[]>(`/projects/${projectId}/photos`);
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
      await api.upload(`/projects/${projectId}/photos`, formData);
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
      await api.delete(`/projects/${projectId}/photos/${photoId}`);
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
        <div className="flex items-center gap-3">
          <div className="size-9 animate-skeleton rounded-lg" />
          <div className="h-5 w-16 animate-skeleton rounded" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-skeleton rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-9 animate-skeleton rounded-lg" />
          <div className="h-5 w-16 animate-skeleton rounded" />
        </div>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed py-14 text-center">
          <p className="text-base text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <ImageIcon className="size-5" />
          </div>
          <h2 className="text-base font-semibold tracking-tight">
            Fotos{photos.length > 0 && ` (${photos.length})`}
          </h2>
        </div>
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
          className="gap-2"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Upload className="size-5" />
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
                  src={getAssetUrl(photo.url)}
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
        <div className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center transition-all duration-200 hover:border-accent/30 hover:shadow-sm">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10 transition-transform duration-200 group-hover:scale-110">
            <ImageIcon className="size-6" />
          </div>
          <p className="text-base font-medium text-muted-foreground">
            Nenhuma foto adicionada
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Adicione fotos para documentar o processo.
          </p>
        </div>
      )}
    </section>
  );
}
