import { httpClient } from '@shared/api';
import { winsListSchema } from '../schemas/wins.schema';
import type { ConfirmWinsInput, WinsList } from '../types/wins.types';

export const winsApi = {
  list: async (): Promise<WinsList> => {
    const response = await httpClient.get<unknown>('/me/wins');
    return winsListSchema.parse(response.data);
  },

  /**
   * Confirms one or more wins against a delivery address. mazad-api groups the confirmed wins
   * into one order *per store*, transactionally — so this is deliberately a batch call rather
   * than one request per win.
   */
  confirm: async (input: ConfirmWinsInput): Promise<void> => {
    await httpClient.post('/wins/confirm', input);
  },

  decline: async (winId: string): Promise<void> => {
    await httpClient.post(`/wins/${winId}/decline`);
  },
};
