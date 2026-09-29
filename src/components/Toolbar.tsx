import React from 'react';
import type { ToolbarState } from '../types';

export interface ToolbarProps {
  title: string;
  state?: ToolbarState;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onOpenSearch?: () => void;
  /** Number of columns currently hidden via the Columns panel. Deliberately
   *  NOT called `activeFilterCount` — see the design doc's writeup on the
   *  "Filters" naming collision this replaced. Toggling which columns are
   *  visible is a different operation from filtering row VALUES (that lives
   *  on each HeaderCell's own per-column filter icon), so this button and
   *  its badge are named for what they actually do. */
  hiddenColumnCount?: number;
  onOpenColumns?: () => void;
}

/** Mirrors the Figma "Toolbar" component set: Default, Search active, Columns
 *  hidden. In the live DataGrid, `state` is derived automatically from
 *  whether the search field has focus/text — it's still exposed as a prop
 *  here so Storybook can force each of the three variants independently,
 *  matching Figma 1:1. */
export function Toolbar({ title, state = 'default', searchValue = '', onSearchChange, onOpenSearch, hiddenColumnCount = 0, onOpenColumns }: ToolbarProps) {
  const showSearchField = state === 'search-active' || searchValue.length > 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 64,
        width: '100%',
        padding: '0 16px',
        background: 'var(--grid-color-surface-container)',
        fontFamily: 'var(--grid-font-body)',
      }}
    >
      {!showSearchField && (
        <>
          <div style={{ flex: 1, fontSize: 22, color: 'var(--grid-color-on-surface)' }}>{title}</div>
          <button
            type="button"
            onClick={onOpenSearch}
            className="grid-focusable"
            aria-label="Open search"
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6" fill="none" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} />
              <line x1="16" y1="16" x2="21" y2="21" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} />
            </svg>
          </button>
        </>
      )}

      {showSearchField && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 40,
            padding: '0 12px',
            border: '1px solid var(--grid-color-outline)',
            borderRadius: 20,
            background: 'var(--grid-color-surface)',
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6" fill="none" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} />
            <line x1="16" y1="16" x2="21" y2="21" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search clients & accounts"
            aria-label="Search clients and accounts"
            className="grid-focusable"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              font: 'inherit',
              fontSize: 14,
              color: 'var(--grid-color-on-surface)',
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={onOpenColumns}
        className="grid-focusable"
        aria-label="Columns"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 32,
          padding: '0 12px',
          border: 'none',
          borderRadius: 16,
          background: hiddenColumnCount > 0 ? 'var(--grid-color-primary-container)' : 'transparent',
          color: hiddenColumnCount > 0 ? 'var(--grid-color-on-primary-container)' : 'var(--grid-color-on-surface-variant)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {/* Three vertical bars — a distinct glyph from HeaderCell's funnel icon,
            on purpose: this toggles which columns show, it doesn't filter row
            values, so it shouldn't borrow the "filter" funnel's shape either. */}
        <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="4" height="16" rx="1" fill="currentColor" />
          <rect x="10" y="4" width="4" height="16" rx="1" fill="currentColor" />
          <rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor" />
        </svg>
        Columns
        {hiddenColumnCount > 0 && (
          <span
            style={{
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: 'var(--grid-color-on-primary-container)',
              color: 'var(--grid-color-primary-container)',
              fontSize: 11,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}
          >
            {hiddenColumnCount}
          </span>
        )}
      </button>
    </div>
  );
}
