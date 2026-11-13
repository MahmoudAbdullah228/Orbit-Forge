---
name: Orbit Forge — Space Mission Design Game
description: Pixel-art retro-arcade design system for a space mission design game. Deep-space violet canvas, magenta horizon glow, rocket-red actions, amber HUD text, CRT-style panels, and a pixel rocket as the mouse cursor.
version: 1.0
colors:
  space-void: "#0A0626"
  space-deep: "#120A3D"
  space-violet: "#2A1370"
  space-purple: "#5B2BA8"
  horizon-magenta: "#C2268F"
  horizon-pink: "#E85BB5"
  panel-bg: "#1A0F3A"
  panel-bg-raised: "#241552"
  panel-border: "#6B4FD8"
  rocket-red: "#F81414"
  rocket-red-dark: "#A80C0C"
  rocket-outline: "#3A0505"
  hull-white: "#EEF1F8"
  hull-silver: "#B9C2D6"
  hull-steel: "#7C869C"
  porthole-blue: "#12A8E8"
  porthole-light: "#7DD8FF"
  flame-orange: "#FF9A1F"
  flame-yellow: "#FFE45C"
  hud-amber: "#FFB23E"
  hud-cream: "#F3E9B8"
  planet-teal: "#2EE6A8"
  planet-teal-dark: "#1BA5C9"
  star-white: "#FFFFFF"
  success: "#3DF08A"
  warning: "#FFC83D"
  danger: "#FF3B4E"
  info: "#4FC3F7"
typography:
  font-display: "'Press Start 2P', 'Courier New', monospace"
  font-body: "'VT323', 'Courier New', monospace"
  font-ui-small: "'Silkscreen', 'Press Start 2P', monospace"
  font-arabic-fallback: "'Tajawal', 'Noto Sans Arabic', sans-serif"
spacing-base: 8px
radius: 0px
---

# Orbit Forge — Design System

> A Space Mission Design Game rendered as an 8-bit/16-bit arcade cabinet. The player is an engineer-pilot; every screen should feel like a retro console UI that happens to contain real mission-engineering data (mass, power, budget, data, comms, lifetime).

## 1. Visual Theme & Atmosphere

- **Mood:** Nostalgic arcade meets mission control. Calm deep-space backdrop, high-contrast glowing HUD, chunky pixel shapes.
- **Core idea:** Everything is built on a pixel grid. No smooth gradients, no blur, no rounded corners, no soft shadows. Depth comes from hard stepped shadows, stepped gradients (banded colors), and bevels made of 1–2 pixel lines.
- **Backgrounds:** Layered pixel-art space scenes (violet-to-magenta horizon with jagged purple mountains, starfields, teal/blue pixel planets, nebula dither clouds). Backgrounds are decorative; UI panels sit on top with solid fills.
- **Signature elements:** the red/white pixel rocket (mascot + cursor), `START` arcade screens with hearts/HI-SCORE row, cream-on-navy menu text with a ▶ selector arrow, CRT scanline overlay, dither-pattern glows.
- **Tone of copy:** Short, imperative, game-like ("LAUNCH", "NEW MISSION", "READY?") with a plain-language sub-line explaining the engineering concept.

## 2. Color Palette & Roles

| Role | Token | Hex | Usage |
|---|---|---|---|
| Page background (top) | `space-void` | `#0A0626` | Top of sky, full-page base |
| Page background (mid) | `space-deep` | `#120A3D` | Sky mid-band |
| Sky band | `space-violet` | `#2A1370` | Lower sky bands, section fills |
| Mountains / far terrain | `space-purple` | `#5B2BA8` | Silhouettes, disabled-but-visible shapes |
| Horizon glow | `horizon-magenta` | `#C2268F` | Horizon band, hero accents |
| Horizon highlight | `horizon-pink` | `#E85BB5` | Glow top edge, hover highlights |
| Panel fill | `panel-bg` | `#1A0F3A` | Cards, HUD panels, modals |
| Panel raised | `panel-bg-raised` | `#241552` | Hovered/selected rows, inner wells |
| Panel border | `panel-border` | `#6B4FD8` | 4px pixel borders |
| Primary action | `rocket-red` | `#F81414` | Primary buttons (LAUNCH, CONFIRM) |
| Primary action shadow | `rocket-red-dark` | `#A80C0C` | Button bottom/right pixel shadow |
| Outline | `rocket-outline` | `#3A0505` | Dark outline around red elements |
| Hull | `hull-white` / `hull-silver` / `hull-steel` | `#EEF1F8` / `#B9C2D6` / `#7C869C` | Spacecraft sprites, neutral light buttons |
| Porthole / info | `porthole-blue` | `#12A8E8` | Info chips, communications indicators, links |
| Flame | `flame-orange` / `flame-yellow` | `#FF9A1F` / `#FFE45C` | Secondary actions, score highlights, thrust |
| HUD text (accent) | `hud-amber` | `#FFB23E` | Titles, scores, selected menu item |
| HUD text (body) | `hud-cream` | `#F3E9B8` | Default text on dark panels |
| Planet accent | `planet-teal` | `#2EE6A8` | Science value, data, success glow |
| Stars | `star-white` | `#FFFFFF` | 1–2px star dots |

