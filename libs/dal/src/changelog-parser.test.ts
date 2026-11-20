import { describe, expect, it } from 'vitest';

import { parseChangelogMarkdown } from './changelog-parser';

describe('parseChangelogMarkdown', () => {
  it('parses release versions, dates, and categorized items', () => {
    const markdown = `# Changelog

## [0.2.0] - 2026-11-20

### Added
- Modular CLI
- Storybook
`;

    const entries = parseChangelogMarkdown(markdown);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual({
      version: '0.2.0',
      date: '2026-11-20',
      sections: [
        {
          category: 'Added',
          items: ['Modular CLI', 'Storybook'],
        },
      ],
    });
  });
});
