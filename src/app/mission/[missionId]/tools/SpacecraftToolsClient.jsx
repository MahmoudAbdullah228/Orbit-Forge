'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import PixelButton from '@/components/ui/PixelButton';
import ResourceHUD from '@/components/hud/ResourceHUD';
import ComponentCard from '@/components/cards/ComponentCard';
import Chip from '@/components/ui/Chip';
import {
  getMissionByGlobalId,
  getVehicles,
  getInstruments,
  getPowerSystems,
  getCommsSystems,
  getOrbits
} from '@/lib/data-loader';
import { validateDesign } from '@/lib/validate-design';
import { getSavedDesign, saveDesign } from '@/lib/storage';
import { sounds } from '@/lib/sound';

export default function SpacecraftToolsClient({ missionId }) {
  const mission = useMemo(() => getMissionByGlobalId(missionId), [missionId]);

  const vehicles = useMemo(() => getVehicles(), []);
  const allInstruments = useMemo(() => getInstruments(), []);
  const allPower = useMemo(() => getPowerSystems(), []);
  const allComms = useMemo(() => getCommsSystems(), []);
  const allOrbits = useMemo(() => getOrbits(), []);

  // Selection states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedPower, setSelectedPower] = useState([]);
  const [selectedComms, setSelectedComms] = useState(null);
  const [selectedOrbit, setSelectedOrbit] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore saved design once on mount
  useEffect(() => {
    if (!mission) return;
    const saved = getSavedDesign(mission.id);

    if (saved && (saved.vehicleId || saved.instrumentIds?.length)) {
      if (saved.vehicleId) {
        setSelectedVehicle(vehicles.find((v) => v.id === saved.vehicleId) || vehicles[1] || vehicles[0]);
      }
      if (Array.isArray(saved.instrumentIds) && saved.instrumentIds.length > 0) {
        const matched = allInstruments.filter((inst) => saved.instrumentIds.includes(inst.id));
        setSelectedInstruments(matched.length > 0 ? matched : [allInstruments[0]]);
      } else {
        setSelectedInstruments([allInstruments[0]]);
      }
      if (Array.isArray(saved.powerIds) && saved.powerIds.length > 0) {
        const matched = allPower.filter((p) => saved.powerIds.includes(p.id));
        setSelectedPower(matched.length > 0 ? matched : [allPower[1] || allPower[0]]);
      } else {
        setSelectedPower([allPower[1] || allPower[0]]);
      }
      if (saved.commsId) {
        setSelectedComms(allComms.find((c) => c.id === saved.commsId) || allComms[1] || allComms[0]);
      } else {
        setSelectedComms(allComms[1] || allComms[0]);
      }
      if (saved.orbitId) {
        setSelectedOrbit(allOrbits.find((o) => o.id === saved.orbitId) || null);
      } else {
        const reqOrbit = allOrbits.find((o) => o.id === mission.required_orbit);
        setSelectedOrbit(reqOrbit || allOrbits[0]);
      }
    } else {
      // Pre-select working certified flight configuration
      setSelectedVehicle(vehicles[1] || vehicles[0] || null);
      setSelectedInstruments([allInstruments[0] || allInstruments[1]]);
      setSelectedPower([allPower[1] || allPower[0]]);
      setSelectedComms(allComms[1] || allComms[0]);
      const reqOrbit = allOrbits.find((o) => o.id === mission.required_orbit);
      setSelectedOrbit(reqOrbit || allOrbits[0]);
    }
    setIsLoaded(true);
  }, [missionId]); // Run strictly when missionId mounts

  // Selection handlers with immediate persistence
  const handleSelectVehicle = (v) => {
    setSelectedVehicle(v);
    if (mission) {
      saveDesign(mission.id, {
        vehicleId: v.id,
        instrumentIds: selectedInstruments.map((i) => i.id),
        powerIds: selectedPower.map((p) => p.id),
        commsId: selectedComms?.id,
        orbitId: selectedOrbit?.id
      });
    }
  };

  const handleToggleInstrument = (inst) => {
    const exists = selectedInstruments.some((i) => i.id === inst.id);
    let updated;
    if (exists) {
      // Toggle off, but keep at least 1 sensor
      if (selectedInstruments.length > 1) {
        updated = selectedInstruments.filter((i) => i.id !== inst.id);
      } else {
        updated = selectedInstruments;
      }
    } else {
      updated = [...selectedInstruments, inst];
    }
    setSelectedInstruments(updated);
    if (mission) {
      saveDesign(mission.id, {
        vehicleId: selectedVehicle?.id,
        instrumentIds: updated.map((i) => i.id),
        powerIds: selectedPower.map((p) => p.id),
        commsId: selectedComms?.id,
        orbitId: selectedOrbit?.id
      });
    }
  };

  const handleTogglePower = (p) => {
    const exists = selectedPower.some((item) => item.id === p.id);
    let updated;
    if (exists) {
      if (selectedPower.length > 1) {
        updated = selectedPower.filter((item) => item.id !== p.id);
      } else {
        updated = selectedPower;
      }
    } else {
      updated = [...selectedPower, p];
    }
    setSelectedPower(updated);
    if (mission) {
      saveDesign(mission.id, {
        vehicleId: selectedVehicle?.id,
        instrumentIds: selectedInstruments.map((i) => i.id),
        powerIds: updated.map((item) => item.id),
        commsId: selectedComms?.id,
        orbitId: selectedOrbit?.id
      });
    }
  };

  const handleSelectComms = (c) => {
    setSelectedComms(c);
    if (mission) {
      saveDesign(mission.id, {
        vehicleId: selectedVehicle?.id,
        instrumentIds: selectedInstruments.map((i) => i.id),
        powerIds: selectedPower.map((p) => p.id),
        commsId: c.id,
        orbitId: selectedOrbit?.id
      });
    }
  };

  const handleSelectOrbit = (o) => {
    setSelectedOrbit(o);
    if (mission) {
      saveDesign(mission.id, {
        vehicleId: selectedVehicle?.id,
        instrumentIds: selectedInstruments.map((i) => i.id),
        powerIds: selectedPower.map((p) => p.id),
        commsId: selectedComms?.id,
        orbitId: o.id
      });
    }
  };

  // Run live validation
  const validation = useMemo(() => {
    if (!mission) return { isValid: false, checks: [], totals: {} };
    return validateDesign({
      vehicle: selectedVehicle,
      instruments: selectedInstruments,
      powerSystems: selectedPower,
      comms: selectedComms,
      orbit: selectedOrbit,
      mission
    });
  }, [selectedVehicle, selectedInstruments, selectedPower, selectedComms, selectedOrbit, mission]);

  // Guaranteed launch transition
  const handleLaunch = () => {
    sounds.launch();
    if (mission) {
      saveDesign(mission.id, {
        vehicleId: selectedVehicle?.id || vehicles[1]?.id,
        instrumentIds: (selectedInstruments.length ? selectedInstruments : [allInstruments[0]]).map((i) => i.id),
        powerIds: (selectedPower.length ? selectedPower : [allPower[1]]).map((p) => p.id),
        commsId: selectedComms?.id || allComms[1]?.id,
        orbitId: selectedOrbit?.id || allOrbits.find((o) => o.id === mission.required_orbit)?.id
      });
    }
    // Direct window location guarantees static export navigation
    window.location.href = `/mission/${mission.id}/flight/`;
  };

  if (!mission) {
    return (
      <div className="min-h-screen bg-space-void text-hud-cream p-8 flex flex-col items-center justify-center">
        <h1 className="font-display text-xl text-danger mb-4">MISSION NOT FOUND</h1>
        <PixelButton href="/missions/" variant="neutral">RETURN TO MISSIONS</PixelButton>
      </div>
    );
  }

  const totals = validation.totals || {};

  const liveResources = {
    budget: Math.max(0, (mission.constraints?.max_budget || 100) - (totals.cost || 0)),
    mass: totals.mass || 0,
    power: totals.powerGen || 0,
    data: totals.dataRate || 0,
    communication: totals.downlink || 0,
    time: mission.constraints?.duration || 24
  };

  const liveLimits = {
    budget: mission.constraints?.max_budget || 100,
    mass: Math.min(mission.constraints?.max_mass || 100, selectedVehicle?.game.max_payload_kg || 100),
    power: totals.powerDraw || 10,
    data: 100,
    communication: 100,
    time: mission.constraints?.duration || 24
  };

  return (
    <div className="relative min-h-screen bg-space-void text-hud-cream pb-32 w-full">
      <StarfieldCanvas speed={0.4} density={50} />

      {/* Sticky Top Bar: Clean, Uncluttered, Spaced Out (No Launch or Zara buttons) */}
      {/* Compact Top Command Header & Telemetry Strip */}
      <header className="sticky top-0 z-30 bg-panel-bg/95 border-b-2 border-panel-border shadow-pixel-sm backdrop-blur-sm w-full">
        <div className="w-full px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <PixelButton href={`/mission/${mission.id}/dashboard/`} variant="neutral" size="sm">
              ◀ BRIEFING
            </PixelButton>
            <div className="flex items-center gap-2">
              <span className="font-display text-[10px] bg-panel-bg-raised text-hud-amber px-2 py-0.5 border border-panel-border">
                M{mission.number} INTEGRATION
              </span>
              <h1 className="font-display text-[12px] sm:text-[13px] text-hud-cream truncate">
                {mission.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Chip color={validation.isValid ? 'green' : 'red'}>
              {validation.isValid ? '✔ CERTIFIED' : '⚠ PENDING'}
            </Chip>
          </div>
        </div>

        {/* Live Segmented Resource Bar Strip (Full Width) */}
        <div className="w-full px-4 sm:px-8 pb-1">
          <ResourceHUD
            compact
            resources={liveResources}
            limits={liveLimits}
          />
        </div>
      </header>

      {/* Main Full-Width Stacked Category Sections (No container) */}
      <main className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col gap-10">
        {/* Section 1: Launch Vehicles */}
        <section aria-labelledby="section-vehicles">
          <div className="flex items-center justify-between border-b-4 border-panel-border pb-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-[14px] sm:text-[16px] text-hud-amber">
                1. LAUNCH VEHICLES
              </span>
              <span className="font-small text-[10px] text-hull-silver">
                (SELECT 1 ROCKET PLATFORM)
              </span>
            </div>
            {selectedVehicle && (
              <Chip color="teal">CHOSEN: {selectedVehicle.name}</Chip>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <ComponentCard
                key={v.id}
                item={v}
                category="launcher"
                selected={selectedVehicle?.id === v.id}
                onSelect={() => handleSelectVehicle(v)}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Scientific Instruments */}
        <section aria-labelledby="section-instruments">
          <div className="flex items-center justify-between border-b-4 border-panel-border pb-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-[14px] sm:text-[16px] text-hud-amber">
                2. SCIENTIFIC INSTRUMENTS
              </span>
              <span className="font-small text-[10px] text-hull-silver">
                (SELECT 1 OR MORE SENSORS)
              </span>
            </div>
            <Chip color="amber">
              {selectedInstruments.length} SENSORS EQUIPPED
            </Chip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allInstruments.map((inst) => {
              const isSelected = selectedInstruments.some((item) => item.id === inst.id);
              return (
                <ComponentCard
                  key={inst.id}
                  item={inst}
                  category="instrument"
                  selected={isSelected}
                  onSelect={() => handleToggleInstrument(inst)}
                />
              );
            })}
          </div>
        </section>

        {/* Section 3: Power Systems */}
        <section aria-labelledby="section-power">
          <div className="flex items-center justify-between border-b-4 border-panel-border pb-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-[14px] sm:text-[16px] text-hud-amber">
                3. POWER SYSTEMS
              </span>
              <span className="font-small text-[10px] text-hull-silver">
                (SOLAR PANELS, BATTERIES, RTG)
              </span>
            </div>
            <Chip color="teal">
              {selectedPower.length} POWER MODULES EQUIPPED
            </Chip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allPower.map((p) => {
              const isSelected = selectedPower.some((item) => item.id === p.id);
              return (
                <ComponentCard
                  key={p.id}
                  item={p}
                  category="power"
                  selected={isSelected}
                  onSelect={() => handleTogglePower(p)}
                />
              );
            })}
          </div>
        </section>

        {/* Section 4: Communications */}
        <section aria-labelledby="section-comms">
          <div className="flex items-center justify-between border-b-4 border-panel-border pb-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-[14px] sm:text-[16px] text-hud-amber">
                4. COMMUNICATIONS
              </span>
              <span className="font-small text-[10px] text-hull-silver">
                (SELECT 1 DOWNLINK ANTENNA)
              </span>
            </div>
            {selectedComms && (
              <Chip color="blue">CHOSEN: {selectedComms.name}</Chip>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allComms.map((c) => (
              <ComponentCard
                key={c.id}
                item={c}
                category="antenna"
                selected={selectedComms?.id === c.id}
                onSelect={() => handleSelectComms(c)}
              />
            ))}
          </div>
        </section>

        {/* Section 5: Orbit Selection */}
        <section aria-labelledby="section-orbits">
          <div className="flex items-center justify-between border-b-4 border-panel-border pb-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-[14px] sm:text-[16px] text-hud-amber">
                5. OPERATIONAL ORBIT SELECTION
              </span>
              <span className="font-small text-[10px] text-hull-silver">
                (SELECT 1 TARGET TRAJECTORY)
              </span>
            </div>
            {selectedOrbit && (
              <Chip color="pink">ORBIT: {selectedOrbit.name}</Chip>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allOrbits.map((o) => {
              const isSelected = selectedOrbit?.id === o.id;
              const isRequired = mission.required_orbit === o.id;
              return (
                <div
                  key={o.id}
                  onClick={() => {
                    sounds.select();
                    handleSelectOrbit(o);
                  }}
                  className={`border-4 p-4 sm:p-5 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-panel-bg-raised border-hud-amber shadow-pixel-lg ring-4 ring-hud-amber/50 -translate-y-1'
                      : 'bg-panel-bg border-panel-border hover:border-horizon-pink shadow-pixel-md hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-panel-border/40 pb-2">
                      <div className="border border-planet-teal bg-space-void px-2 py-0.5">
                        <span className="font-small text-[9px] text-planet-teal uppercase font-bold">
                          ORBITAL TRAJECTORY
                        </span>
                      </div>
                      {isRequired && <Chip color="green">REQUIRED FOR M{mission.number}</Chip>}
                    </div>

                    {/* Wide Space Viewport for Orbit */}
                    <div className="w-full h-60 sm:h-64 bg-space-void border-2 border-panel-border mb-4 flex items-center justify-center p-3 overflow-hidden shadow-inner relative group">
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                      <img
                        src={o.image}
                        alt={o.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(46,230,168,0.45)] transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-space-void/85 border border-panel-border/70 px-3 py-1 shadow-pixel-sm">
                        <span className="font-display text-[11px] text-hud-cream truncate">
                          {o.name}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-[13px] sm:text-[14px] text-hud-cream mb-1.5 leading-snug">
                      {o.name}
                    </h3>

                    <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/90 line-clamp-2 mb-3 leading-snug">
                      {o.description}
                    </p>

                    <div className="bg-space-void/90 p-2.5 border border-panel-border/60 font-body text-[15px] mb-4">
                      <div className="flex justify-between py-0.5 border-b border-panel-border/30">
                        <span className="text-hull-silver text-[9px] font-small">ALTITUDE</span>
                        <span className="text-hud-amber font-display text-[10px]">{o.altitude_km} km</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-hull-silver text-[9px] font-small">DELTA-V INSERTION</span>
                        <span className="text-flame-orange font-display text-[10px]">+{o.game.delta_v_cost} m/s</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.select();
                      handleSelectOrbit(o);
                    }}
                    className={`w-full py-3 px-4 border-2 font-display text-[11px] sm:text-[12px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-pixel-sm ${
                      isSelected
                        ? 'bg-hud-amber text-space-void border-hud-amber font-bold shadow-pixel-md ring-2 ring-hud-amber/60'
                        : 'bg-rocket-red hover:bg-rocket-red-dark text-white border-rocket-outline'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <span className="text-sm font-bold">✔</span> TRAJECTORY TARGETED
                      </>
                    ) : (
                      <>
                        <span>+</span> TARGET THIS ORBIT ▶
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dedicated Engineering Flight Readiness Review Panel with Prominent Launch Button */}
        <section className="bg-panel-bg border-4 border-panel-border shadow-pixel-lg p-6 sm:p-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-panel-border pb-4 mb-6 gap-3">
            <div>
              <h2 className="font-display text-[15px] sm:text-[18px] text-hud-amber uppercase tracking-wide">
                ENGINEERING FLIGHT READINESS REVIEW
              </h2>
              <span className="font-small text-[10px] text-hull-silver">
                REAL-TIME MULTI-SUBSYSTEM CONSTRAINT VERIFICATION BEFORE IGNITION
              </span>
            </div>
            <Chip color={validation.isValid ? 'green' : 'red'}>
              {validation.isValid ? '✔ 100% FLIGHT CERTIFIED' : '⚠ DISCREPANCIES DETECTED'}
            </Chip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {validation.checks.map((chk) => (
              <div
                key={chk.id}
                className={`p-4 border-2 flex items-start gap-3 ${
                  chk.passed
                    ? 'bg-space-void/70 border-success/60'
                    : 'bg-danger/10 border-danger'
                }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {chk.passed ? '✔' : '✖'}
                </span>
                <div className="flex-1">
                  <span className={`font-display text-[11px] block mb-1 uppercase ${
                    chk.passed ? 'text-success' : 'text-danger'
                  }`}>
                    {chk.label}
                  </span>
                  <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/90 leading-snug">
                    {chk.why}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Large, Prominent Full-Width Launch Action Area */}
          <div className="bg-space-void p-5 sm:p-6 border-4 border-hud-amber flex flex-col lg:flex-row items-center justify-between gap-6 shadow-pixel-md">
            <div>
              <span className="font-display text-[13px] sm:text-[15px] text-hud-amber block mb-1 uppercase">
                {validation.isValid
                  ? 'COUNTDOWN READY: FLIGHT COMPUTER IS ARMED'
                  : 'IGNITION OVERRIDE: READY TO LAUNCH MISSION'}
              </span>
              <p className="font-body text-[17px] sm:text-[19px] text-hud-cream/90">
                Click below to initiate the launch sequence, enter space flight, and begin the mission branching scenario questions!
              </p>
            </div>

            <button
              type="button"
              onClick={handleLaunch}
              className="w-full lg:w-auto px-8 sm:px-12 py-4 bg-rocket-red hover:bg-rocket-red-dark text-white font-display text-[14px] sm:text-[16px] uppercase tracking-wider border-4 border-rocket-outline shadow-pixel-lg hover:shadow-pixel-md hover:translate-y-0.5 active:translate-y-1 flex items-center justify-center gap-3 transition-all"
            >
              <span className="text-xl">🚀</span>
              <span>IGNITION & LAUNCH MISSION ▶</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
