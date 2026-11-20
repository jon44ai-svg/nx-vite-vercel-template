import type { ChangelogEntry, ChangelogSection } from '@nx-vite-vercel/shared-types';

const VERSION_HEADING = /^##\s+\[?([^\]\s]+)\]?(?:\s*-\s*(.+))?$/;
const SECTION_HEADING = /^###\s+(.+)$/;
const LIST_ITEM = /^-\s+(.+)$/;

export function parseChangelogMarkdown(markdown: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  let currentEntry: ChangelogEntry | null = null;
  let currentSection: ChangelogSection | null = null;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();

    const versionMatch = VERSION_HEADING.exec(line);
    if (versionMatch) {
      currentEntry = {
        version: versionMatch[1] ?? 'Unreleased',
        date: (versionMatch[2] ?? '').trim(),
        sections: [],
      };
      entries.push(currentEntry);
      currentSection = null;
      continue;
    }

    const sectionMatch = SECTION_HEADING.exec(line);
    if (sectionMatch && currentEntry) {
      currentSection = {
        category: sectionMatch[1] ?? 'Changes',
        items: [],
      };
      currentEntry.sections.push(currentSection);
      continue;
    }

    const itemMatch = LIST_ITEM.exec(line);
    if (itemMatch && currentEntry) {
      if (!currentSection) {
        currentSection = { category: 'Changes', items: [] };
        currentEntry.sections.push(currentSection);
      }
      currentSection.items.push(itemMatch[1] ?? '');
    }
  }

  return entries;
}
