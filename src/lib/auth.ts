import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ARCHITECT" | "CLIENT";
  photo?: string | null;
}

let currentUser: User | null = null;

export function getUser(): User | null {
  return currentUser;
}

export function setUser(user: User | null): void {
  currentUser = user;
}

export async function login(email: string, password: string): Promise<User> {
  const data = await api.post<{ user: User }>("/auth/login", { email, password });
  const user: User = data.user;
  currentUser = user;
  return user;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  currentUser = null;
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const user = await api.get<User>("/auth/me");
    currentUser = user;
    return user;
  } catch {
    currentUser = null;
    return null;
  }
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}
