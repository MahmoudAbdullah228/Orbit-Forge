'use client';

import React, { useState, useEffect, useMemo } from 'react';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import Chip from '@/components/ui/Chip';
import ResourceHUD from '@/components/hud/ResourceHUD';
import { getMissionByGlobalId, getVehicles } from '@/lib/data-loader';
import { getSavedDesign, saveMissionResult, unlockMission } from '@/lib/storage';
import { calculateMissionScore } from '@/lib/scoring';
import { sounds } from '@/lib/sound';

export default function FlightSceneClient({ missionId }) {
  const mission = useMemo(() => getMissionByGlobalId(missionId), [missionId]);
  const destName = mission?.scenarioId?.includes('mars')
    ? 'mars'
    : mission?.scenarioId?.includes('earth')
    ? 'earth'
    : 'moon';

  // Phases: 'countdown', 'cruising', 'question', 'orbital_insertion', 'task_execution', 'debrief'
  const [flightPhase, setFlightPhase] = useState('countdown');
  const [countdown, setCountdown] = useState(2);
  const [shipShake, setShipShake] = useState(false);
  const [transitMessage, setTransitMessage] = useState('PROPULSION ENGINES FIRING • TRANSIT IN PROGRESS');

  // Animation & timing states
  const [isRocketIntro, setIsRocketIntro] = useState(true);
  const [isRocketFinalTransit, setIsRocketFinalTransit] = useState(false);
  const [autoPilot, setAutoPilot] = useState(false);
  const [cruiseTimer, setCruiseTimer] = useState(2);

  // Flight progression state
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [reachedDestination, setReachedDestination] = useState(false);
  const [tasksState, setTasksState] = useState({});
  const [decisionHistory, setDecisionHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Live resources
  const [resources, setResources] = useState({
    budget: 70,
    mass: 25,
    power: 75,
    data: 30,
    communication: 80,
    scientific_value: 10,
    time: 24
  });

  // Saved vehicle
  const savedDesign = typeof window !== 'undefined' ? getSavedDesign(mission?.id) : null;
  const activeVehicle = useMemo(() => {
    const allV = getVehicles();
    return allV.find((v) => v.id === savedDesign?.vehicleId) || allV[1] || allV[0];
  }, [savedDesign]);

  // Tasks from mission
  const missionTasks = useMemo(() => {
    return mission?.tasks || [
      { id: 'T001', label: 'Primary Remote Sensing & Mapping' },
      { id: 'T002', label: 'Subsurface Science & Mineral Analysis' },
      { id: 'T003', label: 'Transmit 50 GB Telemetry via Ka-Band Link' }
    ];
  }, [mission]);

  // Comprehensive multi-phase flight directives
  const flightNodes = useMemo(() => {
    const dest = mission?.scenarioDestination || 'The Moon';
    return [
      // Phase 1: Deep Space Hazard 1 (Radiation & Space Weather)
      {
        id: 'HAZARD-01',
        isTask: false,
        stage: 'DEEP SPACE TRANSIT • HAZARD AVOIDANCE',
        badge: 'SOLAR RADIATION STORM',
        story: `Cruising through interplanetary space toward ${dest}. Space weather telemetry alerts an intense solar energetic particle (SEP) storm approaching at 800 km/s.`,
        question: 'How do you configure the spacecraft systems before the radiation wavefront arrives?',
        answers: [
          {
            id: 'H1-A',
            text: 'Rotate spacecraft bus to shield sensitive electronics, stow secondary boom antennas, and switch critical computers to safe-mode.',
            effects: { power: -10, budget: 0, scientific_value: 5, communication: -5 },
            consequence: 'Optimal defense: Sensitive detectors shielded without hardware degradation.',
            learning: 'Spacecraft utilize their heavy chassis and propellant tanks as bulk radiation shielding against solar protons.'
          },
          {
            id: 'H1-B',
            text: 'Keep all systems fully operational and attempt continuous observation of the solar proton event.',
            effects: { power: -25, budget: -5, scientific_value: 12, communication: -15 },
            consequence: 'Radiation induced minor sensor saturation and drained battery heaters.',
            learning: 'Unshielded microelectronics suffer single-event upsets (SEUs) and accelerated degradation during SEP storms.'
          }
        ]
      },
      // Phase 2: Deep Space Hazard 2 (Trajectory Correction & Communication Shadow)
      {
        id: 'HAZARD-02',
        isTask: false,
        stage: 'TRAJECTORY INSERTION • NAVIGATION TRIM',
        badge: 'ORBITAL DRIFT DETECTED',
        story: `Deep Space Network tracking stations detect a 1.4° angular drift off the planned trajectory vector prior to gravitational capture at ${dest}.`,
        question: 'Which trajectory correction maneuver (TCM) will flight dynamics execute?',
        answers: [
          {
            id: 'H2-A',
            text: 'Execute calibrated bipropellant thruster burn and lock star-tracker optics on celestial reference guides.',
            effects: { power: -5, budget: -5, mass: -2, scientific_value: 8, communication: 10 },
            consequence: 'Precision maneuver complete: Spacecraft locks onto optimal planetary arrival vector.',
            learning: 'Mid-course correction burns conserve exponential delta-V compared to late corrections near periapsis.'
          },
          {
            id: 'H2-B',
            text: 'Rely solely on cold-gas reaction control system (RCS) pulses to preserve main propellant margins.',
            effects: { power: -10, budget: 0, mass: 0, scientific_value: 3, communication: 0 },
            consequence: 'RCS pulses corrected the trajectory slowly, increasing arrival time slightly.',
            learning: 'RCS thrusters provide high pointing precision but possess lower specific impulse (Isp) than bipropellant engines.'
          }
        ]
      },
      // Phase 3: Primary Mission Task 1 (Orbital Science Activation)
      {
        id: 'TASK-01',
        isTask: true,
        taskIndex: 0,
        stage: `PLANETARY ARRIVAL • ${dest.toUpperCase()} ORBIT`,
        badge: `TASK 1: ${missionTasks[0]?.label || 'PRIMARY REMOTE SENSING'}`,
        story: `Orbital insertion confirmed! The spacecraft is now locked into target orbit over ${dest}. The primary science payload is warmed and ready for target deployment.`,
        question: `How will you execute the primary task: "${missionTasks[0]?.label}"?`,
        answers: [
          {
            id: 'T1-A',
            text: 'Initiate nadir-pointing calibration, sync laser/optical detectors with orbital timing, and execute high-resolution swath mapping.',
            effects: { power: -15, scientific_value: 25, communication: 10 },
            consequence: `TASK 1 COMPLETED: Surface mapped with high precision! Telemetry verified.`,
            learning: 'Nadir-pointing attitude control aligns optical instruments perpendicular to the planetary surface for minimum optical distortion.',
            taskSuccess: true
          },
          {
            id: 'T1-B',
            text: 'Power down thermal heaters to conserve maximum power before firing remote sensing payloads.',
            effects: { power: 10, scientific_value: 5, communication: -10 },
            consequence: 'Cold optical elements caused minor focus drift; data resolution reduced.',
            learning: 'Optical lenses and laser diodes require tightly regulated thermal envelopes to maintain millimeter focus.',
            taskSuccess: false
          }
        ]
      },
      // Phase 4: Primary Mission Task 2 (Subsurface & Mineral Investigation)
      {
        id: 'TASK-02',
        isTask: true,
        taskIndex: 1,
        stage: `LOW SCIENCE ORBIT • TARGET SCAN`,
        badge: `TASK 2: ${missionTasks[1]?.label || 'SUBSURFACE SCIENCE'}`,
        story: `Passing over high-priority geological coordinates on ${dest}. Ground teams request immediate activation of secondary sensors to detect water-ice and deep strata.`,
        question: `How do you command the secondary payload for "${missionTasks[1]?.label}"?`,
        answers: [
          {
            id: 'T2-A',
            text: 'Deploy sensor boom / radar dipoles, route clean battery bus voltage, and integrate multi-pass neutron and radar spectra.',
            effects: { power: -15, scientific_value: 30, communication: 10 },
            consequence: `TASK 2 COMPLETED: Rich subsurface signals detected and recorded in onboard solid-state memory!`,
            learning: 'Low orbital altitudes increase secondary neutron emission capture and maximize radar ground-penetration depth.',
            taskSuccess: true
          },
          {
            id: 'T2-B',
            text: 'Limit observations to single high-speed passes to minimize thermal radiator heating.',
            effects: { power: 5, scientific_value: 10, communication: 0 },
            consequence: 'Sparse observational passes left portions of the geological formation unmapped.',
            learning: 'Nuclear and radar detectors require long integration times to achieve high signal-to-noise ratios.',
            taskSuccess: false
          }
        ]
      },
      // Phase 5: Primary Mission Task 3 (High-Bandwidth Downlink to Earth DSN)
      {
        id: 'TASK-03',
        isTask: true,
        taskIndex: 2,
        stage: `COMMUNICATIONS PASS • EARTH RELAY`,
        badge: `TASK 3: ${missionTasks[2]?.label || 'HIGH-SPEED TELEMETRY DOWNLINK'}`,
        story: `Science storage arrays are loaded with gigabytes of raw planetary discoveries. Earth ground stations at Goldstone and Madrid are in direct line-of-sight.`,
        question: `How do you execute the final telemetry delivery: "${missionTasks[2]?.label}"?`,
        answers: [
          {
            id: 'T3-A',
            text: 'Gimbal high-gain dish / phased array directly to Earth ground stations, activate high-power traveling-wave amplifiers, and beam compressed science packets.',
            effects: { power: -20, scientific_value: 35, communication: 25 },
            consequence: `TASK 3 COMPLETED: 100% telemetry downlinked to NASA Mission Control! Ground teams celebrate!`,
            learning: 'Directional high-frequency Ka-band transmitters deliver massive data rates when attitude determination errors remain below 0.1°.',
            taskSuccess: true
          },
          {
            id: 'T3-B',
            text: 'Transmit data through omnidirectional low-gain antennas to avoid turning the spacecraft.',
            effects: { power: -5, scientific_value: 12, communication: -20 },
            consequence: 'Low bandwidth limited transmission; only low-resolution preview thumbnails received.',
            learning: 'Omnidirectional antennas lack parabolic signal gain and support only low-bitrate housekeeping telemetry.',
            taskSuccess: false
          }
        ]
      }
    ];
  }, [mission, missionTasks]);

  // Initialize once on mount
  useEffect(() => {
    if (!mission) return;
    const initRes = mission.initial_resources || {};
    setResources({
      budget: initRes.budget ?? 70,
      mass: initRes.mass ?? 25,
      power: initRes.power ?? 75,
      data: 30,
      communication: initRes.communication ?? 70,
      scientific_value: initRes.scientific_value ?? 10,
      time: initRes.time ?? 24
    });

    const initTasks = {};
    for (const t of missionTasks) {
      initTasks[t.id] = false;
    }
    setTasksState(initTasks);
  }, [mission, missionTasks]);

  // Snappy launch countdown
  useEffect(() => {
    if (flightPhase !== 'countdown') return;

    sounds.countdown(500);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          sounds.countdown(600);
          return prev - 1;
        } else {
          clearInterval(interval);
          sounds.launch();
          setShipShake(true);
          setTimeout(() => {
            setShipShake(false);
            // Rocket begins soaring across deep space: sweeps right->left->right->center!
            setFlightPhase('cruising');
            setIsRocketIntro(true);
            setTransitMessage('CALCULATING ESCAPE TRAJECTORY • PROPULSION ACTIVE');
            sounds.transmission();

            // Settle into hover after 2.4s sweep
            setTimeout(() => {
              setIsRocketIntro(false);
            }, 2400);

            // Cruising duration: exactly 2.0s before first question appears
            setTimeout(() => {
              setFlightPhase('question');
            }, 2000);
          }, 800);
          return 0;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [flightPhase]);

  // Cruising phase flight interval (exactly 2 seconds before each new question appears)
  useEffect(() => {
    if (flightPhase !== 'cruising') return;

    setCruiseTimer(2);
    const tick = setInterval(() => {
      setCruiseTimer((t) => (t > 1 ? t - 1 : 1));
    }, 1000);

    const timer = setTimeout(() => {
      setFlightPhase('question');
    }, 2000);

    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [flightPhase, currentStageIndex]);

  // Optional 2-second Auto-Pilot cadence
  useEffect(() => {
    if (!autoPilot || flightPhase !== 'question' || feedback !== null) return;

    const timer = setTimeout(() => {
      const activeNode = flightNodes[currentStageIndex];
      const defaultChoice = activeNode?.answers?.[0];
      if (defaultChoice) {
        handleAnswer(defaultChoice);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [autoPilot, flightPhase, feedback, currentStageIndex, flightNodes]);

  // Current active node
  const activeNode = flightNodes[currentStageIndex] || flightNodes[0];

  // Answer handler
  const handleAnswer = (ans) => {
    sounds.click();
    setFeedback(ans);

    // Apply resource adjustments
    const eff = ans.effects || {};
    setResources((prev) => {
      return {
        budget: Math.max(0, Math.min(100, prev.budget + (eff.budget || 0))),
        mass: Math.max(0, Math.min(100, prev.mass + (eff.mass || 0))),
        power: Math.max(0, Math.min(100, prev.power + (eff.power || 0))),
        data: Math.max(0, Math.min(100, prev.data + (eff.scientific_value || 0))),
        communication: Math.max(0, Math.min(100, prev.communication + (eff.communication || 0))),
        scientific_value: Math.max(0, prev.scientific_value + (eff.scientific_value || 0)),
        time: prev.time
      };
    });

    // Record decision
    setDecisionHistory((prev) => [
      ...prev,
      {
        stage: activeNode.stage,
        question: activeNode.question,
        choice: ans.text,
        consequence: ans.consequence,
        learning: ans.learning
      }
    ]);

    // If this question mapped to a mission task, record its completion status
    if (activeNode.isTask && missionTasks[activeNode.taskIndex]) {
      const targetTask = missionTasks[activeNode.taskIndex];
      const isComplete = Boolean(ans.taskSuccess);
      setTasksState((prev) => ({
        ...prev,
        [targetTask.id]: isComplete
      }));
    }

    // Advance to next flight phase after 1.4s feedback display
    setTimeout(() => {
      setFeedback(null);
      const nextIdx = currentStageIndex + 1;

      if (nextIdx >= flightNodes.length) {
        // All flight challenges and tasks completed!
        finishMission();
      } else {
        setCurrentStageIndex(nextIdx);

        // If transitioning from deep space hazard to orbital arrival
        if (nextIdx === 2 && !reachedDestination) {
          setReachedDestination(true);
          sounds.ping();
          setTransitMessage(`🌕 ORBITAL INSERTION CONFIRMED • ENTERING ${mission.scenarioDestination.toUpperCase()} ORBIT`);
        } else {
          setTransitMessage('TRAVERSING ORBIT • TELEMETRY NOMINAL');
        }

        sounds.transmission();
        // Switches to cruising which will take exactly 2 seconds before the next question appears
        setFlightPhase('cruising');
      }
    }, 1400);
  };

  // Complete mission & persist all numerical telemetry
  const finishMission = () => {
    sounds.transmission();
    setIsRocketFinalTransit(true);
    setFlightPhase('debrief');

    setTimeout(() => {
      // Calculate task outcomes
      const completedCount = Object.values(tasksState).filter(Boolean).length;
      const totalTasksCount = missionTasks.length;
      const isSuccess = completedCount >= 2 && resources.power > 0;

      const scoreObj = calculateMissionScore({
        success: isSuccess,
        tasksCompleted: completedCount,
        totalTasks: totalTasksCount,
        remainingBudgetPercent: resources.budget / 100,
        remainingPowerPercent: resources.power / 100,
        scientificValue: resources.scientific_value,
        decisionEfficiency: 0.88
      });

      const finalizedTasks = missionTasks.map((t) => ({
        ...t,
        completed: Boolean(tasksState[t.id])
      }));

      // Complete telemetry object with verified real values
      const missionResultData = {
        missionId: mission.id,
        missionNumber: mission.number,
        missionTitle: mission.title,
        scenarioId: mission.scenarioId,
        scenarioDestination: mission.scenarioDestination,
        success: isSuccess,
        score: scoreObj.score,
        stars: scoreObj.stars,
        rating: scoreObj.rating,
        resources: {
          budget: resources.budget,
          mass: resources.mass,
          power: resources.power,
          data: resources.data,
          communication: resources.communication,
          scientific_value: resources.scientific_value,
          time: resources.time
        },
        tasks: finalizedTasks,
        completedTasksCount: completedCount,
        totalTasksCount: totalTasksCount,
        decisions: decisionHistory,
        vehicleName: activeVehicle?.name || 'Falcon 9',
        ending: {
          title: isSuccess ? 'Mission Accomplished' : 'Mission Parameters Exceeded',
          description: isSuccess
            ? `Your spacecraft successfully captured into ${mission.scenarioDestination} orbit and completed ${completedCount} of ${totalTasksCount} primary science tasks.`
            : 'Flight margins were exhausted before all orbital tasks could be safely downlinked.',
          scientific_explanation: isSuccess
            ? 'Optimal balance of power generation, orbital delta-v management, and directional communication bandwidth ensured complete mission success.'
            : 'Subsystem trade-off imbalances led to payload constraints during primary planetary operations.',
          learning_point: 'NASA mission success relies on holistic systems engineering where budget, mass, power, and science goals are kept in equilibrium.'
        }
      };

      // Save directly to localStorage for guaranteed immediate rendering
      saveMissionResult(mission.id, missionResultData);

      if (isSuccess) {
        sounds.success();
        const nextNum = mission.number + 1;
        if (nextNum <= 3) {
          unlockMission(mission.scenarioId, `${mission.scenarioId.replace('-exploration', '')}-m${nextNum}`);
        }
      } else {
        sounds.failure();
      }

      // Hard browser navigation guarantees static export rendering
      window.location.href = `/mission/${mission.id}/report/`;
    }, 2200);
  };

  if (!mission) return null;

  return (
    <div className={`relative min-h-screen bg-space-void text-hud-cream overflow-hidden flex flex-col justify-between w-full ${
      shipShake ? 'animate-bounce' : ''
    }`}>
      <StarfieldCanvas speed={flightPhase === 'countdown' ? 0.4 : 2.0} density={75} />

      {/* Slim, Compact Top Telemetry Strip */}
      <header className="relative z-20 bg-panel-bg/95 border-b-2 border-panel-border py-1.5 px-4 sm:px-8 shadow-pixel-sm w-full">
        <div className="w-full flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] bg-panel-bg-raised text-hud-amber px-2 py-0.5 border border-panel-border font-bold">
              FLIGHT M{mission.number}
            </span>
            <span className="font-display text-[11px] sm:text-[12px] text-hud-cream truncate">
              {mission.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoPilot((p) => !p)}
              className={`font-small text-[9px] px-2 py-0.5 border transition-all cursor-pointer font-bold ${
                autoPilot
                  ? 'bg-planet-teal text-space-void border-planet-teal animate-pulse'
                  : 'bg-space-void text-hull-silver border-panel-border hover:text-hud-amber'
              }`}
              title="Toggle automatic 2-second flight cadence"
            >
              ⚡ AUTO (2s): {autoPilot ? 'ON' : 'OFF'}
            </button>
            <span className="font-small text-[9px] text-planet-teal hidden md:inline">
              TARGET: {mission.scenarioDestination.toUpperCase()}
            </span>
            <Chip color={reachedDestination ? 'green' : 'amber'}>
              {reachedDestination ? 'LUNAR ORBIT' : 'CRUISING'}
            </Chip>
          </div>
        </div>

        <div className="w-full">
          <ResourceHUD compact resources={resources} limits={mission.constraints} />
        </div>
      </header>

      {/* Main Flight Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start w-full">
        {/* Countdown Stage */}
        {flightPhase === 'countdown' && (
          <div className="flex-1 flex items-center justify-center p-6 w-full">
            <div className="bg-panel-bg/95 border-4 border-panel-border p-6 sm:p-8 shadow-pixel-lg text-center max-w-xl w-full">
              <span className="font-small text-[10px] sm:text-[11px] text-hull-silver uppercase tracking-widest block mb-2 font-bold">
                LAUNCH PAD 39B • IGNITION SEQUENCE
              </span>
              <div className="font-display text-2xl sm:text-3xl md:text-4xl text-flame-yellow my-3 animate-pulse font-bold tracking-wider">
                {countdown > 0 ? countdown : 'LIFTOFF!'}
              </div>
              <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/90 mb-5 leading-snug">
                Main engines firing at full thrust. Hold-down clamps released. Ascending through atmosphere...
              </p>
              <button
                type="button"
                onClick={() => {
                  sounds.transmission();
                  setFlightPhase('cruising');
                  setIsRocketIntro(true);
                  setTimeout(() => setIsRocketIntro(false), 1800);
                  setTimeout(() => setFlightPhase('question'), 2000);
                }}
                className="py-2.5 px-5 bg-rocket-red hover:bg-rocket-red-dark text-white font-display text-[11px] sm:text-[12px] tracking-wider uppercase border-2 border-rocket-outline cursor-pointer font-bold shadow-pixel-sm active:translate-y-1"
              >
                🚀 INITIATE DIRECT ORBITAL TRANSIT ▶
              </button>
            </div>
          </div>
        )}

        {/* Panoramic Cosmic Viewport with Flying Rocket (Starts Left -> Settles Fixed -> Flies to Planet at End) */}
        {flightPhase !== 'countdown' && (
          <div className="w-full h-64 sm:h-72 lg:h-80 relative bg-space-void/90 border-b-2 border-panel-border overflow-hidden flex items-center shadow-inner group">
            {/* Ambient Starfield & Grid in Viewport */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

            {/* Target Celestial Body (Pixel art for gameplay: Moon / Mars / Earth) */}
            <div className={`absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-1000 ${
              reachedDestination || isRocketFinalTransit ? 'scale-110 sm:scale-125' : 'scale-90 opacity-80'
            }`}>
              <div className="w-36 h-36 sm:w-52 sm:h-52 relative flex items-center justify-center">
                <img
                  src={`/assets/pixel/destinations/${destName}.png`}
                  alt={mission.scenarioDestination}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.4)] pixel-art"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <span className="font-small text-[9px] text-planet-teal uppercase tracking-widest mt-1 bg-space-void/90 px-2 py-0.5 border border-planet-teal/60">
                {mission.scenarioDestination} • {reachedDestination || isRocketFinalTransit ? 'IN ORBIT' : 'APPROACHING'}
              </span>
            </div>

            {/* Flying Spacecraft: Horizontally oriented (90° heading) pointing directly at target planet */}
            <div className={`absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
              isRocketFinalTransit
                ? 'animate-rocket-to-planet'
                : isRocketIntro
                ? 'animate-rocket-from-left'
                : 'animate-rocket-fixed'
            }`}>
              {/* Thruster exhaust flame behind rocket on the left side */}
              <div className="flex items-center -mr-3 z-0">
                <div className="w-12 sm:w-16 h-3 sm:h-4 bg-flame-yellow rounded-full blur-[2px] animate-pulse" />
                <div className="w-8 sm:w-10 h-2 sm:h-3 bg-rocket-red rounded-full -ml-4 animate-ping opacity-85" />
              </div>

              <div className="relative flex items-center justify-center z-10">
                <img
                  src="/assets/sprites/rocket-flight-horizontal.png"
                  alt="Orbit Forge Rocket"
                  className="w-24 sm:w-28 md:w-32 h-auto pixel-art filter drop-shadow-[0_0_20px_rgba(255,140,0,0.85)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Spacecraft Identification Tag */}
              <div className="ml-3 bg-space-void/90 border border-hud-amber px-2.5 py-1 shadow-pixel-sm hidden sm:block z-10">
                <span className="font-display text-[9px] text-hud-amber uppercase font-bold block">
                  {activeVehicle?.name || 'ORBIT FORGE SPACECRAFT'}
                </span>
                <span className="font-small text-[8px] text-planet-teal block">
                  HEADING: 090° EAST • {reachedDestination ? `${mission.scenarioDestination.toUpperCase()} ORBIT` : 'INTERPLANETARY'}
                </span>
              </div>
            </div>

            {/* Flight Telemetry Status Banner overlay at bottom of viewport */}
            <div className="absolute bottom-2 left-4 z-10 flex items-center gap-2 bg-space-void/90 border border-panel-border/80 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              <span className="font-display text-[10px] text-hud-cream uppercase tracking-wider">
                {transitMessage}
              </span>
              {flightPhase === 'cruising' && (
                <span className="font-small text-[9px] text-hud-amber ml-2 bg-panel-bg px-1.5 py-0.5 border border-hud-amber/60">
                  NEXT DIRECTIVE: {cruiseTimer}s
                </span>
              )}
            </div>

            {/* Stage indicator tag at top left of viewport */}
            <div className="absolute top-2 left-4 z-10 bg-space-void/90 border border-hud-amber px-3 py-1">
              <span className="font-small text-[9px] text-hud-amber uppercase font-bold tracking-widest">
                STEP {currentStageIndex + 1} OF {flightNodes.length} • {activeNode.stage}
              </span>
            </div>
          </div>
        )}

        {/* Mid-flight 2-Second Transition Screen */}
        {flightPhase === 'cruising' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 w-full text-center">
            <div className="bg-panel-bg/95 border-4 border-panel-border p-6 shadow-pixel-lg max-w-lg w-full">
              <div className="text-3xl mb-2 animate-bounce">🛰️</div>
              <span className="font-display text-[12px] sm:text-[13px] text-hud-amber uppercase block mb-2 font-bold">
                {transitMessage}
              </span>
              <p className="font-body text-[15px] text-hud-cream/90 leading-snug mb-3">
                Spacecraft flight computer is computing navigational attitude and telemetry parameters...
              </p>
              <div className="inline-flex items-center gap-2 bg-space-void px-3 py-1 border border-hud-amber">
                <span className="w-2 h-2 rounded-full bg-hud-amber animate-ping" />
                <span className="font-small text-[10px] text-hud-amber uppercase">
                  INCOMING DIRECTIVE IN: {cruiseTimer} SECONDS
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Question & Mission Decision Card */}
        {flightPhase === 'question' && (
          <div className="w-full max-w-5xl p-4 sm:p-6 flex flex-col gap-4">
            <div className="bg-panel-bg/95 border-4 border-panel-border shadow-pixel-lg p-5 sm:p-7">
              {/* Category / Node Badge */}
              <div className="flex flex-wrap items-center justify-between border-b-2 border-panel-border/60 pb-2.5 mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="border border-planet-teal bg-space-void px-2.5 py-0.5 font-small text-[9px] text-planet-teal font-bold uppercase">
                    {activeNode.badge}
                  </span>
                  {activeNode.isTask && (
                    <Chip color="green">CRITICAL MISSION TASK</Chip>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {autoPilot && (
                    <span className="font-small text-[9px] text-flame-yellow animate-pulse">
                      AUTO-CADENCE ACTIVE
                    </span>
                  )}
                  <span className="font-small text-[10px] text-hull-silver">
                    NODE: {activeNode.id} • {currentStageIndex + 1}/{flightNodes.length}
                  </span>
                </div>
              </div>

              {/* Story Context (Refined font size) */}
              <p className="font-body text-[15px] sm:text-[16px] text-hud-cream/90 leading-relaxed mb-3 bg-space-void/70 p-3.5 border border-panel-border/50">
                {activeNode.story}
              </p>

              {/* Question Text (Refined font size) */}
              <h3 className="font-display text-[12px] sm:text-[14px] text-hud-amber mb-4 leading-snug">
                {activeNode.question}
              </h3>

              {/* Answer Choices */}
              <div className="flex flex-col gap-3">
                {activeNode.answers.map((ans, idx) => (
                  <button
                    key={ans.id || idx}
                    type="button"
                    onClick={() => handleAnswer(ans)}
                    disabled={feedback !== null}
                    className="p-3.5 sm:p-4 bg-space-void hover:bg-space-deep border-2 border-panel-border hover:border-hud-amber transition-all text-left flex items-start gap-3 shadow-pixel-sm active:translate-y-0.5 cursor-pointer group disabled:opacity-50"
                  >
                    <span className="font-display text-[11px] text-hud-amber group-hover:text-flame-yellow mt-0.5">
                      [{String.fromCharCode(65 + idx)}]
                    </span>
                    <div className="flex-1">
                      <p className="font-body text-[14px] sm:text-[15px] text-hud-cream leading-snug group-hover:text-white">
                        {ans.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Live Decision Feedback Banner */}
              {feedback && (
                <div className="mt-4 p-3.5 bg-space-void border-2 border-planet-teal shadow-pixel-sm">
                  <span className="font-display text-[11px] text-planet-teal uppercase block mb-1 font-bold">
                    FLIGHT DIRECTOR TELEMETRY:
                  </span>
                  <p className="font-body text-[14px] text-hud-cream mb-1">
                    {feedback.consequence}
                  </p>
                  <p className="font-small text-[10px] text-hull-silver">
                    PRINCIPLE: {feedback.learning}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debrief Transition: Target Planet Reached */}
        {flightPhase === 'debrief' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 w-full text-center">
            <div className="bg-panel-bg/95 border-4 border-hud-amber p-6 sm:p-8 shadow-pixel-lg max-w-lg w-full flex flex-col items-center">
              <span className="font-small text-[10px] text-planet-teal uppercase tracking-widest mb-1 font-bold">
                TRANSIT COMPLETE • ORBITAL INJECTION 100%
              </span>
              <h2 className="font-display text-[15px] sm:text-[17px] text-hud-amber uppercase mb-3 font-bold">
                🪐 DESTINATION REACHED: {mission.scenarioDestination.toUpperCase()}
              </h2>

              <div className="w-44 h-44 sm:w-56 sm:h-56 relative my-2">
                <img
                  src={`/assets/pixel/destinations/${destName}.png`}
                  alt={`${mission.scenarioDestination} Pixel Globe`}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(255,255,255,0.45)] pixel-art"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              <p className="font-body text-[15px] text-hud-cream/90 leading-snug mt-2">
                Spacecraft captured into target science orbit over {mission.scenarioDestination}. Compiling telemetry report and logging mission outcomes...
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
