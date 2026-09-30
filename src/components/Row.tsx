import React from 'react';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';
import { Cell } from './Cell';
import type { ClientAccountRow, ColumnDef, RowState } from '../types';

const ROW_HEIGHT: Record<'compact' | 'comfortable' | 'standard', number> = {
  compact: 48,
  standard: 56,
  comfortable: 64,
};

export interface RowProps {
  row: ClientAccountRow;
  /** One of the three density tiers the exercise calls for. Comfortable (64px)
   *  matches the Figma file's own built row height. */
  density?: 'compact' | 'comfortable' | 'standard';
  /** Matches Figma's Row State variant 1:1: Default / Hover / Selected /
   *  Disabled / Error. Forcing this prop is how the Storybook story reproduces
   *  each of the five Figma variants exactly. In the live DataGrid, only
   *  'selected' is ever forced from data — real hover is left to the browser's
   *  own :hover, which is the more honest interaction (see .grid-row:hover
   *  in this file's inline styles below). */
  state?: RowState;
  /** Which columns are currently visible, from the same column-visibility
   *  state that drives the header row (DataGrid's Filters panel). Defaults to
   *  all three so a Row rendered on its own (e.g. Storybook's Row stories)
   *  still shows everything — only the composed DataGrid passes this
   *  explicitly, keeping it in sync with which HeaderCells are shown.
   *
   *  Takes full column defs (well, just the two fields Row actually needs —
   *  see RowVisibleColumn below), not bare keys, since Row now has to know
   *  each column's OWN `pinned` state to decide whether it belongs in the
   *  sticky frozen group or the scrolling group (see freezeFirstColumn) —
   *  a plain key array stopped being enough once pinning became a per-column
   *  toggle instead of something only ever true for Client. */
  visibleColumns?: RowVisibleColumn[];
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  /** Roving-tabindex wiring from DataGrid — see its keyboard-nav notes. */
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  rowRef?: React.Ref<HTMLDivElement>;
  /** Responsive layout mode, driven by DataGrid's own container-width
   *  measurement (see its `layoutTier` — this is a genuinely independent fact
   *  from `freezeFirstColumn` below, not two branches of one enum, since a
   *  future layout could conceivably need both at once). 'row' is the
   *  existing horizontal layout, unchanged. 'card' stacks the row vertically
   *  with labeled fields, for the narrowest tier where a horizontal row
   *  (even scrolled) stops being usable. */
  layout?: 'row' | 'card';
  /** Only meaningful when `layout === 'row'`. Sticks the checkbox+avatar+name
   *  group to the left edge of its (horizontally-scrolling) container via
   *  `position: sticky`, so Status/Balance can scroll out of view without
   *  losing track of which client's row you're looking at — the "frozen
   *  first column" tier between full-width and card fallback. */
  freezeFirstColumn?: boolean;
}

/** Row only ever needs a column's key and its pinned state — never label,
 *  sortable, or locked, all of which are header/panel-only concerns — so it
 *  takes this narrower shape rather than a full ColumnDef. Any ColumnDef
 *  satisfies it structurally, so DataGrid can keep passing its real column
 *  objects straight through with no mapping step. */
export type RowVisibleColumn = Pick<ColumnDef, 'key' | 'pinned'>;

const ALL_COLUMNS: RowVisibleColumn[] = [{ key: 'clientName' }, { key: 'status' }, { key: 'balance' }];

