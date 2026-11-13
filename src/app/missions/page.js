'use client';

import React from 'react';
import Link from 'next/link';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import ScenarioCard from '@/components/cards/ScenarioCard';
import PixelButton from '@/components/ui/PixelButton';
import { getScenarios } from '@/lib/data-loader';

export default function ScenariosPage() {
  const scenarios = getScenarios();

  return (
    <div className="relative min-h-screen bg-horizon-dusk flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full">
      <StarfieldCanvas speed={0.6} density={70} />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between border-b-4 border-panel-border bg-space-void/90 p-4 sm:p-5 shadow-pixel-md mb-8 w-full">
        <div className="flex items-center gap-3">
          <PixelButton href="/landing/" variant="neutral" size="sm">
            ◀ BACK
          </PixelButton>
          <div>
            <h1 className="font-display text-[16px] sm:text-[20px] text-hud-amber uppercase tracking-wide">
              SELECT CAMPAIGN DESTINATION
            </h1>
            <span className="font-small text-[10px] text-planet-teal">
              NASA SPACE MISSION DESIGN CAMPAIGNS • 3 CELESTIAL TARGETS
            </span>
          </div>
        </div>

        <div className="hidden sm:block font-small text-[11px] text-hud-cream bg-panel-bg px-3 py-1 border-2 border-panel-border">
          15 TOTAL MISSIONS
        </div>
      </header>

      {/* Scenarios Grid (Full Width) */}
      <main className="relative z-10 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center font-small text-[10px] text-hull-steel mt-8">
        MISSION ARCHITECT CONSOLE • SELECT A DESTINATION TO VIEW ITS 3 FLIGHT MISSIONS
      </footer>
    </div>
  );
}
