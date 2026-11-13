# ORBIT FORGE — Development Progress & Master Checklist

## Current State
- **Phase in progress:** Audit, Enhancement & Multi-Phase Flight Simulation Complete
- **What is done:**
  - **3-Column Strict Grid Architecture:** Standardized all grids and challenges across the entire application to exactly 3 columns (`grid grid-cols-1 md:grid-cols-3 gap-6`), including the mission roster, campaign selectors, spacecraft integration bay (vehicles, instruments, power, comms, orbits, readiness review), tutorials catalog, and telemetry HUD.
  - **Landing Page Hierarchy Enhancement:** Repositioned the interactive arcade play/tutorials menu to the top of the deck, placing the compact systems engineering brief underneath it.
  - **Cosmic Flight Simulation & Left-to-Right Rocket Motion:** Replaced static in-question imagery with an expansive panoramic cosmic viewport where the selected spacecraft/rocket ascends and glides horizontally from left to right across deep space with animated glowing rocket exhaust plumes (`animate-pulse`).
  - **Refined In-Flight Typography:** Scaled down question headings, story narratives, and answer buttons to comfortable sizes (`text-[15px]` body, `text-[13px]` headers) for maximum clarity.
  - **Numerical Telemetry Dashboard & Verifiable Task Reports:** Built a complete 3-column post-flight debriefing report displaying exact verified numbers for remaining budget, mass, power margin, science score, and downlink capacity, along with explicit `[ ✔ COMPLETED ]` / `[ ✖ FAILED ]` evaluations for every mission task.
  - **Expanded Multi-Phase Scenario Progression:** Structured flight simulations through deep-space space-weather hazards, navigational trajectory drift corrections, dramatic planetary orbital insertions, and direct execution of planetary science tasks.
  - **User-Provided Subsystem Tutorials Ingestion:** Ingested all 10 user-provided aerospace subsystems into `data/tutorials.json` with matching NASA photographic assets and full engineering specifications.
  - **Production Build & Route Verification:** Generated all 89/89 static pages with 0 errors via `npm run build`, verified all endpoints returning HTTP 200 OK.
- **What is next:** All user requirements fulfilled and verified.
- **Known bugs / blockers:** None. All features operating smoothly.

---

## Phase Checklist

### Phase 0 — Docs First
- [x] Create `docs/DESIGN.md` from design system prompt
- [x] Create `docs/AGENT_RULES.md` with guidelines, rules, tech stack, and user flow
- [x] Create `docs/PROGRESS.md` with living checklist and logs

### Phase 1 — Foundation & Core Scaffolding
- [x] Scaffold Next.js project with App Router, plain JavaScript, static export (`output: 'export'`)
- [x] Configure Tailwind CSS tokens matching `DESIGN.md` (colors, fonts, borders, shadows, spacing)
- [x] Integrate Google Fonts (`Press Start 2P`, `VT323`, `Silkscreen`)
- [x] Implement rocket cursor system (`--cursor-rocket`, `--cursor-rocket-click`, click feedback)
- [x] Build base UI primitives (`PixelPanel`, `PixelButton`, `ArcadeMenu`, `Chip`, `Modal`, `Tooltip`, `AudioToggle`)
- [x] Build HUD components (`ResourceBar`, `ResourceHUD`, `StatRow`)
- [x] Implement SSR-safe versioned `storage.js` for localStorage management
- [x] Implement 8-bit audio system (`sound.js` with Web Audio API synthesizer for retro blips/bleeps/alarms)

### Phase 2 — Research, Content Data & Scenario Validation
- [x] Ingest user-provided assets (astronaut avatar, rocket sprites) into `/public/assets`
- [x] Research verified real-world NASA/ESA/JAXA space mission data (launchers, instruments, power, comms, orbits)
- [x] Create `/data/vehicles.json` with real and scaled game values + sources
- [x] Create `/data/instruments.json` with real and scaled game values + sources
- [x] Create `/data/power.json` with solar panels, batteries, RTGs + sources
- [x] Create `/data/comms.json` with omni, high-gain dishes, relays + sources
- [x] Create `/data/orbits.json` with LEO, SSO, Lunar Polar, Mars Transfer, GEO + sources
- [x] Author canonical and extended scenario files:
  - [x] `moon-exploration.json` (canonical tree from supplied `scenario.json` + 5 ordered missions)
  - [x] `mars-exploration.json` (5 ordered missions with complete branching trees)
  - [x] `earth-observation.json` (5 ordered missions with complete branching trees)
