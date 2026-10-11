'use client';

import { useLocale } from '@shared/hooks';
import { pickLocalizedName } from '@shared/lib';
import type { Locale } from '@shared/store';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { Auction } from '../types/catalog.types';
import { DetailRow, DetailSection } from './DetailSection';

/** The reading language's text, else the other one's; mazad-api already fills an empty side. */
function pick(en: string | null | undefined, ar: string | null | undefined, locale: Locale) {
  const text = locale === 'ar' ? ar?.trim() || en?.trim() : en?.trim() || ar?.trim();
  return text ?? '';
}

/** The full description, line breaks kept, never truncated. */
export function ProductDetailsSection({ auction }: { auction: Auction }) {
  const { t } = useCatalogTranslation();
  const { locale } = useLocale();
  const description = pick(auction.product.descriptionEn, auction.product.descriptionAr, locale);
  return (
    <DetailSection title={t('detail.productDetails')}>
      <p className="whitespace-pre-wrap text-body text-foreground" data-testid="detail-description">
        {description || t('detail.noDescription')}
      </p>
    </DetailSection>
  );
}

/**
 * Condition (explained), the main category and subcategory, then the seller's specifications —
 * only rows with data, nothing invented (there are no brand or model fields).
 */
export function ProductInfoSection({ auction }: { auction: Auction }) {
  const { t } = useCatalogTranslation();
  const { locale } = useLocale();
  const { condition, category } = auction.product;
  // With a parent, the parent is the main category and the product's own the subcategory.
  const main = category?.parent ?? category;
  const sub = category?.parent ? category : null;
  const specs = (auction.product.variants ?? []).flatMap((variant) => {
    const name = pick(variant.nameEn, variant.nameAr, locale);
    const value = pick(variant.valueEn, variant.valueAr, locale);
    return name && value ? [{ name, value }] : [];
  });

  return (
    <DetailSection title={t('detail.productInfo')} testId="detail-product-info">
      <div className="flex flex-col gap-1">
        <DetailRow label={t('detail.condition')} value={t(`condition.${condition}`)} />
        <span className="text-footnote text-muted-foreground">
          {t(`conditionHint.${condition}`)}
        </span>
      </div>
      {main ? (
        <DetailRow label={t('detail.category')} value={pickLocalizedName(main, locale)} />
      ) : null}
      {sub ? (
        <DetailRow label={t('detail.subcategory')} value={pickLocalizedName(sub, locale)} />
      ) : null}
      {specs.map((spec, index) => (
        <DetailRow key={`${index}-${spec.name}`} label={spec.name} value={spec.value} />
      ))}
    </DetailSection>
  );
}
