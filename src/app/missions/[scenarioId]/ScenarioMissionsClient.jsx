'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import MissionCard from '@/components/cards/MissionCard';
import PixelButton from '@/components/ui/PixelButton';
import Chip from '@/components/ui/Chip';
import { getScenarioById } from '@/lib/data-loader';
import { getUnlockedMissions, getMissionResults } from '@/lib/storage';

export default function ScenarioMissionsClient({ scenarioId }) {
  const scenario = getScenarioById(scenarioId);

  const [unlockedList, setUnlockedList] = useState([]);
  const [resultsMap, setResultsMap] = useState({});

  useEffect(() => {
    if (!scenario) return;
    const unlocked = getUnlockedMissions(scenario.id);
    setUnlockedList(unlocked);

    const results = {};
    for (const mission of scenario.missions) {
      results[mission.id] = getMissionResults(mission.id);
    }
    setResultsMap(results);
  }, [scenario]);

  if (!scenario) {
    return (
      <div className="min-h-screen bg-space-void text-hud-cream p-8 flex flex-col items-center justify-center">
        <h1 className="font-display text-xl text-danger mb-4">CAMPAIGN NOT FOUND</h1>
        <PixelButton href="/missions/" variant="neutral">RETURN TO CAMPAIGNS</PixelButton>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-horizon-dusk flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full">
      <StarfieldCanvas speed={0.7} density={65} />

      {/* Header bar */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-panel-border bg-space-void/90 p-4 sm:p-5 shadow-pixel-md gap-4 mb-8 w-full">
        <div className="flex items-center gap-4">
          <PixelButton href="/missions/" variant="neutral" size="sm">
            ◀ ALL CAMPAIGNS
          </PixelButton>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[16px] sm:text-[20px] text-hud-amber uppercase tracking-wide">
                {scenario.title}
              </h1>
              <Chip color="teal">{scenario.destination}</Chip>
            </div>
            <span className="font-small text-[10px] text-hull-silver">
              PROGRESSION: {Math.min(unlockedList.length, 3)} / 3 MISSIONS UNLOCKED
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-small text-[11px] text-hud-cream bg-panel-bg px-3 py-1 border-2 border-panel-border">
            3-FLIGHT CAMPAIGN SEQUENCE
          </span>
        </div>
      </header>

      {/* Missions Grid (Strictly 3 Columns across full width) */}
      <main className="relative z-10 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenario.missions.slice(0, 3).map((mission, index) => {
            const isUnlocked = index === 0 || unlockedList.includes(mission.id);
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                scenarioId={scenario.id}
                isUnlocked={isUnlocked}
                result={resultsMap[mission.id]}
              />
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center font-small text-[10px] text-hull-steel mt-8">
        COMPLETE EACH FLIGHT MISSION TO UNLOCK ADVANCED SUBSYSTEM OBJECTIVES
      </footer>
    </div>
  );
}
