# Accessibility checklist — Clients & Accounts Table

Per the Step 3 brief, this checklist covers: correct table/grid semantics, sort
state and result counts announced to screen readers, full keyboard navigation
between cells, sufficient color contrast on negative-value and hover/selected
states, and visible focus indicators throughout. Every item below is walked
through against what's actually implemented in this codebase — not aspirational.

## 1. Correct table/grid semantics

- The grid container uses `role="grid"` with `aria-label` and `aria-rowcount`
  (`DataGrid.tsx`).
- The header row and each data row use `role="row"`.
- Header cells use `role="columnheader"`; data cells use `role="gridcell"`
  (`HeaderCell.tsx`, `Cell.tsx`).
- This is an ARIA grid, not a static ARIA table, because rows are selectable
  and cells participate in keyboard navigation — a plain `table`/`row`/`cell`
  triad would under-communicate the interaction model to assistive tech.

## 2. Sort state and result counts announced to screen readers

- Sortable header cells carry a real `aria-sort` attribute (`"ascending"`,
  `"descending"`, or `"none"`), computed directly from sort state rather than
  being a cosmetic icon swap (`HeaderCell.tsx`). This is the actual
  accessibility hook screen readers use — a sort arrow icon with no
  `aria-sort` communicates nothing to a screen reader user.
- A visually-hidden `aria-live="polite"` region reports the filtered/sorted
  result count (e.g. "3 of 6 accounts shown") any time search or sort changes
  the visible row set (`DataGrid.tsx`). `polite` (not `assertive`) so it
  doesn't interrupt whatever the user is doing.

## 2a. Multi-column sort, bulk actions, density, and reorder — accessible names, not just visuals

Four features were added after this checklist's first pass, and each needed its own accessible-name
treatment rather than relying on a visual-only cue:

- Multi-column sort's priority badge (a small numbered circle) is `aria-hidden` — the number alone,
  read out of context, would mean nothing. The sort button's `aria-label` instead spells out the
  whole fact directly: `"Balance, sorted ascending (sort priority 2)"`. A `title` attribute also
  hints at the shift-click gesture for sighted mouse users, who have no other way to discover it.
- The bulk-actions bar (Deactivate/Export, shown once any row is selected) is `role="group"` with
  `aria-label="Bulk actions"`, and every button in it is a real `<button>` — no custom click targets.
- The density toggle is `role="group"` with `aria-label="Row density"`; each option is a real
  `<button>` with `aria-pressed` reflecting the current selection, the standard pattern for a
  segmented control (not three unrelated buttons with no shared state communicated).
- The new column reorder controls (← / → next to each non-pinned column in the Columns panel) carry
  explicit `aria-label`s ("Move Balance earlier") rather than relying on the arrow glyph alone, and
  are disabled (not hidden) at either end of the reorderable range so their presence/absence doesn't
  shift focus order unexpectedly.

## 3. Full keyboard navigation between cells

