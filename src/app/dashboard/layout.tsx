"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { PageLoader } from "@/components/ui/page-loader";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    toast.success("Deslogado com sucesso");
    router.push("/login");
  }

  if (checking) {
    return <PageLoader />;
  }

  return (
    <AuthProvider user={user!} onLogout={handleLogout}>
      <div className="flex min-h-dvh">
        <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <Sidebar sidebarOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

        <main className={`mt-16 flex-1 bg-gradient-to-b from-background to-muted/30 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
          <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
