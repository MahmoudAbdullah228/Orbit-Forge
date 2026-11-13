import TutorialDetailClient from './TutorialDetailClient';
import { getTutorials } from '@/lib/data-loader';

export function generateStaticParams() {
  const tutorials = getTutorials();
  const params = tutorials.map((t) => ({ itemId: t.id }));
  const legacyIds = [
    'electron-rocket',
    'falcon-9',
    'stereo-camera',
    'laser-altimeter',
    'neutron-spectrometer',
    'radar-sounder',
    'deployable-solar-wings',
    'mmrtg-nuclear',
    'kaband-phased-array',
    'lunar-polar-orbit'
  ];
  legacyIds.forEach((id) => {
    if (!params.some((p) => p.itemId === id)) {
      params.push({ itemId: id });
    }
  });
  return params;
}

export default async function TutorialDetailPage({ params }) {
  const { itemId } = await params;
  return <TutorialDetailClient itemId={itemId} />;
}
