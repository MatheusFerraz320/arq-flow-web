import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function proxyRequest(request: NextRequest, path: string) {
  const token = request.cookies.get("arqflow_token")?.value;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  if (token) headers.set("Authorization", `Bearer ${token}`);

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