**Semantic colors**

- Success / within budget: `#3DF08A`
- Warning / near limit (≥ 80%): `#FFC83D`
- Danger / exceeded / mission failure: `#FF3B4E`
- Info / tips / learning cards: `#4FC3F7`

**Resource color coding (consistent everywhere — bars, icons, charts)**

| Resource | Color |
|---|---|
| Budget | `#FFE45C` (flame-yellow) |
| Mass | `#B9C2D6` (hull-silver) |
| Power | `#FF9A1F` (flame-orange) |
| Data | `#2EE6A8` (planet-teal) |
| Communications | `#12A8E8` (porthole-blue) |
| Time / Lifetime | `#E85BB5` (horizon-pink) |

**Rules**

- Text on `panel-bg` must be `hud-cream` or `hud-amber` (contrast > 7:1).
- Never use pure black `#000` for fills; use `space-void`.
- Maximum 3 saturated hues on one screen besides the background (typically red + amber + teal/blue).
- Use no opacity gradients. For glow, use stepped dithering (checkerboard pattern) or 2–3 solid concentric bands.

## 3. Typography

| Role | Font | Fallback | Notes |
|---|---|---|---|
| Display / Titles / Buttons | **Press Start 2P** | `'Courier New', monospace` | Google Fonts. Uppercase only. |
| Body / Descriptions / Tooltips | **VT323** | `'Courier New', monospace` | Larger sizes needed (it renders small). |
| Small labels / HUD tags | **Silkscreen** | `'Press Start 2P'` | Tiny uppercase labels, units |
| Arabic text (if RTL is supported) | **Tajawal** / Noto Sans Arabic | `sans-serif` | Pixel fonts have no Arabic glyphs. Keep Arabic in a clean sans, never fake-pixel it. |

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&family=Tajawal:wght@400;700&display=swap');
```

**Type scale** (calibrated whole-pixel scale for compact, legible cockpit layout)

| Token | Font | Size / Line height | Use |
|---|---|---|---|
| `display-xl` | Press Start 2P | 32px / 40px | Game logo, START screen hero title |
| `display-lg` | Press Start 2P | 22px / 28px | Screen titles ("MISSION BRIEFING") |
| `display-md` | Press Start 2P | 16px / 22px | Section headings, panel titles |
| `display-sm` | Press Start 2P | 12px / 16px | Buttons, card headers, tabs |
| `display-xs` | Press Start 2P | 9px / 12px | Chips, badges, small HUD tags |
| `body-lg` | VT323 | 20px / 24px | Main lead text, narrative dialogue |
| `body-md` | VT323 | 17px / 21px | Default body, item descriptions, tables |
| `body-sm` | VT323 | 15px / 19px | Secondary hints, footnotes, specs |
| `label` | Silkscreen | 10px / 14px, letter-spacing 1px | Units, resource tags (MASS, PWR, DATA) |
| `score` | Press Start 2P | 14px / 18px, tabular | Numeric readouts, currency values |

**Rules**

- Titles and buttons: UPPERCASE. Body: sentence case.
- Disable font smoothing for the pixel look: `-webkit-font-smoothing: none; font-smooth: never; text-rendering: optimizeSpeed;`
- Never use font weights other than 400 for pixel fonts (no faux bold).
- Max line length for body: 60 characters. Max 3 lines of text per tooltip.
- Numbers in HUD use tabular alignment (monospace fonts already do this).

## 4. Layout, Spacing & Grid

- **Base unit:** `8px` (one "game pixel" = 4px on screen: render art at 1x then scale ×4; UI borders are 4px).
- **Spacing scale:** `4, 8, 16, 24, 32, 48, 64, 96`
- **Container:** max-width `1280px`, page padding `24px` (mobile `16px`).
- **Grid:** 12 columns, 16px gutter (desktop). 4 columns on mobile.
- **Main game layout (desktop):**
  - Top bar (64px): mission name, phase indicator, score, lives/hearts (attempts), team roster.
  - Left rail (280px): role panel + instruments/components list.
  - Center: spacecraft builder / orbit view / simulation canvas.
  - Right rail (320px): resource HUD (6 bars) + consequences log + learning tips.
  - Bottom bar (72px): primary action (LAUNCH / NEXT PHASE) + phase stepper.
- **Mobile:** single column, resource HUD collapses into a sticky top strip of 6 mini bars; phases become tabs.
- **Breakpoints:** `sm 480`, `md 768`, `lg 1024`, `xl 1280`.
- **Alignment:** Everything snaps to a 4px grid. Never place elements at half pixels.

## 5. Shape, Borders & Elevation

- **Border radius:** `0` everywhere. Pixel-corner effect is done with a notched border (see below) when a softened corner is wanted.
- **Border:** `4px solid` using `panel-border`. Inner highlight: 4px line in lighter tone on top/left, darker on bottom/right (bevel).
- **Notched corner panel** (pixel-rounded look):

```css
.pixel-panel {
  background: var(--panel-bg);
  box-shadow:
    0 -4px 0 0 var(--panel-border),
    0 4px 0 0 var(--panel-border),
    -4px 0 0 0 var(--panel-border),
    4px 0 0 0 var(--panel-border);
  margin: 4px;               /* room for the border shadows */
}
```

- **Elevation (hard offset shadows only):**
  - Level 0: none (page)
  - Level 1: `4px 4px 0 0 #000A` (cards)
  - Level 2: `8px 8px 0 0 #0A0626` (modals, dropdowns)
  - Pressed state: shadow removed, element translates `(4px, 4px)`.
