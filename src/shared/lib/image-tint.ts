import type { CSSProperties } from 'react';

/**
 * There is no product photography in the system yet, so an auction with no `coverImage` gets a
 * flat pastel well instead of grey emptiness. The hue is derived from the product id so the same
 * product always lands on the same tint — a grid stays varied but never reshuffles between
 * renders. Lightness/chroma come from `--image-well-*` so dark mode dims the whole family at once.
 */
export function getImageTintStyle(seed: string): CSSProperties {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 360;
  }
  return {
    backgroundColor: `oklch(var(--image-well-l) var(--image-well-c) ${hash})`,
  };
}
