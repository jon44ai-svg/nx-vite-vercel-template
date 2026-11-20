import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const config: StorybookConfig = {
  stories: ['../libs/ui/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string>),
      '@nx-vite-vercel/shared-types': resolve(rootDir, 'libs/shared-types/src/index.ts'),
      '@nx-vite-vercel/dal': resolve(rootDir, 'libs/dal/src/index.ts'),
      '@nx-vite-vercel/ui': resolve(rootDir, 'libs/ui/src/index.ts'),
    };
    return viteConfig;
  },
};

export default config;