- **Overlay / CRT effect (optional, toggle in Options):**

```css
.crt::after {
  content: "";
  position: fixed; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,.18) 0 2px, transparent 2px 4px);
  mix-blend-mode: multiply;
  z-index: 9999;
}
```

- **Image rendering:** all sprites and backgrounds use `image-rendering: pixelated;` and integer scale factors only (×2, ×3, ×4).

## 6. Components

### 6.1 Buttons

| Variant | Background | Text | Border / Shadow | Use |
|---|---|---|---|---|
| **Primary** | `rocket-red` | `hull-white` | 4px `rocket-outline` border, bottom/right shadow `rocket-red-dark` 4px | LAUNCH, CONFIRM, START |
| **Secondary** | `flame-orange` | `space-void` | 4px `#7A3B00` border, shadow `#B35E00` | NEXT, SAVE DESIGN |
| **Neutral** | `hull-silver` | `space-void` | 4px `hull-steel` border | CANCEL, BACK |
| **Ghost / Menu** | transparent | `hud-cream` | none; ▶ arrow appears on hover | Main-menu items (NEW GAME / OPTIONS / CREDITS / QUIT) |
| **Danger** | `danger` | `hull-white` | 4px `#6B0010` border | ABORT MISSION |

- Font: `display-sm` (Press Start 2P, 16px), padding `16px 24px`, min-height `56px`.
- Hover: lighten fill one step + show ▶ blinking selector on the left. Active: translate `(4px,4px)` and remove shadow. Focus-visible: 4px dashed `hud-amber` outline offset 4px.
- Disabled: fill `space-purple`, text `hull-steel`, no shadow.
- Sound hooks: `ui-hover` (blip), `ui-click` (bleep), `ui-error` (buzz).

### 6.2 Menu (Arcade list)

- Items stacked vertically, 32px spacing, `display-sm` in `hud-cream`.
- Selected item: `hud-amber` text with a `▶` (pixel triangle, 16px) to the left, blinking at 1Hz (steps(2)).
- Container: a 4px cream (`hud-cream`) frame on `space-void`, matching the "NEW GAME / OPTIONS / CREDITS / QUIT" reference.
- Keyboard: ↑/↓ to move, Enter to select, Esc to go back.

### 6.3 Start Screen ("ARE YOU READY?")

- CRT-style rounded frame (violet bezel) containing: HI-SCORE (top-left, `hud-amber`), hearts row (top-right, 5 pixel hearts in `flame-orange`), giant `START` in `display-xl` with amber stepped gradient, sub-text `ARE YOU READY?` and YES ◀ / NO options.
- Hearts = mission attempts remaining. A lost attempt turns a heart to `space-purple` outline.

### 6.4 Panels / Cards

