import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toolbar } from './Toolbar';

/**
 * Toolbar — mirrors the Figma "Toolbar" component set: Default, Search
 * active.
 *
 * Figma property → Storybook arg mapping:
 *  - `State` variant       → `state` arg (forced here; the live DataGrid derives it automatically
 *    from whether search has a value)
 *  - `Title` text          → `title` arg
 *
 * A third "Columns hidden" variant existed in Figma at one point, showing a
 * Columns button with its own count badge. It was removed from both Figma
 * and here once we confirmed the live toolbar never had that button —
 * Configure Columns and its count live in the composed DataGrid instead
 * (see DataGrid.tsx's Configure Columns button), not on Toolbar in
 * isolation.
 */
const meta: Meta<typeof Toolbar> = {
  title: 'DataGrid/Toolbar',
  component: Toolbar,
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'search-active'],
      description: "Figma variant property: Toolbar's State",
    },
    title: { control: 'text' },
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
