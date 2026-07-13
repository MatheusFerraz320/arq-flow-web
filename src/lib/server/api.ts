import { cookies } from "next/headers";
import { requireServerEnv } from "@/lib/env";
import { AUTH_COOKIE_NAME, buildAuthHeader } from "./auth-cookie";

export async function serverFetch(path: string, init?: RequestInit) {
  const API_INTERNAL_URL = requireServerEnv("API_INTERNAL_URL");
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return fetch(`${API_INTERNAL_URL}${path}`, {
    ...init,
    headers: { ...init?.headers, ...buildAuthHeader(token) },
  });
}
