import { AxiosError, AxiosHeaders } from 'axios';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';
import i18n, { addNamespaceBundle } from '@shared/i18n';
import { httpClient, setSessionTokens } from '@shared/api';
import { QUERY_KEYS } from '@shared/constants';
import { useLocaleStore } from '@shared/store';
import { ordersApi } from './api/orders.api';
import { paymentsApi } from './api/payments.api';
import { sellerPaymentLineKey } from './components/OrderPaymentSection';
import { useAdvanceOrder, useReturnAction } from './hooks/useOrderMutations';
import { useOpenSalesCount } from './hooks/useOrders';
import ordersAr from './i18n/ar.json';
import ordersEn from './i18n/en.json';
import { OrderDetailPage, SaleDetailPage } from './pages/OrderDetailPage';
import { OrdersPage, SalesPage } from './pages/OrdersPage';
import { orderSchema } from './schemas/orders.schema';
import type { Order } from './types/orders.types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/account/orders',
}));

const realApi = (await vi.importActual<{ ordersApi: typeof ordersApi }>('./api/orders.api'))
  .ordersApi;
vi.mock('./api/orders.api', () => ({
  ordersApi: {
    list: vi.fn(),
    listSales: vi.fn(),
    salesSummary: vi.fn(),
    get: vi.fn(),
    updateStatus: vi.fn(),
    returnAction: vi.fn(),
  },
}));
vi.mock('./api/payments.api', () => ({
  paymentsApi: { methods: vi.fn(), forOrder: vi.fn(), startSwiftPay: vi.fn(), mine: vi.fn() },
}));
const api = vi.mocked(ordersApi);

function order(extra: Record<string, unknown> = {}): Order {
  return orderSchema.parse({
    id: 'o1',
    orderNumber: 'ORD-2026-AB',
    status: 'CONFIRMED',
    subtotal: '250000.00',
    deliveryFee: '5000.00',
    total: '255000.00',
    shipCity: 'Baghdad',
    shipArea: null,
    shipStreet: null,
    shipDetails: null,
    shipPhone: null,
    note: null,
    cancelReason: null,
    createdAt: '2026-10-01T10:00:00.000Z',
    confirmedAt: null,
    shippedAt: null,
    deliveredAt: null,
    cancelledAt: null,
    items: [
      {
        id: 'i1',
        productId: 'p1',
        finalPrice: '250000.00',
        product: { id: 'p1', nameEn: 'Camera now', nameAr: 'كاميرا الآن' },
        display: { nameEn: 'Camera', nameAr: 'كاميرا', marketPrice: null, condition: null },
        win: null,
        returnRequest: null,
      },
    ],
    store: { id: 's1', nameEn: 'Store', nameAr: 'متجر', city: 'Baghdad' },
    seller: { id: 'u2', fullName: 'Seller', isVerified: true },
    customer: { id: 'u3', fullName: 'Ali Buyer', phone: '+9647700000302' },
    ...extra,
  });
}

const withDisplay = (display: Record<string, unknown>) =>
  order({
    items: [
      {
        id: 'i1',
        productId: 'p1',
        finalPrice: '250000.00',
        product: null,
        display: { nameEn: 'Camera', nameAr: 'كاميرا', ...display },
        win: null,
        returnRequest: null,
      },
    ],
  });

function newClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function wrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    );
  };
}

function renderPage(ui: ReactNode) {
  const Wrapper = wrapper(newClient());
  return render(<Wrapper>{ui}</Wrapper>);
}

function httpError(status: number) {
  const headers = new AxiosHeaders();
  return new AxiosError('x', 'ERR_BAD_REQUEST', { headers }, null, {
    status,
    statusText: 'x',
    headers: {},
    config: { headers },
    data: { statusCode: status, errorCode: 'NOT_FOUND', message: 'x' },
  });
}

async function setLanguage(locale: 'en' | 'ar') {
  useLocaleStore.getState().setLocale(locale);
  await i18n.changeLanguage(locale);
}

beforeAll(async () => {
  addNamespaceBundle('orders', 'en', ordersEn);
  addNamespaceBundle('orders', 'ar', ordersAr);
  await setLanguage('en');
});

beforeEach(() => {
  vi.clearAllMocks();
  setSessionTokens({ accessToken: 'access', refreshToken: 'refresh' });
  vi.mocked(paymentsApi.forOrder).mockResolvedValue({
    orderId: 'o1',
    paidAt: null,
    paidPaymentId: null,
    payments: [],
  });
  vi.mocked(paymentsApi.methods).mockResolvedValue({
    cashOnDelivery: { enabled: true },
    swiftpay: { enabled: false, mode: 'test', currency: 'IQD' },
  });
});

