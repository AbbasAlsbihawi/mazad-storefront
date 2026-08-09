const ASSET_BASE_URL = (
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? 'http://localhost:3001/assets'
).replace(/\/$/, '');

/**
 * /auctions and /homepage return the raw storage key for a product photo (e.g.
 * "images/<id>/full.webp") instead of resolving it the way /products does — this mirrors
 * mazad-api's own LocalStorageService.getPublicUrl() so both paths render the same URL.
 */
export function resolveAssetUrl(keyOrUrl: string | null | undefined): string | null {
  if (!keyOrUrl) return null;
  if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) return keyOrUrl;
  return `${ASSET_BASE_URL}/${keyOrUrl.replace(/^\//, '')}`;
}
