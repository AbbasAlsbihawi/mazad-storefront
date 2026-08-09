import type { z } from 'zod';
import type {
  bidStandingSchema,
  bidResponseSchema,
  autoBidResponseSchema,
  autoBidCancelResponseSchema,
  auctionPricingSchema,
  myBidItemSchema,
  myBidsListSchema,
  placeBidFormSchema,
  autoBidFormSchema,
} from '../schemas/bidding.schema';

export type BidStanding = z.infer<typeof bidStandingSchema>;
export type BidResponse = z.infer<typeof bidResponseSchema>;
export type AutoBidResponse = z.infer<typeof autoBidResponseSchema>;
export type AutoBidCancelResponse = z.infer<typeof autoBidCancelResponseSchema>;
export type AuctionPricing = z.infer<typeof auctionPricingSchema>;
export type MyBidItem = z.infer<typeof myBidItemSchema>;
export type MyBidsList = z.infer<typeof myBidsListSchema>;
export type PlaceBidFormValues = z.infer<typeof placeBidFormSchema>;
export type AutoBidFormValues = z.infer<typeof autoBidFormSchema>;

export interface MyBidsParams {
  standing?: BidStanding;
  page?: number;
  limit?: number;
}
