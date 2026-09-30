import React, { useEffect, useRef } from 'react';
import type { ToolbarState } from '../types';

export interface ToolbarProps {
  title: string;
  state?: ToolbarState;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onOpenSearch?: () => void;
  /** Fires when focus leaves the search field/clear-button group entirely
   *  (not when it just moves between the input and the clear button — see
   *  the wrapping div's onBlur below). The caller decides whether this
   *  actually collapses anything: in DataGrid, `state` is derived as
   *  `searchOpen || searchTerm ? 'search-active' : 'default'`, so calling
   *  this while there's still text in the field is harmless — the field
   *  stays open because of the searchTerm half of that check, not this
   *  callback. That's deliberate: collapsing a field that still has an
   *  active query would hide a live filter with no visible sign it's still
   *  narrowing the grid. The clear (X) button is the explicit way to both
   *  empty and close it. */
  onBlurSearch?: () => void;
}

/** Mirrors the Figma "Toolbar" component set: Default, Search active, Columns
 *  hidden. In the live DataGrid, `state` is derived automatically from
 *  whether the search field has focus/text — it's still exposed as a prop
 *  here so Storybook can force each of the three variants independently,
 *  matching Figma 1:1. */
export function Toolbar({
  title,
  state = 'default',
  searchValue = '',
  onSearchChange,
  onOpenSearch,
  onBlurSearch,
}: ToolbarProps) {
  const showSearchField = state === 'search-active' || searchValue.length > 0;
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Clicking the search icon only sets `searchOpen` — it never puts actual
  // keyboard focus on the input that appears (there's nothing to focus yet
  // at the moment of that click; the field doesn't exist in the DOM until
  // this re-renders). Without this, the field's own onBlur below never has
  // anything to fire from: nothing was ever focused, so nothing ever blurs,
  // and clicking anywhere else in the grid would silently leave an empty
  // field open forever. Runs after the field mounts (this effect fires
  // post-render), so the ref is already attached.
  useEffect(() => {
    if (showSearchField) {
      searchInputRef.current?.focus();
    }
  }, [showSearchField]);

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
          // Fires when focus leaves this whole group, not when it just moves
          // between the input and the clear button below (both live inside
          // this same div) — e.relatedTarget is the element about to receive
          // focus, so contains() tells the two cases apart. Clicking the
          // clear button still counts as "staying inside" even though it
          // removes the thing focus was just on, since relatedTarget is
          // resolved against the *new* focus target, not the old value.
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              onBlurSearch?.();
            }
          }}
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
          <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="6" fill="none" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} />
            <line x1="16" y1="16" x2="21" y2="21" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search clients & accounts"
            aria-label="Search clients and accounts"
            className="grid-focusable"
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              font: 'inherit',
              fontSize: 14,
              color: 'var(--grid-color-on-surface)',
            }}
          />
          {searchValue.length > 0 && (
            <button
              type="button"
              onClick={() => {
                // Clears the text but deliberately does NOT collapse the
                // field itself — focus never leaves this group (it moves
                // from the input to this button, both inside the onBlur
                // wrapper above), and refocusing the input lets the person
                // immediately type a new query instead of having to click
                // back into an empty field. It'll only actually collapse
                // once they blur away from it while it's empty, same as any
                // other empty search field.
                onSearchChange?.('');
                searchInputRef.current?.focus();
              }}
              className="grid-focusable"
              aria-label="Clear search"
              style={{
                width: 20,
                height: 20,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                background: 'none',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                <line x1="6" y1="6" x2="18" y2="18" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} strokeLinecap="round" />
                <line x1="18" y1="6" x2="6" y2="18" stroke="var(--grid-color-on-surface-variant)" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
