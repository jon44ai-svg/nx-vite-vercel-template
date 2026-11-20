import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_PATH: z.string().min(1).default(':memory:'),
  JWT_SECRET: z.string().min(16).default('dev-only-jwt-secret-change-me-please'),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(3600),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().min(8).default('Admin123!'),
  ADMIN_NAME: z.string().min(1).default('Template Admin'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(rawEnv: Record<string, unknown>): AppEnv {
  return envSchema.parse(rawEnv);
}
