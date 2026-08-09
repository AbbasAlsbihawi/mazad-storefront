import type { z } from 'zod';
import type { homeFeedSchema } from '../schemas/home.schema';

export type HomeFeed = z.infer<typeof homeFeedSchema>;
