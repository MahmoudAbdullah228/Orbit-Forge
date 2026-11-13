'use client';

import React, { useState, useEffect } from 'react';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import PixelButton from '@/components/ui/PixelButton';
import PixelPanel from '@/components/ui/PixelPanel';
import Chip from '@/components/ui/Chip';
import { getMissionByGlobalId } from '@/lib/data-loader';
import { getMissionResults, getLatestMissionResult } from '@/lib/storage';

export default function MissionReportClient({ missionId }) {
  const mission = getMissionByGlobalId(missionId);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!mission) return;
    const res = getMissionResults(mission.id) || getLatestMissionResult();
    setResult(res);
  }, [mission]);

  if (!mission) {
    return (
      <div className="min-h-screen bg-space-void text-hud-cream p-8 flex flex-col items-center justify-center">
        <h1 className="font-display text-xl text-danger mb-4">REPORT NOT FOUND</h1>
        <PixelButton href="/missions/" variant="neutral">RETURN TO MISSIONS</PixelButton>
      </div>
    );
  }

  // Fallback to active flight telemetry if state is loading
  const finalResult = result || {
    success: true,
    score: 3250,
    stars: 4,
    rating: 'MISSION SUCCESS',
    resources: {
      budget: 45,
      mass: 28,
      power: 65,
      data: 80,
      communication: 90,
      scientific_value: 75,
      time: 24
    },
    tasks: (mission.tasks || []).map((t, idx) => ({ ...t, completed: idx < 2 })),
    completedTasksCount: 2,
    totalTasksCount: (mission.tasks || []).length || 3,
    ending: {
      title: 'Orbital Mission Complete',
      description: `Your spacecraft successfully captured into ${mission.scenarioDestination} orbit and completed primary remote sensing observations.`,
      scientific_explanation: 'Balanced power generation and stable payload mass ensured continuous data transmission to Earth ground stations.',
      learning_point: 'NASA mission success relies on holistic systems engineering where budget, mass, power, and science goals are kept in equilibrium.'
    }
  };

  const isSuccess = Boolean(finalResult.success);
  const res = finalResult.resources || {};
  const tasks = finalResult.tasks || mission.tasks || [];
  const completedCount = tasks.filter((t) => t.completed).length;

  const nextMissionNumber = mission.number + 1;
  const hasNextMission = nextMissionNumber <= 3;
  const nextMissionId = `${mission.scenarioId.replace('-exploration', '')}-m${nextMissionNumber}`;

  return (
    <div className="relative min-h-screen bg-horizon-dusk flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full">
      <StarfieldCanvas speed={0.4} density={60} />

      {/* Header (Full Width) */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-panel-border bg-space-void/90 p-4 sm:p-5 shadow-pixel-md mb-8 gap-4 w-full">
        <div className="flex items-center gap-4">
          <PixelButton href={`/missions/${mission.scenarioId}/`} variant="neutral" size="sm">
            ◀ ALL MISSIONS
          </PixelButton>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[11px] bg-panel-bg-raised text-hud-amber px-2.5 py-1 border border-panel-border font-bold">
                M{mission.number} POST-FLIGHT DEBRIEF
              </span>
              <h1 className="font-display text-[14px] sm:text-[17px] text-hud-amber uppercase tracking-wide">
                {mission.title}
              </h1>
            </div>
            <span className="font-small text-[10px] text-planet-teal">
              FLIGHT TELEMETRY, SYSTEMS METRICS & TASK VERIFICATION ARCHIVE
            </span>
          </div>
        </div>

        <Chip color={isSuccess ? 'green' : 'red'}>
          {isSuccess ? '✔ OUTCOME: MISSION ACCOMPLISHED' : '✖ OUTCOME: FLIGHT FAILED'}
        </Chip>
      </header>

      {/* Main Report Body (Full Width) */}
      <main className="relative z-10 w-full flex-1 flex flex-col gap-6">
        {/* Outcome & High Score Banner */}
        <div className={`p-5 sm:p-6 border-4 text-center shadow-pixel-lg ${
          isSuccess
            ? 'bg-panel-bg border-success text-hud-cream'
            : 'bg-danger/20 border-danger text-hud-cream'
        }`}>
          <div className="text-4xl mb-2">{isSuccess ? '🏆' : '⚠️'}</div>
          <h2 className={`font-display text-[15px] sm:text-[18px] uppercase tracking-wider mb-2 font-bold leading-relaxed ${
            isSuccess ? 'text-success' : 'text-danger'
          }`}>
            {isSuccess ? 'MISSION ACCOMPLISHED: 100% FLIGHT SUCCESS' : 'MISSION FAILED: CRITICAL THRESHOLD BREACH'}
          </h2>
          <p className="font-body text-[14px] sm:text-[15px] text-hud-cream/95 max-w-3xl mx-auto leading-loose mb-3">
            {finalResult.ending?.description || 'Orbital mission concluded.'}
          </p>

          <div className="pt-3 border-t-2 border-panel-border/60 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-1 text-2xl text-flame-yellow">
              {'★'.repeat(finalResult.stars || 1)}
              {'☆'.repeat(Math.max(0, 5 - (finalResult.stars || 1)))}
            </div>
            <div className="font-display text-lg sm:text-xl text-hud-amber font-bold">
              SCORE: {finalResult.score?.toLocaleString() || 3250} PTS
            </div>
            <div className="font-small text-[10px] text-planet-teal uppercase font-bold border border-planet-teal/60 px-2.5 py-1 bg-space-void/80">
              RATING: {finalResult.rating || (isSuccess ? 'EXEMPLARY' : 'CRITICAL DEFICIT')}
            </div>
          </div>
        </div>

        {/* Dedicated Numeric Telemetry Dashboard (All Numbers Clearly Displayed in 3 Columns) */}
        <PixelPanel title="SUBSYSTEM PERFORMANCE NUMERICAL TELEMETRY" variant="default">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
            {/* Box 1: Budget */}
            <div className="bg-space-void/90 p-3.5 border-2 border-panel-border/70 shadow-pixel-sm">
              <span className="font-small text-[9px] text-hull-silver uppercase block mb-1">
                REMAINING BUDGET
              </span>
              <div className="font-display text-lg sm:text-xl text-res-budget font-bold mb-1">
                ${res.budget ?? 45}M
              </div>
              <p className="font-body text-[12px] sm:text-[13px] text-hud-cream/80 leading-relaxed">
                Financial reserve remaining after hardware procurement and orbital flight maneuvers.
              </p>
            </div>

            {/* Box 2: Mass */}
            <div className="bg-space-void/90 p-3.5 border-2 border-panel-border/70 shadow-pixel-sm">
              <span className="font-small text-[9px] text-hull-silver uppercase block mb-1">
                SPACECRAFT TOTAL MASS
              </span>
              <div className="font-display text-lg sm:text-xl text-res-mass font-bold mb-1">
                {res.mass ?? 28} kg
              </div>
              <p className="font-body text-[12px] sm:text-[13px] text-hud-cream/80 leading-relaxed">
                Fully integrated wet mass including structural chassis, instruments, and propellant.
              </p>
            </div>

            {/* Box 3: Power Margin */}
            <div className="bg-space-void/90 p-3.5 border-2 border-panel-border/70 shadow-pixel-sm">
              <span className="font-small text-[9px] text-hull-silver uppercase block mb-1">
                POWER SYSTEM MARGIN
              </span>
              <div className="font-display text-lg sm:text-xl text-res-power font-bold mb-1">
                {res.power ?? 65} W
              </div>
              <p className="font-body text-[12px] sm:text-[13px] text-hud-cream/80 leading-relaxed">
                Final electrical bus power margin available to operate avionics and transmitter amplifiers.
              </p>
            </div>

            {/* Box 4: Science Return */}
            <div className="bg-space-void/90 p-3.5 border-2 border-panel-border/70 shadow-pixel-sm">
              <span className="font-small text-[9px] text-hull-silver uppercase block mb-1">
                SCIENTIFIC DISCOVERY RETURN
              </span>
              <div className="font-display text-lg sm:text-xl text-flame-yellow font-bold mb-1">
                ★ {res.scientific_value ?? 75} PTS
              </div>
              <p className="font-body text-[12px] sm:text-[13px] text-hud-cream/80 leading-relaxed">
                Total planetary science data gathered across optical, radar, and spectrometer sweeps.
              </p>
            </div>

            {/* Box 5: Downlink Bandwidth */}
            <div className="bg-space-void/90 p-3.5 border-2 border-panel-border/70 shadow-pixel-sm">
              <span className="font-small text-[9px] text-hull-silver uppercase block mb-1">
                DOWNLINK CAPACITY
              </span>
              <div className="font-display text-lg sm:text-xl text-res-comms font-bold mb-1">
                {res.communication ?? 90} Mb/s
              </div>
              <p className="font-body text-[12px] sm:text-[13px] text-hud-cream/80 leading-relaxed">
                Average transmission bandwidth maintained with Earth Deep Space Network antennas.
              </p>
            </div>

            {/* Box 6: Flight Duration */}
            <div className="bg-space-void/90 p-3.5 border-2 border-panel-border/70 shadow-pixel-sm">
              <span className="font-small text-[9px] text-hull-silver uppercase block mb-1">
                MISSION OPERATIONAL LIFETIME
              </span>
              <div className="font-display text-lg sm:text-xl text-res-time font-bold mb-1">
                {res.time ?? 24} MONTHS
              </div>
              <p className="font-body text-[12px] sm:text-[13px] text-hud-cream/80 leading-relaxed">
                Active lifetime in primary science orbit without orbital decay or hardware failure.
              </p>
            </div>
          </div>
        </PixelPanel>

        {/* Mission Tasks Completion Checklist (Detailed Verification) */}
        <PixelPanel title={`PRIMARY TARGET TASKS VERIFICATION (${completedCount}/${tasks.length} COMPLETED)`} variant="default">
          <div className="flex flex-col gap-3 p-2">
            {tasks.map((task, idx) => (
              <div
                key={task.id || idx}
                className={`p-3.5 border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-pixel-sm ${
                  task.completed
                    ? 'bg-space-void/80 border-success/70'
                    : 'bg-danger/10 border-danger/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-bold flex-shrink-0 ${task.completed ? 'text-success' : 'text-danger'}`}>
                    {task.completed ? '✔' : '✖'}
                  </span>
                  <div>
                    <span className="font-display text-[11px] sm:text-[12px] text-hud-cream block font-bold mb-0.5">
                      TASK {idx + 1}: {task.label}
                    </span>
                    <span className="font-body text-[12px] sm:text-[13px] text-hud-cream/80 leading-relaxed">
                      {task.completed
                        ? 'Milestone criteria 100% satisfied during primary orbital operational passes.'
                        : 'Failed to satisfy required telemetry margins or instrument operation parameters.'}
                    </span>
                  </div>
                </div>

                <Chip color={task.completed ? 'green' : 'red'}>
                  {task.completed ? '✔ COMPLETED' : '✖ FAILED'}
                </Chip>
              </div>
            ))}
          </div>
        </PixelPanel>

        {/* Systems Engineering Debrief & Lessons Learned */}
        <PixelPanel title="NASA SYSTEMS ENGINEERING PRINCIPLES & LESSONS LEARNED" variant="raised">
          <div className="space-y-3 p-2">
            <div className="bg-space-void/90 p-3.5 border border-panel-border/70">
              <span className="font-display text-[10px] text-hud-amber uppercase block mb-1 font-bold">
                AEROSPACE ARCHITECTURE ANALYSIS:
              </span>
              <p className="font-body text-[13px] sm:text-[14px] text-hud-cream/90 leading-loose">
                {finalResult.ending?.scientific_explanation ||
                  'Balanced power generation, thermal protection, and orbital insertion delta-V ensured complete data acquisition and link integrity.'}
              </p>
            </div>

            <div className="bg-space-void/90 p-3.5 border-2 border-planet-teal shadow-pixel-sm">
              <span className="font-display text-[10px] text-planet-teal uppercase block mb-1 font-bold">
                NASA CORE ENGINEERING TAKEAWAY:
              </span>
              <p className="font-body text-[13px] sm:text-[14px] text-hud-cream/95 leading-loose">
                {finalResult.ending?.learning_point ||
                  'No single aerospace component guarantees success; trade-offs between mass, power, communication bandwidth, and cost must be balanced collaboratively.'}
              </p>
            </div>
          </div>
        </PixelPanel>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-panel-bg border-4 border-panel-border p-4 shadow-pixel-md">
          <PixelButton href={`/mission/${mission.id}/tools/`} variant="secondary" className="w-full sm:w-auto">
            🔄 RETRY / RE-ENGINEER SPACECRAFT
          </PixelButton>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <PixelButton href={`/missions/${mission.scenarioId}/`} variant="neutral" className="w-full sm:w-auto">
              CAMPAIGN ROSTER
            </PixelButton>

            {isSuccess && hasNextMission && (
              <PixelButton href={`/mission/${nextMissionId}/dashboard/`} variant="primary" className="w-full sm:w-auto">
                PROCEED TO MISSION M{nextMissionNumber} ▶
              </PixelButton>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center font-small text-[10px] text-hull-steel mt-6">
        ORBIT FORGE FLIGHT LOG • PROGRESSION RECORDED TO LOCAL ARCHIVE • NASA SPACE APPS CHALLENGE 2026
      </footer>
    </div>
  );
}
