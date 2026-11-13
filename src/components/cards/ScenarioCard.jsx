'use client';

import React from 'react';
import Chip from '../ui/Chip';
import { sounds } from '@/lib/sound';

export default function ScenarioCard({ scenario }) {
  let difficultyColor = 'amber';
  if (scenario.difficulty === 'Beginner') difficultyColor = 'green';
  if (scenario.difficulty === 'Advanced') difficultyColor = 'red';

  const handleOpenScenario = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    sounds.click();
    window.location.href = `/missions/${scenario.id}/`;
  };

  return (
    <div
      onClick={handleOpenScenario}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenScenario(e);
        }
      }}
      className="bg-panel-bg border-4 border-panel-border shadow-pixel-lg p-4 sm:p-6 flex flex-col justify-between hover:border-hud-amber transition-all hover:-translate-y-1 group cursor-pointer select-none"
    >
      <div>
        {/* Top category bar */}
        <div className="flex items-center justify-between mb-3 border-b-2 border-panel-border/40 pb-2">
          <div className="border border-planet-teal bg-space-void/80 px-2.5 py-0.5">
            <span className="font-small text-[10px] text-planet-teal uppercase font-bold tracking-wider">
              {scenario.destination} EXPLORATION CAMPAIGN
            </span>
          </div>
          <Chip color={difficultyColor}>{scenario.difficulty}</Chip>
        </div>

        {/* Wide Space Viewport for Planet */}
        <div className="w-full h-56 sm:h-64 bg-space-void border-2 border-panel-border mb-4 flex items-center justify-center p-4 overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
          <img
            src={scenario.image.replace('/assets/realistic/', '/assets/pixel/')}
            alt={scenario.destination}
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain filter drop-shadow-[0_0_20px_rgba(46,230,168,0.4)] transition-transform duration-300 group-hover:scale-105 pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute top-2 left-2 bg-space-void/80 border border-panel-border/60 px-2.5 py-0.5">
            <span className="font-display text-[10px] sm:text-[11px] text-hud-cream uppercase">
              {scenario.destination}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 bg-space-void/80 border border-panel-border/60 px-2 py-0.5">
            <span className="font-small text-[9px] text-hud-amber">
              3 FLIGHT MISSIONS
            </span>
          </div>
        </div>

        <h2 className="font-display text-[15px] sm:text-[17px] text-hud-amber mb-2 uppercase">
          {scenario.title}
        </h2>

        <p className="font-body text-[16px] sm:text-[18px] text-hud-cream/90 leading-snug mb-5">
          {scenario.description}
        </p>
      </div>

      <button
        type="button"
        onClick={handleOpenScenario}
        className="w-full py-3.5 px-4 bg-rocket-red hover:bg-rocket-red-dark text-white font-display text-[11px] sm:text-[12px] tracking-wider uppercase border-2 border-rocket-outline shadow-pixel-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-bold active:translate-y-1"
      >
        <span>SELECT DESTINATION & MISSIONS ▶</span>
      </button>
    </div>
  );
}
