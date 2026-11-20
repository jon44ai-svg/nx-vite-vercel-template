/// <reference types="vitest/config" />

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

interface RawTemplateConfig {
  features?: {
    web?: boolean;
    pwa?: boolean;
    tanstackStart?: boolean;
    expo?: boolean;
    storybook?: boolean;
    apiNest?: boolean;
    apiPython?: boolean;
    auth?: boolean;
    admin?: boolean;
    docker?: boolean;
  };
}

const rootDir = resolve(import.meta.dirname, '../..');

function loadTemplateFeatures() {
  const defaults = {
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
  };

  for (const candidate of [
    resolve(rootDir, '.template/features.json'),
    resolve(rootDir, 'template.config.json'),
  ]) {
    if (existsSync(candidate)) {
      const parsed = JSON.parse(readFileSync(candidate, 'utf8')) as RawTemplateConfig;
      return { ...defaults, ...(parsed.features ?? {}) };
    }
  }

  return defaults;
}

const features = loadTemplateFeatures();
const enablePwa =
  process.env.ENABLE_PWA !== undefined ? process.env.ENABLE_PWA === 'true' : features.pwa;

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  define: {
    __TEMPLATE_FEATURES__: JSON.stringify(features),
  },
  resolve: {
    alias: {
      '@nx-vite-vercel/shared-types': resolve(rootDir, 'libs/shared-types/src/index.ts'),
      '@nx-vite-vercel/dal': resolve(rootDir, 'libs/dal/src/index.ts'),
      '@nx-vite-vercel/ui/tokens.css': resolve(rootDir, 'libs/ui/src/tokens.css'),
      '@nx-vite-vercel/ui': resolve(rootDir, 'libs/ui/src/index.ts'),
    },
  },
  server: {
    port: 4200,
    host: 'localhost',
    fs: {
      allow: [rootDir],
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    ...(enablePwa
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            manifest: {
              name: 'Nx + Vite + Vercel',
              short_name: 'Nx Vite Vercel',
              description: 'A modular Nx, Vite, and Vercel starter.',
              theme_color: '#4F46E5',
              background_color: '#f8fafc',
              display: 'standalone',
              start_url: '/',
              icons: [],
            },
          }),
        ]
      : []),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
