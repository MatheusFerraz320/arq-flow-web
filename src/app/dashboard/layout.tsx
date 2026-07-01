"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth-context";
import type { User } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Não autenticado");
        const data: User = await res.json();
        setUser(data);
      } catch {
        router.push("/login");
      } finally {
        setChecking(false);
      }
    }
    check();
  }, [router]);

  async function handleLogout() {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    toast.success("Deslogado com sucesso");
    router.push("/login");
  }

  if (checking) {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="mx-auto size-8 animate-pulse rounded-full bg-muted" />
            <div className="mx-auto h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider user={user!} onLogout={handleLogout}>
      <div className="flex min-h-dvh">
        <Navbar />

        <main className="ml-64 flex-1 bg-gradient-to-b from-background to-muted/30">
          <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
