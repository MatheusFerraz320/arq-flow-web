export function requireServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente "${name}" não configurada. Configure-a nas Environment Variables do projeto (Vercel).`,
    );
  }
  return value;
}