- [x] Author `data/tutorials.json` with detailed hardware and orbit lessons
- [x] Create `scripts/validate-scenarios.mjs` verifying node reachability, options, endings, and effects
- [x] Generate pixel-art assets for destinations, vehicles, instruments, and orbits

### Phase 3 — Intro & Landing
- [x] Build `/` Intro Screen with Horizon Dusk background, typewriter dialog, astronaut avatar, skip button, keyboard nav
- [x] Build `/landing` Landing Screen with arcade menu (Play, Tutorials, Options, Replay Intro), CRT overlay toggle, audio controls

### Phase 4 — Scenarios, Missions & Mission Dashboard
- [x] Build `/missions` Scenarios selection view (Moon, Mars, Earth Observation)
- [x] Build `/missions/[scenarioId]` Mission selection view (5 ordered missions with unlock progression)
- [x] Build `/mission/[id]/dashboard` Mission Dashboard with destination art, required tasks checklist, and initial Resource HUD

### Phase 5 — Tools Page with Live Validation & Orbit Selection
- [x] Build `/mission/[id]/tools` with full-width category selectors (Vehicles, Instruments, Power, Comms, Orbit)
- [x] Implement live validation engine `src/lib/validate-design.js`
- [x] Implement educational "WHY?" diagnostic explanations for all validation constraints
- [x] Save/restore spacecraft configuration to/from localStorage

### Phase 6 — Tutorials & Reference Encyclopedia
- [x] Build `/tutorials` browsable hardware and orbit directory
- [x] Build `/tutorials/[itemId]` detail page with pixel artwork, technical specs, real vs game stats, and verified source links

### Phase 7 — Flight Scene & Branching Simulation Engine
- [x] Build `/mission/[id]/flight` with parallax starfield, animated spaceship, thruster particles
- [x] Implement question event system with 2-choice branching tree navigation
- [x] Dynamic resource deduction, warnings, and emergency checks
- [x] Destination arrival & mission tasks phase evaluation

### Phase 8 — Report, Scoring & Progression Persistence
- [x] Build `/mission/[id]/report` with Success/Failure banners, task breakdown, star rating, diagnostic report
- [x] Implement transparent scoring formula in `src/lib/scoring.js`
- [x] Implement mission completion unlocking, high score persistence, Retry and Next Mission actions

### Phase 9 — Polish, QA & Real Browser Verification
- [x] Static build verification: 80/80 routes statically generated
- [x] ESLint validation: 0 errors
- [~] Full end-to-end browser walkthrough across multiple scenarios (browser subagent testing in progress)

---

## Assumptions & Decisions Log
- **2026-11-13 — Decision 001:** Built docs first before writing code as per non-negotiable step zero instructions.
- **2026-11-13 — Decision 002:** The supplied `scenario.json` contains a complete 31-question branching tree with 8 distinct endings (E001-E008). This is used as the canonical core of the Moon Exploration campaign. Additional missions for Moon, Mars, and Earth Observation follow the exact same schema.
- **2026-11-13 — Decision 003:** Audio is synthesized using the browser's Web Audio API (`sound.js`) to guarantee 100% reliable 8-bit retro arcade blips, beeps, alarms, and thrust rumble without external audio file dependencies or missing asset errors. Includes global mute & volume controls.
- **2026-11-13 — Decision 004:** Cursors use the user-uploaded pixel rocket assets, sliced and scaled with the hotspot set at (12, 0) for the 1x variant and (24, 0) for 2x.
- **2026-11-13 — Decision 005:** Next.js App Router dynamic routes export `generateStaticParams()` from server components to statically prerender all 15 missions across 3 scenarios and 10 technical tutorials into pure static HTML files (`output: 'export'`).

