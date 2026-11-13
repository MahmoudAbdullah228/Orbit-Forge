'use client';

import React from 'react';
import ResourceBar from './ResourceBar';

/**
 * ResourceHUD - The command center's 6 resource gauges
 * Order per DESIGN.md: BUDGET, MASS, POWER, DATA, COMMS, TIME
 */
export default function ResourceHUD({
  resources = {},
  limits = {},
  compact = false,
  className = '',
  title = 'RESOURCE STATUS'
}) {
  const dataList = [
    {
      key: 'budget',
      current: resources.budget ?? 70,
      max: limits.budget ?? 100,
      inverted: false
    },
    {
      key: 'mass',
      current: resources.mass ?? 20,
      max: limits.mass ?? 100,
      inverted: true // High mass approaches launcher limit
    },
    {
      key: 'power',
      current: resources.power ?? 60,
      max: limits.power ?? 100,
      inverted: false
    },
    {
      key: 'data',
      current: resources.data ?? 40,
      max: limits.data ?? 100,
      inverted: false
    },
    {
      key: 'communication',
      current: resources.communication ?? 50,
      max: limits.communication ?? 100,
      inverted: false
    },
    {
      key: 'time',
      current: resources.time ?? 24,
      max: limits.time ?? 36,
      inverted: false
    }
  ];

  if (compact) {
    return (
      <div className={`bg-panel-bg/95 border-b-2 border-panel-border py-1 px-2.5 grid grid-cols-3 sm:grid-cols-6 gap-2 shadow-pixel-sm ${className}`}>
        {dataList.map((item) => (
          <ResourceBar
            key={item.key}
            resourceKey={item.key}
            current={item.current}
            max={item.max}
            inverted={item.inverted}
            segmentsCount={8}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-panel-bg border-4 border-panel-border shadow-pixel-md p-4 flex flex-col gap-3.5 ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-panel-border pb-2">
        <span className="font-display text-[13px] text-hud-amber tracking-wider uppercase">
          {title}
        </span>
        <span className="font-small text-[10px] text-planet-teal">LIVE TELEMETRY</span>
      </div>

      <div className="flex flex-col gap-3">
        {dataList.map((item) => (
          <ResourceBar
            key={item.key}
            resourceKey={item.key}
            current={item.current}
            max={item.max}
            inverted={item.inverted}
            segmentsCount={12}
          />
        ))}
      </div>
    </div>
  );
}
