/// <reference types="vite/client" />

import type { TemplateFeatureFlags } from '@nx-vite-vercel/shared-types';

declare global {
  const __TEMPLATE_FEATURES__: TemplateFeatureFlags | undefined;
}
