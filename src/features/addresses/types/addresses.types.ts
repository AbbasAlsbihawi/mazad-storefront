import type { z } from 'zod';
import type { addressSchema, addressFormSchema } from '../schemas/addresses.schema';

export type Address = z.infer<typeof addressSchema>;
export type AddressFormValues = z.infer<typeof addressFormSchema>;
