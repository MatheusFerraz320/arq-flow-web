import { NextRequest, NextResponse } from "next/server";
import { requireServerEnv } from "@/lib/env";
import { AUTH_COOKIE_NAME, buildAuthHeader } from "@/lib/server/auth-cookie";

async function proxyRequest(request: NextRequest, path: string) {
  const API_URL = requireServerEnv("API_INTERNAL_URL");
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const headers = new Headers(buildAuthHeader(token));
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const init: RequestInit = { method: request.method, headers };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const res = await fetch(`${API_URL}/${path}`, init);
  const data = await res.arrayBuffer();

  const responseHeaders = new Headers();
  const resContentType = res.headers.get("content-type");
  if (resContentType) responseHeaders.set("Content-Type", resContentType);

  return new NextResponse(data, { status: res.status, headers: responseHeaders });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const { proxy } = await params;
  return proxyRequest(request, proxy.join("/"));
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const { proxy } = await params;
  return proxyRequest(request, proxy.join("/"));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const { proxy } = await params;
  return proxyRequest(request, proxy.join("/"));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const { proxy } = await params;
  return proxyRequest(request, proxy.join("/"));
}
