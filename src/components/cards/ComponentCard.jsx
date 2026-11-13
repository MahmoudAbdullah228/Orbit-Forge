'use client';

import React from 'react';
import StatRow from '../hud/StatRow';
import { sounds } from '@/lib/sound';

/**
 * ComponentCard - Styled faithfully to the user's reference arcade monitor card
 * Featuring a wide space viewport with prominent hardware graphic, category tags,
 * detailed specifications, and a bold full-width action button.
 */
export default function ComponentCard({
  item,
  selected = false,
  onSelect,
  category = 'instrument',
  disabled = false
}) {
  const handleClick = (e) => {
    if (disabled) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    sounds.select();
    if (onSelect) onSelect(item);
  };

  const game = item.game || {};
  const real = item.real || {};

  // Formatted category tag for top-left outline box
  const getCategoryBadge = () => {
    const cat = (item.category || category).toUpperCase();
    if (cat.includes('POWER') || cat.includes('SOLAR') || cat.includes('RTG') || cat.includes('BATTERY')) {
      return 'SOLAR POWER GENERATION';
    }
    if (cat.includes('LAUNCH') || cat.includes('ROCKET') || cat.includes('VEHICLE')) {
      return 'LAUNCH VEHICLE PLATFORM';
    }
    if (cat.includes('ANTENNA') || cat.includes('COMMS') || cat.includes('DISH') || cat.includes('RELAY')) {
      return 'DEEP SPACE COMMUNICATIONS';
    }
    if (cat.includes('ORBIT') || cat.includes('TRAJECTORY')) {
      return 'OPERATIONAL TRAJECTORY';
    }
    return 'SCIENTIFIC SENSOR PAYLOAD';
  };

  const getSubsystemLabel = () => {
    const cat = (item.category || category).toUpperCase();
    if (cat.includes('POWER') || cat.includes('SOLAR') || cat.includes('RTG') || cat.includes('BATTERY')) return 'POWER';
    if (cat.includes('LAUNCH') || cat.includes('ROCKET') || cat.includes('VEHICLE')) return 'VEHICLE';
    if (cat.includes('ANTENNA') || cat.includes('COMMS') || cat.includes('DISH') || cat.includes('RELAY')) return 'COMMS';
    if (cat.includes('ORBIT')) return 'ORBIT';
    return 'INSTRUMENT';
  };

  return (
    <div
      onClick={handleClick}
      role="checkbox"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`relative p-3.5 sm:p-5 transition-all duration-200 flex flex-col justify-between border-4 select-none cursor-pointer ${
        disabled
          ? 'bg-space-void/70 border-panel-border/40 opacity-50 cursor-not-allowed'
          : selected
          ? 'bg-panel-bg-raised border-hud-amber shadow-pixel-lg ring-4 ring-hud-amber/50 -translate-y-1'
          : 'bg-panel-bg border-panel-border hover:border-horizon-pink hover:shadow-pixel-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Bar with Category Outline Badge on Left & Subsystem Tag on Right */}
      <div className="flex items-center justify-between mb-3 border-b-2 border-panel-border/40 pb-2">
        <div className="border border-planet-teal bg-space-void/80 px-2.5 py-0.5 shadow-pixel-sm">
          <span className="font-small text-[9px] sm:text-[10px] text-planet-teal tracking-wider uppercase font-bold">
            {getCategoryBadge()}
          </span>
        </div>
        <span className="font-small text-[10px] text-hull-silver uppercase tracking-widest">
          {getSubsystemLabel()}
        </span>
      </div>

      {/* Main Wide Cinematic Space Viewport with Large Centered Hardware Graphic */}
      <div className="relative w-full h-64 sm:h-72 lg:h-80 bg-space-void border-2 border-panel-border mb-4 overflow-hidden shadow-inner flex items-center justify-center group">
        {/* Subtle background space stars */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        {/* Floating Moon in corner for aesthetic space realism */}
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-hull-silver/40 border border-hull-white/40 pointer-events-none" />

        {/* Hardware name overlay across top of image */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-space-void/85 border border-panel-border/70 px-3 py-1 shadow-pixel-sm">
          <span className="font-display text-[11px] sm:text-[12px] text-hud-cream truncate block max-w-[280px]">
            {item.name}
          </span>
        </div>

        {/* Selected badge overlay */}
        {selected && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-hud-amber text-space-void font-display text-[11px] px-3 py-1.5 uppercase tracking-wider flex items-center gap-1.5 shadow-pixel-md font-bold">
            <span className="blink-arcade">▶</span> EQUIPPED
          </div>
        )}

        {/* Hardware Image: Centered, Large, Clear Pixel Art */}
        {item.image ? (
          <img
            src={item.image.replace('/assets/realistic/', '/assets/pixel/')}
            alt={item.name}
            className="w-full h-full object-contain p-2 filter drop-shadow-[0_0_22px_rgba(255,178,62,0.45)] transition-transform duration-300 group-hover:scale-105 pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <span className="text-6xl">📦</span>
        )}
      </div>

      {/* Hardware Information & Descriptions */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-[13px] sm:text-[14px] text-hud-cream mb-1.5 leading-snug">
            {item.name}
          </h3>

          <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/90 leading-snug mb-3">
            {item.description}
          </p>
        </div>

        {/* Subsystem Specifications Box */}
        <div className="flex flex-col gap-1 bg-space-void/90 p-2.5 border-2 border-panel-border/60 mb-3">
          {game.cost !== undefined && (
            <StatRow label="BUDGET" value={`$${game.cost}M`} color="text-res-budget" />
          )}
          {game.mass !== undefined && (
            <StatRow label="MASS" value={`${game.mass}`} unit="kg" color="text-res-mass" />
          )}
          {game.max_payload_kg !== undefined && (
            <StatRow label="PAYLOAD CAP" value={`${game.max_payload_kg}`} unit="kg" color="text-res-mass" />
          )}
          {game.power !== undefined && (
            <StatRow label="PWR CONSUME" value={`${game.power}`} unit="W" color="text-res-power" />
          )}
          {game.power_generation !== undefined && (
            <StatRow label="PWR GENERATE" value={`+${game.power_generation}`} unit="W" color="text-success" />
          )}
          {game.data_rate !== undefined && (
            <StatRow label="DATA GEN" value={`${game.data_rate}`} unit="Mb/s" color="text-res-data" />
          )}
          {game.downlink_capacity !== undefined && (
            <StatRow label="DOWNLINK" value={`${game.downlink_capacity}`} unit="Mb/s" color="text-res-comms" />
          )}
          {game.science_value !== undefined && (
            <div className="flex items-center justify-between pt-0.5">
              <span className="font-small text-[9px] text-hull-silver">SCIENCE</span>
              <div className="text-flame-yellow text-xs tracking-wider">
                {'★'.repeat(Math.min(5, Math.max(1, Math.round(game.science_value / 6))))}
              </div>
            </div>
          )}
        </div>

        {/* Wide Action Button Styled like User's Image */}
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`w-full py-3 px-4 border-2 font-display text-[11px] sm:text-[12px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-pixel-sm ${
            selected
              ? 'bg-hud-amber text-space-void border-hud-amber font-bold shadow-pixel-md ring-2 ring-hud-amber/60'
              : 'bg-rocket-red hover:bg-rocket-red-dark text-white border-rocket-outline active:translate-y-1'
          }`}
        >
          {selected ? (
            <>
              <span className="text-sm font-bold">✔</span> EQUIPPED IN PAYLOAD
            </>
          ) : (
            <>
              <span>+</span> EQUIP HARDWARE ▶
            </>
          )}
        </button>
      </div>
    </div>
  );
}
