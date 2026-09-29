import React from 'react';

export interface AvatarProps {
  letter: string;
  imageUrl?: string;
}

/** Mirrors the Figma kit's real "Generic avatar" component (Style=Monogram):
 *  Primary Container background, On Primary Container text — not Tertiary
 *  Container, which was an earlier, corrected assumption (see design doc). */
export function Avatar({ letter, imageUrl }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        width={40}
        height={40}
        style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'var(--grid-color-primary-container)',
        color: 'var(--grid-color-on-primary-container)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--grid-font-body)',
        fontWeight: 500,
        fontSize: 16,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}
