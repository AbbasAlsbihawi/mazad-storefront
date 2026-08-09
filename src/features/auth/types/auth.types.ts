import type { z } from 'zod';
import type {
  loginSchema,
  registerSchema,
  authUserSchema,
  authTokensSchema,
  authResponseSchema,
} from '../schemas/auth.schema';

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
