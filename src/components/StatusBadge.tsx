import React from 'react';
import type { AccountStatus } from '../types';

const TONE: Record<AccountStatus, { bg: string; fg: string; label: string }> = {
  active: { bg: 'var(--grid-color-tertiary-container)', fg: 'var(--grid-color-on-tertiary-container)', label: 'Active' },
  overdue: { bg: 'var(--grid-color-error-container)', fg: 'var(--grid-color-on-error-container)', label: 'Overdue' },
  inactive: { bg: 'var(--grid-color-inactive-bg)', fg: 'var(--grid-color-inactive-fg)', label: 'Inactive' },
};

export interface StatusBadgeProps {
  status: AccountStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone = TONE[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: 1000,
        background: tone.bg,
        color: tone.fg,
        fontFamily: 'var(--grid-font-body)',
        fontWeight: 500,
        fontSize: 11,
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      {tone.label}
    </span>
  );
}
