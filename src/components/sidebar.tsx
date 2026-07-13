"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  User,
  ClipboardList,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { getInitials, bgForName } from "@/lib/utils";
import { getAssetUrl } from "@/lib/asset-url";
import { toast } from "sonner";

const AVATAR_BG = ["bg-brand/10 text-brand", "bg-accent/10 text-accent", "bg-muted text-muted-foreground"];

const REAL_NAV = [
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

const MOCK_NAV = [
  { label: "Briefings", icon: ClipboardList },
  { label: "Templates", icon: FileText },
  { label: "Configurações", icon: Settings },
  { label: "Ajuda", icon: HelpCircle },
];

export function Sidebar({ sidebarOpen, onToggle }: { sidebarOpen: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { user, onLogout } = useAuth();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "fixed top-16 bottom-0 left-0 z-40 flex flex-col border-r border-border bg-card shadow-sm transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16",
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute -right-3 top-6 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-card-foreground",
          !sidebarOpen && "rotate-180",
        )}
      >
        <ChevronLeft className="size-3.5" />
      </button>

      {/* Photo / Avatar */}
      <div className={cn("flex shrink-0 flex-col items-center pt-8", sidebarOpen ? "gap-4 px-6" : "gap-2 px-2")}>
        {user.photo ? (
          <img
            src={getAssetUrl(user.photo)}
            alt={user.name}
            className={cn("shrink-0 rounded-full object-cover ring-4 ring-border", sidebarOpen ? "size-20" : "size-10")}
          />
        ) : (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full font-bold ring-4 ring-border",
              sidebarOpen ? "size-20 text-3xl" : "size-10 text-sm",
              AVATAR_BG[bgForName(user.name)],
            )}
          >
            {getInitials(user.name)}
          </div>
        )}

        {sidebarOpen && (
          <div className="text-center">
            <p className="text-lg font-semibold text-card-foreground truncate max-w-[180px]">{user.name}</p>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <span className="size-2 shrink-0 rounded-full bg-success" />
              Online
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-1", sidebarOpen ? "mt-8 px-4" : "mt-6 px-2")}>
        {REAL_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-all duration-200",
                sidebarOpen ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5",
                active
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}

        {sidebarOpen && (
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">Em breve</span>
            </div>
          </div>
        )}

        {MOCK_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => toast.info(`${item.label} — em breve`)}
              className={cn(
                "flex w-full items-center rounded-lg transition-all duration-200",
                sidebarOpen ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5",
                "text-muted-foreground/60 hover:bg-muted hover:text-card-foreground cursor-pointer",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {sidebarOpen && (
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Em breve</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={cn("border-t border-border", sidebarOpen ? "px-3 py-5" : "px-2 py-5")}>
        <button
          onClick={onLogout}
          className={cn(
            "flex w-full items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground",
            sidebarOpen ? "gap-2 px-4 py-3" : "justify-center px-2 py-3",
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {sidebarOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
