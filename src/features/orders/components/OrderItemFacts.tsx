'use client';

import { useMoney } from '@shared/hooks';
import { useOrdersTranslation } from '../hooks/useOrdersTranslation';
import type { Order } from '../types/orders.types';

const CONDITIONS = ['NEW', 'LIKE_NEW', 'OPEN_BOX', 'USED'];

/**
 * What the item was described as when it was bought, from the order's snapshot only (never the
 * product as it is now): its condition, and the new retail price the seller gave. Each line only
 * when the snapshot has it, and no discount or savings maths on the price.
 */
export function OrderItemFacts({ item }: { item: Order['items'][number] }) {
  const { t } = useOrdersTranslation();
  const { money } = useMoney();
  const condition = item.display?.condition;
  const marketPrice = item.display?.marketPrice;
  const hasCondition = condition != null && CONDITIONS.includes(condition);
  const hasMarketPrice = marketPrice != null && marketPrice !== '';
  if (!hasCondition && !hasMarketPrice) return null;

  return (
    <dl className="flex flex-col gap-0.5 text-footnote" data-testid="order-item-facts">
      {hasCondition ? (
        <div className="flex flex-wrap gap-x-1">
          <dt className="text-muted-foreground">{t('detail.conditionLabel')}:</dt>
          <dd className="text-foreground-soft">{t(`detail.condition.${condition}`)}</dd>
        </div>
      ) : null}
      {hasMarketPrice ? (
        <div className="flex flex-wrap gap-x-1" data-testid="order-item-market-price">
          <dt className="text-muted-foreground">{t('detail.marketPriceAtPurchase')}:</dt>
          <dd className="text-foreground-soft tabular-nums">{money(marketPrice)}</dd>
        </div>
      ) : null}
    </dl>
  );
}
