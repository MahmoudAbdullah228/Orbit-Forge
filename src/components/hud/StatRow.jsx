'use client';

import React from 'react';

export default function StatRow({ label, value, unit = '', color = 'text-hud-amber' }) {
  return (
    <div className="flex items-center justify-between font-body text-[15px] sm:text-[16px] border-b border-panel-border/40 py-0.5">
      <span className="font-small text-[9px] sm:text-[10px] text-hull-silver uppercase tracking-wider">
        {label}
      </span>
      <span className={`font-display text-[10px] sm:text-[11px] ${color}`}>
        {value} <span className="font-body text-[14px] text-hull-steel">{unit}</span>
      </span>
    </div>
  );
}
