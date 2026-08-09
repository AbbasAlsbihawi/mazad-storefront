import { httpClient } from '@shared/api';
import { authResponseSchema, authUserSchema } from '../schemas/auth.schema';
import type { AuthResponse, AuthUser, LoginValues, RegisterValues } from '../types/auth.types';

export const authApi = {
  register: async (values: RegisterValues): Promise<AuthResponse> => {
    const response = await httpClient.post<unknown>('/auth/register', {
      ...values,
      platform: 'web',
    });
    return authResponseSchema.parse(response.data);
  },

  login: async (values: LoginValues): Promise<AuthResponse> => {
    const response = await httpClient.post<unknown>('/auth/login', { ...values, platform: 'web' });
    return authResponseSchema.parse(response.data);
  },

  logout: async (): Promise<void> => {
    await httpClient.post('/auth/logout');
  },

  me: async (): Promise<AuthUser> => {
    const response = await httpClient.get<unknown>('/me');
    return authUserSchema.parse(response.data);
  },
};
