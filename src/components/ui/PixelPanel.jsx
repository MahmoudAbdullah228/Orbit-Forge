'use client';

import React from 'react';

/**
 * PixelPanel - Core retro container component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.title]
 * @param {'default'|'raised'|'selected'|'dark'} [props.variant='default']
 * @param {string} [props.className='']
 * @param {string} [props.titleAction]
 */
export default function PixelPanel({
  children,
  title,
  variant = 'default',
  className = '',
  titleAction,
  ...rest
}) {
  let variantStyle = 'bg-panel-bg border-4 border-panel-border shadow-pixel-sm';
  if (variant === 'raised') {
    variantStyle = 'bg-panel-bg-raised border-4 border-panel-border shadow-pixel-md';
  } else if (variant === 'selected') {
    variantStyle = 'bg-panel-bg border-4 border-hud-amber shadow-pixel-md';
  } else if (variant === 'dark') {
    variantStyle = 'bg-space-void border-4 border-panel-border shadow-pixel-sm';
  }

  return (
    <div className={`relative ${variantStyle} ${className}`} {...rest}>
      {title && (
        <div className="bg-panel-bg-raised border-b-4 border-panel-border px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-hud-amber text-[11px] sm:text-[13px] font-display uppercase tracking-wider">
              {title}
            </span>
          </div>
          {titleAction && <div>{titleAction}</div>}
        </div>
      )}
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}
