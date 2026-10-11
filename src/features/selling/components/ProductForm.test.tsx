import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { addNamespaceBundle } from '@shared/i18n';
import { useLocaleStore } from '@shared/store';
import { renderWithQuery } from '@/test/render';
import { sellingApi } from '../api/selling.api';
import sellingAr from '../i18n/ar.json';
import sellingEn from '../i18n/en.json';
import type { SellerProduct, Store } from '../types/selling.types';
import { ProductForm } from './ProductForm';

vi.mock('../api/selling.api', () => ({
  sellingApi: { createProduct: vi.fn(), updateProduct: vi.fn() },
}));

const store: Store = {
  id: 'st1',
  nameEn: 'Ali Store',
  nameAr: 'متجر علي',
  city: 'Baghdad',
  area: null,
  street: null,
  details: null,
  contactPhone: null,
  deliveryFee: '5000.00',
  isDefault: true,
};

async function setLanguage(locale: 'en' | 'ar') {
  useLocaleStore.getState().setLocale(locale);
  await i18n.changeLanguage(locale);
}

function renderForm() {
  renderWithQuery(
    <ProductForm
      stores={[store]}
      categories={[{ id: 'c1', name: 'Cameras', isLeaf: true }]}
      onDone={vi.fn()}
      onCancel={vi.fn()}
    />,
  );
}

/** The required fields, so only the market price decides whether the form submits. */
async function fillRequired() {
  await userEvent.selectOptions(screen.getByLabelText('Category'), 'c1');
  await userEvent.type(screen.getByLabelText('Name (English)'), 'Camera');
  await userEvent.type(screen.getByLabelText('Description (English)'), 'Works.');
}

const marketPrice = () => screen.getByLabelText('New retail price');

beforeAll(async () => {
  addNamespaceBundle('selling', 'en', sellingEn);
  addNamespaceBundle('selling', 'ar', sellingAr);
  await setLanguage('en');
});

beforeEach(() => {
  vi.mocked(sellingApi.createProduct)
    .mockReset()
    .mockResolvedValue({ id: 'p1' } as SellerProduct);
});

afterEach(async () => {
  await setLanguage('en');
});

describe('ProductForm: new retail price', () => {
  it('is labelled and explained, with the IQD suffix', () => {
    renderForm();
    expect(marketPrice()).toBeTruthy();
    expect(
      screen.getByText(
        'Optional — helps buyers compare the auction price with the price of a new item.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('IQD')).toBeTruthy();
    expect(screen.queryByText(/original price/i)).toBeNull();
  });

  it('groups the digits as they are typed and sends whole dinars', async () => {
    renderForm();
    await fillRequired();
    await userEvent.type(marketPrice(), '1250000');
    expect(marketPrice()).toHaveValue('1,250,000');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(sellingApi.createProduct).toHaveBeenCalled());
    expect(vi.mocked(sellingApi.createProduct).mock.calls[0]![0]).toMatchObject({
      marketPrice: 1_250_000,
    });
  });

  it('refuses decimals with a clear message and sends nothing', async () => {
    renderForm();
    await fillRequired();
    await userEvent.type(marketPrice(), '1250.5');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(await screen.findByText('Use whole dinars (no fractions).')).toBeTruthy();
    expect(sellingApi.createProduct).not.toHaveBeenCalled();
  });

  it('refuses text that is not a number', async () => {
    renderForm();
    await fillRequired();
    await userEvent.type(marketPrice(), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(await screen.findByText('Enter the price as a whole number of dinars.')).toBeTruthy();
    expect(sellingApi.createProduct).not.toHaveBeenCalled();
  });

  it('is optional: empty sends no market price at all', async () => {
    renderForm();
    await fillRequired();
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(sellingApi.createProduct).toHaveBeenCalled());
    expect(vi.mocked(sellingApi.createProduct).mock.calls[0]![0].marketPrice).toBeUndefined();
  });

  it('in Arabic: label, helper and suffix', async () => {
    await setLanguage('ar');
    renderForm();
    expect(screen.getByLabelText('سعر المنتج الجديد في السوق')).toBeTruthy();
    expect(
      screen.getByText('اختياري — يساعد المشتري على مقارنة سعر المزاد بسعر المنتج الجديد.'),
    ).toBeTruthy();
    expect(screen.getByText('د.ع')).toBeTruthy();
  });
});
