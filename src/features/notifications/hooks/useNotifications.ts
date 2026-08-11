'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useIsAuthenticated } from '@shared/hooks';
import { notificationsApi } from '../api/notifications.api';

export function useNotifications() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: QUERY_KEYS.notifications.list,
    queryFn: notificationsApi.list,
    enabled: isAuthenticated,
  });
}

/**
 * Backs the badge on the nav-bar bell. Polls on an interval because mazad-api pushes these over
 * its WebSocket gateway, which this client doesn't yet connect to — a minute's latency on a
 * badge is acceptable; a socket would replace the interval, not the query.
 */
export function useUnreadNotificationCount() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    queryFn: notificationsApi.unreadCount,
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.list });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.list });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
}
