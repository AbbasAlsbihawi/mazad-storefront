import type { z } from 'zod';
import type {
  orderSchema,
  orderStatusSchema,
  ordersListSchema,
  returnStatusSchema,
} from '../schemas/orders.schema';

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type ReturnStatus = z.infer<typeof returnStatusSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrdersList = z.infer<typeof ordersListSchema>;
