import type { TemplateFeatureFlags } from '@nx-vite-vercel/shared-types';
import { Badge, Card } from '@nx-vite-vercel/ui';

export interface OverviewSectionProps {
  features: TemplateFeatureFlags;
}

const FEATURE_LABELS: ReadonlyArray<{ key: keyof TemplateFeatureFlags; label: string }> = [
  { key: 'web', label: 'Vite Web SPA' },
  { key: 'pwa', label: 'PWA' },
  { key: 'tanstackStart', label: 'TanStack Start' },
  { key: 'expo', label: 'Expo Mobile' },
  { key: 'storybook', label: 'Storybook' },
  { key: 'apiNest', label: 'NestJS API' },
  { key: 'apiPython', label: 'Python FastAPI' },
  { key: 'auth', label: 'JWT Auth' },
  { key: 'admin', label: 'Admin Panel' },
  { key: 'docker', label: 'Docker' },
];

export function OverviewSection({ features }: OverviewSectionProps) {
  return (
    <div className="ui-stack">
      <Card>
        <h1 style={{ margin: '0 0 0.5rem', color: 'var(--ui-primary)' }}>Nx + Vite + Vercel</h1>
        <p style={{ margin: 0, color: 'var(--ui-text-muted)' }}>
          This is a modular, mobile-friendly monorepo template powered by Bun, Nx, Vite, and opt-in
          full-stack modules.
        </p>
      </Card>

      <div className="ui-grid ui-grid-2">
        <Card title="Stack Highlights" subtitle="Core architecture out of the box">
          <ul>
            <li>
              <strong>Nx</strong> for monorepo workspaces and task execution
            </li>
            <li>
              <strong>Vite</strong> for ultra-fast dev server and bundle speeds
            </li>
            <li>
              <strong>Vercel</strong> configuration with SPA routing rules (<code>vercel.json</code>
              )
            </li>
            <li>
              <strong>Bun</strong> as the default package manager and runtime
            </li>
          </ul>
        </Card>

        <Card
          title="Enabled Modules"
          subtitle="Run `bun run setup` to toggle optional frontends, backends, and tooling."
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {FEATURE_LABELS.map((item) => (
              <Badge key={item.key} tone={features[item.key] ? 'success' : 'neutral'}>
                {item.label}: {features[item.key] ? 'On' : 'Off'}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
