# ORBIT FORGE — Agent Rules & Engineering Architecture

## 1. Project Concept & Objectives

**Orbit Forge** is a browser-based, pixel-art educational space mission design game created for the **NASA Space Apps Challenge 2026** challenge *"Space Mission Design Game"*.

The core educational purpose is teaching students and aspiring engineers that space mission design is an interconnected system of trade-offs across:
- **Budget** ($M)
- **Mass** (kg)
- **Power** (W)
- **Data** (Gb or Mb/s)
- **Communications** (downlink margin / dish size / ground station link)
- **Time / Lifetime** (days to years)

There is rarely one single perfect solution: every vehicle, instrument, power source, and orbit creates trade-offs.

---

## 2. Mandatory Rules for AI Agents & Developers

1. **Read docs first:** At the start of every session or task, read `docs/AGENT_RULES.md`, `docs/DESIGN.md`, and `docs/PROGRESS.md`.
2. **Never delete or rewrite completed work** without an explicit written reason documented in `docs/PROGRESS.md`.
3. **Make small, reviewable, verifiable changes.**
4. **No backend, no authentication, no login/signup.** Persistence is strictly static JSON files + browser `localStorage` (guarded for SSR, versioned e.g. `orbitforge:v1:*`).
5. **No theme toggle / light mode.** The game is strictly single-theme matching `docs/DESIGN.md` (deep-space violet, magenta horizon, rocket red, amber HUD).
6. **No TypeScript.** Use plain ECMAScript (Next.js JavaScript with JSDoc comments where types are helpful).
7. **No unrecorded dependencies.** Do not install packages without logging the justification in `docs/PROGRESS.md`.
8. **No fabricated real-world data.** All real reference facts must be derived from verified sources (NASA, ESA, JAXA, launch providers) with a source URL. If unverified, set `"verified": false` and do not present as real facts in the tutorials. Game values can be scaled, but distinct from real values.
9. **Follow exact design system specifications:** `border-radius: 0`, 4px stepped shadows, pixelated image rendering, custom rocket cursor, retro fonts (Press Start 2P, VT323, Silkscreen), stepped easing (`steps(n)`).
10. **Pre-completion gates:** Always run lint, validation scripts (`validate-scenarios.mjs`), build, and verify in a real browser before marking any task as done.

---

## 3. Full User Flow Specifications

### 3.1 Intro Screen (`/`)
- Pixel-art backdrop: Horizon Dusk scene (navy sky, stepped violet/magenta horizon, purple silhouettes, pixel stars).
- Astronaut avatar sits on the right.
- Left/center: arcade dialog box with typewriter effect (Press Start 2P / VT323), retro blinking ▶ continue prompt. 4–6 messages explaining mission engineering.
- Interactive: Click dialog or press Enter/Space to advance.
- Top-left: SKIP button directly to `/landing`.
- Completion or SKIP sets `orbitforge:v1:intro_seen = "true"` in `localStorage`. Landing provides a "Replay Intro" button.

### 3.2 Landing Screen (`/landing`)
- Left: Arcade vertical menu with options:
  - **PLAY** → navigates to `/missions`
  - **TUTORIALS** → navigates to `/tutorials`
  - **OPTIONS / AUDIO** → audio volume/mute & CRT scanline toggle
  - **REPLAY INTRO** → navigates to `/`
- Right: Large pixel astronaut avatar.
- CRT bezel frame, keyboard navigability (↑ / ↓ / Enter / Space / Esc).

### 3.3 Scenarios & Missions (`/missions`, `/missions/[scenarioId]`)
- **Scenarios view (`/missions`):**
  - Displays at least 3 scenarios:
    1. Moon Exploration (supplied canonical scenario tree)
    2. Mars Exploration (Red Planet robotic exploration)
    3. Earth Observation (climate, weather, orbital remote sensing)
  - Cards show pixel destination icon, difficulty tag, and brief overview.
