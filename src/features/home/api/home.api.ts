import { httpClient } from '@shared/api';
import { homeFeedSchema } from '../schemas/home.schema';
import type { HomeFeed } from '../types/home.types';

export const homeApi = {
  getFeed: async (): Promise<HomeFeed> => {
    const response = await httpClient.get<unknown>('/homepage');
    return homeFeedSchema.parse(response.data);
  },
};
