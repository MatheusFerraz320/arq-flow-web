"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { User } from "./auth";

interface AuthContextType {
  user: User;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  user,
  onLogout,
  children,
}: {
  user: User;
  onLogout: () => void;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
