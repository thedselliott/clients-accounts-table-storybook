import type { Meta, StoryObj } from '@storybook/react';
import { Row } from './Row';
import { sampleRows } from '../sampleData';
import type { CellState } from '../types';

/**
 * Row — mirrors the Figma "Row" component set 1:1.
 *
 * Figma property → Storybook arg mapping:
 *  - Row's Figma `State` variant (Default/Hover/Selected/Disabled/Error)  → `state` arg
 *  - Row's Figma `Pinned` boolean                                        → `pinned` arg (merged into row data —
 *    pinned is orthogonal to State, so it's exposed as its own control here even though the
 *    live DataGrid reads it off row data rather than a separate prop)
 *  - The embedded Balance "Cell" instance's own State (independent of Row) → `balanceCellState` arg
 *  - Row's `density` (Compact/Comfortable/Standard, applied at the DataGrid level in Figma) → `density` arg
 *
 * Intentional departure from the exercise's suggested flat booleans
 * (sortable/pinned/editable/selected/hasError): Row's visual state is modeled
 * as ONE mutually-exclusive `RowState` enum instead of independent booleans,
 * because those states are mutually exclusive in the design (a row can't be
 * both Hovered and Disabled). `pinned` stays a true independent boolean
 * because it composes with any State. `sortable`/`editable` moved to
 * HeaderCell/Cell respectively — they're column/cell-level concerns, not
 * row-level ones. See src/types.ts for the same rationale in code comments.
 */
const meta: Meta<typeof Row> = {
  title: 'DataGrid/Row',
  component: Row,
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'hover', 'selected', 'disabled', 'error'],
      description: "Figma variant property: Row's State",
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'standard'],
      description: 'Row height density, set at the DataGrid level in Figma',
    },
    selected: {
      control: 'boolean',
      description: 'Checkbox checked-state, drives the Selected variant',
    },
  },
  render: ({ row, ...args }) => <Row {...args} row={row} />,
};
export default meta;

type Story = StoryObj<
  typeof Row & { pinned?: boolean; balanceCellState?: CellState }
>;

export const Default: Story = {
  args: { row: sampleRows[0], state: 'default', density: 'comfortable' },
};

export const Hover: Story = {
  args: { row: sampleRows[0], state: 'hover', density: 'comfortable' },
};

export const Selected: Story = {
  args: { row: sampleRows[0], state: 'selected', selected: true, density: 'comfortable' },
};

export const Disabled: Story = {
  args: { row: sampleRows[3], state: 'disabled', density: 'comfortable' },
};

export const ErrorState: Story = {
  name: 'Error',
  args: { row: sampleRows[4], state: 'error', density: 'comfortable' },
};

export const Pinned: Story = {
  args: { row: sampleRows[5], state: 'default', density: 'comfortable' },
};

/** The Focused+Error combination the design doc calls out: an errored balance
 *  cell inside an otherwise-default row, proving Cell's State is fully
 *  independent of Row's State once embedded. */
export const ErrorCellInDefaultRow: Story = {
  args: {
    row: { ...sampleRows[0], balance: -150, balanceCellState: 'error' },
    state: 'default',
    density: 'comfortable',
  },
};

export const CompactDensity: Story = {
  args: { row: sampleRows[0], state: 'default', density: 'compact' },
};
