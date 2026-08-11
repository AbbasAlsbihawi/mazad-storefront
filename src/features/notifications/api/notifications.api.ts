import { httpClient } from '@shared/api';
import { notificationsListSchema, unreadCountSchema } from '../schemas/notifications.schema';
import type { NotificationsList } from '../types/notifications.types';

export const notificationsApi = {
  list: async (): Promise<NotificationsList> => {
    const response = await httpClient.get<unknown>('/me/notifications', {
      params: { limit: 50 },
    });
    return notificationsListSchema.parse(response.data);
  },

  unreadCount: async (): Promise<number> => {
    const response = await httpClient.get<unknown>('/me/notifications/unread-count');
    return unreadCountSchema.parse(response.data).count;
  },

  markRead: async (id: string): Promise<void> => {
    await httpClient.post(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await httpClient.post('/notifications/read-all');
  },
};
