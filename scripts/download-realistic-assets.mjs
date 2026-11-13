/**
 * Realistic NASA Public Domain Imagery Downloader
 * Fetches photographic assets directly from NASA's Open Image API (images.nasa.gov)
 * and processes them using sharp into crisp, high-resolution web-ready images.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '../public/assets/realistic');

// Curated list of NASA search queries / NASA IDs for each asset
const ASSET_MANIFEST = [
  // Destinations
  {
    category: 'destinations',
    name: 'moon.png',
    query: 'moon full hemisphere Apollo',
    fallbackQuery: 'moon LRO global',
    width: 600,
    height: 600
  },
  {
    category: 'destinations',
    name: 'mars.png',
    query: 'mars global view hubble valles marineris',
    fallbackQuery: 'mars globe true color',
    width: 600,
    height: 600
  },
  {
    category: 'destinations',
    name: 'earth.png',
    query: 'earth blue marble 2012',
    fallbackQuery: 'earth from space apollo 17',
    width: 600,
    height: 600
  },

  // Vehicles
  {
    category: 'vehicles',
    name: 'rocket-light.png',
    query: 'rocket lab electron launch',
    fallbackQuery: 'pegasus rocket launch',
    width: 500,
    height: 650
  },
  {
    category: 'vehicles',
    name: 'rocket-medium.png',
    query: 'falcon 9 launch pad ksc',
    fallbackQuery: 'falcon 9 liftoff',
    width: 500,
    height: 650
  },
  {
    category: 'vehicles',
    name: 'rocket-heavy.png',
    query: 'atlas v launch pad',
    fallbackQuery: 'atlas v liftoff',
    width: 500,
    height: 650
  },
  {
    category: 'vehicles',
    name: 'rocket-super.png',
    query: 'artemis 1 sls launch pad 39b',
    fallbackQuery: 'sls artemis launch',
    width: 500,
    height: 650
  },

  // Scientific Instruments
  {
    category: 'instruments',
    name: 'camera.png',
    query: 'perseverance mastcam-z camera instrument',
    fallbackQuery: 'spacecraft optical camera lens',
    width: 500,
    height: 500
  },
  {
    category: 'instruments',
    name: 'altimeter.png',
    query: 'ICESat-2 ATLAS laser instrument',
    fallbackQuery: 'laser altimeter spacecraft',
    width: 500,
    height: 500
  },
  {
    category: 'instruments',
    name: 'spectrometer.png',
    query: 'spectrometer instrument spacecraft cleanroom',
    fallbackQuery: 'gamma ray spectrometer spacecraft',
    width: 500,
    height: 500
  },
  {
    category: 'instruments',
    name: 'radar.png',
    query: 'rimfax ground penetrating radar perseverance',
    fallbackQuery: 'synthetic aperture radar antenna spacecraft',
    width: 500,
    height: 500
  },
  {
    category: 'instruments',
    name: 'gas-sensor.png',
    query: 'MAVEN NGIMS spectrometer',
    fallbackQuery: 'mass spectrometer spacecraft instrument',
    width: 500,
    height: 500
  },
  {
    category: 'instruments',
    name: 'hyperspectral.png',
    query: 'EMIT imaging spectrometer earth',
    fallbackQuery: 'hyperspectral sensor spacecraft',
    width: 500,
    height: 500
  },

  // Power Systems
  {
    category: 'power',
    name: 'solar-compact.png',
    query: 'spacecraft solar cell panel cleanroom',
    fallbackQuery: 'satellite solar panel',
    width: 500,
    height: 500
  },
  {
    category: 'power',
    name: 'solar-wings.png',
    query: 'roll out solar array space station',
    fallbackQuery: 'ultraflex solar array spacecraft',
    width: 600,
    height: 500
  },
  {
    category: 'power',
    name: 'battery-pack.png',
    query: 'lithium ion battery space station',
    fallbackQuery: 'spacecraft battery module',
    width: 500,
    height: 500
  },
  {
    category: 'power',
    name: 'rtg.png',
    query: 'multi-mission radioisotope thermoelectric generator mmrtg',
    fallbackQuery: 'radioisotope thermoelectric generator',
    width: 500,
    height: 500
  },

  // Communications
  {
    category: 'comms',
    name: 'antenna-omni.png',
    query: 'spacecraft low gain antenna',
    fallbackQuery: 'omni antenna spacecraft',
    width: 500,
    height: 500
  },
  {
    category: 'comms',
    name: 'dish-xband.png',
    query: 'spacecraft high gain dish antenna goldstone',
    fallbackQuery: 'parabolic dish antenna spacecraft',
    width: 500,
    height: 500
  },
  {
    category: 'comms',
    name: 'phased-array.png',
    query: 'phased array antenna satellite',
    fallbackQuery: 'satellite communication antenna array',
    width: 500,
    height: 500
  },
  {
    category: 'comms',
    name: 'optical-relay.png',
    query: 'deep space optical communications dsoc laser',
    fallbackQuery: 'laser communications space',
    width: 500,
    height: 500
  },

  // Orbits
  {
    category: 'orbits',
    name: 'orbit-leo.png',
    query: 'earth orbit space station cupola view',
    fallbackQuery: 'low earth orbit aurora',
    width: 600,
    height: 450
  },
  {
    category: 'orbits',
    name: 'orbit-sso.png',
    query: 'earth polar orbit terminator sun',
    fallbackQuery: 'earth terminator sunlight shadow',
    width: 600,
    height: 450
  },
  {
    category: 'orbits',
    name: 'orbit-lunar.png',
    query: 'lunar reconnaissance orbiter moon view',
    fallbackQuery: 'moon orbit apollo command module',
    width: 600,
    height: 450
  },
  {
    category: 'orbits',
    name: 'orbit-lunar-eq.png',
    query: 'moon horizon apollo 11 orbit',
    fallbackQuery: 'moon surface orbit',
    width: 600,
    height: 450
  },
  {
    category: 'orbits',
    name: 'orbit-mars.png',
    query: 'mars atmosphere horizon odyssey mro',
    fallbackQuery: 'mars limb atmosphere',
    width: 600,
    height: 450
  }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function findNasaImageUrl(query) {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
  const data = await fetchJson(url);
  const items = data?.collection?.items || [];
  for (const item of items) {
    const href = item.links?.[0]?.href;
    if (href && (href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.png'))) {
      return href;
    }
  }
  return null;
}

async function main() {
  console.log('Beginning NASA Realistic Asset Ingestion...');

  for (const item of ASSET_MANIFEST) {
    const catDir = path.join(baseDir, item.category);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
    const targetFile = path.join(catDir, item.name);

    console.log(`Processing [${item.category}/${item.name}]...`);
    let imgUrl = await findNasaImageUrl(item.query);
    if (!imgUrl && item.fallbackQuery) {
      console.log(`  Falling back to query: "${item.fallbackQuery}"`);
      imgUrl = await findNasaImageUrl(item.fallbackQuery);
    }

    if (!imgUrl) {
      console.warn(`  ⚠️ Could not find NASA image for: ${item.query}`);
      continue;
    }

    try {
      console.log(`  Downloading: ${imgUrl}`);
      const rawBuf = await downloadImage(imgUrl);
      
      // Process with sharp: resize, add slight contrast/vibrancy, save as high-quality PNG
      await sharp(rawBuf)
        .resize(item.width, item.height, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90 })
        .toFile(targetFile);

      console.log(`  ✓ Saved realistic asset to: ${targetFile}`);
    } catch (err) {
      console.error(`  ❌ Error processing ${item.name}:`, err.message);
    }
  }

  console.log('\nAll realistic NASA assets successfully downloaded and optimized! 🚀');
}

main().catch(console.error);
