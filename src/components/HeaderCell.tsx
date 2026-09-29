import React from 'react';
import type { HeaderCellState } from '../types';

export interface HeaderCellProps {
  label: string;
  state?: HeaderCellState;
  pinned?: boolean;
  width?: number | string;
  align?: 'left' | 'right';
  /** Receives the click event so DataGrid can read `e.shiftKey` for
   *  multi-column sort (shift-click adds/cycles a secondary sort tier
   *  instead of replacing the whole sort). A handler that ignores the
   *  argument (`() => {}`, as every existing Storybook story does) is still
   *  a valid value here — this is a widening of the type, not a breaking
   *  change to any call site. */
  onSort?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenFilter?: () => void;
  /** This column's 1-based position among the *currently active* sort
   *  criteria — shown only when more than one column is sorted at once, so
   *  a single-column sort (the common case) doesn't grow a redundant "1"
   *  badge next to every sort arrow. Independent of `state`/`filterActive`
   *  for the same reason those two are independent of each other: a column
   *  can be sorted, filtered, and a secondary (not primary) sort key, all
   *  three at once. */
  sortPriority?: number;
  /** Whether this column currently has an active value filter. Kept
   *  independent of `state` on purpose — a column can be sorted AND filtered
   *  at the same time (e.g. Balance sorted descending with a min/max range
   *  applied), and those are two separate facts, not one mutually-exclusive
   *  choice. `state: 'filter-active'` is kept working too, purely so the
   *  existing "Filter active" Storybook story (which forces it via `state`
   *  for a clean 1:1 Figma-variant demo) doesn't need to change. */
  filterActive?: boolean;
}

/** Mirrors the Figma "Header cell" component set: Default, Sorted ascending,
 *  Sorted descending, Filter active. `aria-sort` is the actual accessibility
 *  hook screen readers use to announce sort state — see the a11y checklist. */
export function HeaderCell({
  label,
  state = 'default',
  pinned = false,
  width,
  align = 'left',
  onSort,
  onOpenFilter,
  filterActive = false,
  sortPriority,
}: HeaderCellProps) {
  const ariaSort =
    state === 'sorted-ascending' ? 'ascending' : state === 'sorted-descending' ? 'descending' : 'none';

  // `aria-sort` on the columnheader (above) covers this column's own
  // direction, but says nothing about whether it's the primary or a
  // secondary sort key when several columns are sorted at once — that's
  // exactly the kind of thing a sighted user reads off the little priority
  // badge but a screen reader user would otherwise miss entirely. Spelled
  // out explicitly in the sort button's own accessible name instead of
  // relying on the (aria-hidden) visual badge.
  const sortButtonLabel = onSort
    ? `${label}${ariaSort !== 'none' ? `, sorted ${ariaSort}` : ''}${
        sortPriority ? ` (sort priority ${sortPriority})` : ''
      }`
    : undefined;

  return (
    <div
      role="columnheader"
      aria-sort={ariaSort}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : 'space-between',
        gap: 4,
        height: 48,
        width,
        // When no fixed width is given (the Client column), this header cell
        // must grow to fill the same flexible space Row.tsx's name/secondary-
        // line block claims with `flex: 1` — otherwise the header row and the
        // data rows disagree about how wide the Client column is, and every
        // column after it (Status, Balance) drifts out of alignment with its
        // header. Fixed-width columns (Status, Balance) stay flexShrink: 0 so
        // they never compress below their intended width.
        flexGrow: width === undefined ? 1 : 0,
        flexShrink: 0,
        minWidth: 0,
        padding: '0 16px',
        background: pinned ? 'var(--grid-color-surface-container)' : 'transparent',
        borderRight: pinned ? '1px solid var(--grid-color-outline-variant)' : undefined,
        fontFamily: 'var(--grid-font-body)',
      }}
    >
      <button
        type="button"
        onClick={onSort}
        className="grid-focusable"
        disabled={!onSort}
        aria-label={sortButtonLabel}
        title={onSort ? `Sort by ${label}. Shift-click to add as a secondary sort.` : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          // Fill the whole header cell, not just hug the label text. Once the
          // Client column started stretching (flexGrow fix above), the
          // clickable button stayed pinned to its own content width while
          // the header cell around it grew — clicking anywhere in that now-
          // wide header except the exact word "Client" did nothing. A real
          // data grid's sort target is the whole header cell, so the button
          // itself now claims the full area its cell occupies.
          flex: '1 1 auto',
          height: '100%',
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
          gap: 4,
          background: 'none',
          border: 'none',
          padding: 0,
          font: 'inherit',
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: 0.5,
          color: 'var(--grid-color-on-surface)',
          cursor: onSort ? 'pointer' : 'default',
        }}
      >
        {label}
        {(state === 'sorted-ascending' || state === 'sorted-descending') && (
          <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={state === 'sorted-ascending' ? 'M7 14l5-5 5 5H7z' : 'M7 10l5 5 5-5H7z'}
              fill="var(--grid-color-on-surface)"
            />
          </svg>
        )}
        {sortPriority !== undefined && sortPriority > 0 && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: 'var(--grid-color-on-surface-variant)',
              color: 'var(--grid-color-surface)',
              fontSize: 9,
              fontWeight: 700,
            }}
          >
            {sortPriority}
          </span>
        )}
      </button>
      {onOpenFilter && (
        <button
          type="button"
          onClick={onOpenFilter}
          className="grid-focusable"
          aria-label={`Filter ${label}`}
          style={{
            width: 24,
            height: 24,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16l-6 7v5l-4 2v-7z" fill="var(--grid-color-on-surface-variant)" />
          </svg>
          {(state === 'filter-active' || filterActive) && (
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--grid-color-on-primary-container)',
              }}
              aria-hidden="true"
            />
          )}
        </button>
      )}
    </div>
  );
}
