'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sound';
import PixelButton from './PixelButton';
import Chip from './Chip';

/**
 * ZaraBriefingModal - Commander Zara's interactive flight architecture briefing
 */
export default function ZaraBriefingModal({
  isOpen,
  onClose,
  mission,
  scenarioDestination = 'Moon'
}) {
  const [activeTab, setActiveTab] = useState('directive');
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setTypedChars(0);
      return;
    }
    sounds.dialogue();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mission) return null;

  const dest = (mission.scenarioDestination || scenarioDestination || 'Moon').toUpperCase();

  const getBriefingContent = () => {
    switch (activeTab) {
      case 'directive':
        return {
          title: 'PRIMARY MISSION OBJECTIVES',
          subtitle: `DIRECTIVE FOR FLIGHT OPERATION M${mission.number || 1}`,
          text: `Greetings, Systems Engineer! I am Commander Zara, Chief Mission Architect at Orbit Forge Control. Your objective for Mission ${mission.number} is to design, integrate, and certify an uncrewed exploration craft to operate in ${mission.required_orbit || 'target'} orbit around ${dest}.\n\nEvery payload sensor you select generates valuable research data, but demands real kilowatt-hours and adds precious kilograms to your launch stack. Remember: a high science yield means nothing if the rocket cannot reach escape velocity!`,
          bullets: mission.tasks?.map((t) => t.label) || [
            'Attain stable orbit insertion',
            'Generate positive telemetry downlink',
            'Maintain continuous electrical balance'
          ]
        };
      case 'tradeoffs':
        return {
          title: 'SUBSYSTEM TRADE-OFF BLUEPRINT',
          subtitle: 'ENGINEERING ADVISORY ON HARDWARE BALANCING',
          text: `In aerospace engineering, there is never one single perfect configuration. You must negotiate trade-offs across 6 core constraints:\n\n• MASS vs. LAUNCH VEHICLE: The Falcon 9 and Atlas V offer generous payload margins, but cost significantly more against your budget. If you choose a lightweight rocket like Electron, you must strictly minimize instrument payload.\n• POWER GENERATION: Solar wings are light and cost-effective, but produce zero watts in planetary shadow. Pair them with battery packs, or consider an RTG for deep-space and polar night operations.\n• COMMUNICATIONS: High-rate cameras need a high-gain dish or optical laser downlink. An omni antenna is cheap, but creates a data bottleneck.`,
          bullets: [
            `Maximum allowable launch mass: ${mission.constraints?.max_mass || 100} kg`,
            `Allocated project funding: $${mission.constraints?.max_budget || 100} Million`,
            `Design mission lifetime: ${mission.constraints?.duration || 24} Months`
          ]
        };
      case 'hazards':
        return {
          title: 'ENVIRONMENTAL HAZARDS & THREATS',
          subtitle: `${dest} ORBITAL ENVIRONMENT PROFILE`,
          text: `Space is unforgiving. Keep these real space physics hazards in mind during configuration:\n\n• THERMAL CYCLING: Entering eclipse drops external temperature to -150°C. Ensure your battery system has reserve amp-hours to keep bus heaters running.\n• ORBITAL DRIFT: Off-target orbit insertion will cause sensor blind spots. Only the certified trajectory (${mission.required_orbit}) will satisfy mission telemetry requirements.\n• COMMS OCCULTATION: When your probe passes behind ${dest}, Earth contact is cut. High-capacity downlink ensures gathered data transmits rapidly during visibility passes.`,
          bullets: [
            'Solar flare radiation risks to unshielded electronics',
            'Severe orbital eclipse shadows requiring stored power',
            'Ground station acquisition window limitations'
          ]
        };
      case 'checklist':
        return {
          title: 'FLIGHT CERTIFICATION CRITERIA',
          subtitle: 'MISSION CONTROL GO / NO-GO REQUIREMENTS',
          text: `Launch control will NOT grant countdown authorization until your probe meets all flight safety standards:\n\n1. BUDGET CLEARANCE: Total hardware cost cannot exceed the $${mission.constraints?.max_budget || 100}M ceiling.\n2. PAYLOAD CAPACITY: Total spacecraft wet mass must not exceed your selected launch vehicle’s payload limit.\n3. ELECTRICAL EQUILIBRIUM: Array power output must meet or exceed total instrument draw.\n4. DOWNLINK BANDWIDTH: Ground station transmission rate must handle all active sensor telemetry.\n5. MISSION ORBIT: Spacecraft trajectory must match ${mission.required_orbit}.`,
          bullets: [
            'All 5 subsystem checks must show green status',
            'At least 1 scientific sensor must be equipped',
            'Launch vehicle must have valid flight margin'
          ]
        };
      default:
        return null;
    }
  };

  const content = getBriefingContent();

  const handleTabChange = (tab) => {
    sounds.select();
    setActiveTab(tab);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="zara-briefing-title"
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-space-void/90 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-panel-bg border-4 border-hud-amber shadow-pixel-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header bar */}
        <div className="bg-space-void border-b-4 border-panel-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-panel-bg-raised border-2 border-hud-amber p-1 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/avatars/astronaut.png"
                alt="Commander Zara"
                className="w-full h-full object-contain pixel-art"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[12px] sm:text-[13px] text-hud-amber">
                  COMMANDER ZARA
                </span>
                <Chip color="amber">CHIEF ARCHITECT</Chip>
              </div>
              <span className="font-small text-[9px] text-planet-teal">
                TRANSMISSION CHANNEL: ORBIT FORGE CONTROL // SECURE
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.select();
              onClose();
            }}
            aria-label="Close Briefing"
            className="w-8 h-8 bg-panel-bg-raised hover:bg-danger text-hud-cream hover:text-white border-2 border-panel-border font-display text-[12px] flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap border-b-2 border-panel-border bg-space-deep px-4 pt-2 gap-1">
          {[
            { id: 'directive', label: '1. DIRECTIVE' },
            { id: 'tradeoffs', label: '2. TRADE-OFFS' },
            { id: 'hazards', label: '3. HAZARDS' },
            { id: 'checklist', label: '4. GO / NO-GO' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-1.5 font-display text-[10px] sm:text-[11px] uppercase transition-colors border-t-2 border-x-2 ${
                activeTab === tab.id
                  ? 'bg-panel-bg text-hud-amber border-hud-amber -mb-[2px] pb-2 font-bold shadow-pixel-sm'
                  : 'bg-space-void/70 text-hull-silver border-panel-border/60 hover:text-hud-cream hover:bg-space-void'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
          {/* Left Avatar & Comms Status */}
          <div className="w-full md:w-56 flex-shrink-0 flex flex-col items-center text-center bg-space-void/80 border-2 border-panel-border p-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-space-deep border-4 border-hud-amber p-2 mb-3 shadow-pixel-md relative">
              <img
                src="/assets/avatars/astronaut.png"
                alt="Commander Zara Portrait"
                className="w-full h-full object-contain pixel-art drop-shadow-[0_0_8px_rgba(255,178,62,0.4)]"
              />
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-success rounded-full border border-space-void animate-ping" />
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-success rounded-full border border-space-void" />
            </div>

            <span className="font-display text-[11px] text-hud-cream uppercase mb-1">
              CDR. ZARA VASQUEZ
            </span>
            <span className="font-small text-[9px] text-hull-silver mb-3">
              NASA FLIGHT CERTIFIED
            </span>

            <div className="w-full bg-space-deep p-2 border border-panel-border/70 text-left font-body text-[14px]">
              <div className="flex justify-between text-hull-silver text-[9px] font-small mb-1">
                <span>SIGNAL:</span>
                <span className="text-success">99.8% STEREO</span>
              </div>
              <div className="flex justify-between text-hull-silver text-[9px] font-small mb-1">
                <span>ENCRYPTION:</span>
                <span className="text-planet-teal">AES-256</span>
              </div>
              <div className="flex justify-between text-hull-silver text-[9px] font-small">
                <span>LATENCY:</span>
                <span className="text-hud-amber">1.28 SEC</span>
              </div>
            </div>

            <button
              onClick={() => sounds.dialogue()}
              className="mt-3 w-full py-1.5 px-2 bg-panel-bg hover:bg-panel-bg-raised border border-panel-border text-hud-amber font-display text-[9px] flex items-center justify-center gap-1.5"
            >
              <span>🎙️</span> PLAY AUDIO CHATTER
            </button>
          </div>

          {/* Right Briefing Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-panel-border pb-2 mb-3">
                <span className="font-small text-[10px] text-planet-teal uppercase tracking-wider block">
                  {content.subtitle}
                </span>
                <h3 id="zara-briefing-title" className="font-display text-[14px] sm:text-[16px] text-hud-amber uppercase">
                  {content.title}
                </h3>
              </div>

              <div className="font-body text-[16px] sm:text-[18px] text-hud-cream/95 whitespace-pre-line leading-relaxed mb-4 bg-space-void/40 p-3 border border-panel-border/50">
                {content.text}
              </div>

              <div className="bg-panel-bg-raised border-2 border-panel-border p-3 mb-4">
                <span className="font-small text-[9px] text-hud-amber uppercase tracking-wider block mb-2">
                  KEY FLIGHT SPECIFICATIONS & TARGET CRITERIA:
                </span>
                <ul className="space-y-1.5">
                  {content.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 font-body text-[15px] sm:text-[16px] text-hud-cream">
                      <span className="text-planet-teal font-display text-[10px] mt-0.5">▶</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-panel-border">
              <PixelButton
                variant="neutral"
                size="sm"
                onClick={() => {
                  sounds.select();
                  onClose();
                }}
              >
                DISMISS BRIEFING
              </PixelButton>
              <PixelButton
                variant="primary"
                size="sm"
                onClick={() => {
                  sounds.select();
                  onClose();
                }}
              >
                I AM READY FOR INTEGRATION BAY ▶
              </PixelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
