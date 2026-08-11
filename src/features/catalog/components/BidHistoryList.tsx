import { formatDateTime } from '@shared/lib';
import { useLocale, useMoney } from '@shared/hooks';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { BidHistoryItem } from '../types/catalog.types';

export function BidHistoryList({ bids }: { bids: BidHistoryItem[] }) {
  const { t } = useCatalogTranslation();
  const { locale } = useLocale();
  const { money } = useMoney();

  if (bids.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('detail.noBids')}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {bids.map((bid) => (
        <li key={bid.id} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-foreground-soft">{bid.bidder.maskedName}</span>
          <span className="font-medium text-foreground">{money(bid.amount)}</span>
          <span className="text-muted-foreground">{formatDateTime(bid.createdAt, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
