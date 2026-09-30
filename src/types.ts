/**
 * Shared types for the Clients & Accounts Table.
 *
 * NOTE ON A DELIBERATE DEPARTURE FROM THE EXERCISE'S SUGGESTED PROP LIST:
 * The exercise brief suggests flat booleans on Row — sortable, pinned, editable,
 * selected, has-error. We kept `pinned` (it's a genuinely independent, orthogonal
 * flag — a row can be pinned in any state) but modeled Default/Hover/Selected/
 * Disabled/Error as ONE mutually-exclusive `RowState`, matching how Figma's own
 * component variants work and how Material 3's real components (e.g. the Text
 * Field, the Card) model state throughout the kit. `sortable` and `editable`
 * are column/cell-level concerns, not row-level, so they live on HeaderCell and
 * Cell respectively. This is documented at length in the design doc as a
 * systemic-thinking talking point, not an oversight.
 */

export type RowState = 'default' | 'hover' | 'selected' | 'disabled' | 'error';

export type CellState = 'default' | 'editing' | 'error';

export type HeaderCellState =
  | 'default'
  | 'sorted-ascending'
  | 'sorted-descending'
  | 'filter-active';

export type ToolbarState = 'default' | 'search-active';

export type AccountStatus = 'active' | 'overdue' | 'inactive';

export interface ClientAccountRow {
  id: string;
  clientName: string;
  secondaryLine: string;
  avatarLetter: string;
  status: AccountStatus;
  balance: number;
  /** A pinned ROW (visually tinted — see Row.tsx's rowBackground), e.g. a
   *  flagged or important account kept easy to spot. Unrelated to
   *  ColumnDef's own `pinned` below despite the shared name — one is about
   *  a row's data, the other about a column freezing during horizontal
   *  scroll; nothing here bypasses pagination or otherwise treats a pinned
   *  row as special beyond that tint. */
  pinned?: boolean;
  /** Row-level State is derived at render time (selected/hover/disabled/error);
   *  `disabled` and `error` are still authorable per-row as source-of-truth data
   *  (e.g. an account the system has frozen, or one failing validation). */
  disabled?: boolean;
  hasError?: boolean;
  /** Independent of Row's own state — see Cell.tsx and the design doc's
   *  "Cell embedded in Row" writeup for why this is deliberately NOT coupled
   *  to the row's state. */
  balanceCellState?: CellState;
}

export type SortDirection = 'ascending' | 'descending' | null;

export interface ColumnDef {
  key: 'clientName' | 'status' | 'balance';
  label: string;
  sortable: boolean;
  /** Client's identity flag: this column can't be hidden or reordered away
   *  from first position (it's the row's identity, not an optional
   *  attribute — see the design doc's discussion of this decision). Split
   *  out from `pinned` below rather than reusing it, now that `pinned` is a
   *  genuine, independently-toggleable feature of its own: before this
   *  split, the one `pinned: true` on Client silently did double duty as
   *  both "can't be hidden/reordered" AND "frozen while scrolling," which
   *  meant there was no way to let a user pin Status or Balance without
   *  also (wrongly) making it un-hideable and un-reorderable. Only Client
   *  is ever `locked`; it's never exposed as a user-facing toggle. */
  locked?: boolean;
  /** Real "Column pinning" per the R11971 brief's own feature list — a
   *  column marked pinned stays frozen (visually anchored via
   *  `position: sticky`) while the rest of the row scrolls horizontally in
   *  the 'scroll-frozen' responsive tier; it has no visible effect in tiers
   *  wide enough that nothing scrolls. Client defaults to pinned (and,
   *  being `locked`, can't be unpinned), but Status and Balance can now
   *  also be pinned by the user via the Configure Columns panel — pinned
   *  columns are always kept as a contiguous group starting right after
   *  Client (see DataGrid's `toggleColumnPinned`), so the frozen zone is
   *  always a single unbroken block, never scattered non-adjacent columns. */
  pinned?: boolean;
  visible: boolean;
}
