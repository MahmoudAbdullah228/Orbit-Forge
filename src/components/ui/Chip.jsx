'use client';

import React from 'react';

/**
 * Chip - Status, category, and constraint tags
 *
 * @param {Object} props
 * @param {'amber'|'teal'|'blue'|'pink'|'silver'|'red'|'green'} [props.color='amber']
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 */
export default function Chip({ color = 'amber', children, className = '' }) {
  let colorClasses = 'border-hud-amber text-hud-amber bg-hud-amber/10';
  if (color === 'teal') colorClasses = 'border-planet-teal text-planet-teal bg-planet-teal/10';
  if (color === 'blue') colorClasses = 'border-porthole-blue text-porthole-blue bg-porthole-blue/10';
  if (color === 'pink') colorClasses = 'border-horizon-pink text-horizon-pink bg-horizon-pink/10';
  if (color === 'silver') colorClasses = 'border-hull-silver text-hull-silver bg-hull-silver/10';
  if (color === 'red') colorClasses = 'border-danger text-danger bg-danger/10';
  if (color === 'green') colorClasses = 'border-success text-success bg-success/10';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border-2 text-[11px] font-small tracking-wider uppercase ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
}
