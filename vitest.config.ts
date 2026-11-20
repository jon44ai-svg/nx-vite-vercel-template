import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

const rootDir = import.meta.dirname;

export default defineConfig({
  define: {
    __TEMPLATE_FEATURES__: JSON.stringify({
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
    }),
  },
  resolve: {
    alias: {
      '@nx-vite-vercel/shared-types': resolve(rootDir, 'libs/shared-types/src/index.ts'),
      '@nx-vite-vercel/dal': resolve(rootDir, 'libs/dal/src/index.ts'),
      '@nx-vite-vercel/ui/tokens.css': resolve(rootDir, 'libs/ui/src/tokens.css'),
      '@nx-vite-vercel/ui': resolve(rootDir, 'libs/ui/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './apps/web/src/test-setup.ts',
    include: ['apps/web/src/**/*.test.{ts,tsx}', 'libs/**/*.test.{ts,tsx}'],
  },
});
