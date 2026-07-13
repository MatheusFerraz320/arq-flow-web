export const AUTH_COOKIE_NAME = "arqflow_token";

export function buildAuthHeader(token: string | undefined): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