afterEach(async () => {
  setSessionTokens(null);
  vi.restoreAllMocks();
  await setLanguage('en');
});

describe('cash on delivery: what the seller is told', () => {
  it('"collect the total" only while the order is on its way and the cash is not in', () => {
    for (const status of ['CREATED', 'CONFIRMED', 'OUT_FOR_DELIVERY'] as const) {
      expect(sellerPaymentLineKey('unpaid', status)).toBe('payment.seller.cod');
    }
  });

  it('delivered with the cash collected reads as complete, never "collect"', () => {
    expect(sellerPaymentLineKey('paidCash', 'DELIVERED')).toBe('payment.seller.collected');
    expect(sellerPaymentLineKey('unpaid', 'DELIVERED')).not.toBe('payment.seller.cod');
  });

  it('a cancelled order has no collect line at all', () => {
    expect(sellerPaymentLineKey('unpaid', 'CANCELLED')).toBeNull();
    expect(sellerPaymentLineKey('paidCash', 'CANCELLED')).toBeNull();
  });

  it('shows the collected line on a delivered sale, and none on a cancelled one', async () => {
    vi.mocked(paymentsApi.forOrder).mockResolvedValue({
      orderId: 'o1',
      paidAt: '2026-10-02T10:00:00.000Z',
      paidPaymentId: 'cod',
      payments: [
        {
          id: 'cod',
          orderId: 'o1',
          method: 'CASH_ON_DELIVERY',
          status: 'PAID',
          amount: '255000.00',
          currency: 'IQD',
          isLive: false,
          expiresAt: null,
          paidAt: '2026-10-02T10:00:00.000Z',
          failedAt: null,
          refundedAt: null,
          cancelledAt: null,
          createdAt: '2026-10-01T10:00:00.000Z',
          open: false,
        },
      ],
    });
    api.get.mockResolvedValue(order({ status: 'DELIVERED' }));
    renderPage(<SaleDetailPage id="o1" />);
    expect(await screen.findByText(/Cash collected on delivery/)).toBeTruthy();
    expect(screen.queryByText(/collect the total/)).toBeNull();
  });

  it('no payment line on a cancelled sale', async () => {
    api.get.mockResolvedValue(order({ status: 'CANCELLED' }));
    renderPage(<SaleDetailPage id="o1" />);
    await screen.findByText('Camera');
    await waitFor(() => expect(paymentsApi.forOrder).toHaveBeenCalled());
    expect(screen.queryByTestId('order-payment')).toBeNull();
    expect(screen.queryByText(/collect the total/)).toBeNull();
  });

  it('the status and return actions also refresh the order payments', async () => {
    const client = newClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    api.updateStatus.mockResolvedValue(undefined);
    api.returnAction.mockResolvedValue(undefined);
    const advance = renderHook(() => useAdvanceOrder('o1'), { wrapper: wrapper(client) });
    await advance.result.current.mutateAsync({ status: 'DELIVERED', cashReceived: 255000 });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.payments.order('o1') });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.payments.mine });

    invalidate.mockClear();
    const ret = renderHook(() => useReturnAction('o1'), { wrapper: wrapper(client) });
    await ret.result.current.mutateAsync({ returnId: 'r1', action: 'refund' });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.payments.order('o1') });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.payments.mine });
  });
});

describe('retail price at purchase (snapshot only)', () => {
  it('shows the snapshot price and condition on the buyer order and the seller sale', async () => {
    api.get.mockResolvedValue(withDisplay({ marketPrice: '400000.00', condition: 'LIKE_NEW' }));
    const view = renderPage(<OrderDetailPage id="o1" />);
    const facts = await screen.findByTestId('order-item-facts');
    expect(facts.textContent).toMatch(/New retail price at purchase/);
    expect(facts.textContent).toMatch(/400,000/);
    expect(facts.textContent).toMatch(/Condition:\s*Like new/);
    // No savings or discount maths anywhere.
    expect(document.body.textContent).not.toMatch(/sav|discount|%/i);
    view.unmount();

    renderPage(<SaleDetailPage id="o1" />);
    expect((await screen.findByTestId('order-item-market-price')).textContent).toMatch(/400,000/);
  });

  it('nothing when the snapshot has no price (never the current product)', async () => {
    api.get.mockResolvedValue(withDisplay({ marketPrice: null, condition: null }));
    renderPage(<OrderDetailPage id="o1" />);
    await screen.findByText('Camera');
    expect(screen.queryByTestId('order-item-facts')).toBeNull();
  });

  it('reads in Arabic', async () => {
    await setLanguage('ar');
    api.get.mockResolvedValue(withDisplay({ marketPrice: '400000.00', condition: 'USED' }));
    renderPage(<OrderDetailPage id="o1" />);
    const facts = await screen.findByTestId('order-item-facts');
    expect(facts.textContent).toMatch(/سعر المنتج الجديد وقت الشراء/);
    expect(facts.textContent).toMatch(/مستعمل/);
  });
});

