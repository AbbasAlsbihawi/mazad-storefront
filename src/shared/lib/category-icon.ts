import type { IconName } from '@shared/components/ui';

/**
 * mazad-api's categories carry an `iconUrl`, but the design system allows only the vendored
 * Lucide set — no raster icons — so the slug picks a glyph instead. Unknown slugs fall back to
 * `package` rather than rendering nothing.
 */
const SLUG_ICONS: Record<string, IconName> = {
  electronics: 'credit-card',
  phones: 'credit-card',
  mobiles: 'credit-card',
  computers: 'layout-grid',
  cameras: 'camera',
  fashion: 'shopping-bag',
  clothing: 'shopping-bag',
  watches: 'clock',
  jewelry: 'star',
  home: 'house',
  furniture: 'house',
  vehicles: 'map-pin',
  cars: 'map-pin',
  collectibles: 'badge-check',
  antiques: 'badge-check',
  sports: 'trending-up',
};

export function getCategoryIcon(slug: string): IconName {
  return SLUG_ICONS[slug] ?? 'package';
}
