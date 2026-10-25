import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { httpClient, setSessionTokens } from '@shared/api';
import { QUERY_KEYS } from '@shared/constants';
import { useLocaleStore } from '@shared/store';
import { authApi } from '../api/auth.api';
import type { AuthUser } from '../types/auth.types';
import { useLocaleSync } from './useLocaleSync';

const user = (locale: string | null | undefined): AuthUser => ({
  id: 'u1',
  role: 'CUSTOMER',
  phone: '+9647700000001',
  fullName: 'Ali',
  isVerified: true,
  locale,
});

function setup(me: AuthUser) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  vi.spyOn(authApi, 'me').mockResolvedValue(me);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  renderHook(() => useLocaleSync(), { wrapper });
  return client;
}

beforeEach(() => {
  setSessionTokens({ accessToken: 'access', refreshToken: 'refresh' });
  useLocaleStore.getState().setLocale('ar');
});

afterEach(() => {
  setSessionTokens(null);
  vi.restoreAllMocks();
  useLocaleStore.getState().setLocale('ar');
});

describe('useLocaleSync (PATCH /me { locale })', () => {
  it('after sign-in, sends the app language once when the server has another', async () => {
    const patch = vi.spyOn(authApi, 'updateLocale').mockResolvedValue();
    const client = setup(user('en'));
    await waitFor(() => expect(patch).toHaveBeenCalledWith('ar'));
    await waitFor(() =>
      expect(client.getQueryData<AuthUser>(QUERY_KEYS.auth.me)?.locale).toBe('ar'),
    );
    expect(patch).toHaveBeenCalledTimes(1);
  });

  it('sends nothing when they already agree', async () => {
    const patch = vi.spyOn(authApi, 'updateLocale').mockResolvedValue();
    const client = setup(user('ar'));
    await waitFor(() => expect(client.getQueryData(QUERY_KEYS.auth.me)).toBeTruthy());
    expect(patch).not.toHaveBeenCalled();
  });

  it('follows a language switch, without holding it up', async () => {
    let resolve: () => void = () => {};
    const patch = vi
      .spyOn(authApi, 'updateLocale')
      .mockImplementation(() => new Promise<void>((done) => (resolve = done)));
    const client = setup(user('ar'));
    await waitFor(() => expect(client.getQueryData(QUERY_KEYS.auth.me)).toBeTruthy());

    act(() => useLocaleStore.getState().setLocale('en'));
    // The switch is immediate; the call is still in flight.
    expect(useLocaleStore.getState().locale).toBe('en');
    await waitFor(() => expect(patch).toHaveBeenCalledWith('en'));
    await act(async () => resolve());
  });

  it('a failed call (older API) neither reverts the language nor retries in a loop', async () => {
    const patch = vi.spyOn(authApi, 'updateLocale').mockRejectedValue(new Error('400'));
    setup(user('en'));
    await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
    await new Promise((done) => setTimeout(done, 20));
    expect(patch).toHaveBeenCalledTimes(1);
    expect(useLocaleStore.getState().locale).toBe('ar');
  });

  it('leaves an older API that sends no locale alone', async () => {
    const patch = vi.spyOn(authApi, 'updateLocale').mockResolvedValue();
    const client = setup(user(undefined));
    await waitFor(() => expect(client.getQueryData(QUERY_KEYS.auth.me)).toBeTruthy());
    expect(patch).not.toHaveBeenCalled();
  });

  it('calls the documented route', async () => {
    const patch = vi.spyOn(httpClient, 'patch').mockResolvedValue({ data: {} });
    await authApi.updateLocale('en');
    expect(patch).toHaveBeenCalledWith('/me', { locale: 'en' });
  });
});
