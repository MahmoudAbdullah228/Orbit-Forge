'use client';

import React from 'react';
import Chip from '../ui/Chip';
import { sounds } from '@/lib/sound';

export default function MissionCard({
  mission,
  scenarioId,
  isUnlocked = false,
  result = null
}) {
  const destName = scenarioId.includes('mars') ? 'mars' : scenarioId.includes('earth') ? 'earth' : 'moon';

  const handleOpenBriefing = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isUnlocked) return;
    sounds.click();
    window.location.href = `/mission/${mission.id}/dashboard/`;
  };

  return (
    <div
      onClick={handleOpenBriefing}
      role={isUnlocked ? 'button' : undefined}
      tabIndex={isUnlocked ? 0 : -1}
      onKeyDown={(e) => {
        if (isUnlocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleOpenBriefing(e);
        }
      }}
      className={`border-4 p-4 sm:p-5 flex flex-col justify-between transition-all select-none ${
        isUnlocked
          ? 'bg-panel-bg border-panel-border hover:border-hud-amber shadow-pixel-md hover:-translate-y-1 cursor-pointer'
          : 'bg-space-void/60 border-space-purple/50 opacity-60 cursor-not-allowed'
      }`}
    >
      <div>
        {/* Top category bar */}
        <div className="flex items-center justify-between mb-3 border-b-2 border-panel-border/40 pb-2">
          <div className="border border-planet-teal bg-space-void/80 px-2.5 py-0.5">
            <span className="font-small text-[9px] text-planet-teal uppercase font-bold tracking-wider">
              MISSION FLIGHT {mission.number}
            </span>
          </div>
          <Chip color={isUnlocked ? 'teal' : 'silver'}>
            {isUnlocked ? 'READY FOR FLIGHT' : 'LOCKED'}
          </Chip>
        </div>

        {/* Space Viewport showing Mission Destination and Flight Status */}
        <div className="w-full h-48 sm:h-56 bg-space-void border-2 border-panel-border mb-3 flex items-center justify-center p-3 overflow-hidden relative shadow-inner group">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
          <img
            src={`/assets/pixel/destinations/${destName}.png`}
            alt={mission.title}
            className="w-36 h-36 sm:w-44 sm:h-44 object-contain filter drop-shadow-[0_0_20px_rgba(255,178,62,0.4)] transition-transform duration-300 group-hover:scale-105 pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute top-2 left-2 bg-space-void/80 border border-panel-border/60 px-2 py-0.5">
            <span className="font-display text-[10px] text-hud-cream uppercase">
              M{mission.number} • {mission.required_orbit}
            </span>
          </div>
          {result && (
            <div className="absolute bottom-2 right-2 bg-space-void/90 border border-hud-amber px-2 py-0.5 flex items-center gap-1 text-flame-yellow text-xs">
              {'★'.repeat(result.stars || 3)}
              <span className="font-display text-[9px] text-hud-amber ml-1">
                {result.score} PTS
              </span>
            </div>
          )}
        </div>

        {/* Title & description */}
        <h3 className="font-display text-[13px] sm:text-[14px] text-hud-cream mb-2 leading-snug">
          {mission.title}
        </h3>
        <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/80 mb-3 leading-snug">
          {mission.description}
        </p>

        {/* Requirements */}
        <div className="bg-space-void/90 p-2.5 border border-panel-border/60 mb-4">
          <div className="font-small text-[9px] text-hull-silver mb-1 uppercase tracking-wider">
            PRIMARY TARGET TASKS:
          </div>
          <ul className="list-disc list-inside font-body text-[15px] sm:text-[16px] text-hud-cream space-y-0.5">
            {mission.tasks.map((task) => (
              <li key={task.id}>{task.label}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Button */}
      <div>
        {isUnlocked ? (
          <button
            type="button"
            onClick={handleOpenBriefing}
            className="w-full py-3.5 px-4 bg-rocket-red hover:bg-rocket-red-dark text-white font-display text-[11px] sm:text-[12px] tracking-wider uppercase border-2 border-rocket-outline shadow-pixel-md active:translate-y-1 transition-all cursor-pointer font-bold"
          >
            ENTER MISSION BRIEFING ▶
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3 px-4 bg-space-void/80 text-hull-steel font-display text-[10px] tracking-wider uppercase border-2 border-panel-border/40 cursor-not-allowed"
          >
            🔒 COMPLETE PREVIOUS MISSION TO UNLOCK
          </button>
        )}
      </div>
    </div>
  );
}