- **Missions view (`/missions/[scenarioId]`):**
  - Each scenario has **5 ordered missions**.
  - Mission N+1 unlocks only after Mission N is completed (persisted in `localStorage`).
  - Displays high score, stars, completion badges.

### 3.4 Mission Dashboard (`/mission/[id]/dashboard`)
- **Right side:** Pixel destination art, live available power, available budget, and hard constraints (max mass, max power, max budget, comms, lifetime, required orbit) via the Resource HUD.
- **Left side:** Mission briefing and required tasks checklist (e.g. "Equip optical spectrometer", "Achieve Low Polar Orbit", "Maintain ≥ 20% power reserve").
- Navigation: **CONTINUE TO SPACECRAFT DESIGN** → `/mission/[id]/tools`, **BACK** → `/missions/[scenarioId]`.

### 3.5 Tools / Spacecraft Builder (`/mission/[id]/tools`)
- Full-width stacked category widgets:
  1. **Launch Vehicles** (payload capacity to orbits, fairing mass, launch cost)
  2. **Scientific Instruments** (mass, power draw, science value, data rate)
  3. **Power Systems** (solar panels, batteries, RTGs: mass, power output, solar distance penalty)
  4. **Communications** (omni antennas, high-gain dishes, relay transponders: data rate, power draw, mass)
  5. **Orbit Selection** (LEO, SSO, Lunar Polar, Mars Transfer, GEO: delta-V, eclipse times, coverage)
- **Sticky Resource HUD:** Real-time calculation of Budget, Mass, Power, Data, Comms, Time vs. Mission & Launcher Limits.
- **Live Validation Engine (`validate-design.js`):**
  - Total mass ≤ mission max mass AND ≤ launcher payload capacity to selected orbit.
  - Power generation ≥ power draw (taking eclipse & solar distance into account).
  - Total cost ≤ budget.
  - Comms capability matches instrument data generation.
  - Required instruments for mission tasks are present.
  - Clear, educational "WHY?" explanations for any failure.
- **LAUNCH** button is locked until all hard validation checks pass. State is autosaved to `localStorage`.

### 3.6 Flight Phase (`/mission/[id]/flight`)
- Full-screen retro pixel space flight scene:
  - Deep-space starfield with parallax layers (GSAP animated).
  - Center spaceship sprite with animated thruster flame.
  - "Incoming Transmission" alert banner.
  - Branching decision modal: exactly two options per question node with resource trade-offs.
  - Live HUD updating resources dynamically after each decision.
  - Destination arrival triggers task evaluation questions.
  - Immediate failure trigger if any vital resource drops to 0 or fatal branch is chosen.

### 3.7 Mission Report (`/mission/[id]/report`)
- Status banner: **MISSION SUCCESS** (green) or **MISSION FAILED** (red).
- Resource consumption summary (budget spent, mass flown, power consumed, data returned).
- Checklist of mission tasks (Completed ✔ vs. Failed ✖).
- 1–5 Star rating and numeric score computed using documented formula.
- Educational "WHY IT WORKED / FAILED" diagnostic panel.
- Action buttons: **RETRY** (back to tools), **NEXT MISSION** (if unlocked), **RETURN TO MISSIONS**.
- Persists best score, stars, and completion state.

### 3.8 Tutorials & Reference Encyclopedia (`/tutorials`, `/tutorials/[itemId]`)
- Catalog of all launch vehicles, spacecraft buses, instruments, power systems, communications hardware, and orbits.
- Detail view:
  - Right: Pixel artwork of the component/orbit.
  - Left: Detailed technical description, real vs. game stats (mass, power, cost, data), affected mission constraints, real-world mission example, and verified source URL link.

---

## 4. Game Rules & Simulation Mechanics

