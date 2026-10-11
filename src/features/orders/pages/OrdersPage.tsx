'use client';

import Link from 'next/link';
import { ROUTES } from '@shared/constants';
import { EmptyState, ErrorState, PageLoader } from '@shared/components/feedback';
import { ScreenHeader } from '@shared/components/layout';
import { Badge, Card, Skeleton } from '@shared/components/ui';
import { useLocale, useMoney } from '@shared/hooks';
import { formatDate } from '@shared/lib';
import { OrderItemImage } from '../components/OrderItemImage';
import { useOrders, useSales } from '../hooks/useOrders';
import { useOrderPaymentLabel } from '../hooks/useOrderPaymentLabel';
import { useOrdersTranslation } from '../hooks/useOrdersTranslation';
import { orderItemImage, orderItemName, orderStoreName } from '../lib/order-display';
import type { Order, OrderStatus } from '../types/orders.types';

const STATUS_TONE: Record<OrderStatus, 'live' | 'upcoming' | 'warning' | 'neutral'> = {
  CREATED: 'upcoming',
  CONFIRMED: 'upcoming',
  OUT_FOR_DELIVERY: 'warning',
  DELIVERED: 'live',
  CANCELLED: 'neutral',
};

export type OrdersMode = 'buyer' | 'seller';

/**
 * The buyer's orders, or (mode "seller", the Selling hub's "Orders received") the orders other
 * people placed on the seller's auctions: GET /me/sales, same rows with the buyer's name.
 */
export function OrdersPage({ mode = 'buyer' }: { mode?: OrdersMode }) {
  const { t, isReady } = useOrdersTranslation();
  const isSeller = mode === 'seller';
  // Only the list on screen is fetched.
  const buyerOrders = useOrders(!isSeller);
  const sales = useSales(isSeller);
  const orders = isSeller ? sales : buyerOrders;

  if (!isReady) return <PageLoader />;

  return (
    <>
      <ScreenHeader
        title={t(isSeller ? 'sales.title' : 'page.title')}
        backHref={isSeller ? ROUTES.selling : ROUTES.account}
      />

      <div className="flex flex-col gap-3 px-gutter pb-6">
        {orders.isPending ? (
          Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} radius="lg" className="h-24 w-full" />
          ))
        ) : orders.isError ? (
          <ErrorState onRetry={() => void orders.refetch()} />
        ) : orders.data.length === 0 ? (
          isSeller ? (
            <EmptyState icon="package" title={t('sales.emptyTitle')} message={t('sales.empty')} />
          ) : (
            <EmptyState icon="package" title={t('page.emptyTitle')} message={t('page.empty')} />
          )
        ) : (
          orders.data.map((order) => <OrderRow key={order.id} order={order} mode={mode} />)
        )}
      </div>
    </>
  );
}

/** Seller route: the received orders. */
export function SalesPage() {
  return <OrdersPage mode="seller" />;
}

/**
 * One order in the list: the (first) product's photo and name as bought, the order number and
 * date, the buyer (seller view) or store, item price and delivery, how it is paid, and the total.
 */
function OrderRow({ order, mode }: { order: Order; mode: OrdersMode }) {
  const { t } = useOrdersTranslation();
  const { locale } = useLocale();
  const { money } = useMoney();
  const payment = useOrderPaymentLabel(order);
  const isSeller = mode === 'seller';
  const [first] = order.items;
  const name = first ? orderItemName(first, locale) : '—';
  const more = order.items.length - 1;
  const itemPrice = more > 0 ? order.subtotal : (first?.display?.finalPrice ?? first?.finalPrice);

  return (
    <Link href={isSeller ? ROUTES.saleDetail(order.id) : ROUTES.orderDetail(order.id)}>
      <Card
        isInset
        className="flex gap-3 transition-transform duration-fast ease-ios active:scale-[0.985]"
      >
        <OrderItemImage
          src={first ? orderItemImage(first, 'thumb') : null}
          alt={name}
          sizePx={64}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <span
              className="min-w-0 truncate text-subhead font-semibold text-foreground"
              data-testid="order-row-name"
            >
              {name}
              {more > 0 ? ` ${t('list.more', { count: more })}` : null}
            </span>
            <Badge tone={STATUS_TONE[order.status]} hasDot={order.status === 'OUT_FOR_DELIVERY'}>
              {t(`status.${order.status}`)}
            </Badge>
          </div>

          <span className="truncate text-caption text-muted-foreground">
            {order.orderNumber} · {formatDate(order.createdAt, locale)}
          </span>
          <span className="truncate text-footnote text-foreground-soft">
            {isSeller
              ? `${t('sales.buyer')}: ${order.customer?.fullName ?? '—'}`
              : orderStoreName(order, locale)}
          </span>
          <span className="text-caption text-muted-foreground tabular-nums">
            {t(more > 0 ? 'list.itemsAndDelivery' : 'list.itemAndDelivery', {
              item: money(itemPrice),
              delivery: money(order.deliveryFee),
            })}
          </span>

          <div className="flex items-center justify-between gap-3">
            <span
              className="truncate text-caption text-muted-foreground"
              data-testid="order-row-payment"
            >
              {payment?.method ?? null}
            </span>
            <span className="text-callout font-bold text-foreground tabular-nums">
              {money(order.total)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
