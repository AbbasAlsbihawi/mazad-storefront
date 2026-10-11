import { formatDateTime } from '@shared/lib';
import { useLocale, useMoney } from '@shared/hooks';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { BidHistoryItem } from '../types/catalog.types';

/**
 * Bids as mazad-api orders them (highest, then newest, first). Bidders stay masked; the viewer's
 * own bids read "You", and automatic bids carry a small "Auto" tag.
 */
export function BidHistoryList({ bids }: { bids: BidHistoryItem[] }) {
  const { t } = useCatalogTranslation();
  const { locale } = useLocale();
  const { money } = useMoney();

  if (bids.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('detail.noBids')}</p>;
  }

  return (
    <ul className="flex flex-col gap-2" data-testid="bid-history">
      {bids.map((bid) => (
        <li key={bid.id} className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <span
              className={
                bid.isMine ? 'font-semibold text-foreground' : 'truncate text-foreground-soft'
              }
            >
              {bid.isMine ? t('detail.bidYou') : bid.bidder.maskedName}
            </span>
            {bid.isAutoBid ? (
              <span className="shrink-0 rounded-full bg-fill px-1.5 text-caption-2 font-semibold text-muted-foreground">
                {t('detail.bidAuto')}
              </span>
            ) : null}
          </span>
          <span className="font-medium text-foreground tabular-nums">{money(bid.amount)}</span>
          <span className="text-muted-foreground">{formatDateTime(bid.createdAt, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
