import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/server/auth-cookie";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado com sucesso" });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
