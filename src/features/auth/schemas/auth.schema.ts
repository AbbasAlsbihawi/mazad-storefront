import { z } from 'zod';

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{10,15}$/, 'errors.field.phoneInvalid');

const passwordSchema = z.string().min(8, 'errors.field.passwordMin');

export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  phone: phoneSchema,
  fullName: z.string().trim().min(2, 'errors.field.fullNameMin'),
  password: passwordSchema,
});

// mazad-api's sanitizeUser() returns the full User row minus passwordHash; only the fields the
// UI actually renders are modeled here — Zod silently drops the rest (banReason, timestamps, ...).
export const authUserSchema = z.object({
  id: z.string(),
  role: z.enum(['CUSTOMER', 'ADMIN']),
  phone: z.string().nullable(),
  fullName: z.string(),
  isVerified: z.boolean(),
});

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  sessionId: z.string(),
});

export const authResponseSchema = authTokensSchema.extend({
  user: authUserSchema,
});
