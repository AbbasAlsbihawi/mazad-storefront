interface LocalizedEntity {
  nameEn: string;
  nameAr: string;
}

/**
 * mazad-api's /categories, /products, and /stores pick the right name server-side from
 * Accept-Language. /auctions and /homepage don't — they return raw nameEn/nameAr on the nested
 * product — so callers rendering an auction's product name localize it here instead.
 */
export function pickLocalizedName(entity: LocalizedEntity, locale: 'en' | 'ar'): string {
  if (locale === 'en' && entity.nameEn) return entity.nameEn;
  return entity.nameAr || entity.nameEn || '';
}
