import { AxiosError, AxiosHeaders } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { httpClient } from './http-client';
import { isMissingEndpoint, probeApiFeature } from './feature-probe';

function httpError(status: number) {
  return new AxiosError('failed', undefined, undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: {},
  });
}

describe('probeApiFeature', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is available when the route answers', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: { items: [] } });
    await expect(probeApiFeature('stores')).resolves.toBe(true);
  });

  it('is available when the route exists but needs a session', async () => {
    vi.spyOn(httpClient, 'get').mockRejectedValue(httpError(401));
    await expect(probeApiFeature('supportReports')).resolves.toBe(true);
  });

  it('is hidden when the API does not have the route yet (404)', async () => {
    vi.spyOn(httpClient, 'get').mockRejectedValue(httpError(404));
    await expect(probeApiFeature('stores')).resolves.toBe(false);
  });

  it('is hidden when the API cannot be reached', async () => {
    vi.spyOn(httpClient, 'get').mockRejectedValue(new Error('Network Error'));
    await expect(probeApiFeature('stores')).resolves.toBe(false);
  });
});

describe('isMissingEndpoint', () => {
  it('reads only a 404 as a missing route', () => {
    expect(isMissingEndpoint(httpError(404))).toBe(true);
    expect(isMissingEndpoint(httpError(500))).toBe(false);
    expect(isMissingEndpoint(new Error('x'))).toBe(false);
  });
});
