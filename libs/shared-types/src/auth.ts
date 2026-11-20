export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
  user: UserProfile;
}

export interface HealthResponse {
  status: 'ok';
  service: 'api-nest' | 'api-python';
  timestamp: string;
}

export interface AdminStatsResponse {
  totalUsers: number;
  adminUsers: number;
  service: 'api-nest' | 'api-python';
  uptimeSeconds: number;
}
