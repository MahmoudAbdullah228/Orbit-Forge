/**
 * Data Loader for Orbit Forge
 * Statically imports all hardware, orbit, and mission data
 */

import vehiclesData from '../../data/vehicles.json';
import instrumentsData from '../../data/instruments.json';
import powerData from '../../data/power.json';
import commsData from '../../data/comms.json';
import orbitsData from '../../data/orbits.json';
import tutorialsData from '../../data/tutorials.json';
import scenariosList from '../../data/scenarios.json';

import moonScenarioTree from '../../data/scenarios/moon-exploration.json';
import marsScenarioTree from '../../data/scenarios/mars-exploration.json';
import earthScenarioTree from '../../data/scenarios/earth-observation.json';

const scenarioTrees = {
  'moon-exploration': moonScenarioTree,
  'mars-exploration': marsScenarioTree,
  'earth-observation': earthScenarioTree,
};

export function getVehicles() {
  return vehiclesData;
}

export function getInstruments() {
  return instrumentsData;
}

export function getPowerSystems() {
  return powerData;
}

export function getCommsSystems() {
  return commsData;
}

export function getOrbits() {
  return orbitsData;
}

export function getTutorials() {
  return tutorialsData;
}

export function getTutorialById(id) {
  if (!id) return null;
  const exact = tutorialsData.find((t) => t.id === id);
  if (exact) return exact;

  const aliases = {
    'deployable-solar-wings': 'ultraflex-solar-wings',
    'mmrtg-nuclear': 'mmrtg-nuclear-power',
    'kaband-phased-array': 'ka-band-phased-array',
    'lunar-polar-orbit': 'low-lunar-polar-orbit',
    'laser-altimeter': 'laser-altimeter-lola-atlas',
    'electron-rocket': 'rocket-lab-electron',
    'falcon-9': 'spacex-falcon-9',
    'stereo-camera': '3d-stereo-mapping-camera',
    'radar-sounder': 'subsurface-radar-sounder'
  };
  const targetId = aliases[id] || Object.keys(aliases).find((k) => aliases[k] === id);
  return tutorialsData.find((t) => t.id === targetId) || null;
}

export function getScenarios() {
  return scenariosList;
}

export function getScenarioById(scenarioId) {
  return scenariosList.find((s) => s.id === scenarioId) || null;
}

export function getMissionById(scenarioId, missionId) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return null;
  const mission = scenario.missions.find((m) => m.id === missionId) || null;
  if (!mission) return null;

  const tree = scenarioTrees[scenarioId] || moonScenarioTree;
  return {
    ...mission,
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    scenarioDestination: scenario.destination,
    backdrop: scenario.backdrop,
    tree,
  };
}

export function getMissionByGlobalId(globalMissionId) {
  for (const scenario of scenariosList) {
    const mission = scenario.missions.find((m) => m.id === globalMissionId);
    if (mission) {
      return getMissionById(scenario.id, mission.id);
    }
  }
  return null;
}
