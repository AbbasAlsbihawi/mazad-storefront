import { z } from 'zod';
import { resolveAssetUrl } from '@shared/lib';

// /homepage only ever returns LIVE (live/endingSoon) or SCHEDULED (upcoming) auctions.
const homeAuctionStatusSchema = z.enum(['LIVE', 'SCHEDULED']);

// Unlike /auctions, /homepage already picks a single coverImage — just needs URL resolution
// (see shared/lib/asset.ts).
const homeProductSchema = z
  .object({
    id: z.string(),
    nameEn: z.string(),
    nameAr: z.string(),
    coverImage: z.string().nullable(),
  })
  .transform((product) => ({ ...product, coverImage: resolveAssetUrl(product.coverImage) }));

const homeSellerSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  isVerified: z.boolean(),
});

const homeStoreSchema = z.object({
  id: z.string(),
  nameEn: z.string(),
  nameAr: z.string(),
  city: z.string(),
});

const homeAuctionSchema = z.object({
  id: z.string(),
  status: homeAuctionStatusSchema,
  startingPrice: z.string(),
  currentPrice: z.string().nullable(),
  bidCount: z.number(),
  startsAt: z.string(),
  endsAt: z.string(),
  product: homeProductSchema,
  seller: homeSellerSchema,
  store: homeStoreSchema,
});

export const homeFeedSchema = z.object({
  live: z.array(homeAuctionSchema),
  upcoming: z.array(homeAuctionSchema),
  endingSoon: z.array(homeAuctionSchema),
  serverTime: z.string(),
});
