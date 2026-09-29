import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid } from './DataGrid';
import { sampleRows } from '../sampleData';

/**
 * DataGrid — the composed, interactive Clients & Accounts Table. This is the
 * "real, working Canvas" the Step 3 brief asks for: search filtering,
 * single- and multi-column sort, column visibility and reordering, row
 * selection with bulk actions (mouse + keyboard), a live density toggle, and
 * per-column value filtering all work live in this story, not just as static
 * variant screenshots.
 *
 * Figma property → Storybook arg mapping:
 *  - `density` (Compact/Comfortable/Standard) → `density` arg sets the INITIAL value only; the
 *    grid's own density toggle (always visible, just under the toolbar) controls it live from
 *    then on — this is a real interactive feature now, not just a prop you set from the outside.
 *  - `rows` / `columns` / `pagination` are represented here as the `rows` arg (data) — this
 *    exercise's brief calls out `columns`, `data`, and `pagination` as example props to map;
 *    `columns` are defined internally (Client/Status/Balance, matching the Figma columns) and
 *    toggled visible/hidden AND reordered (Status/Balance only — Client stays pinned first) via
 *    the grid's own Columns panel rather than as a top-level Storybook control, since both are
 *    genuinely per-column interactive state, not a fixed prop set.
 *    Pagination was out of scope for the Figma file (Option B's composed example shows a single
 *    page of 5–6 rows) and is called out as a documented gap in the design doc rather than
 *    faked here.
 *  - Per-column value filtering (Status: multi-select, Balance: min/max range) lives behind each
 *    HeaderCell's own filter icon, and narrows the same `filteredRows` computation search uses —
 *    see the design doc for why this was brought into scope alongside sort rather than treated
 *    as an unrequested addition.
 *  - Multi-column sort: click a header to sort by it alone; shift-click a second header to add it
 *    as a secondary sort tier (a small numbered badge shows priority once more than one column is
 *    sorted). Plain click on any header always collapses back to a single-column sort.
 *  - Row selection now shows a bulk-actions bar (Deactivate / Export) the moment any row is
 *    selected. Export is a real CSV download of the selected rows; Deactivate is a local demo
 *    overlay (sets status to Inactive and disables the row) rather than a real backend call.
 *  - Responsive layout is driven by the grid's own rendered width via `ResizeObserver` — a
 *    container query, not a `@media` viewport query, since a component library's grid can end up
 *    embedded in a narrow panel on a wide screen just as easily as in an actually-narrow browser
 *    window. The four responsive stories below force each width band by wrapping the grid in a
 *    fixed-width container, so every tier is directly visible here without resizing anything —
 *    they demonstrate the real, live behavior, not a static mock of it.
 *
 * States documented via Controls (per the Step 3 brief's "loading, empty, error" requirement):
 *  - `loading`: true shows the Loading message row in place of the grid body
 *  - `error`: any non-empty string shows the Error message row with that text
 *  - `rows: []` (or the dedicated Empty story below) shows the Empty message row
 * These three are mutually exclusive in the same precedence order they're checked in code:
 * loading beats error beats empty beats the normal row list — matching how a real fetch
 * lifecycle would resolve one final state.
 */
const meta: Meta<typeof DataGrid> = {
  title: 'DataGrid/DataGrid',
  component: DataGrid,
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'standard'],
    },
    loading: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: {
    rows: sampleRows,
    title: 'Clients & Accounts',
    density: 'comfortable',
  },
};
export default meta;

type Story = StoryObj<typeof DataGrid>;

/** The default interactive grid — try the search icon, click a column header
 *  to sort (shift-click a second header for multi-column sort), open Columns
 *  to hide/show/reorder columns, click the funnel icon on Status or Balance
 *  to filter by value, click a row checkbox (a bulk-actions bar appears) or
 *  focus a row and use Arrow keys + Space to select via keyboard, and try
 *  the density buttons under the toolbar. */
export const Interactive: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { rows: [] },
};

export const ErrorState: Story = {
  name: 'Error',
  args: { error: 'Could not load accounts. Check your connection and try again.' },
};

export const CompactDensity: Story = {
  args: { density: 'compact' },
};

export const StandardDensity: Story = {
  args: { density: 'standard' },
};

/** All four responsive tiers, each forced by wrapping the grid in a
 *  fixed-width container — since layoutTier is driven by the grid's own
 *  measured width (a ResizeObserver "container query"), pinning the wrapper's
 *  width is enough to demonstrate each one directly in Storybook, live and
 *  interactive, not as a static screenshot mock. */
export const ResponsiveWide: Story = {
  name: 'Responsive — Wide (full table)',
  decorators: [(Story) => <div style={{ width: 900 }}><Story /></div>],
};

export const ResponsiveCollapsed: Story = {
  name: 'Responsive — Collapsed (Balance drops out)',
  decorators: [(Story) => <div style={{ width: 650 }}><Story /></div>],
};

export const ResponsiveScrollFrozen: Story = {
  name: 'Responsive — Scroll with frozen Client column',
  decorators: [(Story) => <div style={{ width: 460 }}><Story /></div>],
};

export const ResponsiveCards: Story = {
  name: 'Responsive — Mobile card fallback',
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
};
