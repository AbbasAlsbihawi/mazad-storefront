import { z } from 'zod';

export const followToggleSchema = z.object({
  sellerId: z.string(),
  following: z.boolean(),
});

export const sellerProfileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  isVerified: z.boolean(),
  memberSince: z.string(),
  followerCount: z.number(),
  rating: z.object({ average: z.number().nullable(), count: z.number() }),
  stores: z.array(
    z.object({
      id: z.string(),
      nameEn: z.string(),
      nameAr: z.string(),
      city: z.string(),
      isDefault: z.boolean(),
    }),
  ),
});

const followingSellerSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  isVerified: z.boolean(),
});

export const followingItemSchema = z.object({
  sellerId: z.string(),
  followedAt: z.string(),
  seller: followingSellerSchema,
});

export const followingMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const followingListSchema = z.object({
  data: z.array(followingItemSchema),
  meta: followingMetaSchema,
});
