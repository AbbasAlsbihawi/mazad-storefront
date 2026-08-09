import { z } from 'zod';

export const addressSchema = z.object({
  id: z.string(),
  label: z.string(),
  city: z.string(),
  area: z.string().nullable(),
  street: z.string().nullable(),
  details: z.string().nullable(),
  contactPhone: z.string().nullable(),
  isDefault: z.boolean(),
  createdAt: z.string(),
});

export const addressListSchema = z.array(addressSchema);

// Mirrors mazad-api's CreateAddressDto/UpdateAddressDto exactly — PATCH /me/addresses/:id 400s
// if label/city are omitted despite being an "update," so create and edit share this schema
// unmodified rather than a `.partial()` variant for edit.
export const addressFormSchema = z.object({
  label: z.string().trim().min(1, 'errors.field.labelRequired'),
  city: z.string().trim().min(1, 'errors.field.cityRequired'),
  area: z.string().trim().optional(),
  street: z.string().trim().optional(),
  details: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  isDefault: z.boolean().optional(),
});
