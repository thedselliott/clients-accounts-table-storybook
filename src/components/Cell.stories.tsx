import type { Meta, StoryObj } from '@storybook/react';
import { Cell } from './Cell';

/**
 * Cell — mirrors the Figma "Cell" component set: Default, Editing, Error.
 *
 * Figma property → Storybook arg mapping:
 *  - Cell's `State` variant       → `state` arg
 *  - Cell's "Cell value" text prop → `value` arg
 *
 * This is the component the "Cell embedded in Row" integration work centered
 * on: its State is deliberately NOT derived from the parent Row's state (see
 * the design doc's write-up) — Storybook forcing `state` here independently
 * of any Row context is the direct proof of that decoupling.
 */
const meta: Meta<typeof Cell> = {
  title: 'DataGrid/Cell',
  component: Cell,
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'editing', 'error'],
      description: "Figma variant property: Cell's State",
    },
    value: {
      control: 'text',
      description: 'Figma component property: Cell value (text)',
    },
  },
  args: {
    value: '$12,480.00',
  },
};
export default meta;

type Story = StoryObj<typeof Cell>;

export const Default: Story = { args: { state: 'default' } };
export const Editing: Story = { args: { state: 'editing', value: '12480.00' } };
export const ErrorState: Story = { name: 'Error', args: { state: 'error', value: '-$150.00' } };