- Fill `panel-bg`, 4px `panel-border`, padding `16px`, header strip `panel-bg-raised` with `display-xs` title in `hud-amber`.
- **Component card** (instrument, engine, solar panel, launch vehicle): 64×64 pixel icon, name (`display-xs`), 4 stat rows (MASS kg / PWR W / COST $ / DATA Mb/s) using `label` + `score`, and a "SCIENCE ★" rating 1–5 pixel stars.
- Selected card: border switches to `hud-amber`, plus a blinking corner marker.

### 6.5 Resource HUD (core of the game)

Six horizontal segmented bars, each with a pixel icon, label, current/limit numbers.

- Bar height 24px; segments of 8px × 24px separated by 2px gaps (retro "battery" look).
- Colors by resource (see palette section). When usage ≥ 80% segments turn `warning`; ≥ 100% turn `danger` and the bar blinks.
- Hover on any bar reveals a "WHY?" tooltip explaining what consumes that resource.
- Order: BUDGET, MASS, POWER, DATA, COMMS, TIME.

### 6.6 Inputs

- Text input: fill `space-void`, 4px `panel-border`, text `hud-cream` (VT323 24px), caret = solid block in `hud-amber`.
- Slider: track = row of pixel segments, thumb = 16×24 block in `rocket-red`.
- Toggle: 56×28 pixel switch; ON = `success`, OFF = `space-purple`.
- Select / dropdown: same as input + ▼ pixel arrow; list uses menu style (6.2).
- Error state: border `danger` + message in `danger` with ✖ pixel icon.

### 6.7 Tabs & Phase Stepper

- Mission phases: `OBJECTIVE → SPACECRAFT → PAYLOAD → ORBIT → LAUNCH → SIMULATE → REPORT`.
- Stepper nodes: 24px squares; done = `success` with ✔, current = `hud-amber` blinking, locked = `space-purple`.
- Connectors: 4px dashed line in `panel-border`.

### 6.8 Team Roles (multiplayer, up to 4)

| Role | Accent color | Icon |
|---|---|---|
| Mission Commander (planning / objectives) | `rocket-red` | star |
| Spacecraft Engineer (structure, power, ADCS) | `hull-silver` | gear |
| Science Lead (instruments) | `planet-teal` | flask |
| Comms & Ops (comms, data, budget) | `porthole-blue` | antenna |

- Player chips: 32×32 pixel avatar + name + role color border. Online = green dot, "voting" state = blinking amber.
- Negotiation UI: proposal cards with ▲/▼ pixel vote buttons; a decision requires majority.

### 6.9 Modals, Toasts & Tooltips

- Modal: `panel-bg` with Level-2 shadow, backdrop `space-void` at 80% via dither pattern (checkerboard) rather than alpha blur.
- Toast (top-right): 4px border colored by severity, ▶ icon, auto-dismiss 4s, slide in with `steps(4)`.
- Tooltip: `hud-cream` fill, `space-void` text, 4px `hud-amber` border, VT323 20px, max 3 lines.
- **Learning card ("WHY?"):** `info` border, planet icon, explains the physics/engineering reason in ≤ 2 sentences of plain language.

### 6.10 Mission Report / Results

- Title: `MISSION SUCCESS` (`success`, `display-lg`) or `MISSION FAILED` (`danger`).
- Score breakdown table (VT323), star rating (1–5 pixel stars), medal sprites, and a "WHY IT WORKED / FAILED" panel.
- Buttons: `RETRY`, `EDIT DESIGN`, `SHARE`, `LEADERBOARD`.

### 6.11 Charts

- Pixel-style bar/line charts: stepped lines, square markers, no anti-aliasing (`shape-rendering: crispEdges` on SVG).
- Use resource color coding; axis labels in `label` style; grid lines 2px dashed `panel-border` at 40%.

## 7. Cursor (Rocket) — IMPORTANT

The mouse cursor is the pixel-art rocket (red nose cone, white hull, blue porthole, red fins, flame).

**Assets** (generated from the supplied rocket image, background removed):

- `assets/cursors/rocket-cursor.png` — 24×48 (1x)
- `assets/cursors/rocket-cursor@2x.png` — 48×96 (high-DPI)
- `assets/cursors/rocket-cursor-click.png` — 20×40 (pressed/"boost" state)

**Hotspot:** the tip of the nose cone → x = 12, y = 0 (1x). Keep it at the very top-center so clicks land where the nose points.

