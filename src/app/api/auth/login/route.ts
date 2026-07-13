import { NextRequest, NextResponse } from "next/server";
import { requireServerEnv } from "@/lib/env";
import { AUTH_COOKIE_NAME } from "@/lib/server/auth-cookie";

export async function POST(request: NextRequest) {
  const API_URL = requireServerEnv("API_INTERNAL_URL");
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro ao fazer login" }));
    return NextResponse.json(error, { status: res.status });
  }

  const data = await res.json();

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(AUTH_COOKIE_NAME, data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
