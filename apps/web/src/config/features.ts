import type { TemplateFeatureFlags } from '@nx-vite-vercel/shared-types';

const FALLBACK_FEATURES: TemplateFeatureFlags = {
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

export function getTemplateFeatures(): TemplateFeatureFlags {
  if (typeof __TEMPLATE_FEATURES__ !== 'undefined' && __TEMPLATE_FEATURES__) {
    return __TEMPLATE_FEATURES__;
  }
  return FALLBACK_FEATURES;
}
