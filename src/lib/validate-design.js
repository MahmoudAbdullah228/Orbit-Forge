/**
 * Live Spacecraft Design Validation Engine
 * Evaluates mass, power balance, cost limits, downlink throughput, and mission suitability.
 */

export function validateDesign({
  vehicle,
  instruments = [],
  powerSystems = [],
  comms,
  orbit,
  mission
}) {
  const checks = [];
  let isValid = true;

  // 1. Mandatory component selections
  const hasVehicle = Boolean(vehicle);
  const hasInstruments = instruments.length > 0;
  const hasPower = powerSystems.length > 0;
  const hasComms = Boolean(comms);
  const hasOrbit = Boolean(orbit);

  checks.push({
    id: 'selection_complete',
    label: 'All Subsystems Selected',
    passed: hasVehicle && hasInstruments && hasPower && hasComms && hasOrbit,
    isHard: true,
    why: !hasVehicle
      ? 'A launch vehicle is required to lift the spacecraft from Earth.'
      : !hasInstruments
      ? 'At least one scientific instrument is required to collect mission data.'
      : !hasPower
      ? 'A power system (solar array, battery, or RTG) is required to operate spacecraft systems.'
      : !hasComms
      ? 'A communication antenna is required to transmit science telemetry to Earth.'
      : !hasOrbit
      ? 'An operational trajectory orbit must be designated.'
      : 'All core subsystems (launcher, payload, power, comms, orbit) are assigned.'
  });

  if (!hasVehicle || !hasInstruments || !hasPower || !hasComms || !hasOrbit) {
    return {
      isValid: false,
      checks,
      totals: { mass: 0, powerDraw: 0, powerGen: 0, cost: 0, dataRate: 0, downlink: 0 }
    };
  }

  // Calculate totals
  const launcherCost = vehicle.game.cost || 0;
  const instrumentsCost = instruments.reduce((sum, item) => sum + (item.game.cost || 0), 0);
  const powerCost = powerSystems.reduce((sum, item) => sum + (item.game.cost || 0), 0);
  const commsCost = comms.game.cost || 0;
  const totalCost = launcherCost + instrumentsCost + powerCost + commsCost;

  const instrumentsMass = instruments.reduce((sum, item) => sum + (item.game.mass || 0), 0);
  const powerMass = powerSystems.reduce((sum, item) => sum + (item.game.mass || 0), 0);
  const commsMass = comms.game.mass || 0;
  const orbitPenalty = orbit.game.mass_penalty || 0;
  const dryMass = instrumentsMass + powerMass + commsMass + orbitPenalty;

  const instrumentsPowerDraw = instruments.reduce((sum, item) => sum + (item.game.power || 0), 0);
  const commsPowerDraw = comms.game.power || 0;
  const baseBusPowerDraw = 10; // Computers, attitude control, heating
  const totalPowerDraw = instrumentsPowerDraw + commsPowerDraw + baseBusPowerDraw;

  const totalPowerGeneration = powerSystems.reduce((sum, item) => sum + (item.game.power_generation || 0), 0);

  const totalDataRate = instruments.reduce((sum, item) => sum + (item.game.data_rate || 0), 0);
  const downlinkCapacity = comms.game.downlink_capacity || 0;

  // 2. Launch vehicle payload capacity check
  const launcherCapacity = vehicle.game.max_payload_kg || 100;
  const massUnderLauncher = dryMass <= launcherCapacity;
  checks.push({
    id: 'mass_launcher',
    label: `Mass ≤ Launch Vehicle Capacity (${dryMass}kg / ${launcherCapacity}kg)`,
    passed: massUnderLauncher,
    isHard: true,
    why: massUnderLauncher
      ? 'Your spacecraft mass fits comfortably within the chosen rocket’s lift capacity.'
      : `Spacecraft mass (${dryMass}kg) exceeds ${vehicle.name}'s maximum payload capacity (${launcherCapacity}kg). Upgrade to a heavier launcher or select lighter instruments.`
  });
  if (!massUnderLauncher) isValid = false;

  // 3. Mission max mass constraint
  const missionMaxMass = mission.constraints?.max_mass || 100;
  const massUnderMission = dryMass <= missionMaxMass;
  checks.push({
    id: 'mass_mission',
    label: `Mass ≤ Mission Ceiling (${dryMass}kg / ${missionMaxMass}kg)`,
    passed: massUnderMission,
    isHard: true,
    why: massUnderMission
      ? 'Mission structural mass is within the agency allowance.'
      : `Spacecraft mass (${dryMass}kg) exceeds mission ceiling of ${missionMaxMass}kg.`
  });
  if (!massUnderMission) isValid = false;

  // 4. Budget check
  const maxBudget = mission.constraints?.max_budget || 100;
  const budgetPassed = totalCost <= maxBudget;
  checks.push({
    id: 'budget_check',
    label: `Total Cost ≤ Budget ($${totalCost}M / $${maxBudget}M)`,
    passed: budgetPassed,
    isHard: true,
    why: budgetPassed
      ? `Budget is healthy. You have $${maxBudget - totalCost}M in remaining reserve funds.`
      : `Total project cost ($${totalCost}M) exceeds available mission budget ($${maxBudget}M). Downgrade launcher or simplify instruments to avoid fiscal cancellation.`
  });
  if (!budgetPassed) isValid = false;

  // 5. Power generation vs consumption check
  const powerBalancePassed = totalPowerGeneration >= totalPowerDraw;
  checks.push({
    id: 'power_balance',
    label: `Power Generation ≥ Draw (${totalPowerGeneration}W / ${totalPowerDraw}W)`,
    passed: powerBalancePassed,
    isHard: true,
    why: powerBalancePassed
      ? `Power generation (${totalPowerGeneration}W) provides a +${totalPowerGeneration - totalPowerDraw}W surplus for onboard battery charging.`
      : `Spacecraft systems draw ${totalPowerDraw}W but power generation supplies only ${totalPowerGeneration}W. Add solar wings or high-capacity batteries to prevent brownout.`
  });
  if (!powerBalancePassed) isValid = false;

  // 6. Communications Downlink Margin
  const commsMarginPassed = downlinkCapacity >= totalDataRate * 0.7; // Can buffer 30%
  checks.push({
    id: 'comms_bandwidth',
    label: `Downlink Bandwidth vs Sensor Data (${downlinkCapacity}Mb/s / ${totalDataRate}Mb/s)`,
    passed: commsMarginPassed,
    isHard: false,
    why: commsMarginPassed
      ? 'The communication system has sufficient throughput to downlink payload datasets.'
      : `Sensor data generation (${totalDataRate}Mb/s) outpaces downlink speed (${downlinkCapacity}Mb/s). Telemetry will accumulate in memory and require duty-cycling.`
  });

  // 7. Orbit Compatibility with Launch Vehicle
  const orbitCompatible = vehicle.game.compatible_orbits?.includes(orbit.id);
  checks.push({
    id: 'orbit_compatibility',
    label: `Launcher Compatible with ${orbit.name}`,
    passed: orbitCompatible,
    isHard: true,
    why: orbitCompatible
      ? `${vehicle.name} has the delta-V upper stage capable of injecting into ${orbit.name}.`
      : `${vehicle.name} cannot deliver the velocity increment needed for ${orbit.name}. Select a higher-class rocket.`
  });
  if (!orbitCompatible) isValid = false;

  // 8. Required Mission Tasks instrument suitability
  const requiredTasks = mission.tasks || [];
  let tasksSatisfied = true;
  for (const task of requiredTasks) {
    if (task.target === 'LUNAR_POLAR' || task.target === 'SSO' || task.target === 'MARS_LOW_ORBIT') {
      if (orbit.id !== task.target) {
        tasksSatisfied = false;
        checks.push({
          id: `task_${task.id}`,
          label: `Mission Requirement: ${task.label}`,
          passed: false,
          isHard: true,
          why: `This mission requires insertion into ${task.target} to satisfy objectives.`
        });
      }
    } else if (task.target === 'power') {
      // Checked by power balance
    } else if (task.target === 'mass') {
      // Checked by mass
    } else {
      // Must have matching instrument, comms, or vehicle
      const instrumentMatches = instruments.some((inst) => inst.id === task.target);
      const commsMatches = comms.id === task.target;
      const powerMatches = powerSystems.some((p) => p.id === task.target);
      const vehicleMatches = vehicle.id === task.target;

      const matched = instrumentMatches || commsMatches || powerMatches || vehicleMatches;
      if (!matched) {
        tasksSatisfied = false;
        checks.push({
          id: `task_${task.id}`,
          label: `Mission Objective: ${task.label}`,
          passed: false,
          isHard: true,
          why: `The mission plan specifically requires hardware matching "${task.target}" to complete this objective.`
        });
      }
    }
  }
  if (!tasksSatisfied) isValid = false;

  return {
    isValid,
    checks,
    totals: {
      mass: dryMass,
      maxMass: missionMaxMass,
      cost: totalCost,
      maxBudget,
      powerDraw: totalPowerDraw,
      powerGen: totalPowerGeneration,
      dataRate: totalDataRate,
      downlink: downlinkCapacity
    }
  };
}
