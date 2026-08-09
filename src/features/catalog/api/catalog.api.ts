import { z } from 'zod';
import { httpClient } from '@shared/api';
import {
  categoryNodeSchema,
  auctionSchema,
  auctionListSchema,
  bidHistorySchema,
  storePageSchema,
} from '../schemas/catalog.schema';
import type {
  AuctionListParams,
  CategoryNode,
  Auction,
  AuctionList,
  BidHistoryItem,
  StorePage,
} from '../types/catalog.types';

export const catalogApi = {
  getCategories: async (): Promise<CategoryNode[]> => {
    const response = await httpClient.get<unknown>('/categories');
    return z.array(categoryNodeSchema).parse(response.data);
  },

  listAuctions: async (params: AuctionListParams): Promise<AuctionList> => {
    const response = await httpClient.get<unknown>('/auctions', { params });
    return auctionListSchema.parse(response.data);
  },

  getAuction: async (id: string): Promise<Auction> => {
    const response = await httpClient.get<unknown>(`/auctions/${id}`);
    return auctionSchema.parse(response.data);
  },

  getSimilarAuctions: async (id: string): Promise<Auction[]> => {
    const response = await httpClient.get<unknown>(`/auctions/${id}/similar`);
    return z.array(auctionSchema).parse(response.data);
  },

  getAuctionBids: async (id: string): Promise<BidHistoryItem[]> => {
    const response = await httpClient.get<unknown>(`/auctions/${id}/bids`);
    return bidHistorySchema.parse(response.data);
  },

  getStore: async (id: string): Promise<StorePage> => {
    const response = await httpClient.get<unknown>(`/stores/${id}`);
    return storePageSchema.parse(response.data);
  },
};
