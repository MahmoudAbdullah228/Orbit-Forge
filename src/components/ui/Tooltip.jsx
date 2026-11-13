'use client';

import React, { useState } from 'react';

/**
 * Tooltip - Retro tooltip as per DESIGN.md (hud-cream fill, space-void text, 4px hud-amber border)
 */
export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  let posStyle = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
  if (position === 'bottom') posStyle = 'top-full left-1/2 -translate-x-1/2 mt-2';
  if (position === 'left') posStyle = 'right-full top-1/2 -translate-y-1/2 mr-2';
  if (position === 'right') posStyle = 'left-full top-1/2 -translate-y-1/2 ml-2';

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          role="tooltip"
          className={`absolute ${posStyle} z-40 bg-hud-cream text-space-void border-2 border-hud-amber px-3 py-1.5 font-body text-[18px] leading-tight shadow-pixel-sm pointer-events-none whitespace-normal max-w-xs text-center`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
