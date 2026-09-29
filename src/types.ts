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

export type ToolbarState = 'default' | 'search-active' | 'filters-applied';

export type AccountStatus = 'active' | 'overdue' | 'inactive';

export interface ClientAccountRow {
  id: string;
  clientName: string;
  secondaryLine: string;
  avatarLetter: string;
  status: AccountStatus;
  balance: number;
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
  pinned?: boolean;
  visible: boolean;
}
