import type { ChangelogEntry } from '@nx-vite-vercel/shared-types';

import { Badge } from './Badge';
import { Card } from './Card';

export interface ChangelogListProps {
  entries: readonly ChangelogEntry[];
}

export function ChangelogList({ entries }: ChangelogListProps) {
  if (entries.length === 0) {
    return (
      <Card title="Changelog">
        <p>No release notes published yet.</p>
      </Card>
    );
  }

  return (
    <div className="ui-stack">
      {entries.map((entry) => (
        <Card
          key={`${entry.version}-${entry.date}`}
          title={`v${entry.version}`}
          subtitle={entry.date || 'Unreleased'}
        >
          <div className="ui-stack">
            {entry.sections.map((section) => (
              <div key={section.category}>
                <Badge tone="neutral">{section.category}</Badge>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