describe('delivery phone missing on an older order', () => {
  it('tells the seller, with no call link and not the buyer account phone', async () => {
    api.get.mockResolvedValue(order({ shipPhone: null }));
    renderPage(<SaleDetailPage id="o1" />);
    expect(await screen.findByText('No delivery phone was saved for this order')).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Call the buyer/ })).toBeNull();
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
    expect(screen.queryByText('+9647700000302')).toBeNull();
  });

  it('says nothing about it on the buyer view', async () => {
    api.get.mockResolvedValue(order({ shipPhone: null }));
    renderPage(<OrderDetailPage id="o1" />);
    await screen.findByText('Camera');
    expect(screen.queryByTestId('order-no-delivery-phone')).toBeNull();
  });
});

describe('orders and sales beyond the first 50', () => {
  const page = (count: number, offset = 0) =>
    Array.from({ length: count }, (_, index) =>
      order({ id: `o${offset + index}`, orderNumber: `ORD-${offset + index}` }),
    );

  it('loads the next page of buyer orders on request, and stops at a short page', async () => {
    api.list.mockImplementation(async (pageNumber = 1) =>
      pageNumber === 1 ? page(50) : page(3, 50),
    );
    renderPage(<OrdersPage />);
    await userEvent.click(await screen.findByTestId('orders-load-more'));
    expect(await screen.findByText(/ORD-52/)).toBeTruthy();
    expect(api.list).toHaveBeenLastCalledWith(2);
    expect(screen.queryByTestId('orders-load-more')).toBeNull();
  });

  it('pages the seller sales the same way', async () => {
    api.listSales.mockImplementation(async (pageNumber = 1) =>
      pageNumber === 1 ? page(50) : page(1, 50),
    );
    renderPage(<SalesPage />);
    await userEvent.click(await screen.findByTestId('orders-load-more'));
    expect(await screen.findByText(/ORD-50/)).toBeTruthy();
    expect(api.listSales).toHaveBeenLastCalledWith(2);
  });

  it('offers no "Load more" when everything fits on one page', async () => {
    api.list.mockResolvedValue(page(2));
    renderPage(<OrdersPage />);
    await screen.findByText(/ORD-1/);
    expect(screen.queryByTestId('orders-load-more')).toBeNull();
  });

  it('asks the API for one page at a time', async () => {
    const get = vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] });
    await realApi.list(3);
    expect(get).toHaveBeenCalledWith('/me/orders', { params: { page: 3, limit: 50 } });
    await realApi.listSales(2);
    expect(get).toHaveBeenCalledWith('/me/sales', { params: { page: 2, limit: 50 } });
  });
});

describe('Selling hub: open orders count', () => {
  function count() {
    return renderHook(() => useOpenSalesCount(), { wrapper: wrapper(newClient()) });
  }

  it('uses /me/sales/summary', async () => {
    api.salesSummary.mockResolvedValue({ open: 12 });
    const { result } = count();
    await waitFor(() => expect(result.current).toBe(12));
    expect(api.listSales).not.toHaveBeenCalled();
  });

  it('falls back to counting the first page while the API has no summary (404)', async () => {
    api.salesSummary.mockRejectedValue(httpError(404));
    api.listSales.mockResolvedValue([
      order({ id: 'a', status: 'CREATED' }),
      order({ id: 'b', status: 'DELIVERED' }),
      order({ id: 'c', status: 'OUT_FOR_DELIVERY' }),
    ]);
    const { result } = count();
    await waitFor(() => expect(result.current).toBe(2));
    expect(api.listSales).toHaveBeenCalledTimes(1);
    expect(api.listSales).toHaveBeenCalledWith(1);
  });

  it('calls the documented summary route', async () => {
    const get = vi.spyOn(httpClient, 'get').mockResolvedValue({ data: { open: 3, byStatus: {} } });
    await expect(realApi.salesSummary()).resolves.toMatchObject({ open: 3 });
    expect(get).toHaveBeenCalledWith('/me/sales/summary');
  });
});
