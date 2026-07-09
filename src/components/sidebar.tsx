"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { getInitials, bgForName } from "@/lib/utils";

const AVATAR_BG = ["bg-brand/10 text-brand", "bg-accent/10 text-accent", "bg-muted text-muted-foreground"];

export function Sidebar() {
  const { user, onLogout } = useAuth();

  return (
    <aside className="fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card shadow-sm">
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex size-20 items-center justify-center rounded-full text-3xl font-bold ring-4 ring-border",
              AVATAR_BG[bgForName(user.name)],
            )}
          >
            {getInitials(user.name)}
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-card-foreground">{user.name}</p>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-success" />
              Online
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-3 py-5">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
