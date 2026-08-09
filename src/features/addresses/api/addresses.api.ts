import { httpClient } from '@shared/api';
import { addressSchema, addressListSchema } from '../schemas/addresses.schema';
import type { Address, AddressFormValues } from '../types/addresses.types';

export const addressesApi = {
  list: async (): Promise<Address[]> => {
    const response = await httpClient.get<unknown>('/me/addresses');
    return addressListSchema.parse(response.data);
  },

  create: async (values: AddressFormValues): Promise<Address> => {
    const response = await httpClient.post<unknown>('/me/addresses', values);
    return addressSchema.parse(response.data);
  },

  update: async (id: string, values: AddressFormValues): Promise<Address> => {
    const response = await httpClient.patch<unknown>(`/me/addresses/${id}`, values);
    return addressSchema.parse(response.data);
  },

  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/me/addresses/${id}`);
  },
};
