import type { z } from 'zod';
import type {
  followToggleSchema,
  sellerProfileSchema,
  followingItemSchema,
  followingListSchema,
} from '../schemas/sellers.schema';

export type FollowToggleResult = z.infer<typeof followToggleSchema>;
export type SellerProfile = z.infer<typeof sellerProfileSchema>;
export type FollowingItem = z.infer<typeof followingItemSchema>;
export type FollowingList = z.infer<typeof followingListSchema>;
