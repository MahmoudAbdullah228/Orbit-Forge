/**
 * Pixel Sprite Generator for Orbit Forge
 * Generates crisp 8-bit/16-bit pixel art SVG icons snapped to the 4px/8px grid
 * using the official palette from DESIGN.md.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public/assets/pixel');

const PALETTE = {
  void: '#0A0626',
  deep: '#120A3D',
  violet: '#2A1370',
  purple: '#5B2BA8',
  magenta: '#C2268F',
  pink: '#E85BB5',
  panel: '#1A0F3A',
  panelRaised: '#241552',
  panelBorder: '#6B4FD8',
  red: '#F81414',
  redDark: '#A80C0C',
  white: '#EEF1F8',
  silver: '#B9C2D6',
  steel: '#7C869C',
  blue: '#12A8E8',
  blueLight: '#7DD8FF',
  orange: '#FF9A1F',
  yellow: '#FFE45C',
  amber: '#FFB23E',
  cream: '#F3E9B8',
  teal: '#2EE6A8',
  tealDark: '#1BA5C9',
  green: '#3DF08A'
};

function createSvg(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges" style="image-rendering: pixelated;">\n${content}\n</svg>`;
}

// Generate destination pixel art
const destinations = {
  'moon.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="${PALETTE.void}"/>
    <!-- Stars -->
    <rect x="8" y="10" width="2" height="2" fill="${PALETTE.white}"/>
    <rect x="52" y="14" width="2" height="2" fill="${PALETTE.yellow}"/>
    <rect x="14" y="48" width="2" height="2" fill="${PALETTE.white}"/>
    <!-- Moon Body -->
    <rect x="16" y="8" width="32" height="48" fill="${PALETTE.silver}"/>
    <rect x="8" y="16" width="48" height="32" fill="${PALETTE.silver}"/>
    <rect x="12" y="12" width="40" height="40" fill="${PALETTE.silver}"/>
    <!-- Highlights -->
    <rect x="16" y="12" width="24" height="4" fill="${PALETTE.white}"/>
    <rect x="12" y="16" width="4" height="24" fill="${PALETTE.white}"/>
    <!-- Craters -->
    <rect x="20" y="20" width="8" height="8" fill="${PALETTE.steel}"/>
    <rect x="22" y="22" width="4" height="4" fill="${PALETTE.deep}"/>
    <rect x="36" y="32" width="12" height="10" fill="${PALETTE.steel}"/>
    <rect x="38" y="34" width="8" height="6" fill="${PALETTE.deep}"/>
    <rect x="22" y="40" width="6" height="6" fill="${PALETTE.steel}"/>
    <!-- Shadow side -->
    <rect x="44" y="16" width="12" height="32" fill="${PALETTE.deep}" opacity="0.4"/>
  `),
  'mars.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="${PALETTE.void}"/>
    <!-- Mars Body -->
    <rect x="16" y="8" width="32" height="48" fill="${PALETTE.red}"/>
    <rect x="8" y="16" width="48" height="32" fill="${PALETTE.red}"/>
    <rect x="12" y="12" width="40" height="40" fill="${PALETTE.red}"/>
    <!-- Polar Ice Cap -->
    <rect x="24" y="8" width="16" height="4" fill="${PALETTE.white}"/>
    <rect x="28" y="12" width="8" height="2" fill="${PALETTE.white}"/>
    <!-- Dark Canyons (Valles Marineris) -->
    <rect x="16" y="32" width="28" height="4" fill="${PALETTE.redDark}"/>
    <rect x="20" y="36" width="18" height="3" fill="${PALETTE.redDark}"/>
    <!-- Craters & Dunes -->
    <rect x="20" y="20" width="6" height="6" fill="${PALETTE.redDark}"/>
    <rect x="38" y="22" width="8" height="6" fill="${PALETTE.redDark}"/>
    <rect x="32" y="44" width="10" height="4" fill="${PALETTE.redDark}"/>
    <!-- Atmosphere haze -->
    <rect x="10" y="14" width="2" height="36" fill="${PALETTE.orange}" opacity="0.5"/>
  `),
  'earth.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="${PALETTE.void}"/>
    <!-- Earth Ocean Body -->
    <rect x="16" y="8" width="32" height="48" fill="${PALETTE.blue}"/>
    <rect x="8" y="16" width="48" height="32" fill="${PALETTE.blue}"/>
    <rect x="12" y="12" width="40" height="40" fill="${PALETTE.blue}"/>
    <!-- Polar Cap -->
    <rect x="24" y="8" width="16" height="4" fill="${PALETTE.white}"/>
    <!-- Continents (Green/Teal) -->
    <rect x="18" y="18" width="14" height="12" fill="${PALETTE.teal}"/>
    <rect x="20" y="30" width="8" height="14" fill="${PALETTE.teal}"/>
    <rect x="36" y="16" width="16" height="18" fill="${PALETTE.teal}"/>
    <rect x="38" y="34" width="12" height="10" fill="${PALETTE.teal}"/>
    <!-- Swirling Clouds -->
    <rect x="16" y="24" width="18" height="3" fill="${PALETTE.white}" opacity="0.8"/>
    <rect x="30" y="38" width="20" height="3" fill="${PALETTE.white}" opacity="0.8"/>
  `)
};

// Generate vehicle sprites
const vehicles = {
  'rocket-light.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <!-- Sleek black/silver Electron style -->
    <rect x="28" y="8" width="8" height="8" fill="${PALETTE.white}"/>
    <rect x="30" y="4" width="4" height="4" fill="${PALETTE.white}"/>
    <rect x="28" y="16" width="8" height="32" fill="${PALETTE.deep}"/>
    <rect x="26" y="44" width="12" height="6" fill="${PALETTE.silver}"/>
    <!-- Fins -->
    <rect x="22" y="42" width="6" height="8" fill="${PALETTE.deep}"/>
    <rect x="36" y="42" width="6" height="8" fill="${PALETTE.deep}"/>
    <!-- Exhaust flame -->
    <rect x="30" y="50" width="4" height="10" fill="${PALETTE.yellow}"/>
    <rect x="31" y="52" width="2" height="6" fill="${PALETTE.white}"/>
  `),
  'rocket-medium.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <!-- Falcon 9 white/black style -->
    <rect x="28" y="6" width="8" height="6" fill="${PALETTE.white}"/>
    <rect x="30" y="2" width="4" height="4" fill="${PALETTE.white}"/>
    <rect x="26" y="12" width="12" height="36" fill="${PALETTE.white}"/>
    <rect x="28" y="22" width="8" height="2" fill="${PALETTE.deep}"/>
    <rect x="28" y="36" width="8" height="2" fill="${PALETTE.deep}"/>
    <!-- Engine section -->
    <rect x="26" y="48" width="12" height="4" fill="${PALETTE.steel}"/>
    <!-- Grid fins -->
    <rect x="22" y="20" width="4" height="4" fill="${PALETTE.steel}"/>
    <rect x="38" y="20" width="4" height="4" fill="${PALETTE.steel}"/>
    <!-- Flame -->
    <rect x="28" y="52" width="8" height="10" fill="${PALETTE.orange}"/>
    <rect x="30" y="54" width="4" height="6" fill="${PALETTE.yellow}"/>
  `),
  'rocket-heavy.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <!-- Atlas / Heavy core + boosters -->
    <!-- Core -->
    <rect x="28" y="6" width="8" height="42" fill="${PALETTE.amber}"/>
    <rect x="30" y="2" width="4" height="4" fill="${PALETTE.white}"/>
    <!-- Left Booster -->
    <rect x="20" y="18" width="6" height="30" fill="${PALETTE.white}"/>
    <rect x="21" y="14" width="4" height="4" fill="${PALETTE.white}"/>
    <!-- Right Booster -->
    <rect x="38" y="18" width="6" height="30" fill="${PALETTE.white}"/>
    <rect x="39" y="14" width="4" height="4" fill="${PALETTE.white}"/>
    <!-- Thrust -->
    <rect x="22" y="48" width="20" height="12" fill="${PALETTE.red}"/>
    <rect x="25" y="50" width="14" height="8" fill="${PALETTE.yellow}"/>
  `),
  'rocket-super.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <!-- SLS Orange core + dual white SRBs -->
    <rect x="26" y="8" width="12" height="40" fill="${PALETTE.orange}"/>
    <rect x="28" y="2" width="8" height="6" fill="${PALETTE.white}"/>
    <!-- Left SRB -->
    <rect x="16" y="12" width="8" height="38" fill="${PALETTE.white}"/>
    <rect x="18" y="8" width="4" height="4" fill="${PALETTE.white}"/>
    <!-- Right SRB -->
    <rect x="40" y="12" width="8" height="38" fill="${PALETTE.white}"/>
    <rect x="42" y="8" width="4" height="4" fill="${PALETTE.white}"/>
    <!-- Massive flame -->
    <rect x="18" y="50" width="28" height="12" fill="${PALETTE.orange}"/>
    <rect x="22" y="52" width="20" height="8" fill="${PALETTE.yellow}"/>
    <rect x="26" y="54" width="12" height="4" fill="${PALETTE.white}"/>
  `)
};

// Generate instrument sprites
const instruments = {
  'camera.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="12" y="18" width="40" height="28" fill="${PALETTE.panel}"/>
    <rect x="10" y="16" width="44" height="32" fill="none" stroke="${PALETTE.panelBorder}" stroke-width="4"/>
    <!-- Optical Lens -->
    <rect x="24" y="24" width="16" height="16" fill="${PALETTE.blue}"/>
    <rect x="28" y="28" width="8" height="8" fill="${PALETTE.blueLight}"/>
    <rect x="30" y="30" width="4" height="4" fill="${PALETTE.white}"/>
    <!-- Sensor button & flash -->
    <rect x="18" y="10" width="8" height="6" fill="${PALETTE.red}"/>
    <rect x="40" y="12" width="6" height="4" fill="${PALETTE.amber}"/>
  `),
  'altimeter.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="16" y="16" width="32" height="32" fill="${PALETTE.steel}"/>
    <rect x="14" y="14" width="36" height="36" fill="none" stroke="${PALETTE.silver}" stroke-width="4"/>
    <!-- Laser Emitter Emitter -->
    <rect x="26" y="26" width="12" height="12" fill="${PALETTE.redDark}"/>
    <rect x="28" y="28" width="8" height="8" fill="${PALETTE.red}"/>
    <!-- Laser Beam Pulse -->
    <rect x="30" y="44" width="4" height="16" fill="${PALETTE.red}"/>
    <rect x="31" y="44" width="2" height="16" fill="${PALETTE.yellow}"/>
  `),
  'spectrometer.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="12" y="14" width="40" height="36" fill="${PALETTE.deep}"/>
    <rect x="10" y="12" width="44" height="40" fill="none" stroke="${PALETTE.purple}" stroke-width="4"/>
    <!-- Spectrum bands -->
    <rect x="18" y="20" width="6" height="24" fill="${PALETTE.purple}"/>
    <rect x="24" y="20" width="6" height="24" fill="${PALETTE.blue}"/>
    <rect x="30" y="20" width="6" height="24" fill="${PALETTE.teal}"/>
    <rect x="36" y="20" width="6" height="24" fill="${PALETTE.yellow}"/>
    <rect x="42" y="20" width="6" height="24" fill="${PALETTE.red}"/>
  `),
  'radar.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <!-- Radar Boom & Dish -->
    <rect x="28" y="32" width="8" height="24" fill="${PALETTE.steel}"/>
    <!-- Radar waves -->
    <path d="M 12 28 A 20 20 0 0 1 52 28" stroke="${PALETTE.teal}" stroke-width="4" fill="none"/>
    <path d="M 18 34 A 14 14 0 0 1 46 34" stroke="${PALETTE.teal}" stroke-width="4" fill="none"/>
    <rect x="24" y="36" width="16" height="6" fill="${PALETTE.amber}"/>
  `),
  'gas-sensor.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="16" y="16" width="32" height="32" fill="${PALETTE.panel}"/>
    <rect x="14" y="14" width="36" height="36" fill="none" stroke="${PALETTE.panelBorder}" stroke-width="4"/>
    <!-- Ion funnel / spectrometer chamber -->
    <polygon points="20,20 44,20 36,36 28,36" fill="${PALETTE.teal}"/>
    <rect x="30" y="36" width="4" height="12" fill="${PALETTE.amber}"/>
    <circle cx="32" cy="26" r="3" fill="${PALETTE.white}"/>
  `),
  'hyperspectral.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="10" y="16" width="44" height="32" fill="${PALETTE.panelRaised}"/>
    <rect x="8" y="14" width="48" height="36" fill="none" stroke="${PALETTE.panelBorder}" stroke-width="4"/>
    <!-- Multi-spectral prism -->
    <polygon points="32,20 20,40 44,40" fill="${PALETTE.blue}"/>
    <polygon points="32,24 24,38 40,38" fill="${PALETTE.magenta}"/>
    <rect x="28" y="28" width="8" height="8" fill="${PALETTE.white}"/>
  `)
};

// Generate power sprites
const power = {
  'solar-compact.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="12" y="16" width="40" height="32" fill="${PALETTE.blue}"/>
    <rect x="10" y="14" width="44" height="36" fill="none" stroke="${PALETTE.silver}" stroke-width="4"/>
    <!-- Solar grid lines -->
    <rect x="12" y="26" width="40" height="2" fill="${PALETTE.silver}"/>
    <rect x="12" y="36" width="40" height="2" fill="${PALETTE.silver}"/>
    <rect x="24" y="16" width="2" height="32" fill="${PALETTE.silver}"/>
    <rect x="38" y="16" width="2" height="32" fill="${PALETTE.silver}"/>
  `),
  'solar-wings.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <!-- Spacecraft body in center -->
    <rect x="26" y="24" width="12" height="16" fill="${PALETTE.white}"/>
    <!-- Left Wing -->
    <rect x="4" y="20" width="20" height="24" fill="${PALETTE.blue}"/>
    <rect x="4" y="20" width="20" height="24" fill="none" stroke="${PALETTE.yellow}" stroke-width="2"/>
    <rect x="4" y="31" width="20" height="2" fill="${PALETTE.yellow}"/>
    <!-- Right Wing -->
    <rect x="40" y="20" width="20" height="24" fill="${PALETTE.blue}"/>
    <rect x="40" y="20" width="20" height="24" fill="none" stroke="${PALETTE.yellow}" stroke-width="2"/>
    <rect x="40" y="31" width="20" height="2" fill="${PALETTE.yellow}"/>
  `),
  'battery-pack.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="16" y="18" width="32" height="32" fill="${PALETTE.steel}"/>
    <rect x="14" y="16" width="36" height="36" fill="none" stroke="${PALETTE.silver}" stroke-width="4"/>
    <!-- Terminal caps -->
    <rect x="22" y="10" width="6" height="6" fill="${PALETTE.red}"/>
    <rect x="36" y="10" width="6" height="6" fill="${PALETTE.deep}"/>
    <!-- Charge bolt -->
    <polygon points="34,22 26,34 32,34 30,44 40,30 34,30" fill="${PALETTE.yellow}"/>
  `),
  'rtg.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <!-- Cylindrical RTG with cooling fins -->
    <rect x="22" y="14" width="20" height="36" fill="${PALETTE.silver}"/>
    <!-- Cooling fins -->
    <rect x="10" y="20" width="12" height="4" fill="${PALETTE.steel}"/>
    <rect x="10" y="28" width="12" height="4" fill="${PALETTE.steel}"/>
    <rect x="10" y="36" width="12" height="4" fill="${PALETTE.steel}"/>
    <rect x="42" y="20" width="12" height="4" fill="${PALETTE.steel}"/>
    <rect x="42" y="28" width="12" height="4" fill="${PALETTE.steel}"/>
    <rect x="42" y="36" width="12" height="4" fill="${PALETTE.steel}"/>
    <!-- Radiation trefoil symbol in amber -->
    <circle cx="32" cy="32" r="4" fill="${PALETTE.amber}"/>
  `)
};

// Generate comms sprites
const comms = {
  'antenna-omni.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="28" y="20" width="8" height="36" fill="${PALETTE.steel}"/>
    <circle cx="32" cy="18" r="6" fill="${PALETTE.red}"/>
    <!-- Radiation ripples -->
    <circle cx="32" cy="18" r="14" stroke="${PALETTE.blueLight}" stroke-width="2" fill="none" opacity="0.6"/>
    <circle cx="32" cy="18" r="22" stroke="${PALETTE.blueLight}" stroke-width="2" fill="none" opacity="0.3"/>
  `),
  'dish-xband.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="28" y="38" width="8" height="18" fill="${PALETTE.steel}"/>
    <!-- Parabolic Dish -->
    <path d="M 10 32 Q 32 46 54 32" stroke="${PALETTE.white}" stroke-width="6" fill="none"/>
    <rect x="30" y="16" width="4" height="14" fill="${PALETTE.silver}"/>
    <circle cx="32" cy="16" r="4" fill="${PALETTE.amber}"/>
  `),
  'phased-array.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="14" y="16" width="36" height="32" fill="${PALETTE.panel}"/>
    <rect x="12" y="14" width="40" height="36" fill="none" stroke="${PALETTE.panelBorder}" stroke-width="4"/>
    <!-- Phased antenna elements grid -->
    <circle cx="22" cy="24" r="3" fill="${PALETTE.teal}"/>
    <circle cx="32" cy="24" r="3" fill="${PALETTE.teal}"/>
    <circle cx="42" cy="24" r="3" fill="${PALETTE.teal}"/>
    <circle cx="22" cy="34" r="3" fill="${PALETTE.teal}"/>
    <circle cx="32" cy="34" r="3" fill="${PALETTE.teal}"/>
    <circle cx="42" cy="34" r="3" fill="${PALETTE.teal}"/>
  `),
  'optical-relay.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <rect x="16" y="20" width="32" height="26" fill="${PALETTE.panelRaised}"/>
    <rect x="14" y="18" width="36" height="30" fill="none" stroke="${PALETTE.purple}" stroke-width="4"/>
    <!-- Laser Optical Aperture -->
    <circle cx="32" cy="31" r="8" fill="${PALETTE.magenta}"/>
    <circle cx="32" cy="31" r="4" fill="${PALETTE.pink}"/>
    <!-- Beam -->
    <rect x="30" y="6" width="4" height="12" fill="${PALETTE.pink}"/>
  `)
};

// Generate orbits sprites
const orbits = {
  'orbit-leo.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="${PALETTE.void}"/>
    <!-- Earth in center -->
    <circle cx="32" cy="32" r="14" fill="${PALETTE.blue}"/>
    <!-- Circular LEO Track -->
    <ellipse cx="32" cy="32" rx="26" ry="12" stroke="${PALETTE.teal}" stroke-width="3" fill="none" stroke-dasharray="4,2"/>
    <!-- Satellite dot -->
    <rect x="48" y="24" width="6" height="6" fill="${PALETTE.white}"/>
  `),
  'orbit-sso.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="${PALETTE.void}"/>
    <circle cx="32" cy="32" r="14" fill="${PALETTE.blue}"/>
    <!-- Sun vector on left -->
    <rect x="4" y="24" width="4" height="16" fill="${PALETTE.yellow}"/>
    <!-- Polar Orbit Track -->
    <ellipse cx="32" cy="32" rx="10" ry="26" stroke="${PALETTE.amber}" stroke-width="3" fill="none" stroke-dasharray="4,2"/>
    <rect x="36" y="10" width="6" height="6" fill="${PALETTE.white}"/>
  `),
  'orbit-lunar.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="${PALETTE.void}"/>
    <!-- Moon in center -->
    <circle cx="32" cy="32" r="14" fill="${PALETTE.silver}"/>
    <!-- Polar track -->
    <ellipse cx="32" cy="32" rx="12" ry="28" stroke="${PALETTE.blueLight}" stroke-width="3" fill="none" stroke-dasharray="4,2"/>
    <rect x="40" y="14" width="6" height="6" fill="${PALETTE.white}"/>
  `),
  'orbit-lunar-eq.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="${PALETTE.void}"/>
    <circle cx="32" cy="32" r="14" fill="${PALETTE.silver}"/>
    <!-- Equatorial track -->
    <ellipse cx="32" cy="32" rx="28" ry="10" stroke="${PALETTE.green}" stroke-width="3" fill="none" stroke-dasharray="4,2"/>
    <rect x="50" y="26" width="6" height="6" fill="${PALETTE.white}"/>
  `),
  'orbit-mars.png': createSvg(64, 64, `
    <rect width="64" height="64" fill="none"/>
    <circle cx="32" cy="32" r="14" fill="${PALETTE.red}"/>
    <!-- Mars Low Science Orbit -->
    <ellipse cx="32" cy="32" rx="24" ry="14" stroke="${PALETTE.orange}" stroke-width="3" fill="none" stroke-dasharray="4,2"/>
    <rect x="46" y="22" width="6" height="6" fill="${PALETTE.white}"/>
  `)
};

const collections = [
  { folder: 'destinations', items: destinations },
  { folder: 'vehicles', items: vehicles },
  { folder: 'instruments', items: instruments },
  { folder: 'power', items: power },
  { folder: 'comms', items: comms },
  { folder: 'orbits', items: orbits }
];

for (const col of collections) {
  const dir = path.join(publicDir, col.folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const [filename, svgContent] of Object.entries(col.items)) {
    // Write SVG version
    const svgPath = path.join(dir, filename.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, svgContent);

    // Also write as valid SVG-based image accessible under filename or update path
    // In next.config image unoptimized mode, SVG files can be served directly or copied
    const directPath = path.join(dir, filename);
    fs.writeFileSync(directPath, svgContent);
    console.log(`Generated sprite: ${col.folder}/${filename}`);
  }
}

console.log('All pixel art assets generated successfully! 🎨');
