"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { User } from "./auth";

interface AuthContextType {
  user: User;
  updateUser: (patch: Partial<User>) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  user: initialUser,
  onLogout,
  children,
}: {
  user: User;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [user, setUser] = useState(initialUser);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, updateUser, onLogout }}>
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
