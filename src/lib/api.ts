const BASE_URL = "/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      body.message || `Erro ${response.status}`,
      response.status,
    );
  }
  return response.json();
}

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export const api = {
  get: <T = unknown>(path: string): Promise<T> =>
    fetch(`${BASE_URL}${path}`, { ...defaultOptions, method: "GET" }).then(
      handleResponse,
    ),

  post: <T = unknown>(path: string, body?: unknown): Promise<T> =>
    fetch(`${BASE_URL}${path}`, {
      ...defaultOptions,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse),

  patch: <T = unknown>(path: string, body: unknown): Promise<T> =>
    fetch(`${BASE_URL}${path}`, {
      ...defaultOptions,
      method: "PATCH",
      body: JSON.stringify(body),
    }).then(handleResponse),
};

export { ApiError };
