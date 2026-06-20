"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      triggerError("Preencha todos os campos");
      toast.warning("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success(`Bem-vindo, ${user.name}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao fazer login";
      toast.error(message);
      triggerError(message);
    } finally {
      setLoading(false);
    }
  }

  function triggerError(message: string) {
    setError(message);
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  }

  return (
    <div className="animate-stagger space-y-6">
      {/* Logo & Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-xl font-bold text-white shadow-lg shadow-brand/25">
          AF
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          ArqFlow
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Entre na sua conta
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 pl-10 transition-shadow focus-visible:shadow-[0_0_0_4px_var(--brand)/0.1]"
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              tabIndex={-1}
              onClick={(e) => e.preventDefault()}
            >
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 pl-10 transition-shadow focus-visible:shadow-[0_0_0_4px_var(--brand)/0.1]"
              autoComplete="current-password"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive",
              shaking && "animate-shake",
            )}
          >
            <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="h-10 w-full transition-transform active:scale-[0.98] "
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Entrando
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">ou</span>
        </div>
      </div>

      {/* Google Button (placeholder) */}
      <Button
        type="button"
        variant="outline"
        className="h-10 w-full"
        disabled
      >
        <Globe className="size-4" />
        Continuar com Google
      </Button>
    </div>
  );
}
