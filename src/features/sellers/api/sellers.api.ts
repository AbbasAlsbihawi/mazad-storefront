import { httpClient } from '@shared/api';
import {
  followToggleSchema,
  sellerProfileSchema,
  followingListSchema,
} from '../schemas/sellers.schema';
import type { FollowToggleResult, SellerProfile, FollowingList } from '../types/sellers.types';

// No per-seller "am I following" lookup exists on mazad-api — callers scan this generously
// limited list instead (see FollowSellerButton), same approach as watchlist.
const FOLLOWING_SCAN_LIMIT = 100;

export const sellersApi = {
  getProfile: async (sellerId: string): Promise<SellerProfile> => {
    const response = await httpClient.get<unknown>(`/sellers/${sellerId}`);
    return sellerProfileSchema.parse(response.data);
  },

  follow: async (sellerId: string): Promise<FollowToggleResult> => {
    const response = await httpClient.post<unknown>(`/sellers/${sellerId}/follow`);
    return followToggleSchema.parse(response.data);
  },

  unfollow: async (sellerId: string): Promise<FollowToggleResult> => {
    const response = await httpClient.delete<unknown>(`/sellers/${sellerId}/follow`);
    return followToggleSchema.parse(response.data);
  },

  listFollowing: async (): Promise<FollowingList> => {
    const response = await httpClient.get<unknown>('/me/following', {
      params: { limit: FOLLOWING_SCAN_LIMIT },
    });
    return followingListSchema.parse(response.data);
  },
};
