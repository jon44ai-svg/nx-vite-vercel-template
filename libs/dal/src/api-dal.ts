import type {
  AdminStatsResponse,
  AuthResponse,
  HealthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '@nx-vite-vercel/shared-types';

import { FetchHttpClient, type FetchHttpClientConfig } from './http-client';
import type { ApiDal, HttpClient } from './interfaces';

export interface CreateApiDalOptions extends Partial<FetchHttpClientConfig> {
  client?: HttpClient;
}

export function createApiDal(options: CreateApiDalOptions = {}): ApiDal {
  const client =
    options.client ??
    new FetchHttpClient({
      baseUrl: options.baseUrl ?? 'http://localhost:3000',
      getToken: options.getToken,
      fetchImpl: options.fetchImpl,
    });

  return {
    auth: {
      register: (payload: RegisterRequest) =>
        client.request<AuthResponse>('/auth/register', { method: 'POST', body: payload }),
      login: (payload: LoginRequest) =>
        client.request<AuthResponse>('/auth/login', { method: 'POST', body: payload }),
      me: () => client.request<UserProfile>('/auth/me'),
    },
    admin: {
      getStats: () => client.request<AdminStatsResponse>('/admin/stats'),
      listUsers: () => client.request<UserProfile[]>('/admin/users'),
    },
    system: {
      getHealth: () => client.request<HealthResponse>('/health'),
    },
  };
}
