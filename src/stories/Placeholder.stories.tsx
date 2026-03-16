import type { Meta, StoryObj } from '@storybook/react-vite';

function Placeholder() {
  return <p>Rizoma component library — Storybook is working.</p>;
}

const meta: Meta<typeof Placeholder> = {
  title: 'Placeholder',
  component: Placeholder
};

export default meta;

type Story = StoryObj<typeof Placeholder>;

export const Default: Story = {};
