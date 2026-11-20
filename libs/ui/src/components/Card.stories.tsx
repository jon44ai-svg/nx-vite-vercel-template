import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './Badge';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Modular Workspace',
    subtitle: 'Enable only the stacks your product needs.',
    children: <Badge tone="success">Active</Badge>,
  },
};