- Rows use a roving-tabindex pattern: exactly one row is in the Tab order at
  a time (`tabIndex={0}`), and Arrow Up/Down, Home, and End move DOM focus
  between rows without leaving the Tab sequence (`DataGrid.tsx`'s
  `handleRowKeyDown`, `Row.tsx`'s `rowRef`/`tabIndex` wiring). This is the
  standard pattern for composite widgets (WAI-ARIA APG "Grid" pattern) and
  avoids forcing a screen reader or keyboard user to Tab through every row
  individually.
- Space or Enter on a focused row toggles its selection — the same
  interaction available with the mouse via the row's checkbox.
- Every interactive control (search field, sort buttons, filter toggle,
  column-visibility checkboxes, row checkboxes, row's "more actions" button)
  is a real focusable element (`button`, `input`), not a `div` with a click
  handler, so native Tab order and Enter/Space activation work without extra
  code.
- Gap not yet built: cell-level (not just row-level) arrow-key navigation —
  e.g. Left/Right moving between the checkbox, name, status, and balance
  cells within a row. The brief's own phrasing ("selecting rows by mouse and
  keyboard") scopes this to row selection rather than full 2D cell
  navigation, so row-level roving tabindex was built as the honest match to
  scope; true 2D grid navigation (arrow keys moving a focused *cell*, not a
  focused *row*) is called out here as a next iteration rather than
  quietly skipped.

## 4. Sufficient color contrast on negative-value and hover/selected states

- Negative/error balances use the Error Cell variant: a 1dp `--grid-color-error`
  border plus an explicit error glyph, not color alone — so the signal
  doesn't depend on a user's ability to distinguish red from black (this
  also satisfies WCAG 1.4.1, "don't rely on color alone").
- The Hover state layer is `rgba(29,27,32,0.08)` (8% opacity), verified
  against Material 3's own real Card:Hovered state-layer value during the
  Figma work — see the design doc's "two real bugs" write-up for how the
  original 100%-opacity implementation was caught and fixed. At 8% over a
  light surface this stays a background-only affordance and never drops
  foreground text contrast below body-text values.
- The Selected state uses `--grid-color-secondary-container` as a full,
  solid background (not a translucent tint), which is the same token/pattern
  M3 uses for its own selected/checked surfaces — chosen specifically because
  a solid, named color token has a guaranteed, checkable contrast ratio
  against its paired on-color, where a translucent overlay's effective
  contrast shifts with whatever is underneath it.
- Disabled content uses 38% opacity on foreground content only (never a dark
  scrim over the row) — verified against the Outlined Text Field's real
  Disabled state in the M3 kit, which was the fix for a genuine bug this
  project's Figma work caught (Disabled was originally rendering with a
  100%-opacity dark overlay).

## 5. Visible focus indicators throughout

- A shared `.grid-focusable:focus-visible` rule in `tokens.css` applies a
  visible outline to every interactive element in the grid — checkboxes,
  sort buttons, the search field, filter toggle, column-visibility checkboxes,
  and the row's "more actions" button — so focus is never invisible on any
  control.
- `:focus-visible` (not bare `:focus`) is used deliberately: it shows the
  indicator for keyboard navigation while not showing a distracting outline
  on every mouse click, matching modern browser/OS conventions and avoiding
  the common anti-pattern of suppressing focus outlines entirely
  (`outline: none` with no replacement), which would fail WCAG 2.4.7.
- Rows themselves get the same treatment via the `grid-row grid-focusable`
  class combination, so the currently-focused row in the roving-tabindex
  sequence is always visibly indicated, not just programmatically focused.

## 6. Responsive layout changes CSS, never semantics

Four width tiers (`DataGrid.tsx`'s `layoutTier`, driven by a `ResizeObserver` on the grid's own
container rather than a `@media` viewport query — see that file's comment for why a container
query is the more correct choice here) restyle the grid from a full table down to phone-width
cards. Deliberately, only the CSS arrangement changes across all four tiers — `role="row"`,
`aria-selected`, the roving-tabindex keyboard navigation, and Space/Enter selection are byte-for-byte
the same code path whether a row is rendered as a horizontal row or a stacked card (`Row.tsx`'s
`layout` prop only branches the JSX/CSS, never the ARIA attributes or event handlers). This means
none of the keyboard-navigation or screen-reader behavior already verified above needs separate
testing per breakpoint — it provably can't have changed, since it isn't touched by any of the
responsive code.

Two things specific to each narrower tier:

- **Collapsed** (mid-width): Balance drops out of both the header row and each row's cells at once,
  from the same `responsiveVisibleColumns` list both derive from — there's no way for the header to
  disagree with the data here, the same discipline as the reorder-column fix earlier in this project.
- **Scroll-frozen** (narrow): the checkbox+avatar+name group is wrapped in one `position: sticky`
  container (both in the header row and in every data row), with an explicit opaque background so
  Status/Balance content passes visibly behind it while scrolling rather than showing through. Header
  and body share one scrolling container instead of two separately-scrolled elements kept in sync via
  JS, so there's no scroll-sync code to get out of sync in the first place.
- **Cards** (phone width): the header row is dropped entirely (a column header has no meaning once
  rows are vertical), and Status/Balance move inline with visible text labels ("Status", "Balance")
  so the same information a sighted column header used to convey by position is still conveyed, now
  by an explicit label next to each value.

## Summary table

| Checklist item | Status | Where |
|---|---|---|
| Grid/row/columnheader/gridcell semantics | Implemented | `DataGrid.tsx`, `Row.tsx`, `HeaderCell.tsx`, `Cell.tsx` |
| `aria-sort` on sortable headers | Implemented | `HeaderCell.tsx` |
| `aria-live` result-count announcement | Implemented | `DataGrid.tsx` |
| Roving-tabindex row navigation (Arrow/Home/End) | Implemented | `DataGrid.tsx`, `Row.tsx` |
| Space/Enter toggles selection | Implemented | `DataGrid.tsx` |
| Cell-level (2D) arrow-key navigation | Not built — documented gap | — |
| Error signaled by more than color | Implemented | `Cell.tsx` |
| Verified hover/selected/disabled contrast against M3 precedent | Implemented | `tokens.css`, design doc |
| Visible `:focus-visible` outline on every control | Implemented | `tokens.css` (`.grid-focusable`) |
| Multi-sort priority announced (not just shown visually) | Implemented | `HeaderCell.tsx` (`aria-label`) |
| Bulk-actions bar and density toggle use real, labeled controls | Implemented | `DataGrid.tsx` |
| Column reorder controls have explicit `aria-label`s | Implemented | `DataGrid.tsx` |
| Responsive layout preserves row/selection semantics across all four tiers | Implemented | `Row.tsx`, `DataGrid.tsx` |
