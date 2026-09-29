import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toolbar } from './Toolbar';

/**
 * Toolbar — mirrors the Figma "Toolbar" component set: Default, Search
 * active, Columns hidden.
 *
 * Figma property → Storybook arg mapping:
 *  - `State` variant       → `state` arg (forced here; the live DataGrid derives it automatically
 *    from whether search has a value)
 *  - `Title` text          → `title` arg
 *  - Hidden column count   → `hiddenColumnCount` arg (drives the Columns-hidden badge). Named for
 *    what it does — toggling which columns show — rather than "Filters", which now refers to the
 *    separate per-column value-filtering feature on each HeaderCell (see HeaderCell.stories.tsx's
 *    SortedAndFiltered story, and the design doc's writeup of this naming collision).
 */
const meta: Meta<typeof Toolbar> = {
  title: 'DataGrid/Toolbar',
  component: Toolbar,
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'search-active', 'columns-hidden'],
      description: "Figma variant property: Toolbar's State",
    },
    title: { control: 'text' },
    hiddenColumnCount: { control: 'number' },
  },
  args: {
    title: 'Clients & Accounts',
  },
};
export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Default: Story = { args: { state: 'default' } };

export const SearchActive: Story = {
  args: { state: 'search-active' },
  render: (args) => {
    // Interactive wrapper so the Controls-driven story still has a working
    // search input, mirroring the real click-to-open-search affordance wired
    // up in DataGrid (the search icon button next to the title).
    function Wrapper() {
      const [value, setValue] = useState('Sierra');
      return <Toolbar {...args} searchValue={value} onSearchChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const ColumnsHidden: Story = {
  args: { state: 'columns-hidden', hiddenColumnCount: 2 },
};
