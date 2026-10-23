'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@shared/lib';
import { useMoney } from '@shared/hooks';
import { Icon } from './Icon';

/** "★ 4.8 (126 ratings)" (design `stars()`): a store's score and how many ratings it rests on. */
export function RatingSummary({
  average,
  count,
  className,
}: {
  average: number;
  count: number;
  className?: string;
}) {
  const { t } = useTranslation('common');
  const { rating, number } = useMoney();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] text-[13px] text-foreground-soft',
        className,
      )}
    >
      <Icon name="star" isFilled size={16} className="text-gold" />
      <span className="font-tabular text-foreground">{rating(average)}</span>
      <span className="text-muted-foreground">
        ({number(count)} {t('rating.count', { count })})
      </span>
    </span>
  );
}

/** A row of five stars, filled to a whole-number rating (review cards). */
export function StarRow({
  value,
  size = 16,
  label,
  className,
}: {
  value: number;
  size?: number;
  /** The accessible reading, e.g. "4 out of 5 stars". */
  label: string;
  className?: string;
}) {
  return (
    <span role="img" aria-label={label} className={cn('inline-flex gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={size}
          isFilled={star <= value}
          className={star <= value ? 'text-gold' : 'text-muted-foreground'}
        />
      ))}
    </span>
  );
}
