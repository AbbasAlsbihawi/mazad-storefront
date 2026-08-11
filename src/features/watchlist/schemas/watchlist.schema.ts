import { z } from 'zod';

// The marketplace-wide status enum, so a watchlist auction is assignable to AuctionSummary and
// the shared AuctionCard can render it.
const auctionStatusSchema = z.enum([
  'DRAFT',
  'PENDING_APPROVAL',
  'REJECTED',
  'SCHEDULED',
  'LIVE',
  'ENDED',
  'SOLD',
  'UNSOLD',
  'CANCELLED',
]);

export const watchToggleSchema = z.object({
  auctionId: z.string(),
  watching: z.boolean(),
});

// `coverImage` and `bidCount` are optional because mazad-api's watchlist query doesn't select
// them today (its include only pulls product id/names and the seller). The watchlist screen
// renders the same AuctionCard as everywhere else, which degrades to the pastel image well and
// hides the bid row when they're missing — and picks both up with no client change if the API
// starts sending them.
const watchlistAuctionSchema = z.object({
  id: z.string(),
  status: auctionStatusSchema,
  currentPrice: z.string().nullable(),
  startingPrice: z.string(),
  bidCount: z.number().default(0),
  endsAt: z.string(),
  startsAt: z.string(),
  product: z.object({
    id: z.string(),
    nameEn: z.string(),
    nameAr: z.string(),
    coverImage: z.string().nullable().default(null),
  }),
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