### 4.1 Resources & Thresholds
- **Budget ($M):** Depleted by spacecraft components and launch vehicles. Cannot drop below 0.
- **Mass (kg):** Sum of dry mass, instruments, power systems, comms, and propellant. Must not exceed launch vehicle payload capacity to destination orbit.
- **Power (W):** Generation must exceed base bus + instrument consumption. Orbital night/shadow requires battery storage or RTG.
- **Data (Mb/s or Gb):** Generated by instruments; must be stored or downlinked via communications subsystem.
- **Communications:** Antenna gain and frequency (S-band, X-band, Ka-band, optical relay) determine downlink rate and ground station visibility.
- **Time / Lifetime:** Mission duration vs. component degradation and distance delays.

### 4.2 Scoring Formula
```javascript
export function calculateMissionScore({
  success,
  tasksCompleted,
  totalTasks,
  remainingBudgetPercent,
  remainingPowerPercent,
  scientificValue,
  decisionEfficiency
}) {
  if (!success) {
    return Math.max(100, Math.round(scientificValue * 5 + tasksCompleted * 50));
  }
  const baseScore = 1000;
  const taskScore = (tasksCompleted / Math.max(1, totalTasks)) * 1500;
  const scienceScore = scientificValue * 25;
  const budgetBonus = remainingBudgetPercent * 500;
  const powerBonus = remainingPowerPercent * 400;
  const efficiencyBonus = decisionEfficiency * 300;
  return Math.round(baseScore + taskScore + scienceScore + budgetBonus + powerBonus + efficiencyBonus);
}
```

---

## 5. Tech Stack & Coding Standards

- **Framework:** Next.js (App Router), static export (`output: 'export'`), static assets with `unoptimized: true`.
- **Language:** JavaScript (ESNext, React 19 / 18, JSDoc).
- **Styling:** Tailwind CSS with custom theme tokens from `DESIGN.md`.
- **UI Animation:** `motion/react` for component micro-interactions and transitions.
- **Scene Animation:** `gsap` (dynamically imported on flight and intro scenes).
- **Fonts:** `Press Start 2P`, `VT323`, `Silkscreen` loaded via `@next/font/google`.
- **Code Style:** Functional components, hooks, clean module boundaries, pure state reducers, zero console errors, zero hydration mismatches.
- **Pixel Art Policy:** Native pixel size rendered with integer scaling (×2, ×3, ×4) and `image-rendering: pixelated`.

---

## 6. Directory Layout

```
docs/
  DESIGN.md
  AGENT_RULES.md
  PROGRESS.md
public/
  assets/
    avatars/
    cursors/
    pixel/
      destinations/
      vehicles/
      instruments/
      power/
      comms/
      orbits/
      ui/
data/
  scenarios/
    moon-exploration.json
    mars-exploration.json
    earth-observation.json
  vehicles.json
  instruments.json
  power.json
  comms.json
  orbits.json
  tutorials.json
  constraints.json
scripts/
  validate-scenarios.mjs
  pixelate.mjs
src/
  app/
    layout.js
    page.js
    landing/page.js
    missions/page.js
    missions/[scenarioId]/page.js
    mission/[missionId]/dashboard/page.js
    mission/[missionId]/tools/page.js
    mission/[missionId]/flight/page.js
    mission/[missionId]/report/page.js
    tutorials/page.js
    tutorials/[itemId]/page.js
  components/
    ui/
      PixelPanel.jsx
      PixelButton.jsx
      ArcadeMenu.jsx
      Chip.jsx
      Modal.jsx
      Tooltip.jsx
      AudioToggle.jsx
    hud/
      ResourceBar.jsx
      ResourceHUD.jsx
      StatRow.jsx
      TaskChecklist.jsx
    scenes/
      StarfieldCanvas.jsx
      FlightScene.jsx
      IntroDialog.jsx
    cards/
      ComponentCard.jsx
      ScenarioCard.jsx
      MissionCard.jsx
  lib/
    storage.js
    resources.js
    validate-design.js
    mission-engine.js
    scoring.js
    sound.js
```