export function Row({
  row,
  density = 'comfortable',
  state = 'default',
  visibleColumns = ALL_COLUMNS,
  selected = false,
  onToggleSelect,
  tabIndex,
  onKeyDown,
  rowRef,
  layout = 'row',
  freezeFirstColumn = false,
}: RowProps) {
  // These three are independent facts about a row, not one mutually-exclusive
  // choice — a row can genuinely be both selected AND have an error at the
  // same time (select a row to bulk-act on it while it's still failing
  // validation, say). The `state` prop stays as a fallback purely so an
  // isolated Storybook story can force a preset (e.g. Hover, which has no
  // row-data equivalent) without needing matching fields on the row itself.
  // The previous version chained these through one RowState value in
  // priority order (disabled > error > selected > state), which meant any
  // row with hasError:true could never show as selected, no matter what was
  // clicked — the checkbox's underlying state updated correctly, but its
  // visual `checked` prop was permanently locked out by that priority chain.
  const isDisabled = !!row.disabled || state === 'disabled';
  const isError = !!row.hasError || state === 'error';
  const isSelected = !!selected || state === 'selected';

  const isCard = layout === 'card';

  // backgroundColor (longhand), not the `background` shorthand: an inline
  // `background: ...` implicitly resets `background-image` to `none` as
  // part of that same inline declaration, and inline styles beat any
  // stylesheet rule regardless of specificity — so it was silently
  // cancelling out .grid-row:hover's `background-image` overlay in
  // tokens.css. The row's own solid background needs to live in a
  // different sub-property than the CSS hover state layer for the two to
  // compose instead of one clobbering the other.
  const rowBackground = isSelected
    ? 'var(--grid-color-secondary-container)'
    : row.pinned
    ? 'var(--grid-color-surface-container)'
    : 'var(--grid-color-surface)';

  const containerStyle: React.CSSProperties = isCard
    ? {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        padding: '12px 16px',
        backgroundColor: rowBackground,
        fontFamily: 'var(--grid-font-body)',
        cursor: isDisabled ? 'default' : 'pointer',
      }
    : {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: ROW_HEIGHT[density],
        width: '100%',
        minWidth: freezeFirstColumn ? 480 : undefined,
        padding: '0 16px',
        backgroundColor: rowBackground,
        fontFamily: 'var(--grid-font-body)',
        cursor: isDisabled ? 'default' : 'pointer',
      };

  // Content (everything but the pinned tint / hover scrim, which are separate
  // layers) is dimmed to 38% under Disabled — the real M3 convention, not a
  // dark overlay. See the design doc's writeup of that exact bug + fix.
  const contentOpacity = isDisabled ? 'var(--grid-disabled-content-opacity)' : 1;

  // The avatar+checkbox+name group, identical in row and card layouts except
  // for one thing: in the frozen-column responsive tier, this whole group is
  // wrapped so it can be `position: sticky` against DataGrid's horizontally-
  // scrolling container (see DataGrid's "scroll-frozen" layoutTier) — it
  // needs its own opaque background there so Status/Balance actually scroll
  // *behind* it instead of showing through.
  const leadingGroup = (
    <>
      <div style={{ position: 'relative', opacity: contentOpacity }}>
        <Avatar letter={row.avatarLetter} />
        {isError && (
          // Doubled from 6px to 12px (~15% -> ~30% of the 40px avatar) — the
          // original read as too subtle to catch at a glance. top/right stay
          // at -2 (unchanged): since those anchor the dot's own top-right
          // corner, growth extends toward the avatar's center, not sideways
          // into the 16px gap before the checkbox, so this doesn't crowd
          // anything next to it. It now overlaps the avatar's corner a bit
          // instead of floating just outside it — the existing surface-
          // colored border still cuts a clean ring around it either way, and
          // overlapping the badge it decorates is the more conventional
          // treatment anyway.
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'var(--grid-color-error)',
              border: '1px solid var(--grid-color-surface)',
            }}
          />
        )}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: contentOpacity }}>
        <input
          type="checkbox"
          checked={isSelected}
          disabled={isDisabled}
          onChange={() => onToggleSelect?.(row.id)}
          aria-label={`Select ${row.clientName}`}
          className="grid-focusable"
        />
      </label>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, opacity: contentOpacity }}>
        <div
          style={{
            fontSize: 14,
            color: 'var(--grid-color-on-surface)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.clientName}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--grid-color-on-surface-variant)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.secondaryLine}
        </div>
      </div>
    </>
  );

  const menuButton = (
    <button
      type="button"
      aria-label={`More actions for ${row.clientName}`}
      disabled={isDisabled}
      className="grid-focusable"
      style={{
        width: 48,
        height: 48,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        borderRadius: '50%',
        cursor: isDisabled ? 'default' : 'pointer',
        opacity: contentOpacity,
      }}
    >
      <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="5" r="2" fill="var(--grid-color-on-surface-variant)" />
        <circle cx="12" cy="12" r="2" fill="var(--grid-color-on-surface-variant)" />
        <circle cx="12" cy="19" r="2" fill="var(--grid-color-on-surface-variant)" />
      </svg>
    </button>
  );

  // Rendered by iterating `visibleColumns` IN ORDER, rather than two
  // independent `includes()` checks — columns can now be reordered
  // (DataGrid's move-earlier/move-later controls), and the header row
  // already follows that order automatically since it maps over the same
  // reordered array. If this stayed as two separate hardcoded blocks (Status
  // always before Balance, regardless of column order), reordering columns
  // would misalign the header row against the data row again — the same
  // class of bug as Bug 1, just triggered by a new feature instead of a
  // missing flexGrow.
  const orderedDataColumns = visibleColumns.filter((c) => c.key !== 'clientName');

  // Only meaningful in the row (non-card) layout while frozen: splits
  // Status/Balance into whichever of them are pinned (join the sticky group
  // alongside the avatar/checkbox/name) versus not (scroll normally) — the
  // Row-side half of the same split DataGrid's header row makes. Outside
  // the frozen tier, `pinned` has no visual meaning at all (nothing scrolls
  // to freeze against), so every data column just renders in the one
  // ordinary flow, same as before pinning became a per-column toggle.
  const pinnedDataColumns = freezeFirstColumn ? orderedDataColumns.filter((c) => c.pinned) : [];
  const scrollDataColumns = freezeFirstColumn ? orderedDataColumns.filter((c) => !c.pinned) : orderedDataColumns;

  function renderDataCell(col: RowVisibleColumn) {
    return col.key === 'status' ? (
      <div key="status" style={{ opacity: contentOpacity, flexShrink: 0 }}>
        <StatusBadge status={row.status} />
      </div>
    ) : col.key === 'balance' ? (
      <div key="balance" style={{ opacity: contentOpacity, flexShrink: 0 }}>
        <Cell value={balanceValue} state={row.balanceCellState ?? 'default'} />
      </div>
    ) : null;
  }

  const balanceValue = row.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div
      ref={rowRef}
      role="row"
      aria-selected={isSelected}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : tabIndex ?? -1}
      onKeyDown={onKeyDown}
      className={isDisabled ? undefined : 'grid-row grid-focusable'}
      style={containerStyle}
    >
      {isCard ? (
        <>
          {/* Card layout: same underlying `role="row"`/selection/keyboard
              semantics as the horizontal layout — only the CSS arrangement
              changes, deliberately, so none of the roving-tabindex or
              screen-reader behavior already verified needs to change for
              this responsive tier. Header line mirrors the row layout's
              leading group; Status/Balance move below as labeled fields
              since there's no header row to give them position-based
              meaning once the grid is this narrow. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {leadingGroup}
            {menuButton}
          </div>
          {orderedDataColumns.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: contentOpacity }}>
              {/* Card layout never scrolls horizontally, so pinning has
                  nothing to do here — every visible data column just renders
                  in one plain stack, same as before pinning existed. */}
              {orderedDataColumns.map((col) =>
                col.key === 'status' ? (
                  <div key="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--grid-color-on-surface-variant)' }}>
                      Status
                    </span>
                    <StatusBadge status={row.status} />
                  </div>
                ) : col.key === 'balance' ? (
                  <div key="balance" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--grid-color-on-surface-variant)' }}>
                      Balance
                    </span>
                    <Cell value={balanceValue} state={row.balanceCellState ?? 'default'} />
                  </div>
                ) : null
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {freezeFirstColumn ? (
            // The sticky group now holds the avatar/checkbox/name PLUS
            // whichever of Status/Balance are pinned — generalized from
            // "always just Client" once pinning became a per-column toggle.
            // The right-hand border only appears when this group actually
            // has something to be a boundary against, matching the header's
            // own pinnedBoundary logic (DataGrid.tsx): with nothing pinned
            // beyond Client, this still renders the same single hairline
            // that was there before this feature existed.
            <div
              style={{
                position: 'sticky',
                left: 0,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                backgroundColor: rowBackground,
                paddingRight: 16,
                flexShrink: 0,
                borderRight: '1px solid var(--grid-color-outline-variant)',
              }}
            >
              {leadingGroup}
              {pinnedDataColumns.map(renderDataCell)}
            </div>
          ) : (
            leadingGroup
          )}

          {scrollDataColumns.map(renderDataCell)}

          {menuButton}
        </>
      )}
    </div>
  );
}
