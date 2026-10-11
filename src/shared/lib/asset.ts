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

/** An upload's full image key or URL: `images/<uuid>/full.webp`, next to its `thumb.webp`. */
const UPLOAD_FULL_IMAGE = /(^|\/)(images\/[0-9a-f-]{36})\/full\.webp(?=$|[?#])/i;

/**
 * The 300 px thumbnail for lists and small thumbs, for responses that only carry the full image
 * (GET /me/bids, /me/products). Mirrors mazad-api's UploadsService.resolveThumbUrl(): every upload
 * writes `thumb.webp` next to `full.webp`; anything else (seed or external images) has no
 * thumbnail and stays the full URL.
 */
export function resolveThumbUrl(keyOrUrl: string | null | undefined): string | null {
  if (!keyOrUrl) return null;
  return resolveAssetUrl(keyOrUrl.replace(UPLOAD_FULL_IMAGE, '$1$2/thumb.webp'));
}
