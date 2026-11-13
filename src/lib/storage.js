/**
 * Storage manager for Orbit Forge
 * SSR-safe, versioned, strictly client-side localStorage wrapper.
 */

const STORAGE_PREFIX = 'orbitforge:v1:';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getStorageItem(key, defaultValue = null) {
  if (!isBrowser()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] Error reading key "${key}":`, err);
    return defaultValue;
  }
}

export function setStorageItem(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] Error setting key "${key}":`, err);
  }
}

export function removeStorageItem(key) {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (err) {
    console.warn(`[storage] Error removing key "${key}":`, err);
  }
}

// Preset helpers
export function isIntroSeen() {
  return Boolean(getStorageItem('intro_seen', false));
}

export function markIntroSeen() {
  setStorageItem('intro_seen', true);
}

export function getUnlockedMissions(scenarioId) {
  // Mission 1 is always unlocked by default
  const defaultList = ['mission-1'];
  return getStorageItem(`unlocked_missions:${scenarioId}`, defaultList);
}

export function unlockMission(scenarioId, missionId) {
  const current = getUnlockedMissions(scenarioId);
  if (!current.includes(missionId)) {
    const updated = [...current, missionId];
    setStorageItem(`unlocked_missions:${scenarioId}`, updated);
    return updated;
  }
  return current;
}

export function getMissionResults(missionId) {
  return getStorageItem(`mission_result:${missionId}`, null);
}

export function getLatestMissionResult() {
  return getStorageItem('latest_mission_result', null);
}

export function saveMissionResult(missionId, result) {
  // Always record latest run for immediate report rendering
  setStorageItem('latest_mission_result', result);

  const existing = getMissionResults(missionId);
  // Keep best score or update with current flight telemetry
  if (!existing || (result.score || 0) >= (existing.score || 0)) {
    setStorageItem(`mission_result:${missionId}`, result);
  } else {
    setStorageItem(`mission_result:${missionId}`, {
      ...result,
      bestScore: existing.score,
      bestStars: existing.stars
    });
  }
}

export function getSavedDesign(missionId) {
  return getStorageItem(`saved_design:${missionId}`, null);
}

export function saveDesign(missionId, design) {
  setStorageItem(`saved_design:${missionId}`, design);
}
