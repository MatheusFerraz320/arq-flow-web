export function getAssetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  if (!base) {
    console.error(
      "NEXT_PUBLIC_ASSET_BASE_URL não configurada; imagens não vão carregar.",
    );
    return path;
  }
  return `${base}${path}`;
}