```css
:root {
  --cursor-rocket: image-set(
    url('/assets/cursors/rocket-cursor.png') 1x,
    url('/assets/cursors/rocket-cursor@2x.png') 2x
  ) 12 0, auto;
  --cursor-rocket-click: url('/assets/cursors/rocket-cursor-click.png') 10 0, pointer;
}

html, body { cursor: var(--cursor-rocket); }
button, a, [role="button"], .clickable { cursor: var(--cursor-rocket-click); }
```

**Notes & guidance**

- Browsers cap custom cursors at 128×128px, and sizes above 32px wide can be unreliable on some systems; keep widths small as above and always provide the `auto` fallback.
- Custom CSS cursors can't be animated. For the flame flicker or a trailing exhaust effect, hide the native cursor on the game canvas (`cursor: none`) and draw a DOM/canvas sprite following `pointermove` (use `transform: translate3d`, `pointer-events: none`, `z-index: 10000`). Keep the hotspot offset at the nose tip.
- Touch devices have no cursor: show the rocket only as a tap-feedback sprite.
- Respect `prefers-reduced-motion`: disable the trail/flicker.
- Optional: rocket leaves 3–5 fading pixel-square exhaust particles (`flame-orange` → `flame-yellow`) while moving; max 20 particles.

## 8. Iconography & Sprites

- Pixel icons on a 16×16 or 32×32 grid, 1px dark outline (`rocket-outline` or `space-void`), 2–3 tone shading, no anti-aliasing.
- Core sets: spacecraft parts (structure, solar panel, battery, antenna, computer, thrusters/ADCS), instruments (camera, spectrometer, radar, magnetometer), launch vehicles (small / medium / heavy), orbits (LEO, SSO, GEO, lunar, Mars transfer), resources (6 icons), status (✔ ✖ ⚠ ★ ♥).
- Planets: round sprites with crater patches (teal `#2EE6A8` with shaded `#1BA5C9`; purple ringed planet `#5B2BA8`/`#C2268F`).
- Always scale by integer factors with `image-rendering: pixelated`.

## 9. Backgrounds & Scenes

| Scene | Description | Used on |
|---|---|---|
| **Horizon Dusk** | Deep navy sky, stepped violet→magenta horizon, jagged purple mountain silhouettes, striped purple ground, white pixel stars | Main menu, launch pad |
| **Deep Space** | Dark indigo with scattered cyan/violet/teal dust pixels, teal cratered planet with dithered nebula, small purple ringed planet, 4-point sparkle stars | Orbit view, mission simulation |
| **Asteroid Field** | Dark starfield with pixel asteroids, amber glow flares, small fighter-sprite ships | Random events, hazards, loading screens |
| **Cockpit CRT** | Violet bezel framing a dark purple grid screen | Start/pause overlays |

- Parallax: 3 layers (stars slow, planets medium, foreground fast) with `steps()` easing; disable with reduced motion.
- Star twinkle: 2-frame blink, random 1–3s intervals.
- Keep a dark scrim (solid `space-void` panel) behind dense text; never put body text directly on busy art.

## 10. Motion & Sound

- **Easing:** `steps(n)` only — frame-based, no smooth curves. Typical: `steps(4)` for slide-ins, `steps(2)` for blinks.
- **Durations:** micro 120ms, UI transitions 240ms, scene transitions 480ms (pixel dissolve / scanline wipe).
- **Launch sequence:** 3-2-1 countdown in `display-xl`, screen shake (±4px, 8 frames), rocket flame sprite loop at 8 fps.
- **Sounds (8-bit chiptune):** click, hover, success jingle, failure buzz, countdown beeps, launch rumble (noise burst), warning alarm. Provide a global MUTE toggle and volume slider in Options. Never autoplay audio before the first user interaction.

## 11. Accessibility

- Text/background contrast ≥ 4.5:1 (cream/amber on `panel-bg` exceeds 7:1).
- Do not rely on color alone: pair resource states with icons (✔ ⚠ ✖) and text labels.
- Full keyboard navigation (Tab, arrows, Enter, Esc); visible focus ring (4px dashed `hud-amber`).
- Respect `prefers-reduced-motion` (stop parallax, blinking, shake, trail) and offer a "Reduce effects" option for CRT scanlines.
- Pixel fonts are hard to read at small sizes: never go below `12px` for Press Start 2P and `20px` for VT323.
- Provide a "Readable font" toggle that swaps pixel fonts for a clean sans (e.g. Tajawal / system sans) for long explanations.
- RTL: when Arabic is active set `dir="rtl"`, mirror layout (rails, ▶ arrows → ◀), and use the Arabic fallback font.
- Add `aria-label`s to resource bars (e.g. "Power 72 of 100 watts").

