import { z } from 'zod';

export const watchToggleSchema = z.object({
  auctionId: z.string(),
  watching: z.boolean(),
});

const watchlistAuctionSchema = z.object({
  id: z.string(),
  status: z.string(),
  currentPrice: z.string().nullable(),
  startingPrice: z.string(),
  endsAt: z.string(),
  startsAt: z.string(),
  product: z.object({ id: z.string(), nameEn: z.string(), nameAr: z.string() }),
  seller: z.object({ id: z.string(), fullName: z.string(), isVerified: z.boolean() }),
});

export const watchlistItemSchema = z.object({
  auctionId: z.string(),
  addedAt: z.string(),
  auction: watchlistAuctionSchema,
});

export const watchlistMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const watchlistListSchema = z.object({
  data: z.array(watchlistItemSchema),
  meta: watchlistMetaSchema,
});
