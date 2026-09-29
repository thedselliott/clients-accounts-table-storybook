import type { Meta, StoryObj } from '@storybook/react';
import { HeaderCell } from './HeaderCell';

/**
 * HeaderCell — mirrors the Figma "Header cell" component set: Default,
 * Sorted ascending, Sorted descending, Filter active.
 *
 * Figma property → Storybook arg mapping:
 *  - `State` variant      → `state` arg (drives the real `aria-sort` attribute — see a11y checklist)
 *  - `Column label` text  → `label` arg
 *  - `Pinned` boolean     → `pinned` arg
 */
const meta: Meta<typeof HeaderCell> = {
  title: 'DataGrid/HeaderCell',
  component: HeaderCell,
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'sorted-ascending', 'sorted-descending', 'filter-active'],
      description: "Figma variant property: Header cell's State",
    },
    label: { control: 'text', description: 'Figma component property: Column label' },
    pinned: { control: 'boolean', description: 'Figma variant property: Pinned' },
    align: { control: 'select', options: ['left', 'right'] },
    filterActive: {
      control: 'boolean',
      description:
        'Independent of sort `state` — a column can be sorted AND filtered at once. See SortedAndFiltered below.',
    },
    sortPriority: {
      control: 'number',
      description:
        "This column's 1-based position among active multi-column sort criteria. Only shown by DataGrid when more than one column is sorted — see MultiSortSecondary below.",
    },
  },
  args: {
    label: 'Client',
    onSort: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof HeaderCell>;

export const Default: Story = { args: { state: 'default' } };
export const SortedAscending: Story = { args: { state: 'sorted-ascending' } };
export const SortedDescending: Story = { args: { state: 'sorted-descending' } };
export const FilterActive: Story = { args: { state: 'filter-active', onOpenFilter: () => {} } };
/** Proves the sort/filter decoupling: the sort arrow and the filter-active
 *  dot both show at once, because they're two independent facts about this
 *  column, not one enum. Try it: this is what Balance looks like sorted
 *  descending with a min/max range filter applied in the live DataGrid. */
export const SortedAndFiltered: Story = {
  args: { state: 'sorted-descending', filterActive: true, onOpenFilter: () => {} },
};
/** What a SECONDARY sort key looks like: the numbered badge only appears
 *  once a second column is added to the sort (shift-click in the live grid)
 *  — a single-column sort never shows a redundant "1". */
export const MultiSortSecondary: Story = {
  args: { state: 'sorted-ascending', sortPriority: 2, label: 'Balance', align: 'right', width: 140 },
};
export const Pinned: Story = { args: { state: 'default', pinned: true } };
export const RightAligned: Story = {
  args: { state: 'default', label: 'Balance', align: 'right', width: 140 },
};