## 12. Tokens (CSS Variables)

```css
:root {
  /* colors */
  --space-void:#0A0626; --space-deep:#120A3D; --space-violet:#2A1370; --space-purple:#5B2BA8;
  --horizon-magenta:#C2268F; --horizon-pink:#E85BB5;
  --panel-bg:#1A0F3A; --panel-bg-raised:#241552; --panel-border:#6B4FD8;
  --rocket-red:#F81414; --rocket-red-dark:#A80C0C; --rocket-outline:#3A0505;
  --hull-white:#EEF1F8; --hull-silver:#B9C2D6; --hull-steel:#7C869C;
  --porthole-blue:#12A8E8; --porthole-light:#7DD8FF;
  --flame-orange:#FF9A1F; --flame-yellow:#FFE45C;
  --hud-amber:#FFB23E; --hud-cream:#F3E9B8;
  --planet-teal:#2EE6A8; --planet-teal-dark:#1BA5C9; --star-white:#FFFFFF;
  --success:#3DF08A; --warning:#FFC83D; --danger:#FF3B4E; --info:#4FC3F7;

  /* resources */
  --res-budget:#FFE45C; --res-mass:#B9C2D6; --res-power:#FF9A1F;
  --res-data:#2EE6A8; --res-comms:#12A8E8; --res-time:#E85BB5;

  /* type */
  --font-display:'Press Start 2P','Courier New',monospace;
  --font-body:'VT323','Courier New',monospace;
  --font-small:'Silkscreen','Press Start 2P',monospace;
  --font-ar:'Tajawal','Noto Sans Arabic',sans-serif;

  /* spacing & shape */
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:32px; --space-6:48px; --space-7:64px;
  --radius:0; --border:4px;

  /* shadows */
  --shadow-1:4px 4px 0 0 rgba(0,0,0,.6);
  --shadow-2:8px 8px 0 0 var(--space-void);

  /* motion */
  --t-micro:120ms; --t-ui:240ms; --t-scene:480ms;
}

*{ box-sizing:border-box; image-rendering:pixelated; }
body{
  margin:0; background:var(--space-void); color:var(--hud-cream);
  font-family:var(--font-body); font-size:24px; line-height:28px;
  -webkit-font-smoothing:none; text-rendering:optimizeSpeed;
}
h1,h2,h3,button{ font-family:var(--font-display); text-transform:uppercase; font-weight:400; }
```

## 13. Do's and Don'ts

**Do**

- Keep every edge crisp, on the 4px grid, with integer-scaled pixel art.
- Use hard stepped shadows and dither patterns for depth and glow.
- Reserve `rocket-red` for the single most important action per screen.
- Show consequences visually: when a choice changes mass/power/cost, animate the affected bars in steps and log it in the consequence panel.
- Explain *why* with short "WHY?" learning cards in plain language.
- Keep the rocket cursor everywhere (with pointer variant on clickable items).

**Don't**

- Don't use border radius, blur, soft drop shadows, smooth gradients, or glassmorphism.
- Don't mix more than two pixel scales on one screen (e.g. ×2 icons next to ×3 sprites).
- Don't set long paragraphs in Press Start 2P — use VT323 (or the readable-font toggle).
- Don't put text directly over busy backgrounds without a solid panel.
- Don't use pure black, pure grey, or pastel colors outside the palette.
- Don't hide critical numbers (budget/mass/power) behind menus — the Resource HUD is always visible.
- Don't animate with smooth easing; use `steps()`.

## 14. Agent Prompt Guide

**Quick reference**

- Canvas: `#0A0626` → `#2A1370` → `#C2268F` horizon
- Panels: `#1A0F3A` with 4px `#6B4FD8` border, 0 radius
- Primary button: `#F81414`, white Press Start 2P 16px, 4px bottom/right shadow `#A80C0C`
- Text: `#F3E9B8` (body, VT323 24px), `#FFB23E` (titles/scores)
- Accent: teal `#2EE6A8` (science/data), blue `#12A8E8` (comms/info), orange `#FF9A1F` (power/secondary)
- Cursor: rocket PNG, hotspot at nose tip (12, 0)

---

*Original design system written for the NASA Space Apps 2026 "Space Mission Design Game" project. Visual direction derived from the provided pixel-art references (dusk horizon, deep-space planets, arcade START/menu screens, pixel rocket).*
