'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { sellingApi } from '../api/selling.api';
import { useSellingTranslation } from './useSellingTranslation';
import type { AuctionFormValues } from '../types/selling.types';

export function useSellerAuctions() {
  return useQuery({
    queryKey: QUERY_KEYS.selling.auctions,
    queryFn: sellingApi.listAuctions,
  });
}

export function useCreateAuction() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useSellingTranslation();

  return useMutation({
    mutationFn: (values: AuctionFormValues) => sellingApi.createAuction(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.selling.auctions });
      toast.success(t('toast.auctionCreated'));
    },
  });
}

export function useUpdateAuction() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useSellingTranslation();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: AuctionFormValues }) =>
      sellingApi.updateAuction(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.selling.auctions });
      toast.success(t('toast.auctionUpdated'));
    },
  });
}

export function useSubmitAuction() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useSellingTranslation();

  return useMutation({
    mutationFn: (id: string) => sellingApi.submitAuction(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.selling.auctions });
      toast.success(t('toast.auctionSubmitted'));
    },
  });
}

export function useCancelAuction() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useSellingTranslation();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      sellingApi.cancelAuction(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.selling.auctions });
      // Cancelling frees the product to be auctioned again, which the product list reflects.
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.selling.products });
      toast.success(t('toast.auctionCancelled'));
    },
  });
}
