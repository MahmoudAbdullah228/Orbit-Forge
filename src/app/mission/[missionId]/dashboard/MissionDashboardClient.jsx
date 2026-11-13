'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import PixelButton from '@/components/ui/PixelButton';
import PixelPanel from '@/components/ui/PixelPanel';
import ResourceHUD from '@/components/hud/ResourceHUD';
import Chip from '@/components/ui/Chip';
import ZaraBriefingModal from '@/components/ui/ZaraBriefingModal';
import { getMissionByGlobalId } from '@/lib/data-loader';
import { sounds } from '@/lib/sound';

export default function MissionDashboardClient({ missionId }) {
  const mission = useMemo(() => getMissionByGlobalId(missionId), [missionId]);
  const [isZaraModalOpen, setIsZaraModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('directive');

  if (!mission) {
    return (
      <div className="min-h-screen bg-space-void text-hud-cream p-8 flex flex-col items-center justify-center">
        <h1 className="font-display text-xl text-danger mb-4">MISSION NOT FOUND</h1>
        <PixelButton href="/missions/" variant="neutral">RETURN TO MISSIONS</PixelButton>
      </div>
    );
  }

  const constraints = mission.constraints || {};
  const initialRes = mission.initial_resources || {};
  const dest = (mission.scenarioDestination || 'Moon').toUpperCase();

  const getBriefingText = () => {
    switch (activeTab) {
      case 'directive':
        return {
          title: 'PRIMARY MISSION OBJECTIVES',
          subtitle: `FLIGHT DIRECTIVE • MISSION ${mission.number}`,
          lead: `Greetings, Systems Architect! I am Commander Zara Vasquez, Chief Mission Architect at Orbit Forge Control. For Mission ${mission.number}, you must design an autonomous probe to enter ${mission.required_orbit} and conduct orbital survey operations around ${dest}.`,
          bullets: mission.tasks?.map((t) => t.label) || ['Attain stable orbit insertion', 'Maintain power balance', 'Downlink science telemetry']
        };
      case 'tradeoffs':
        return {
          title: 'SUBSYSTEM TRADE-OFF BLUEPRINT',
          subtitle: 'ENGINEERING BALANCING ADVISORY',
          lead: `Every engineering decision has an inescapable trade-off across BUDGET, MASS, POWER, COMMUNICATIONS, and LIFETIME:\n\n• MASS vs. LAUNCH VEHICLE: Small rockets (like Electron) are cheap ($15M) but limit payload to 40 kg. Heavy rockets (Falcon 9, Atlas V) carry massive payloads but consume half your budget.\n• POWER IN SHADOW: Solar wings yield 0W during planetary eclipse. Always pair solar wings with high-density batteries, or equip an RTG for continuous deep-space output.\n• COMMS BANDWIDTH: Science cameras generate massive data streams. Ensure your downlink antenna (X-band dish or optical laser) can transmit at or above the sensor generation rate.`,
          bullets: [
            `Allocated Project Budget: $${constraints.max_budget || 100} Million`,
            `Maximum Launch Mass Margin: ${constraints.max_mass || 100} kg`,
            `Nominal Mission Lifetime: ${constraints.duration || 24} Months`
          ]
        };
      case 'hazards':
        return {
          title: 'ENVIRONMENTAL HAZARDS & THREATS',
          subtitle: `${dest} SPACE ENVIRONMENT PROFILE`,
          lead: `Space operations are hazardous. Account for these environmental threats:\n\n• THERMAL FREEZING: Temperatures drop to -150°C during shadow passes. Bus heaters must be powered continuously by batteries.\n• COMMS OCCULTATION: As the craft orbits behind ${dest}, direct line-of-sight to Earth ground stations is lost. Gathered telemetry must be stored in solid-state memory until re-acquisition.\n• DELTA-V PENALTY: Reaching ${mission.required_orbit} requires precise propellant allocation. Choose a compatible rocket platform.`,
          bullets: [
            'Severe eclipse thermal shock and zero solar generation periods',
            'Planetary occultation cutting radio contact with ground control',
            'Solar flare cosmic radiation threatening unshielded electronics'
          ]
        };
      case 'checklist':
        return {
          title: 'FLIGHT CERTIFICATION CHECKLIST',
          subtitle: 'MISSION CONTROL 5-POINT READINESS RULES',
          lead: `Launch control requires 100% green status across all 5 mandatory checks before ignition is authorized:\n\n1. BUDGET LIMIT: Hardware total cannot exceed $${constraints.max_budget || 100}M.\n2. LAUNCHER MARGIN: Spacecraft wet mass cannot exceed vehicle payload capacity.\n3. POWER EQUILIBRIUM: Array power output must equal or exceed sensor draw.\n4. DOWNLINK CAPACITY: Ground transmission rate must handle all sensor data.\n5. COMPATIBLE ORBIT: Spacecraft trajectory must match ${mission.required_orbit}.`,
          bullets: [
            'At least 1 scientific sensor must be equipped',
            'Electrical power output must remain positive in sunlight',
            'Trajectory must target certified mission orbit'
          ]
        };
      default:
        return { title: '', subtitle: '', lead: '', bullets: [] };
    }
  };

  const briefing = getBriefingText();

  return (
    <div className="relative min-h-screen bg-horizon-dusk flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full">
      <StarfieldCanvas speed={0.6} density={60} />

      {/* Top Header (Full Width, Compact) */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-panel-border bg-space-void/90 p-2.5 sm:p-3 shadow-pixel-sm gap-3 mb-6 w-full">
        <div className="flex items-center gap-3">
          <PixelButton href={`/missions/${mission.scenarioId}/`} variant="neutral" size="sm">
            ◀ CAMPAIGN
          </PixelButton>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[10px] bg-panel-bg-raised text-hud-amber px-2 py-0.5 border border-panel-border">
                MISSION {mission.number}
              </span>
              <h1 className="font-display text-[13px] sm:text-[15px] text-hud-amber uppercase tracking-wide">
                {mission.title}
              </h1>
            </div>
            <span className="font-small text-[9px] text-planet-teal">
              TARGET DESTINATION: {mission.scenarioDestination}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.dialogue();
              setIsZaraModalOpen(true);
            }}
            className="px-3 py-1.5 bg-hud-amber hover:bg-flame-yellow text-space-void font-display text-[10px] tracking-wider uppercase border border-panel-border shadow-pixel-sm font-bold flex items-center gap-1.5"
          >
            <span>🎙️</span> FULLSCREEN BRIEFING
          </button>
          <Chip color="amber">PRE-FLIGHT BRIEFING</Chip>
        </div>
      </header>

      {/* Main 3-Column Layout (Full Width, No container) */}
      <main className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols of 3): Fully Embedded Interactive Commander Zara Briefing */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PixelPanel title="COMMANDER ZARA'S FLIGHT ARCHITECTURE BRIEFING" variant="default">
            {/* Commander Zara Header Profile with Live Radio Audio Controls */}
            <div className="bg-panel-bg-raised border-2 border-hud-amber p-4 mb-4 shadow-pixel-sm flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-space-void border-2 border-hud-amber p-1 flex items-center justify-center flex-shrink-0 relative shadow-pixel-sm">
                <img
                  src="/assets/avatars/astronaut.png"
                  alt="Commander Zara"
                  className="w-full h-full object-contain pixel-art drop-shadow-[0_0_8px_rgba(255,178,62,0.4)]"
                />
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-success animate-ping" />
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-success" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="font-display text-[12px] sm:text-[13px] text-hud-amber font-bold">
                    COMMANDER ZARA VASQUEZ
                  </span>
                  <Chip color="green">FLIGHT DIRECTOR</Chip>
                </div>
                <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/90 mb-3 leading-snug">
                  &ldquo;Systems Engineer, review our mission directives, subsystem trade-offs, and environmental hazards before configuring your spacecraft.&rdquo;
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={() => sounds.dialogue()}
                    className="py-1.5 px-3 bg-space-void hover:bg-space-deep border border-hud-amber text-hud-amber font-display text-[10px] flex items-center gap-1.5 uppercase"
                  >
                    <span>🎙️</span> PLAY RADIO CHATTER
                  </button>
                  <button
                    onClick={() => {
                      sounds.dialogue();
                      setIsZaraModalOpen(true);
                    }}
                    className="py-1.5 px-3 bg-hud-amber hover:bg-flame-yellow text-space-void font-display text-[10px] flex items-center gap-1.5 uppercase font-bold"
                  >
                    <span>📺</span> EXPAND BRIEFING CONSOLE
                  </button>
                </div>
              </div>
            </div>

            {/* Embedded Multi-Tab Navigation */}
            <div className="flex flex-wrap border-b-2 border-panel-border bg-space-deep px-2 pt-2 gap-1 mb-4">
              {[
                { id: 'directive', label: '1. DIRECTIVE' },
                { id: 'tradeoffs', label: '2. TRADE-OFFS' },
                { id: 'hazards', label: '3. HAZARDS' },
                { id: 'checklist', label: '4. GO / NO-GO' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.select();
                    setActiveTab(tab.id);
                  }}
                  className={`px-3 py-1.5 font-display text-[10px] sm:text-[11px] uppercase transition-colors border-t-2 border-x-2 ${
                    activeTab === tab.id
                      ? 'bg-panel-bg text-hud-amber border-hud-amber -mb-[2px] pb-2 font-bold shadow-pixel-sm'
                      : 'bg-space-void/70 text-hull-silver border-panel-border/60 hover:text-hud-cream'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Embedded Tab Content Display */}
            <div className="bg-space-void/80 border-2 border-panel-border/80 p-4 sm:p-6 mb-5">
              <span className="font-small text-[10px] text-planet-teal uppercase tracking-wider block mb-1">
                {briefing.subtitle}
              </span>
              <h3 className="font-display text-[14px] sm:text-[16px] text-hud-amber uppercase mb-3">
                {briefing.title}
              </h3>

              <div className="font-body text-[17px] sm:text-[18px] text-hud-cream/95 whitespace-pre-line leading-relaxed mb-4">
                {briefing.lead}
              </div>

              <div className="bg-panel-bg-raised border border-panel-border p-3">
                <span className="font-small text-[9px] text-hud-amber uppercase tracking-wider block mb-2">
                  KEY FLIGHT CRITERIA & SPECIFICATIONS:
                </span>
                <ul className="space-y-1.5">
                  {briefing.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 font-body text-[16px] text-hud-cream">
                      <span className="text-planet-teal font-display text-[10px] mt-0.5">▶</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checklist of required tasks */}
            <div className="mb-4">
              <h3 className="font-display text-[12px] sm:text-[13px] text-hud-amber mb-2 uppercase">
                MANDATORY MISSION TASKS:
              </h3>
              <div className="flex flex-col gap-2">
                {mission.tasks.map((task, i) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 bg-panel-bg-raised border border-panel-border p-2.5"
                  >
                    <span className="w-6 h-6 border-2 border-hud-amber flex items-center justify-center font-display text-[10px] text-hud-amber">
                      {i + 1}
                    </span>
                    <span className="font-body text-[17px] sm:text-[18px] text-hud-cream">
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PixelPanel>

          {/* Action Row */}
          <div className="flex items-center justify-between bg-panel-bg border-4 border-panel-border p-5 shadow-pixel-sm">
            <span className="font-small text-[11px] text-hull-silver">
              STEP 1 OF 3: BRIEFING REVIEW COMPLETE
            </span>
            <PixelButton href={`/mission/${mission.id}/tools/`} variant="primary" size="lg">
              CONTINUE TO SPACECRAFT DESIGN ▶
            </PixelButton>
          </div>
        </div>

        {/* Right Column (1 col of 3): Celestial Reconnaissance Art & Resource HUD */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <PixelPanel title="CELESTIAL RECONNAISSANCE" variant="raised">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-space-void border-2 border-panel-border p-3 mb-4 flex items-center justify-center overflow-hidden shadow-inner relative group">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                <img
                  src={`/assets/pixel/destinations/${mission.scenarioDestination.toLowerCase()}.png`}
                  alt={mission.scenarioDestination}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(46,230,168,0.4)] transition-transform duration-300 group-hover:scale-105 pixel-art"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <span className="font-display text-[15px] sm:text-[17px] text-hud-amber block mb-1">
                {dest}
              </span>
              <span className="font-small text-[10px] text-hull-silver block mb-1 uppercase">
                TARGET ORBIT: {mission.required_orbit}
              </span>
              <span className="font-small text-[10px] text-planet-teal block">
                DESIGN LIFETIME: {constraints.duration} MONTHS
              </span>
            </div>
          </PixelPanel>

          <ResourceHUD
            title="ALLOCATED BUDGET & RESOURCE CEILINGS"
            resources={initialRes}
            limits={constraints}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center font-small text-[10px] text-hull-steel mt-8">
        MISSION CONTROL PRE-FLIGHT BRIEFING • PROCEED TO INTEGRATION BAY TO SELECT HARDWARE
      </footer>

      {/* Interactive Commander Zara Briefing Modal (Opens on Click) */}
      <ZaraBriefingModal
        isOpen={isZaraModalOpen}
        onClose={() => setIsZaraModalOpen(false)}
        mission={mission}
        scenarioDestination={mission.scenarioDestination}
      />
    </div>
  );
}
