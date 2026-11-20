import type {
  AdminStatsResponse,
  AuthResponse,
  HealthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '@nx-vite-vercel/shared-types';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export interface HttpClient {
  request<T>(path: string, options?: HttpRequestOptions): Promise<T>;
}

export interface AuthRepository {
  register(payload: RegisterRequest): Promise<AuthResponse>;
  login(payload: LoginRequest): Promise<AuthResponse>;
  me(): Promise<UserProfile>;
}

export interface AdminRepository {
  getStats(): Promise<AdminStatsResponse>;
  listUsers(): Promise<UserProfile[]>;
}

export interface SystemRepository {
  getHealth(): Promise<HealthResponse>;
}

export interface ApiDal {
  auth: AuthRepository;
  admin: AdminRepository;
  system: SystemRepository;
}
