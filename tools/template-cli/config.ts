export type FeatureKey =
  | 'web'
  | 'pwa'
  | 'tanstackStart'
  | 'expo'
  | 'storybook'
  | 'apiNest'
  | 'apiPython'
  | 'auth'
  | 'admin'
  | 'docker';

export type BackendChoice = 'none' | 'nest' | 'python';

export interface TemplateConfig {
  $schema?: string;
  projectName: string;
  defaultBackend: BackendChoice;
  features: Record<FeatureKey, boolean>;
}

export interface FeatureDefinition {
  key: FeatureKey;
  label: string;
  description: string;
  workspacePath?: string;
  composeProfile?: string;
}

export const FEATURE_DEFINITIONS: readonly FeatureDefinition[] = [
  {
    key: 'web',
    label: 'Vite React Web App',
    description: 'Primary SPA frontend under apps/web',
    workspacePath: 'apps/web',
  },
  {
    key: 'pwa',
    label: 'PWA Support',
    description: 'Installable manifest and service worker via vite-plugin-pwa',
  },
  {
    key: 'tanstackStart',
    label: 'TanStack Start Frontend',
    description: 'Optional SSR/full-stack React starter under apps/web-tanstack',
    workspacePath: 'apps/web-tanstack',
    composeProfile: 'tanstack',
  },
  {
    key: 'expo',
    label: 'Expo Mobile Frontend',
    description: 'Optional React Native / Expo starter under apps/mobile-expo',
    workspacePath: 'apps/mobile-expo',
  },
  {
    key: 'storybook',
    label: 'Storybook UI Workshop',
    description: 'Interactive component docs for libs/ui under .storybook',
  },
  {
    key: 'apiNest',
    label: 'NestJS Backend (TypeORM)',
    description: 'TypeScript API with TypeORM, Pino logging, JWT auth, and Swagger',
    workspacePath: 'apps/api-nest',
    composeProfile: 'nest',
  },
  {
    key: 'apiPython',
    label: 'Python FastAPI Backend (uv)',
    description: 'FastAPI service managed with uv, SQLAlchemy, structlog, and JWT auth',
    composeProfile: 'python',
  },
  {
    key: 'auth',
    label: 'Password + JWT Authentication',
    description: 'Login/register flow and bearer token guards across enabled backends',
  },
  {
    key: 'admin',
    label: 'Admin Panel & Changelog UI',
    description: 'Mobile-friendly admin dashboard, user management, and release changelog view',
  },
  {
    key: 'docker',
    label: 'Docker & Compose Profiles',
    description: 'Dockerfiles and profiled docker-compose.yml for enabled services',
  },
];

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  $schema: './tools/template-cli/template.config.schema.json',
  projectName: 'nx-vite-vercel-template',
  defaultBackend: 'nest',
  features: {
    web: true,
    pwa: true,
    tanstackStart: false,
    expo: false,
    storybook: true,
    apiNest: false,
    apiPython: false,
    auth: true,
    admin: true,
    docker: true,
  },
};

export function resolveActiveWorkspaces(features: Record<FeatureKey, boolean>): string[] {
  const workspaces = ['libs/*'];
  if (features.web) workspaces.push('apps/web');
  if (features.apiNest) workspaces.push('apps/api-nest');
  if (features.tanstackStart) workspaces.push('apps/web-tanstack');
  if (features.expo) workspaces.push('apps/mobile-expo');
  return workspaces;
}

export function resolveComposeProfiles(features: Record<FeatureKey, boolean>): string[] {
  const profiles: string[] = [];
  if (features.apiNest) profiles.push('nest');
  if (features.apiPython) profiles.push('python');
  if (features.tanstackStart) profiles.push('tanstack');
  return profiles;
}

export function resolveDefaultBackend(features: Record<FeatureKey, boolean>): BackendChoice {
  if (features.apiNest) return 'nest';
  if (features.apiPython) return 'python';
  return 'none';
}
