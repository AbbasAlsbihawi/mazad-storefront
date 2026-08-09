import type { z } from 'zod';
import type {
  watchToggleSchema,
  watchlistItemSchema,
  watchlistListSchema,
} from '../schemas/watchlist.schema';

export type WatchToggleResult = z.infer<typeof watchToggleSchema>;
export type WatchlistItem = z.infer<typeof watchlistItemSchema>;
export type WatchlistList = z.infer<typeof watchlistListSchema>;