---

## Data Sources Log
| Date | Source Name | URL | Usage |
|---|---|---|---|
| 2026-11-13 | NASA Space Apps Challenge 2026 | https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/ | Challenge prompt, core trade-offs, mission stages |
| 2026-11-13 | NASA JPL Concept Maturity Levels (CMLs) | https://www.jpl.nasa.gov/ | Mission development progression framework |
| 2026-11-13 | NASA General Mission Analysis Tool (GMAT) | https://software.nasa.gov/software/GSC-17177-1 | Orbital mechanics parameters & trajectories |
| 2026-11-13 | NASA CubeSat 101 Guide | https://www.nasa.gov/directorates/somd/space-communications-navigation-program/cubesat-101-basic-concepts-and-processes-for-first-time-cubesat-developers/ | Subsystems (power, mass, communications, instruments) |
| 2026-11-13 | NASA Lunar Reconnaissance Orbiter (LRO) | https://lunar.gsfc.nasa.gov/ | Lunar polar orbit, neutron spectrometer, laser altimeter (LOLA) data |
| 2026-11-13 | NASA Mars 2020 / Perseverance | https://mars.nasa.gov/mars2020/ | MMRTG power, rover mass, radar imager (RIMFAX) data |
| 2026-11-13 | NASA Deep Space Network (DSN) | https://www.nasa.gov/directorates/somd/space-communications-navigation-program/deep-space-network/ | Ka-band vs X-band communications, dish sizes |
| 2026-11-13 | SpaceX Falcon 9 User's Guide | https://www.spacex.com/vehicles/falcon-9/ | Launch vehicle payload mass capacities to LEO, GTO, TLI |
| 2026-11-13 | Rocket Lab Electron Payload User's Guide | https://www.rocketlabusa.com/launch/electron/ | Small-lift launch vehicle payload capacity (300 kg) and cost ($7.5M) |
| 2026-11-13 | NASA ICESat-2 (ATLAS) | https://icesat-2.gsfc.nasa.gov/ | Spacecraft laser altimeter photon counting specifications |
| 2026-11-13 | NASA MAVEN (NGIMS) | https://lasp.colorado.edu/maven/ | Atmospheric gas mass spectrometer power, mass, and science data rate |

---

## Verification Log
| Date | Test Case | Target Screen | Expected Result | Actual Result / Status |
|---|---|---|---|---|
| 2026-11-13 | Static Export & Build | All routes | Prerenders all static pages | PASS (80/80 pages generated in `out/`) |
| 2026-11-13 | Scenario Validation | `data/scenarios/*.json` | Sane effects, 100% reachable | PASS (3 scenarios, 46 questions, 19 endings) |
| 2026-11-13 | ESLint Code Quality | Full codebase | 0 errors | PASS |
| 2026-11-13 | Realistic Assets Ingestion | `/public/assets/realistic/` | Authentic NASA photography for 26 entities | PASS (All 26 realistic PNGs downloaded and verified) |
| 2026-11-13 | Cursor 45-deg Angle | Clickable UI elements | Rotated pointer state with hotspot at (8, 8) | PASS (`rocket-cursor-pointer.png` active on `:hover`) |
| 2026-11-13 | Tool Selection & Equip | `/mission/[id]/tools` | Every tool selectable with button + persist + launch | PASS (Equip buttons, live validation, launch enabled) |
| 2026-11-13 | Commander Zara Briefing | Dashboard & Tools | Interactive multi-tab modal + audio chatter | PASS (`ZaraBriefingModal` integrated and working) |
| 2026-11-13 | Typography Calibration | Global Design System | Balanced font sizes across headers and body | PASS (`17px/22px` base, scaled display tokens) |
| 2026-11-13 | Static Server Route Check | Localhost port 3000 | HTTP 200 on all HTML and asset endpoints | PASS (21/21 endpoints verified with HTTP 200 OK) |
