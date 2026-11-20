export interface ChangelogSection {
  category: string;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

export interface TemplateFeatureFlags {
  web: boolean;
  pwa: boolean;
  tanstackStart: boolean;
  expo: boolean;
  storybook: boolean;
  apiNest: boolean;
  apiPython: boolean;
  auth: boolean;
  admin: boolean;
  docker: boolean;
}
