import React from 'react';
import type { CellState } from '../types';

export interface CellProps {
  value: string;
  state?: CellState;
  /** Cell's own State is intentionally NOT derived from the parent Row's state —
   *  see the design doc's "Cell embedded in Row" writeup. A Selected or Hover
   *  row can contain a Default, Editing, or Error cell; the two axes are
   *  orthogonal by design. */
  width?: number | string;
}

/** Mirrors the Figma "Cell" component set 1:1: Default is transparent (inherits
 *  the row), Editing lifts with Surface Container Highest + a 1dp Outline border,
 *  Error mirrors M3's real Text Field error convention (1dp Error border + a
 *  small error icon) rather than a full-container recolor. */
export function Cell({ value, state = 'default', width = 140 }: CellProps) {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end', // right-aligned — numeric-table convention, fixed
    height: 40,
    width,
    flexShrink: 0,
    padding: '0 16px',
    borderRadius: 4,
    fontFamily: 'var(--grid-font-body)',
    fontSize: 14,
    letterSpacing: 0.25,
    color: 'var(--grid-color-on-surface)',
  };

  if (state === 'editing') {
    Object.assign(base, {
      background: 'var(--grid-color-surface-container-highest)',
      border: '1px solid var(--grid-color-outline)',
    });
  } else if (state === 'error') {
    Object.assign(base, {
      border: '1px solid var(--grid-color-error)',
    });
  }

  return (
    <div style={base} role="gridcell" aria-invalid={state === 'error' || undefined}>
      <span className="grid-numeric">{value}</span>
      {state === 'error' && (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ marginLeft: 8, flexShrink: 0 }} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="var(--grid-color-error)" />
          <rect x="11" y="6" width="2" height="7" fill="var(--grid-color-on-error)" />
          <rect x="11" y="15" width="2" height="2" fill="var(--grid-color-on-error)" />
        </svg>
      )}
    </div>
  );
}
