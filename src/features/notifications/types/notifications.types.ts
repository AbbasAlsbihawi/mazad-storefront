import type { z } from 'zod';
import type {
  notificationSchema,
  notificationTypeSchema,
  notificationsListSchema,
} from '../schemas/notifications.schema';

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationsList = z.infer<typeof notificationsListSchema>;
