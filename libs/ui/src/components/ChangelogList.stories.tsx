import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChangelogList } from './ChangelogList';

const meta: Meta<typeof ChangelogList> = {
  title: 'UI/ChangelogList',
  component: ChangelogList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChangelogList>;

export const Releases: Story = {
  args: {
    entries: [
      {
        version: '0.2.0',
        date: '2026-11-20',
        sections: [
          {
            category: 'Added',
            items: [
              'Modular startup CLI',
              'Storybook UI library',
              'JWT auth in NestJS and FastAPI',
            ],
          },
        ],
      },
    ],
  },
};
